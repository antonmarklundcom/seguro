import type { Metadata } from "next";
import { seguroDeAuto } from "@seguro/config";
import { PillarPage } from "@/components/PillarPage";

export const metadata: Metadata = {
  title: "Seguro de Auto Contra Terceros en Paraguay - Cotiza Gratis | Seguro",
  description:
    "Cotiza seguro de auto contra terceros en Paraguay: cubre los danios que le causes a otras personas o vehiculos. Compara precios gratis.",
};

const faqItems = [
  {
    question: "Que cubre exactamente el seguro contra terceros?",
    answer:
      "Cubre los danios materiales y las lesiones que vos le causes a otra persona o a otro vehiculo en un accidente. No cubre danios a tu propio auto.",
  },
  {
    question: "Es la opcion mas barata?",
    answer:
      "Si, es la cobertura de menor costo entre las opciones disponibles, porque protege a terceros pero no a tu propio vehiculo.",
  },
  {
    question: "Para que tipo de auto conviene?",
    answer:
      "Suele ser la eleccion mas comun para vehiculos de varios anios ya pagados, donde el valor del auto no justifica una cobertura todo riesgo.",
  },
];

export default function ContraTercerosPage() {
  return (
    <PillarPage
      vertical={seguroDeAuto}
      headline="Seguro de Auto Contra Terceros"
      subheadline="La cobertura mas accesible: te protege ante danios que le causes a otras personas o vehiculos. Cotiza gratis en 2 minutos."
      trustItems={[
        "La opcion mas economica",
        "Cobertura de responsabilidad civil",
        "Cotizacion 100% gratuita",
      ]}
      faqItems={faqItems}
      relatedLinks={[
        { href: "/seguro-de-auto", label: "Seguro de auto (todas las coberturas)" },
        { href: "/seguro-de-auto/todo-riesgo", label: "Seguro todo riesgo" },
        {
          href: "/guias/que-cubre-el-seguro-contra-terceros",
          label: "Que cubre el seguro contra terceros",
        },
      ]}
    />
  );
}
