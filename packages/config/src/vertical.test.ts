import { describe, expect, it } from "vitest";
import { validateVerticals, verticalConfigSchema, type VerticalConfig } from "./vertical";

const baseVertical: VerticalConfig = {
  id: "seguro-de-auto",
  siteId: "seguro.com.py",
  name: "Seguro de Auto",
  pillarPath: "/seguro-de-auto",
  seo: { title: "Title", description: "Description" },
  active: true,
  fields: [
    { key: "name", step: 1, label: "Nombre", type: "text", required: true },
  ],
};

describe("verticalConfigSchema", () => {
  it("accepts a well-formed vertical", () => {
    expect(verticalConfigSchema.safeParse(baseVertical).success).toBe(true);
  });

  it("rejects a pillarPath that doesn't start with /", () => {
    const result = verticalConfigSchema.safeParse({ ...baseVertical, pillarPath: "seguro-de-auto" });
    expect(result.success).toBe(false);
  });

  it("rejects a vertical with no fields", () => {
    const result = verticalConfigSchema.safeParse({ ...baseVertical, fields: [] });
    expect(result.success).toBe(false);
  });
});

describe("validateVerticals", () => {
  it("passes through a list of unique verticals", () => {
    const second: VerticalConfig = { ...baseVertical, id: "seguro-de-moto", pillarPath: "/seguro-de-moto" };
    expect(() => validateVerticals([baseVertical, second])).not.toThrow();
  });

  it("throws on duplicate vertical ids", () => {
    expect(() => validateVerticals([baseVertical, baseVertical])).toThrow(/Duplicate vertical id/);
  });

  it("throws when a vertical fails schema validation", () => {
    const broken = { ...baseVertical, fields: [] } as VerticalConfig;
    expect(() => validateVerticals([broken])).toThrow();
  });
});
