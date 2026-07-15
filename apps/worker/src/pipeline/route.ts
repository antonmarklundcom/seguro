import { prisma, type Lead, type PartnerVertical } from "@seguro/db";

export interface RoutingFilters {
  city?: string[];
  [key: string]: unknown;
}

function matchesFilters(lead: Lead, filters: RoutingFilters): boolean {
  if (filters.city && filters.city.length > 0) {
    if (!lead.city || !filters.city.includes(lead.city)) return false;
  }
  return true;
}

async function isUnderCaps(pv: PartnerVertical): Promise<boolean> {
  if (!pv.dailyCap && !pv.monthlyCap) return true;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (pv.dailyCap) {
    const count = await prisma.leadDelivery.count({
      where: { partnerId: pv.partnerId, createdAt: { gte: startOfDay } },
    });
    if (count >= pv.dailyCap) return false;
  }
  if (pv.monthlyCap) {
    const count = await prisma.leadDelivery.count({
      where: { partnerId: pv.partnerId, createdAt: { gte: startOfMonth } },
    });
    if (count >= pv.monthlyCap) return false;
  }
  return true;
}

/**
 * Picks which partner(s) should receive this lead. Exclusive partners at
 * the top priority tier win alone; otherwise the lead is shared with up to
 * `maxShared` partners in priority/weight order (docs/05-lead-engine.md).
 */
export async function routeLead(lead: Lead): Promise<PartnerVertical[]> {
  const candidates = await prisma.partnerVertical.findMany({
    where: { verticalId: lead.verticalId, active: true, partner: { active: true } },
    orderBy: [{ priority: "asc" }, { weight: "desc" }],
  });

  const eligible: PartnerVertical[] = [];
  for (const pv of candidates) {
    const filters = (pv.filters as RoutingFilters) ?? {};
    if (!matchesFilters(lead, filters)) continue;
    if (!(await isUnderCaps(pv))) continue;
    eligible.push(pv);
  }

  if (eligible.length === 0) return [];

  const topPriority = eligible[0]!.priority;
  const topTier = eligible.filter((pv) => pv.priority === topPriority);

  const exclusiveWinner = topTier.find((pv) => pv.exclusive);
  if (exclusiveWinner) return [exclusiveWinner];

  const maxShared = topTier[0]?.maxShared ?? 3;
  return eligible.slice(0, maxShared);
}
