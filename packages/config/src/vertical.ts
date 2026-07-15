import { z } from "zod";
import { funnelFieldSchema } from "./funnel-field";

export const verticalConfigSchema = z.object({
  id: z.string().min(1), // slug, matches Prisma Vertical.id, e.g. "seguro-de-auto"
  siteId: z.string().min(1),
  name: z.string().min(1), // display name, e.g. "Seguro de Auto"
  pillarPath: z.string().startsWith("/"), // e.g. "/seguro-de-auto"
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  fields: z.array(funnelFieldSchema).min(1),
  active: z.boolean().default(true),
});

export type VerticalConfig = z.infer<typeof verticalConfigSchema>;

export function validateVerticals(verticals: VerticalConfig[]): VerticalConfig[] {
  const seen = new Set<string>();
  for (const v of verticals) {
    verticalConfigSchema.parse(v);
    if (seen.has(v.id)) {
      throw new Error(`Duplicate vertical id in config: ${v.id}`);
    }
    seen.add(v.id);
  }
  return verticals;
}
