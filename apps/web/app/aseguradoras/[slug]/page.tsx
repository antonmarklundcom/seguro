import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { aseguradoras, getAseguradora } from "@/lib/aseguradoras";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return aseguradoras.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getAseguradora(slug);
  if (!a) return {};
  return {
    title: `${a.name} - Cotiza y Compara | Seguro`,
    description: `Informacion sobre ${a.name} y como cotizar sus coberturas de ${a.ramos.join(", ")} en Paraguay.`,
  };
}

export default async function AseguradoraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getAseguradora(slug);
  if (!a) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/aseguradoras" className="hover:text-blue-600">
          Aseguradoras
        </Link>
        {" / "}
        {a.name}
      </nav>
      <h1 className="mb-3 text-3xl font-bold">{a.name}</h1>
      <p className="mb-2 text-sm font-medium text-slate-500">
        {a.ramos.join(" · ")}
      </p>
      <p className="mb-8 text-slate-700">{a.description}</p>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-6 text-center">
        <p className="mb-3 font-medium text-slate-800">
          Queres comparar la cobertura de {a.name} con otras aseguradoras?
        </p>
        <Link
          href="/seguro-de-auto"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Cotizar gratis
        </Link>
      </div>
      <Footer />
    </main>
  );
}
