import type { FastifyInstance } from "fastify";
import { prisma, Prisma } from "@seguro/db";
import {
  buildConsentRecord,
  leadPartialSchema,
  leadSubmitSchema,
  normalizePyPhone,
} from "@seguro/shared";
import { leadProcessingQueue } from "../lib/queue.js";

const DUPLICATE_WINDOW_DAYS = 30;
const PARTIAL_MERGE_WINDOW_HOURS = 24;

export async function leadsRoutes(app: FastifyInstance) {
  app.post("/v1/leads", async (request, reply) => {
    const parsed = leadSubmitSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "invalid_payload", details: parsed.error.flatten() });
    }
    const input = parsed.data;

    // Spam guard: form filled in under 3 seconds is almost certainly a bot.
    if (input.formStartedAt && Date.now() - input.formStartedAt < 3_000) {
      return reply.status(202).send({ id: null, status: "rejected_spam" });
    }

    const phone = normalizePyPhone(input.phone);
    if (!phone) {
      return reply.status(400).send({ error: "invalid_phone" });
    }

    const duplicateSince = new Date(Date.now() - DUPLICATE_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const existingRecent = await prisma.lead.findFirst({
      where: {
        phone,
        verticalId: input.verticalId,
        status: { notIn: ["PARTIAL", "INVALID"] },
        createdAt: { gte: duplicateSince },
      },
      orderBy: { createdAt: "desc" },
    });

    const consent = buildConsentRecord();
    const attribution = {
      gclid: input.gclid,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmTerm: input.utmTerm,
      landingPage: input.landingPage,
      abVariant: input.abVariant,
      referrer: input.referrer,
      device: input.device,
    };

    if (existingRecent) {
      await prisma.lead.update({
        where: { id: existingRecent.id },
        data: { status: "DUPLICATE" },
      });
      // Still acknowledge success to the user — they don't need to know.
      return reply.status(201).send({ id: existingRecent.id, status: "duplicate" });
    }

    // Merge into a recent partial lead for this phone+vertical if one exists,
    // so funnel-abandonment tracking and the final submit are one record.
    const partialSince = new Date(Date.now() - PARTIAL_MERGE_WINDOW_HOURS * 60 * 60 * 1000);
    const partial = await prisma.lead.findFirst({
      where: {
        phone,
        verticalId: input.verticalId,
        status: "PARTIAL",
        createdAt: { gte: partialSince },
      },
      orderBy: { createdAt: "desc" },
    });

    const lead = partial
      ? await prisma.lead.update({
          where: { id: partial.id },
          data: {
            status: "NEW",
            name: input.name,
            email: input.email,
            city: input.city,
            payload: input.payload as Prisma.InputJsonValue,
            ...consent,
            ...attribution,
          },
        })
      : await prisma.lead.create({
          data: {
            verticalId: input.verticalId,
            status: "NEW",
            phone,
            name: input.name,
            email: input.email,
            city: input.city,
            payload: input.payload as Prisma.InputJsonValue,
            ...consent,
            ...attribution,
          },
        });

    await leadProcessingQueue.add("process-lead", { leadId: lead.id });

    return reply.status(201).send({ id: lead.id, status: "received" });
  });

  app.post("/v1/leads/partial", async (request, reply) => {
    const parsed = leadPartialSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "invalid_payload", details: parsed.error.flatten() });
    }
    const input = parsed.data;

    if (!input.phone) {
      // Nothing useful to persist yet.
      return reply.status(202).send({ status: "skipped" });
    }
    const phone = normalizePyPhone(input.phone);
    if (!phone) {
      return reply.status(202).send({ status: "skipped" });
    }

    const partialSince = new Date(Date.now() - PARTIAL_MERGE_WINDOW_HOURS * 60 * 60 * 1000);
    const existing = await prisma.lead.findFirst({
      where: {
        phone,
        verticalId: input.verticalId,
        status: "PARTIAL",
        createdAt: { gte: partialSince },
      },
      orderBy: { createdAt: "desc" },
    });

    const attribution = {
      gclid: input.gclid,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmTerm: input.utmTerm,
      landingPage: input.landingPage,
      abVariant: input.abVariant,
      referrer: input.referrer,
      device: input.device,
    };

    if (existing) {
      await prisma.lead.update({
        where: { id: existing.id },
        data: { payload: input.payload as Prisma.InputJsonValue, ...attribution },
      });
      return reply.status(200).send({ id: existing.id, status: "updated" });
    }

    const created = await prisma.lead.create({
      data: {
        verticalId: input.verticalId,
        status: "PARTIAL",
        phone,
        payload: input.payload as Prisma.InputJsonValue,
        ...attribution,
      },
    });
    return reply.status(201).send({ id: created.id, status: "created" });
  });
}
