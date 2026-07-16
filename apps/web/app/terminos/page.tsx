import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terminos y Condiciones",
  description: "Terminos y condiciones de uso del sitio.",
};

// DRAFT: placeholder legal text pending review by a Paraguayan lawyer before
// launch (docs/06 risk #6-7). In particular, the "que somos" section must
// stay accurate to whatever corporate/broker structure legal counsel
// recommends -- do not treat this as legal advice or a finished policy.
export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Terminos y Condiciones</h1>
      <p className="mb-8 text-sm text-slate-500">
        Ultima actualizacion: [fecha pendiente]
      </p>

      <div className="space-y-6 text-slate-700">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            1. Que es este servicio
          </h2>
          <p>
            Este sitio es un servicio de comparacion e intermediacion digital de
            cotizaciones de seguros en Paraguay. No somos una aseguradora ni un
            corredor de seguros: te conectamos con aseguradoras y/o corredores
            habilitados para que ellos te brinden su cotizacion y asesoramiento
            profesional.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            2. Uso del servicio
          </h2>
          <p>
            Al completar un formulario de cotizacion, aceptas que tus datos sean
            compartidos con las aseguradoras y/o corredores seleccionados para
            que puedan contactarte con una cotizacion. El servicio es gratuito
            para vos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            3. Responsabilidad
          </h2>
          <p>
            No somos responsables por las condiciones, precios ni tiempos de
            respuesta de las aseguradoras y/o corredores con quienes te
            conectamos. La contratacion final de cualquier poliza es un acuerdo
            entre vos y la aseguradora o corredor correspondiente.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            4. Datos personales
          </h2>
          <p>
            El tratamiento de tus datos personales se rige por nuestra{" "}
            <Link href="/privacidad" className="text-blue-600 underline">
              Politica de Privacidad
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            5. Modificaciones
          </h2>
          <p>
            Podemos actualizar estos terminos en cualquier momento. Los cambios
            se publican en esta pagina con su fecha de actualizacion.
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
