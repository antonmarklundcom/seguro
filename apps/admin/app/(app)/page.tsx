import { prisma } from "@seguro/db";

export const dynamic = "force-dynamic";

async function getStats() {
  const [leadsByStatus, deliveriesByStatus, totalPartners, activePartners] = await Promise.all([
    prisma.lead.groupBy({ by: ["status"], _count: true }),
    prisma.leadDelivery.groupBy({ by: ["status"], _count: true }),
    prisma.partner.count(),
    prisma.partner.count({ where: { active: true } }),
  ]);
  return { leadsByStatus, deliveriesByStatus, totalPartners, activePartners };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const totalLeads = stats.leadsByStatus.reduce((sum, s) => sum + s._count, 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Leads totales" value={totalLeads} />
        <StatCard label="Partners activos" value={`${stats.activePartners} / ${stats.totalPartners}`} />
        <StatCard
          label="Entregas exitosas"
          value={
            stats.deliveriesByStatus.find((d) => d.status === "SENT")?._count ??
            0
          }
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-800">Leads por estado</h2>
          <ul className="space-y-2 text-sm">
            {stats.leadsByStatus.map((s) => (
              <li key={s.status} className="flex justify-between">
                <span className="text-slate-600">{s.status}</span>
                <span className="font-medium">{s._count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-800">Entregas por estado</h2>
          <ul className="space-y-2 text-sm">
            {stats.deliveriesByStatus.map((s) => (
              <li key={s.status} className="flex justify-between">
                <span className="text-slate-600">{s.status}</span>
                <span className="font-medium">{s._count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
