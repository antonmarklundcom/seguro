import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero, WhatsAppButton } from "@seguro/ui";
import { currentSite } from "@/lib/site";
import { getLandingPage, landingPages } from "@/lib/landing-pages";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return landingPages.map((lp) => ({ slug: lp.slug }));
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lp = getLandingPage(slug);
  if (!lp) notFound();

  return (
    <main>
      <Hero
        headline={lp.headline}
        subheadline={lp.subheadline}
        ctaLabel={lp.ctaLabel}
        ctaHref={`/cotizar/${lp.verticalId}`}
      />
      <div className="flex justify-center pb-16">
        <WhatsAppButton
          phoneE164={currentSite.whatsappNumber}
          message={`Hola! Quiero cotizar ${lp.verticalId.replace(/-/g, " ")}`}
        />
      </div>
    </main>
  );
}
