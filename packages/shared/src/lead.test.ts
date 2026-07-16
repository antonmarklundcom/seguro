import { describe, expect, it } from "vitest";
import { buildConsentRecord, leadPartialSchema, leadSubmitSchema } from "./lead";

const validSubmit = {
  verticalId: "seguro-de-auto",
  name: "Juan Perez",
  phone: "0981123456",
  city: "asuncion",
  payload: { vehicleYear: "2019" },
  consent: true as const,
};

describe("leadSubmitSchema", () => {
  it("accepts a valid submission", () => {
    const result = leadSubmitSchema.safeParse(validSubmit);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid phone number", () => {
    const result = leadSubmitSchema.safeParse({ ...validSubmit, phone: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects consent: false", () => {
    const result = leadSubmitSchema.safeParse({ ...validSubmit, consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects a missing verticalId", () => {
    const { verticalId: _verticalId, ...rest } = validSubmit;
    const result = leadSubmitSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a filled-in honeypot field (bot signal)", () => {
    const result = leadSubmitSchema.safeParse({ ...validSubmit, honeypot: "I am a bot" });
    expect(result.success).toBe(false);
  });

  it("accepts optional attribution fields", () => {
    const result = leadSubmitSchema.safeParse({
      ...validSubmit,
      gclid: "abc123",
      utmSource: "google",
      utmMedium: "cpc",
    });
    expect(result.success).toBe(true);
  });

  it("defaults payload to an empty object when omitted", () => {
    const { payload: _payload, ...rest } = validSubmit;
    const result = leadSubmitSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.payload).toEqual({});
    }
  });
});

describe("leadPartialSchema", () => {
  it("accepts a partial submission with just a vertical and step", () => {
    const result = leadPartialSchema.safeParse({ verticalId: "seguro-de-auto", step: 1 });
    expect(result.success).toBe(true);
  });

  it("rejects a non-integer step", () => {
    const result = leadPartialSchema.safeParse({ verticalId: "seguro-de-auto", step: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects step below 1", () => {
    const result = leadPartialSchema.safeParse({ verticalId: "seguro-de-auto", step: 0 });
    expect(result.success).toBe(false);
  });
});

describe("buildConsentRecord", () => {
  it("stamps the given timestamp and a non-empty consent text", () => {
    const at = new Date("2026-01-01T00:00:00Z");
    const record = buildConsentRecord(at);
    expect(record.consentAt).toBe(at);
    expect(record.consentText.length).toBeGreaterThan(0);
    expect(record.consentVersion).toBeTruthy();
  });
});
