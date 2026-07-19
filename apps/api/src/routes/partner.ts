import type { FastifyInstance } from "fastify";
import { prisma, type Prisma } from "@seguro/db";
import { leadOutcomeSchema } from "@seguro/shared";
import { requirePartnerAuth } from "../lib/partner-auth.js";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

interface LeadsQuery {
  status?: string;
  limit?: string;
  cursor?: string;
}

/**
 * Partner-facing API (docs/05 "Partner API (phase 2)") for partners with
 * their own CRM to pull leads and report outcomes programmatically,
 * instead of (or alongside) webhook/email/WhatsApp delivery.
 */
export async function partnerRoutes(app: FastifyInstance) {
  app.get<{ Querystring: LeadsQuery }>(
    "/v1/partner/leads",
    { preHandler: requirePartnerAuth },
    async (request, reply) => {
      const partner = request.partner!;
      const { status, cursor } = request.query;
      const limit = Math.min(Number(request.query.limit) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

      const where: Prisma.LeadDeliveryWhereInput = { partnerId: partner.id };
      if (status) {
        where.status = status as Prisma.LeadDeliveryWhereInput["status"];
      }

      const deliveries = await prisma.leadDelivery.findMany({
        where,
        include: { lead: true },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });

      const hasMore = deliveries.length > limit;
      const page = hasMore ? deliveries.slice(0, limit) : deliveries;

      return reply.send({
        leads: page.map((d) => ({
          deliveryId: d.id,
          leadId: d.leadId,
          verticalId: d.lead.verticalId,
          name: d.lead.name,
          phone: d.lead.phone,
          email: d.lead.email,
          city: d.lead.city,
          payload: d.lead.payload,
          deliveredAt: d.createdAt,
          deliveryStatus: d.status,
          outcome: d.outcome,
        })),
        nextCursor: hasMore ? (page[page.length - 1]?.id ?? null) : null,
      });
    },
  );

  app.post<{ Params: { deliveryId: string } }>(
    "/v1/partner/leads/:deliveryId/outcome",
    { preHandler: requirePartnerAuth },
    async (request, reply) => {
      const partner = request.partner!;
      const { deliveryId } = request.params;

      const parsed = leadOutcomeSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply
          .status(400)
          .send({ error: "invalid_payload", details: parsed.error.flatten() });
      }

      const delivery = await prisma.leadDelivery.findUnique({ where: { id: deliveryId } });
      if (!delivery || delivery.partnerId !== partner.id) {
        return reply.status(404).send({ error: "delivery_not_found" });
      }

      await prisma.leadDelivery.update({
        where: { id: deliveryId },
        data: { outcome: parsed.data.outcome, outcomeNote: parsed.data.note },
      });
      // Lead status mirrors the terminal outcome so admin/routing see the
      // same picture without joining through deliveries.
      await prisma.lead.update({
        where: { id: delivery.leadId },
        data: { status: parsed.data.outcome },
      });

      return reply.send({ status: "updated" });
    },
  );
}
