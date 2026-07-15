import { createHmac } from "node:crypto";
import { prisma, type Lead, type Partner, type PartnerVertical } from "@seguro/db";

interface PartnerChannel {
  type: "webhook" | "email" | "whatsapp" | "sheet";
  config: Record<string, string>;
}

function getChannels(partner: Partner): PartnerChannel[] {
  return (partner.channels as unknown as PartnerChannel[]) ?? [];
}

async function sendWebhook(lead: Lead, channel: PartnerChannel): Promise<void> {
  const url = channel.config.url;
  const secret = channel.config.secret;
  if (!url) throw new Error("webhook channel missing url");

  const body = JSON.stringify({
    leadId: lead.id,
    verticalId: lead.verticalId,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    city: lead.city,
    payload: lead.payload,
    createdAt: lead.createdAt,
  });

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (secret) {
    headers["x-seguro-signature"] = createHmac("sha256", secret).update(body).digest("hex");
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`webhook delivery failed: ${res.status} ${await res.text()}`);
  }
}

// TODO(phase 2): wire real Resend/WhatsApp Cloud API integrations. These
// stubs log intent so the pipeline is fully exercisable end to end before
// partner credentials exist.
async function sendEmail(lead: Lead, channel: PartnerChannel): Promise<void> {
  if (!channel.config.to) throw new Error("email channel missing 'to'");
  console.log(`[stub email] lead ${lead.id} -> ${channel.config.to}`);
}

async function sendWhatsapp(lead: Lead, channel: PartnerChannel): Promise<void> {
  if (!channel.config.phone) throw new Error("whatsapp channel missing 'phone'");
  console.log(`[stub whatsapp] lead ${lead.id} -> ${channel.config.phone}`);
}

async function sendSheet(lead: Lead, channel: PartnerChannel): Promise<void> {
  if (!channel.config.sheetId) throw new Error("sheet channel missing 'sheetId'");
  console.log(`[stub sheet] lead ${lead.id} -> ${channel.config.sheetId}`);
}

async function send(lead: Lead, channel: PartnerChannel): Promise<void> {
  switch (channel.type) {
    case "webhook":
      return sendWebhook(lead, channel);
    case "email":
      return sendEmail(lead, channel);
    case "whatsapp":
      return sendWhatsapp(lead, channel);
    case "sheet":
      return sendSheet(lead, channel);
  }
}

/**
 * Delivers `lead` to every partner in `partnerVerticals`, one LeadDelivery
 * row per partner (billable + auditable — docs/05). Idempotent: a delivery
 * already CONFIRMED/SENT for a partner is skipped on retry.
 */
export async function deliverLead(
  lead: Lead,
  partnerVerticals: PartnerVertical[],
): Promise<void> {
  for (const pv of partnerVerticals) {
    const existing = await prisma.leadDelivery.findFirst({
      where: { leadId: lead.id, partnerId: pv.partnerId, status: { in: ["SENT", "CONFIRMED"] } },
    });
    if (existing) continue;

    const partner = await prisma.partner.findUniqueOrThrow({ where: { id: pv.partnerId } });
    const channels = getChannels(partner);
    const channel = channels[0];
    if (!channel) continue;

    const delivery = await prisma.leadDelivery.upsert({
      where: { id: `${lead.id}:${pv.partnerId}` },
      create: {
        id: `${lead.id}:${pv.partnerId}`,
        leadId: lead.id,
        partnerId: pv.partnerId,
        channel: channel.type.toUpperCase() as "WEBHOOK" | "EMAIL" | "WHATSAPP" | "SHEET",
        status: "PENDING",
        billableGs: pv.cplGs,
      },
      update: {},
    });

    const priorAttempts = Array.isArray(delivery.attempts) ? delivery.attempts : [];

    try {
      await send(lead, channel);
      await prisma.leadDelivery.update({
        where: { id: delivery.id },
        data: {
          status: "SENT",
          attempts: [...priorAttempts, { at: new Date().toISOString(), ok: true }],
        },
      });
    } catch (err) {
      await prisma.leadDelivery.update({
        where: { id: delivery.id },
        data: {
          status: "FAILED",
          attempts: [
            ...priorAttempts,
            {
              at: new Date().toISOString(),
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            },
          ],
        },
      });
      throw err; // let BullMQ retry the whole job
    }
  }
}
