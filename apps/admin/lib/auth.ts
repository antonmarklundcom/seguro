const COOKIE_NAME = "seguro_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signature);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Minimal shared-password auth for the internal admin (docs/05). Web
 * Crypto (not node:crypto) so it works in both the Edge middleware and
 * Node runtimes without extra config. Good enough while the team is 1-2
 * people; swap for real SSO (NextAuth/Clerk) once there are multiple admin
 * users who need distinct audit trails.
 */
export async function createSessionCookieValue(): Promise<string> {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${await hmacSha256(getSecret(), issuedAt)}`;
}

export async function isValidSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const [issuedAt, signature] = cookieValue.split(".");
  if (!issuedAt || !signature) return false;

  const expected = await hmacSha256(getSecret(), issuedAt);
  if (!timingSafeEqualStr(expected, signature)) return false;

  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age < SESSION_TTL_MS;
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  return timingSafeEqualStr(expected, candidate);
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
