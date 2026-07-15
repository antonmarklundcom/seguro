import type { Lead } from "@seguro/db";

/**
 * Transparent, explainable scoring (0-100) — see docs/05-lead-engine.md.
 * Rules-based on purpose: at this volume an ML model would just be a
 * black box no one can debug when a partner disputes a lead.
 */
export function scoreLead(lead: Lead): number {
  let score = 40; // baseline for a validated lead

  if (lead.name) score += 10;
  if (lead.email) score += 10;
  if (lead.city) score += 10;

  const payload = (lead.payload as Record<string, unknown>) ?? {};
  const answeredFields = Object.values(payload).filter(
    (v) => v !== undefined && v !== null && v !== "",
  ).length;
  score += Math.min(answeredFields * 5, 20);

  if (lead.gclid) score += 10; // paid traffic with full attribution

  return Math.max(0, Math.min(100, score));
}
