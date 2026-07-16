import type { Metadata } from "next";
import { seguroDeAuto } from "@seguro/config";
import { PillarPage } from "@/components/PillarPage";

export const metadata: Metadata = {
  title: seguroDeAuto.seo.title,
  description: seguroDeAuto.seo.description,
};

const faqItems = [
  {
    question: "Cuanto cuesta el seguro de auto en Paraguay?",
    answer:
      "El precio depende del anio del vehiculo, el tipo de cobertura (contra terceros o todo riesgo) y la ciudad. Cotiza gratis y te enviamos precios reales de varias aseguradoras.",
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

export default function SeguroDeAutoPage() {
  return (
    <PillarPage
      vertical={seguroDeAuto}
      subheadline="Compara cotizaciones de las principales aseguradoras y elegi la mejor opcion para tu vehiculo."
      trustItems={[
        "Cobertura contra terceros y todo riesgo",
        "Aseguradoras reguladas",
        "Cotizacion 100% gratuita",
      ]}
      faqItems={faqItems}
    />
  );
}
