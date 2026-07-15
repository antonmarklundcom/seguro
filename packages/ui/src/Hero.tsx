export interface HeroProps {
  headline: string;
  subheadline?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

/**
 * The single most important block on any landing page (SEO pillar or Ads
 * LP). Keep this fast: no client JS required to render it.
 */
export function Hero({
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroProps) {
  return (
    <section className="px-4 py-12 text-center sm:py-20">
      <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
        {headline}
      </h1>
      {subheadline ? (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{subheadline}</p>
      ) : null}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          {ctaLabel}
        </a>
        {secondaryCtaLabel && secondaryCtaHref ? (
          <a
            href={secondaryCtaHref}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {secondaryCtaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}
