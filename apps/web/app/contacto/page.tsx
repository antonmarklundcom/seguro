import type { Metadata } from "next";
import { WhatsAppButton } from "@seguro/ui";
import { currentSite } from "@/lib/site";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactate con Seguro por WhatsApp o correo electronico.",
};

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-center">
      <h1 className="mb-6 text-3xl font-bold">Contacto</h1>
      <p className="mb-8 text-slate-600">
        Escribinos por WhatsApp y te respondemos a la brevedad.
      </p>
      <WhatsAppButton
        phoneE164={currentSite.whatsappNumber}
        message="Hola! Tengo una consulta."
      />
      <Footer />
    </main>
  );
}
