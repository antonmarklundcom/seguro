import type { Metadata } from "next";
import { WhatsAppButton } from "@seguro/ui";
import { currentSite } from "@/lib/site";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Socios - Recibi leads calificados",
  description:
    "Sumate como aseguradora o corredor y recibi leads calificados de seguros en Paraguay.",
};

const benefits = [
  {
    title: "Leads calificados",
    description:
      "Cada lead pasa por validacion de telefono, deteccion de duplicados y scoring antes de llegar a vos.",
  },
  {
    title: "Vos elegis el volumen",
    description:
      "Definis un tope diario o mensual de leads, y el rubro (auto, moto, salud) que te interesa.",
  },
  {
    title: "Entrega instantanea",
    description:
      "Los leads llegan por WhatsApp, correo o a tu sistema via webhook, en tiempo real.",
  },
  {
    title: "Pago simple",
    description:
      "Pagas por lead entregado (CPL). Sin costos fijos, sin contratos de permanencia larga.",
  },
];

export default function SociosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-3 text-3xl font-bold">
        Recibi leads calificados de seguros
      </h1>
      <p className="mb-10 text-lg text-slate-600">
        Sumate como aseguradora o corredor y recibi clientes interesados en
        cotizar seguro de auto, moto o salud en Paraguay.
      </p>

      <div className="mb-10 grid gap-6 sm:grid-cols-2">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-lg border border-slate-200 p-5">
            <h2 className="mb-2 font-semibold text-slate-900">{b.title}</h2>
            <p className="text-sm text-slate-600">{b.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-6 text-center">
        <p className="mb-3 font-medium text-slate-800">
          Contactanos por WhatsApp para conocer precios y empezar a recibir
          leads.
        </p>
        <WhatsAppButton
          phoneE164={currentSite.whatsappNumber}
          message="Hola! Somos una aseguradora/corredor y queremos recibir leads."
        />
      </div>
      <Footer />
    </main>
  );
}
