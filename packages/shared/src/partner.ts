import { z } from "zod";

/** Body for POST /v1/partner/leads/:deliveryId/outcome (docs/05 "Partner API"). */
export const leadOutcomeSchema = z.object({
  outcome: z.enum(["ACCEPTED", "REJECTED", "SOLD"]),
  note: z.string().max(500).optional(),
});

export type LeadOutcomeInput = z.infer<typeof leadOutcomeSchema>;
