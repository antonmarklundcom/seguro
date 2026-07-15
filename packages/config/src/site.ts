import { z } from "zod";

/**
 * One tenant/domain on the shared platform (docs/09-multi-vertical-prestamo.md).
 * apps/web selects a SiteConfig by hostname; new domain = new entry here,
 * not a fork of the codebase.
 */
export const siteConfigSchema = z.object({
  id: z.string().min(1), // e.g. "seguro.com.py"
  domain: z.string().min(1),
  brandName: z.string().min(1),
  locale: z.literal("es-PY"),
  themeColor: z.string().min(1),
  whatsappNumber: z.string().min(1), // E.164, used for click-to-WhatsApp CTAs
  gtmContainerId: z.string().optional(),
  ga4MeasurementId: z.string().optional(),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
