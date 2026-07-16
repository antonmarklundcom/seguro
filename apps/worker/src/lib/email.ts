import { Resend } from "resend";
import { env } from "./env.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export interface LeadEmailPayload {
  to: string;
  leadId: string;
  verticalId: string;
  name: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  payload: Record<string, unknown>;
}

function renderLeadEmailHtml(lead: LeadEmailPayload): string {
  const rows = Object.entries(lead.payload)
    .map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${String(value)}</td></tr>`)
    .join("");

  return `
    <h2>Nuevo lead: ${lead.verticalId}</h2>
    <table cellpadding="4">
      <tr><td><strong>Nombre</strong></td><td>${lead.name ?? "-"}</td></tr>
      <tr><td><strong>WhatsApp</strong></td><td>${lead.phone}</td></tr>
      <tr><td><strong>Email</strong></td><td>${lead.email ?? "-"}</td></tr>
      <tr><td><strong>Ciudad</strong></td><td>${lead.city ?? "-"}</td></tr>
      ${rows}
    </table>
    <p>Lead ID: ${lead.leadId}</p>
  `;
}

/**
 * Sends a lead-notification email via Resend. Without RESEND_API_KEY
 * configured (local dev, or before the account exists), logs the intent
 * instead of throwing -- keeps the pipeline exercisable end to end.
 */
export async function sendLeadEmail(lead: LeadEmailPayload): Promise<void> {
  if (!resend) {
    console.log(`[stub email] lead ${lead.leadId} -> ${lead.to}`);
    return;
  }

  const result = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: lead.to,
    subject: `Nuevo lead: ${lead.verticalId} - ${lead.name ?? lead.phone}`,
    html: renderLeadEmailHtml(lead),
  });

  if (result.error) {
    throw new Error(`resend delivery failed: ${result.error.message}`);
  }
}
