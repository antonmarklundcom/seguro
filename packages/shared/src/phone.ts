/**
 * Paraguay mobile numbers: +595 9XX XXX XXX (E.164).
 * Accepts local formats (09XX..., 595 9XX...) and normalizes to E.164.
 */
const PY_MOBILE_E164 = /^\+5959\d{8}$/;

export function normalizePyPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");

  let candidate: string;
  if (digits.startsWith("+595")) {
    candidate = digits;
  } else if (digits.startsWith("595")) {
    candidate = `+${digits}`;
  } else if (digits.startsWith("0")) {
    candidate = `+595${digits.slice(1)}`;
  } else if (digits.startsWith("9")) {
    candidate = `+595${digits}`;
  } else {
    candidate = `+${digits}`;
  }

  return PY_MOBILE_E164.test(candidate) ? candidate : null;
}

export function isValidPyPhone(value: string): boolean {
  return normalizePyPhone(value) !== null;
}
