export interface LandingPageConfig {
  slug: string;
  verticalId: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
}

/**
 * Google Ads landing pages, message-matched per ad group (docs/04). Each
 * entry here is a full LP — no new React code needed to launch a new ad
 * group with its own message match.
 */
export const landingPages: LandingPageConfig[] = [
  {
    slug: "seguro-auto-cotiza",
    verticalId: "seguro-de-auto",
    headline: "Cotiza tu Seguro de Auto en 2 Minutos",
    subheadline: "Compara precios de las mejores aseguradoras de Paraguay, gratis y sin compromiso.",
    ctaLabel: "Cotizar gratis",
  },
  {
    slug: "seguro-auto-barato",
    verticalId: "seguro-de-auto",
    headline: "Seguro de Auto Desde Precios Accesibles",
    subheadline: "Encontra la cobertura que se ajusta a tu presupuesto. Cotiza gratis ahora.",
    ctaLabel: "Ver precios",
  },
  {
    slug: "seguro-auto-asuncion",
    verticalId: "seguro-de-auto",
    headline: "Seguro de Auto en Asuncion",
    subheadline: "Aseguradoras y corredores de confianza en Asuncion. Cotiza gratis por WhatsApp.",
    ctaLabel: "Cotizar ahora",
  },
];

export function getLandingPage(slug: string): LandingPageConfig | undefined {
  return landingPages.find((lp) => lp.slug === slug);
}
