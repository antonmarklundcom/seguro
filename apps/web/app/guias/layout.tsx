import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function GuiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <nav className="mb-8 text-sm text-slate-500">
        <Link href="/" className="hover:text-blue-600">
          Inicio
        </Link>
        {" / "}
        <Link href="/guias" className="hover:text-blue-600">
          Guias
        </Link>
      </nav>
      {children}
      <div className="mt-12 rounded-lg border border-blue-100 bg-blue-50 p-6 text-center">
        <p className="mb-3 font-medium text-slate-800">
          Queres cotizar tu seguro ahora?
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
