import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@seguro/db";
import { deactivatePartnerVertical, togglePartnerActive, upsertPartnerVertical } from "@/lib/actions";
import { ChannelForm } from "./ChannelForm";
import { ApiKeyPanel } from "./ApiKeyPanel";

export const dynamic = "force-dynamic";

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await prisma.partner.findUnique({
    where: { id },
    include: { partnerVerticals: { orderBy: { priority: "asc" } } },
  });
  if (!partner) notFound();

  async function handleToggleActive() {
    "use server";
    await togglePartnerActive(id, !partner!.active);
  }

  return (
    <div>
      <Link href="/partners" className="mb-4 inline-block text-sm text-slate-500 hover:text-blue-600">
        &larr; Volver a Partners
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{partner.name}</h1>
        <form action={handleToggleActive}>
          <button
            type="submit"
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              partner.active
                ? "border border-slate-300 hover:bg-slate-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {partner.active ? "Desactivar" : "Activar"}
          </button>
        </form>
      </div>

      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-slate-800">Canal de entrega</h2>
        <ChannelForm partnerId={partner.id} channels={partner.channels as never} />
      </div>

      <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-slate-800">API key (integracion directa)</h2>
        <ApiKeyPanel partnerId={partner.id} hasKey={Boolean(partner.apiKeyHash)} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-slate-800">Reglas de routing por vertical</h2>
        <table className="mb-6 w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-1">Vertical</th>
              <th className="py-1">CPL (Gs)</th>
              <th className="py-1">Exclusivo</th>
              <th className="py-1">Prioridad</th>
              <th className="py-1">Estado</th>
              <th className="py-1" />
            </tr>
          </thead>
          <tbody>
            {partner.partnerVerticals.map((pv) => (
              <tr key={pv.id} className="border-t border-slate-100">
                <td className="py-2">{pv.verticalId}</td>
                <td className="py-2">{pv.cplGs.toLocaleString("es-PY")}</td>
                <td className="py-2">{pv.exclusive ? "Si" : "No (compartido)"}</td>
                <td className="py-2">{pv.priority}</td>
                <td className="py-2">{pv.active ? "Activa" : "Inactiva"}</td>
                <td className="py-2">
                  {pv.active ? (
                    <form
                      action={async () => {
                        "use server";
                        await deactivatePartnerVertical(pv.id, id);
                      }}
                    >
                      <button type="submit" className="text-xs text-red-600 hover:underline">
                        Desactivar
                      </button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
            {partner.partnerVerticals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-400">
                  Sin reglas de routing todavia.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <h3 className="mb-2 text-sm font-semibold text-slate-700">Agregar / actualizar regla</h3>
        <form action={upsertPartnerVertical} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="partnerId" value={partner.id} />
          <Field label="Vertical ID">
            <input
              name="verticalId"
              required
              placeholder="seguro-de-auto"
              className="w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="CPL (Gs)">
            <input
              name="cplGs"
              type="number"
              required
              min={0}
              className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Prioridad">
            <input
              name="priority"
              type="number"
              defaultValue={100}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Field>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input type="checkbox" name="exclusive" /> Exclusivo
          </label>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-slate-600">{label}</span>
      {children}
    </label>
  );
}
