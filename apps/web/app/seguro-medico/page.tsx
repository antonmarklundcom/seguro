import type { Metadata } from "next";
import { seguroMedico } from "@seguro/config";
import { PillarPage } from "@/components/PillarPage";

export const metadata: Metadata = {
  title: seguroMedico.seo.title,
  description: seguroMedico.seo.description,
};

const faqItems = [
  {
    question: "Que diferencia hay entre seguro medico y medicina prepaga?",
    answer:
      "En Paraguay ambos terminos se usan para planes de salud privados que te dan acceso a consultas, internaciones y estudios en clinicas y sanatorios privados. Cotiza gratis y te explicamos las opciones disponibles.",
  },
  {
    question: "Puedo contratar un plan para toda mi familia?",
    answer:
      "Si, la mayoria de las aseguradoras ofrecen planes familiares con descuentos por cantidad de miembros. Indicalo en el formulario y te enviamos opciones familiares.",
  },
  {
    question: "Hay periodo de carencia?",
    answer:
      "La mayoria de los planes tienen un periodo de carencia inicial para ciertas prestaciones. Cada aseguradora tiene sus propias condiciones, que te detallamos en tu cotizacion.",
  },
];

export default function SeguroMedicoPage() {
  return (
    <PillarPage
      vertical={seguroMedico}
      subheadline="Compara planes de salud privados en Paraguay para vos, tu familia o tu empresa."
      trustItems={[
        "Planes individuales, familiares y empresariales",
        "Aseguradoras y prepagas reconocidas",
        "Cotizacion 100% gratuita",
      ]}
      faqItems={faqItems}
    />
  );
}
