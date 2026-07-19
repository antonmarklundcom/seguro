"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@seguro/db";
import { generateApiKey, hashApiKey } from "@seguro/shared";
import { getLeadProcessingQueue } from "./queue";

/** Re-enqueues a lead for scoring/routing/delivery (docs/05 "delivery
 * monitor with manual redeliver"). Useful after fixing a partner's webhook
 * URL or when a delivery failed and retries were exhausted. */
export async function redeliverLead(leadId: string): Promise<void> {
  await getLeadProcessingQueue().add("process-lead", { leadId });
  revalidatePath(`/leads/${leadId}`);
}

export async function createPartner(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("El nombre es obligatorio");

  await prisma.partner.create({
    data: { name, channels: [] },
  });
  revalidatePath("/partners");
}

export async function togglePartnerActive(partnerId: string, active: boolean): Promise<void> {
  await prisma.partner.update({ where: { id: partnerId }, data: { active } });
  revalidatePath("/partners");
  revalidatePath(`/partners/${partnerId}`);
}

export async function updatePartnerChannel(
  partnerId: string,
  channel: { type: "webhook" | "email" | "whatsapp" | "sheet"; config: Record<string, string> },
): Promise<void> {
  await prisma.partner.update({
    where: { id: partnerId },
    data: { channels: [channel] },
  });
  revalidatePath(`/partners/${partnerId}`);
}

export async function upsertPartnerVertical(formData: FormData): Promise<void> {
  const partnerId = String(formData.get("partnerId") ?? "");
  const verticalId = String(formData.get("verticalId") ?? "").trim();
  const cplGs = Number(formData.get("cplGs") ?? 0);
  const exclusive = formData.get("exclusive") === "on";
  const priority = Number(formData.get("priority") ?? 100);

  if (!partnerId || !verticalId || !cplGs) {
    throw new Error("partnerId, verticalId y cplGs son obligatorios");
  }

  await prisma.partnerVertical.upsert({
    where: { partnerId_verticalId: { partnerId, verticalId } },
    create: { partnerId, verticalId, cplGs, exclusive, priority },
    update: { cplGs, exclusive, priority },
  });
  revalidatePath(`/partners/${partnerId}`);
}

export async function deactivatePartnerVertical(id: string, partnerId: string): Promise<void> {
  await prisma.partnerVertical.update({ where: { id }, data: { active: false } });
  revalidatePath(`/partners/${partnerId}`);
}

/**
 * Issues a new Partner API key (docs/05 "Partner API"). Returns the raw
 * key exactly once — only its hash is persisted, so this is the only
 * chance to show it to whoever is setting up the partner's integration.
 * Invalidates any previously issued key for this partner.
 */
export async function regeneratePartnerApiKey(partnerId: string): Promise<string> {
  const rawKey = generateApiKey();
  await prisma.partner.update({
    where: { id: partnerId },
    data: { apiKeyHash: hashApiKey(rawKey) },
  });
  revalidatePath(`/partners/${partnerId}`);
  return rawKey;
}
