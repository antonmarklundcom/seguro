import { prisma } from "@seguro/db";
import type { Job } from "bullmq";
import { deliverLead } from "./pipeline/deliver.js";
import { routeLead } from "./pipeline/route.js";
import { scoreLead } from "./pipeline/score.js";

export interface ProcessLeadJobData {
  leadId: string;
}

/**
 * The lead pipeline's async half: score -> route -> deliver
 * (docs/05-lead-engine.md). Dedup already happened synchronously in the
 * API (apps/api/src/routes/leads.ts) before this job was ever enqueued.
 */
export async function processLead(job: Job<ProcessLeadJobData>): Promise<void> {
  const lead = await prisma.lead.findUniqueOrThrow({ where: { id: job.data.leadId } });

  if (lead.status === "DUPLICATE" || lead.status === "PARTIAL") {
    return; // nothing to route/deliver
  }

  const score = scoreLead(lead);
  await prisma.lead.update({ where: { id: lead.id }, data: { score } });

  const partnerVerticals = await routeLead(lead);

  if (partnerVerticals.length === 0) {
    await prisma.lead.update({ where: { id: lead.id }, data: { status: "ROUTED_NONE" } });
    job.log(`No partner available for lead ${lead.id} (vertical ${lead.verticalId})`);
    return;
  }

  await prisma.lead.update({ where: { id: lead.id }, data: { status: "ROUTED" } });
  await deliverLead(lead, partnerVerticals);
  await prisma.lead.update({ where: { id: lead.id }, data: { status: "DELIVERED" } });
}
