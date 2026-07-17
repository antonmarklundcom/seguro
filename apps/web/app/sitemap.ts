import type { MetadataRoute } from "next";
import { currentSite } from "@/lib/site";
import { getSiteVerticals } from "@/lib/site";
import { guias } from "@/lib/guias";
import { aseguradoras } from "@/lib/aseguradoras";

const staticPages = [
  { path: "/guias", priority: 0.6 },
  { path: "/aseguradoras", priority: 0.6 },
  { path: "/socios", priority: 0.5 },
  { path: "/seguro-de-auto/contra-terceros", priority: 0.7 },
  { path: "/seguro-de-auto/todo-riesgo", priority: 0.7 },
  { path: "/sobre-nosotros", priority: 0.3 },
  { path: "/contacto", priority: 0.3 },
  { path: "/privacidad", priority: 0.1 },
  { path: "/terminos", priority: 0.1 },
];

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
    ...staticPages.map((p) => ({
      url: `${base}${p.path}`,
      changeFrequency: "monthly" as const,
      priority: p.priority,
    })),
    ...guias.map((g) => ({
      url: `${base}/guias/${g.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...aseguradoras.map((a) => ({
      url: `${base}/aseguradoras/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
