import { z } from "zod";
import { attributionSchema } from "./attribution.js";
import { isValidPyPhone } from "./phone.js";

const CONSENT_TEXT_VERSION = "v1-2026-01" as const;

export const consentTextEs =
  "Acepto que mis datos sean compartidos con las aseguradoras/corredores " +
  "seleccionados para recibir cotizaciones.";

/**
 * Base contact fields, shared by every vertical. Vertical-specific questions
 * live in `payload` and are validated separately against the vertical's own
 * field schema (packages/config) — this keeps new verticals a config change,
 * not a code change (docs/02, docs/09).
 */
export const leadContactSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z
    .string()
    .trim()
    .refine(isValidPyPhone, { message: "Número de WhatsApp/celular paraguayo inválido" }),
  email: z.string().trim().email().max(200).optional(),
  city: z.string().trim().max(100).optional(),
});

/**
 * Full lead submission payload posted from the funnel's final step.
 * Matches the shape the API expects at POST /v1/leads (docs/05-lead-engine.md).
 */
export const leadSubmitSchema = leadContactSchema.extend({
  verticalId: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).default({}),
  consent: z.literal(true, {
    message: "Debés aceptar el uso de tus datos para continuar",
  }),
  // Anti-spam signals, not stored as lead data.
  honeypot: z.string().max(0).optional(),
  formStartedAt: z.number().optional(),
}).merge(attributionSchema);

export type LeadSubmitInput = z.infer<typeof leadSubmitSchema>;

/**
 * Partial-lead capture, posted as the user progresses through funnel steps
 * so an abandoned funnel with a phone number is still a remarketable
 * contact (docs/02 "quote funnel" design decision).
 */
export const leadPartialSchema = z.object({
  verticalId: z.string().min(1),
  step: z.number().int().min(1),
  phone: z.string().trim().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
}).merge(attributionSchema);

export type LeadPartialInput = z.infer<typeof leadPartialSchema>;

export function buildConsentRecord(acceptedAt: Date = new Date()) {
  return {
    consentAt: acceptedAt,
    consentText: consentTextEs,
    consentVersion: CONSENT_TEXT_VERSION,
  };
}
