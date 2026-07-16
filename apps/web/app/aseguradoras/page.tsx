import type { Metadata } from "next";
import Link from "next/link";
import { aseguradoras } from "@/lib/aseguradoras";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aseguradoras en Paraguay",
  description:
    "Conoce las aseguradoras que operan en Paraguay y compara sus coberturas.",
};

export default function AseguradorasIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Aseguradoras en Paraguay</h1>
      <p className="mb-8 text-slate-600">
        Estas son algunas de las aseguradoras que operan en el mercado
        paraguayo. Cotiza gratis para recibir ofertas de varias aseguradoras a
        la vez.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {aseguradoras.map((a) => (
          <li key={a.slug} className="rounded-lg border border-slate-200 p-5">
            <Link
              href={`/aseguradoras/${a.slug}`}
              className="font-semibold text-slate-900 hover:text-blue-600"
            >
              {a.name}
            </Link>
            <p className="mt-1 text-sm text-slate-500">{a.ramos.join(" · ")}</p>
          </li>
        ))}
      </ul>
      <Footer />
    </main>
  );
}
