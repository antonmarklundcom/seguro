import type { Metadata } from "next";
import { seguroDeMoto } from "@seguro/config";
import { PillarPage } from "@/components/PillarPage";

export const metadata: Metadata = {
  title: seguroDeMoto.seo.title,
  description: seguroDeMoto.seo.description,
};

const faqItems = [
  {
    question: "Es obligatorio el seguro de moto en Paraguay?",
    answer:
      "El seguro contra terceros es altamente recomendado para circular en Paraguay, ya que te protege de tener que responder de tu bolsillo por danios a otras personas o vehiculos.",
  },
  {
    question: "El seguro cubre robo de la moto?",
    answer:
      "Depende del plan. Algunas coberturas incluyen robo total, mientras que las basicas solo cubren danios a terceros. Cotiza gratis para ver las opciones disponibles para tu moto.",
  },
  {
    question: "Cuanto cuesta asegurar una moto en Paraguay?",
    answer:
      "El precio varia segun la cilindrada, el anio y la ciudad. Las motos de baja cilindrada suelen tener primas mas accesibles. Cotiza gratis para ver precios reales.",
  },
];

export default function SeguroDeMotoPage() {
  return (
    <PillarPage
      vertical={seguroDeMoto}
      subheadline="Protege tu moto y circula tranquilo. Compara precios de las mejores aseguradoras de Paraguay."
      trustItems={[
        "Coberturas para todas las cilindradas",
        "Aseguradoras reguladas",
        "Cotizacion 100% gratuita",
      ]}
      faqItems={faqItems}
    />
  );
}
