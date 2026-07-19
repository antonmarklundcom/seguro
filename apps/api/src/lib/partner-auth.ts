import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma, type Partner } from "@seguro/db";
import { hashApiKey } from "@seguro/shared";

declare module "fastify" {
  interface FastifyRequest {
    partner?: Partner;
  }
}

/** Fastify preHandler for partner-facing routes (docs/05 "Partner API").
 * Expects `Authorization: Bearer <raw key>`; looks up the partner by the
 * key's hash (raw keys are never stored, see packages/shared/src/api-key.ts). */
export async function requirePartnerAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  if (!token) {
    return reply.status(401).send({ error: "missing_api_key" });
  }

  const partner = await prisma.partner.findUnique({
    where: { apiKeyHash: hashApiKey(token) },
  });
  if (!partner || !partner.active) {
    return reply.status(401).send({ error: "invalid_api_key" });
  }

  request.partner = partner;
}
