import type { Metadata } from "next";
import Link from "next/link";
import { guias } from "@/lib/guias";

export const metadata: Metadata = {
  title: "Guias sobre seguros en Paraguay",
  description:
    "Articulos y guias practicas sobre seguros de auto, moto y salud en Paraguay.",
};

export default function GuiasIndexPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Guias sobre seguros en Paraguay
      </h1>
      <ul className="space-y-6">
        {guias.map((guia) => (
          <li key={guia.slug} className="border-b border-slate-200 pb-6">
            <Link
              href={`/guias/${guia.slug}`}
              className="text-xl font-semibold text-slate-900 hover:text-blue-600"
            >
              {guia.title}
            </Link>
            <p className="mt-2 text-slate-600">{guia.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
