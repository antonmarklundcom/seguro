import type { Metadata } from "next";
import { Hero, TrustBar, FaqAccordion } from "@seguro/ui";
import { seguroDeAuto } from "@seguro/config";

export const metadata: Metadata = {
  title: seguroDeAuto.seo.title,
  description: seguroDeAuto.seo.description,
};

const faqItems = [
  {
    question: "Cuanto cuesta el seguro de auto en Paraguay?",
    answer:
      "El precio depende del año del vehiculo, el tipo de cobertura (contra terceros o todo riesgo) y la ciudad. Cotiza gratis y te enviamos precios reales de varias aseguradoras.",
  },
  {
    question: "Que diferencia hay entre contra terceros y todo riesgo?",
    answer:
      "El seguro contra terceros cubre danios que le causes a otros vehiculos o personas. El seguro todo riesgo ademas cubre danios a tu propio vehiculo, incluso por robo o accidente.",
  },
  {
    question: "Cuanto tarda en llegar la cotizacion?",
    answer: "Normalmente recibis respuesta por WhatsApp en menos de 24 horas.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function SeguroDeAutoPage() {
  return (
    <main>
      <Hero
        headline="Seguro de Auto en Paraguay"
        subheadline="Compara cotizaciones de las principales aseguradoras y elegi la mejor opcion para tu vehiculo."
        ctaLabel="Cotizar gratis"
        ctaHref="/cotizar/seguro-de-auto"
      />
      <TrustBar
        items={[
          { label: "Cobertura contra terceros y todo riesgo" },
          { label: "Aseguradoras reguladas" },
          { label: "Cotizacion 100% gratuita" },
        ]}
      />
      <FaqAccordion items={faqItems} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
