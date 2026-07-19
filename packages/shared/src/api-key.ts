import { randomBytes, createHash } from "node:crypto";

const KEY_PREFIX = "sg_live_";

/**
 * Generates a new raw partner API key. Shown once at generation time
 * (docs/05 "Partner API") — only its hash is ever persisted, so this
 * function must be used in the same place the raw key is displayed to
 * the admin, never reconstructed later.
 */
export function generateApiKey(): string {
  return `${KEY_PREFIX}${randomBytes(24).toString("hex")}`;
}

/** SHA-256 hex digest, used both to store and to verify partner API keys.
 * apps/admin and apps/api must use this exact function so a key generated
 * in one hashes identically when checked in the other. */
export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}
