import type { MetadataRoute } from "next";
import { currentSite } from "@/lib/site";
import { getSiteVerticals } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${currentSite.domain}`;
  const verticals = getSiteVerticals();

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...verticals.map((v) => ({
      url: `${base}${v.pillarPath}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
