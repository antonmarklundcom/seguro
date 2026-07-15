import { z } from "zod";

/**
 * Marketing attribution captured on every lead so paid-channel bidding
 * (docs/04-google-ads-landing-pages.md) can be optimized on lead quality,
 * not just click volume.
 */
export const attributionSchema = z.object({
  gclid: z.string().max(200).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  landingPage: z.string().max(300).optional(),
  abVariant: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
  device: z.string().max(50).optional(),
});

export type Attribution = z.infer<typeof attributionSchema>;
