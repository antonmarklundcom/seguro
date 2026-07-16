export interface Aseguradora {
  slug: string;
  name: string;
  description: string;
  ramos: string[]; // lines of business, e.g. "Auto", "Vida"
}

/**
 * TODO before this goes live: every description below is a generic,
 * unverified placeholder — it must be replaced with facts confirmed either
 * by the insurer's own published materials or by the partner directly
 * (docs/06 risk #6: avoid unverified claims about real companies, and
 * "asesoramos/recomendamos" language that could imply broker advice).
 * Names here reflect the public market landscape (docs/01) for SEO
 * structure only, not a claim of partnership.
 */
export const aseguradoras: Aseguradora[] = [
  {
    slug: "mapfre",
    name: "MAPFRE Paraguay",
    description:
      "Aseguradora que opera en el mercado paraguayo. Descripcion pendiente de verificacion.",
    ramos: ["Auto", "Hogar", "Vida", "Salud"],
  },
  {
    slug: "la-consolidada",
    name: "La Consolidada",
    description:
      "Aseguradora que opera en el mercado paraguayo. Descripcion pendiente de verificacion.",
    ramos: ["Auto", "Vida", "Empresas"],
  },
  {
    slug: "aseguradora-del-este",
    name: "Aseguradora del Este",
    description:
      "Aseguradora que opera en el mercado paraguayo. Descripcion pendiente de verificacion.",
    ramos: ["Auto", "Comercio"],
  },
  {
    slug: "patria-seguros",
    name: "Patria Seguros",
    description:
      "Aseguradora que opera en el mercado paraguayo. Descripcion pendiente de verificacion.",
    ramos: ["Auto", "Hogar", "Vida"],
  },
  {
    slug: "regional-seguros",
    name: "Regional Seguros",
    description:
      "Aseguradora que opera en el mercado paraguayo. Descripcion pendiente de verificacion.",
    ramos: ["Auto", "Empresas", "Patrimoniales"],
  },
];

export function getAseguradora(slug: string): Aseguradora | undefined {
  return aseguradoras.find((a) => a.slug === slug);
}
