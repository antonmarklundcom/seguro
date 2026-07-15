import { Hero, TrustBar } from "@seguro/ui";
import { getSiteVerticals } from "@/lib/site";

export default function HomePage() {
  const verticals = getSiteVerticals();

  return (
    <main>
      <Hero
        headline="Compara seguros en Paraguay y cotiza gratis"
        subheadline="Te conectamos con las mejores aseguradoras del pais. Sin costo, sin compromiso, respuesta por WhatsApp."
        ctaLabel="Cotizar ahora"
        ctaHref="/seguro-de-auto"
      />
      <TrustBar
        items={[
          { label: "Aseguradoras reguladas por el BCP" },
          { label: "Sin costo para vos" },
          { label: "Respuesta en menos de 24 horas" },
        ]}
      />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Elegi tu seguro</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {verticals.map((vertical) => (
            <a
              key={vertical.id}
              href={vertical.pillarPath}
              className="rounded-lg border border-slate-200 p-6 transition hover:border-blue-400 hover:shadow-sm"
            >
              <h3 className="text-lg font-semibold">{vertical.name}</h3>
              <p className="mt-1 text-sm text-slate-600">Cotiza gratis en 2 minutos</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
