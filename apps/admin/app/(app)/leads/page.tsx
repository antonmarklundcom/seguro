import Link from "next/link";
import { prisma, type Prisma } from "@seguro/db";

export const dynamic = "force-dynamic";

interface LeadsSearchParams {
  status?: string;
  verticalId?: string;
  phone?: string;
}

async function getLeads(params: LeadsSearchParams) {
  const where: Prisma.LeadWhereInput = {};
  if (params.status) where.status = params.status as Prisma.LeadWhereInput["status"];
  if (params.verticalId) where.verticalId = params.verticalId;
  if (params.phone) where.phone = { contains: params.phone };

  return prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<LeadsSearchParams>;
}) {
  const params = await searchParams;
  const leads = await getLeads(params);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Leads</h1>

      <form className="mb-6 flex flex-wrap gap-3" method="GET">
        <input
          name="phone"
          placeholder="Buscar por telefono"
          defaultValue={params.phone}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          name="verticalId"
          placeholder="Vertical (ej: seguro-de-auto)"
          defaultValue={params.verticalId}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {[
            "NEW",
            "PARTIAL",
            "VALID",
            "INVALID",
            "DUPLICATE",
            "ROUTED",
            "ROUTED_NONE",
            "DELIVERED",
            "ACCEPTED",
            "REJECTED",
            "SOLD",
          ].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Filtrar
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Vertical</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Telefono</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-2 text-slate-500">
                  {lead.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                </td>
                <td className="px-4 py-2">{lead.verticalId}</td>
                <td className="px-4 py-2">
                  <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline">
                    {lead.name ?? "(sin nombre)"}
                  </Link>
                </td>
                <td className="px-4 py-2">{lead.phone}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-2">{lead.score ?? "-"}</td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No se encontraron leads.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    DELIVERED: "bg-green-100 text-green-700",
    SOLD: "bg-green-100 text-green-700",
    ACCEPTED: "bg-green-100 text-green-700",
    ROUTED: "bg-blue-100 text-blue-700",
    NEW: "bg-slate-100 text-slate-700",
    PARTIAL: "bg-slate-100 text-slate-500",
    DUPLICATE: "bg-amber-100 text-amber-700",
    ROUTED_NONE: "bg-amber-100 text-amber-700",
    INVALID: "bg-red-100 text-red-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status] ?? "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
