import { describe, expect, it } from "vitest";
import type { Lead } from "@seguro/db";
import { scoreLead } from "./score.js";

function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_1",
    verticalId: "seguro-de-auto",
    status: "NEW",
    name: null,
    phone: "+595981123456",
    email: null,
    city: null,
    payload: {},
    gclid: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    landingPage: null,
    abVariant: null,
    referrer: null,
    device: null,
    ip: null,
    consentAt: null,
    consentText: null,
    consentVersion: null,
    score: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as Lead;
}

describe("scoreLead", () => {
  it("gives the baseline score with no bonuses", () => {
    expect(scoreLead(makeLead())).toBe(40);
  });

  it("adds points for name, email and city", () => {
    const lead = makeLead({ name: "Juan", email: "juan@example.com", city: "asuncion" });
    expect(scoreLead(lead)).toBe(70);
  });

  it("adds up to 5 points per answered payload field, capped at 20", () => {
    const twoFields = makeLead({ payload: { a: "1", b: "2" } });
    expect(scoreLead(twoFields)).toBe(50);

    const fiveFields = makeLead({ payload: { a: "1", b: "2", c: "3", d: "4", e: "5" } });
    expect(scoreLead(fiveFields)).toBe(60); // capped at +20, not +25
  });

  it("ignores empty/null/undefined payload values", () => {
    const lead = makeLead({ payload: { a: "", b: null, c: undefined, d: "real" } });
    expect(scoreLead(lead)).toBe(45); // only "d" counts
  });

  it("adds points for gclid presence", () => {
    expect(scoreLead(makeLead({ gclid: "abc123" }))).toBe(50);
  });

  it("never exceeds 100", () => {
    const lead = makeLead({
      name: "Juan",
      email: "juan@example.com",
      city: "asuncion",
      gclid: "abc123",
      payload: { a: "1", b: "2", c: "3", d: "4", e: "5", f: "6" },
    });
    expect(scoreLead(lead)).toBeLessThanOrEqual(100);
  });
});
