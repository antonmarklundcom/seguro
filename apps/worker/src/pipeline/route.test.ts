import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Lead, PartnerVertical } from "@seguro/db";

const { findManyMock, countMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
  countMock: vi.fn(),
}));

vi.mock("@seguro/db", () => ({
  prisma: {
    partnerVertical: { findMany: findManyMock },
    leadDelivery: { count: countMock },
  },
}));

const { routeLead } = await import("./route.js");

function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_1",
    verticalId: "seguro-de-auto",
    city: "asuncion",
    ...overrides,
  } as unknown as Lead;
}

function makePartnerVertical(overrides: Partial<PartnerVertical> = {}): PartnerVertical {
  return {
    id: "pv_1",
    partnerId: "partner_1",
    verticalId: "seguro-de-auto",
    cplGs: 50_000,
    exclusive: false,
    maxShared: 3,
    dailyCap: null,
    monthlyCap: null,
    priority: 100,
    weight: 1,
    filters: {},
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as PartnerVertical;
}

describe("routeLead", () => {
  beforeEach(() => {
    findManyMock.mockReset();
    countMock.mockReset();
    countMock.mockResolvedValue(0);
  });

  it("returns an empty array when there are no candidates", async () => {
    findManyMock.mockResolvedValue([]);
    expect(await routeLead(makeLead())).toEqual([]);
  });

  it("routes exclusively to the top-priority exclusive partner", async () => {
    const exclusive = makePartnerVertical({ id: "pv_excl", priority: 1, exclusive: true });
    const shared = makePartnerVertical({ id: "pv_shared", priority: 1, exclusive: false });
    findManyMock.mockResolvedValue([exclusive, shared]);

    const result = await routeLead(makeLead());
    expect(result).toEqual([exclusive]);
  });

  it("shares the lead among up to maxShared partners when none are exclusive", async () => {
    const a = makePartnerVertical({ id: "pv_a", priority: 1, maxShared: 2 });
    const b = makePartnerVertical({ id: "pv_b", priority: 1, maxShared: 2 });
    const c = makePartnerVertical({ id: "pv_c", priority: 1, maxShared: 2 });
    findManyMock.mockResolvedValue([a, b, c]);

    const result = await routeLead(makeLead());
    expect(result).toEqual([a, b]);
  });

  it("excludes candidates whose city filter doesn't match the lead", async () => {
    const wrongCity = makePartnerVertical({
      id: "pv_wrong_city",
      priority: 1,
      filters: { city: ["encarnacion"] },
    });
    const anyCity = makePartnerVertical({ id: "pv_any_city", priority: 2, filters: {} });
    findManyMock.mockResolvedValue([wrongCity, anyCity]);

    const result = await routeLead(makeLead({ city: "asuncion" }));
    expect(result).toEqual([anyCity]);
  });

  it("falls back to the next priority tier when the top tier is fully filtered out", async () => {
    const filteredOut = makePartnerVertical({
      id: "pv_p1",
      priority: 1,
      filters: { city: ["encarnacion"] },
    });
    const fallback = makePartnerVertical({ id: "pv_p2", priority: 2, exclusive: true });
    findManyMock.mockResolvedValue([filteredOut, fallback]);

    const result = await routeLead(makeLead({ city: "asuncion" }));
    expect(result).toEqual([fallback]);
  });

  it("excludes a partner that has hit its daily cap", async () => {
    const capped = makePartnerVertical({ id: "pv_capped", priority: 1, dailyCap: 5, exclusive: true });
    const uncapped = makePartnerVertical({ id: "pv_uncapped", priority: 2, exclusive: true });
    findManyMock.mockResolvedValue([capped, uncapped]);
    countMock.mockResolvedValueOnce(5); // capped partner already at its daily limit

    const result = await routeLead(makeLead());
    expect(result).toEqual([uncapped]);
  });
});
