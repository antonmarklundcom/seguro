import { describe, expect, it } from "vitest";
import { isValidPyPhone, normalizePyPhone } from "./phone";

describe("normalizePyPhone", () => {
  it("normalizes a local 09XX number to E.164", () => {
    expect(normalizePyPhone("0981123456")).toBe("+595981123456");
  });

  it("normalizes a number already in E.164", () => {
    expect(normalizePyPhone("+595981123456")).toBe("+595981123456");
  });

  it("normalizes a number with country code but no +", () => {
    expect(normalizePyPhone("595981123456")).toBe("+595981123456");
  });

  it("normalizes a number with spaces and dashes", () => {
    expect(normalizePyPhone("0981 123-456")).toBe("+595981123456");
  });

  it("normalizes a bare 9XX number", () => {
    expect(normalizePyPhone("981123456")).toBe("+595981123456");
  });

  it("rejects a landline-shaped number", () => {
    expect(normalizePyPhone("021123456")).toBeNull();
  });

  it("rejects a too-short number", () => {
    expect(normalizePyPhone("098112")).toBeNull();
  });

  it("rejects a non-Paraguay country code", () => {
    expect(normalizePyPhone("+5491123456789")).toBeNull();
  });

  it("rejects garbage input", () => {
    expect(normalizePyPhone("hello")).toBeNull();
  });
});

describe("isValidPyPhone", () => {
  it("returns true for a valid number", () => {
    expect(isValidPyPhone("0981123456")).toBe(true);
  });

  it("returns false for an invalid number", () => {
    expect(isValidPyPhone("123")).toBe(false);
  });
});
