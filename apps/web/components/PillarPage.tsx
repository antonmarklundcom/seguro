import { Hero, TrustBar, FaqAccordion, type FaqItem } from "@seguro/ui";
import type { VerticalConfig } from "@seguro/config";
import { Footer } from "./Footer";

export interface PillarPageProps {
  vertical: VerticalConfig;
  subheadline: string;
  trustItems: string[];
  faqItems: FaqItem[];
}

/**
 * Shared structural renderer for vertical pillar pages (docs/03). Each
 * page.tsx still supplies its own subheadline/trust copy/FAQ content so
 * pages stay genuinely distinct rather than templated doorway pages.
 */
export function PillarPage({
  vertical,
  subheadline,
  trustItems,
  faqItems,
}: PillarPageProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main>
      <Hero
        headline={vertical.name}
        subheadline={subheadline}
        ctaLabel="Cotizar gratis"
        ctaHref={`/cotizar/${vertical.id}`}
      />
      <TrustBar items={trustItems.map((label) => ({ label }))} />
      <FaqAccordion items={faqItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Footer />
    </main>
  );
}
