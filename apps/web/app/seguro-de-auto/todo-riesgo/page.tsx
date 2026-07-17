import type { Metadata } from "next";
import { seguroDeAuto } from "@seguro/config";
import { PillarPage } from "@/components/PillarPage";

export const metadata: Metadata = {
  title: "Seguro de Auto Todo Riesgo en Paraguay - Cotiza Gratis | Seguro",
  description:
    "Cotiza seguro de auto todo riesgo en Paraguay: cubre danios a tu propio vehiculo ademas de terceros, incluyendo robo y accidentes. Compara precios gratis.",
};

const faqItems = [
  {
    question: "Que cubre el seguro todo riesgo que el contra terceros no cubre?",
    answer:
      "Ademas de cubrir a terceros, el todo riesgo cubre danios a tu propio vehiculo por accidente, y en la mayoria de los planes tambien robo total.",
  },
  {
    question: "Cuanto mas cuesta que un contra terceros?",
    answer:
      "Depende del valor de tu vehiculo, pero suele costar entre 2 y 4 veces mas que un contra terceros. Cotiza gratis para ver el precio real para tu auto.",
  },
  {
    question: "Para que vehiculos conviene?",
    answer:
      "Se recomienda para vehiculos nuevos o financiados, donde el costo de reparar o reponer el auto en caso de siniestro seria alto.",
  },
];

export default function TodoRiesgoPage() {
  return (
    <PillarPage
      vertical={seguroDeAuto}
      headline="Seguro de Auto Todo Riesgo"
      subheadline="Protege tu propio vehiculo ademas de terceros: danios, accidentes y robo. Cotiza gratis en 2 minutos."
      trustItems={[
        "Cubre tu vehiculo y a terceros",
        "Incluye robo en la mayoria de los planes",
        "Cotizacion 100% gratuita",
      ]}
      faqItems={faqItems}
      relatedLinks={[
        { href: "/seguro-de-auto", label: "Seguro de auto (todas las coberturas)" },
        { href: "/seguro-de-auto/contra-terceros", label: "Seguro contra terceros" },
        {
          href: "/guias/cuanto-cuesta-el-seguro-de-auto-en-paraguay",
          label: "Cuanto cuesta el seguro de auto",
        },
      ]}
    />
  );
}
