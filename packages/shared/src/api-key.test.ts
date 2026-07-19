import { describe, expect, it } from "vitest";
import { generateApiKey, hashApiKey } from "./api-key";

describe("generateApiKey", () => {
  it("produces a prefixed, sufficiently long key", () => {
    const key = generateApiKey();
    expect(key.startsWith("sg_live_")).toBe(true);
    expect(key.length).toBeGreaterThan(40);
  });

  it("never produces the same key twice", () => {
    const keys = new Set(Array.from({ length: 20 }, () => generateApiKey()));
    expect(keys.size).toBe(20);
  });
});

describe("hashApiKey", () => {
  it("is deterministic for the same input", () => {
    const key = generateApiKey();
    expect(hashApiKey(key)).toBe(hashApiKey(key));
  });

  it("produces different hashes for different keys", () => {
    expect(hashApiKey(generateApiKey())).not.toBe(hashApiKey(generateApiKey()));
  });

  it("produces a 64-char hex digest (sha256)", () => {
    const hash = hashApiKey("some-key");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});
