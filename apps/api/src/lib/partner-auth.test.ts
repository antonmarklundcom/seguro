import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyReply, FastifyRequest } from "fastify";
import { hashApiKey } from "@seguro/shared";

const { findUniqueMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
}));

vi.mock("@seguro/db", () => ({
  prisma: {
    partner: { findUnique: findUniqueMock },
  },
}));

const { requirePartnerAuth } = await import("./partner-auth.js");

function makeReply() {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return reply as unknown as FastifyReply;
}

function makeRequest(authorization?: string) {
  return { headers: { authorization } } as unknown as FastifyRequest;
}

describe("requirePartnerAuth", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
  });

  it("rejects a request with no Authorization header", async () => {
    const reply = makeReply();
    await requirePartnerAuth(makeRequest(undefined), reply);
    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ error: "missing_api_key" });
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("rejects a non-Bearer Authorization header", async () => {
    const reply = makeReply();
    await requirePartnerAuth(makeRequest("Basic abc123"), reply);
    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ error: "missing_api_key" });
  });

  it("rejects a key that doesn't match any partner", async () => {
    findUniqueMock.mockResolvedValue(null);
    const reply = makeReply();
    await requirePartnerAuth(makeRequest("Bearer sg_live_nope"), reply);
    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ error: "invalid_api_key" });
  });

  it("rejects a valid key belonging to an inactive partner", async () => {
    findUniqueMock.mockResolvedValue({ id: "partner_1", active: false });
    const reply = makeReply();
    await requirePartnerAuth(makeRequest("Bearer sg_live_valid"), reply);
    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({ error: "invalid_api_key" });
  });

  it("attaches the partner to the request on a valid, active key", async () => {
    const partner = { id: "partner_1", active: true };
    findUniqueMock.mockResolvedValue(partner);
    const request = makeRequest("Bearer sg_live_valid");
    const reply = makeReply();

    await requirePartnerAuth(request, reply);

    expect(request.partner).toBe(partner);
    expect(reply.status).not.toHaveBeenCalled();
  });

  it("looks up the partner by the hash of the raw key, never the raw key itself", async () => {
    findUniqueMock.mockResolvedValue(null);
    const rawKey = "sg_live_abcdef";
    await requirePartnerAuth(makeRequest(`Bearer ${rawKey}`), makeReply());

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { apiKeyHash: hashApiKey(rawKey) },
    });
  });
});
