import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@seguro/db";
import { redeliverLead } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { deliveries: { include: { partner: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!lead) notFound();

  async function handleRedeliver() {
    "use server";
    await redeliverLead(id);
  }

  return (
    <div>
      <Link href="/leads" className="mb-4 inline-block text-sm text-slate-500 hover:text-blue-600">
        &larr; Volver a Leads
      </Link>
      <h1 className="mb-1 text-2xl font-bold">{lead.name ?? "(sin nombre)"}</h1>
      <p className="mb-6 text-sm text-slate-500">
        {lead.verticalId} · {lead.status} · creado {lead.createdAt.toLocaleString("es-PY")}
      </p>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-800">Contacto</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Telefono" value={lead.phone} />
            <Row label="Email" value={lead.email ?? "-"} />
            <Row label="Ciudad" value={lead.city ?? "-"} />
            <Row label="Score" value={lead.score?.toString() ?? "-"} />
          </dl>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-800">Atribucion</h2>
          <dl className="space-y-2 text-sm">
            <Row label="gclid" value={lead.gclid ?? "-"} />
            <Row label="UTM source" value={lead.utmSource ?? "-"} />
            <Row label="UTM campaign" value={lead.utmCampaign ?? "-"} />
            <Row label="Landing page" value={lead.landingPage ?? "-"} />
          </dl>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Respuestas del formulario</h2>
        </div>
        <pre className="overflow-x-auto rounded-md bg-slate-50 p-3 text-xs">
          {JSON.stringify(lead.payload, null, 2)}
        </pre>
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Entregas</h2>
          <form action={handleRedeliver}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
            >
              Re-enviar a routing
            </button>
          </form>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-1">Partner</th>
              <th className="py-1">Canal</th>
              <th className="py-1">Estado</th>
              <th className="py-1">Precio (Gs)</th>
              <th className="py-1">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {lead.deliveries.map((d) => (
              <tr key={d.id} className="border-t border-slate-100">
                <td className="py-2">{d.partner.name}</td>
                <td className="py-2">{d.channel}</td>
                <td className="py-2">{d.status}</td>
                <td className="py-2">{d.billableGs.toLocaleString("es-PY")}</td>
                <td className="py-2">{d.outcome ?? "-"}</td>
              </tr>
            ))}
            {lead.deliveries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  Sin entregas todavia.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="truncate text-right font-medium">{value}</dd>
    </div>
  );
}
