import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
  description: "Como recopilamos, usamos y protegemos tus datos personales.",
};

// DRAFT: placeholder legal text pending review by a Paraguayan lawyer before
// launch (docs/06 risk #7). [Razon social], [RUC] and [direccion] must be
// filled in once the legal entity is constituted. Do not treat this as
// legal advice or a finished policy.
export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Politica de Privacidad</h1>
      <p className="mb-8 text-sm text-slate-500">
        Ultima actualizacion: [fecha pendiente]
      </p>

      <div className="space-y-6 text-slate-700">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            1. Quienes somos
          </h2>
          <p>
            Este sitio es operado por [Razon social pendiente], con domicilio en
            [direccion pendiente], Paraguay ([RUC pendiente]). Para consultas
            sobre tus datos personales podes escribirnos por WhatsApp desde la
            seccion{" "}
            <Link href="/contacto" className="text-blue-600 underline">
              Contacto
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            2. Que datos recopilamos
          </h2>
          <p>Cuando completas un formulario de cotizacion recopilamos:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Nombre y numero de WhatsApp/celular</li>
            <li>Correo electronico y ciudad (si los proporcionas)</li>
            <li>
              Respuestas especificas del rubro que consultas (por ejemplo, año
              del vehiculo)
            </li>
            <li>
              Datos tecnicos de origen: pagina de aterrizaje, campana
              publicitaria, dispositivo
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            3. Para que usamos tus datos
          </h2>
          <p>
            Usamos tus datos exclusivamente para conectarte con aseguradoras y/o
            corredores de seguros habilitados en Paraguay, para que puedan
            enviarte una cotizacion. No vendemos tus datos para fines distintos
            a este.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            4. Con quien compartimos tus datos
          </h2>
          <p>
            Compartimos tus datos unicamente con las aseguradoras y/o corredores
            seleccionados segun el rubro que consultaste, previa tu aceptacion
            explicita en el formulario. Podes ver el listado de aseguradoras con
            las que trabajamos en la seccion{" "}
            <Link href="/aseguradoras" className="text-blue-600 underline">
              Aseguradoras
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            5. Cuanto tiempo conservamos tus datos
          </h2>
          <p>
            Conservamos tus datos mientras sean necesarios para el fin de
            conectar tu cotizacion con una aseguradora, y por el plazo minimo
            adicional requerido por norma aplicable. Podes solicitar la
            eliminacion de tus datos en cualquier momento.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            6. Tus derechos
          </h2>
          <p>
            Podes solicitar en cualquier momento acceder, corregir o eliminar
            tus datos personales, o retirar tu consentimiento para que sigamos
            compartiendolos con aseguradoras/corredores. Para ejercer estos
            derechos, escribinos desde la seccion{" "}
            <Link href="/contacto" className="text-blue-600 underline">
              Contacto
            </Link>
            .
          </p>
        </section>
      </div>
      <Footer />
    </main>
  );
}
