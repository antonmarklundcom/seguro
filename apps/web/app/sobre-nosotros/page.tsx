import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description:
    "Conoce quienes somos y como funciona Seguro, el comparador de seguros de Paraguay.",
};

export default function SobreNosotrosPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Sobre Nosotros</h1>
      <div className="space-y-4 text-slate-700">
        <p>
          Seguro es un comparador de seguros que te conecta con aseguradoras y
          corredores en Paraguay. Te ayudamos a cotizar de forma gratuita y
          rapida, sin que tengas que llamar uno por uno a cada aseguradora.
        </p>
        <p>
          No somos una aseguradora ni un corredor de seguros: somos un servicio
          de comparacion e intermediacion digital que te conecta con
          aseguradoras y corredores habilitados en Paraguay para que ellos te
          brinden su asesoramiento y cotizacion.
        </p>
        <p>
          Nuestro objetivo es simple: que cotizar un seguro en Paraguay sea
          rapido, transparente y gratuito para vos.
        </p>
      </div>
      <Footer />
    </main>
  );
}
