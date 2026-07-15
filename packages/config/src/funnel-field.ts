import { z } from "zod";

/**
 * Describes one question in a vertical's funnel. A vertical is fully
 * defined by an ordered list of these — adding a vertical is writing this
 * array, not writing React (docs/02 "Landing pages as data").
 */
export const funnelFieldSchema = z.object({
  key: z.string().min(1),
  step: z.number().int().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "number", "select", "radio", "date"]),
  required: z.boolean().default(true),
  options: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  placeholder: z.string().optional(),
});

export type FunnelField = z.infer<typeof funnelFieldSchema>;
