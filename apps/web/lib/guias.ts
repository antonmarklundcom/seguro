export interface GuiaEntry {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
}

/**
 * Registry of guía articles (docs/03 content plan). Each entry's slug must
 * match a folder under app/guias/<slug>/page.mdx. Kept as a separate
 * registry (rather than reading the filesystem) so the index page and
 * sitemap can list articles without a build-time directory scan.
 */
export const guias: GuiaEntry[] = [
  {
    slug: "que-cubre-el-seguro-contra-terceros",
    title: "Que cubre el seguro contra terceros en Paraguay?",
    description:
      "Te explicamos que cubre y que no cubre el seguro contra terceros, y cuando conviene contratar todo riesgo en su lugar.",
    publishedAt: "2026-01-15",
  },
  {
    slug: "cuanto-cuesta-el-seguro-de-auto-en-paraguay",
    title: "Cuanto cuesta el seguro de auto en Paraguay? (Guia 2026)",
    description:
      "Precios reales de seguro de auto en Paraguay segun tipo de cobertura, anio del vehiculo y ciudad, actualizados para 2026.",
    publishedAt: "2026-01-20",
  },
];

export function getGuia(slug: string): GuiaEntry | undefined {
  return guias.find((g) => g.slug === slug);
}
