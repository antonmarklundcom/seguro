import Link from "next/link";
import { Hero, TrustBar, FaqAccordion, type FaqItem } from "@seguro/ui";
import type { VerticalConfig } from "@seguro/config";
import { Footer } from "./Footer";

export interface PillarPageProps {
  vertical: VerticalConfig;
  /** Overrides vertical.name — used by subtype pages (e.g. "contra
   * terceros") that share a vertical's funnel but need their own headline. */
  headline?: string;
  subheadline: string;
  trustItems: string[];
  faqItems: FaqItem[];
  /** Internal links to related pages (subtype pages, guías) — keeps pages
   * from being orphaned and spreads link equity (docs/03). */
  relatedLinks?: { href: string; label: string }[];
}

/**
 * Shared structural renderer for vertical pillar pages (docs/03). Each
 * page.tsx still supplies its own subheadline/trust copy/FAQ content so
 * pages stay genuinely distinct rather than templated doorway pages.
 */
export function PillarPage({
  vertical,
  headline,
  subheadline,
  trustItems,
  faqItems,
  relatedLinks,
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
        headline={headline ?? vertical.name}
        subheadline={subheadline}
        ctaLabel="Cotizar gratis"
        ctaHref={`/cotizar/${vertical.id}`}
      />
      <TrustBar items={trustItems.map((label) => ({ label }))} />
      <FaqAccordion items={faqItems} />
      {relatedLinks && relatedLinks.length > 0 ? (
        <nav className="mx-auto max-w-2xl px-4 pb-12">
          <p className="mb-3 text-sm font-medium text-slate-500">Te puede interesar</p>
          <ul className="flex flex-wrap gap-3">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:border-blue-400 hover:text-blue-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Footer />
    </main>
  );
}
