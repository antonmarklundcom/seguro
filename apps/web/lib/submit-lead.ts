"use client";

import type { Attribution, LeadPartialInput, LeadSubmitInput } from "@seguro/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const UTM_KEYS = [
  "gclid",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
] as const;

const PARAM_MAP: Record<(typeof UTM_KEYS)[number], string> = {
  gclid: "gclid",
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmTerm: "utm_term",
};

/** Reads attribution params from the URL once and persists them for the
 * whole session, so a user who lands on an ad, then browses to another
 * page before converting, doesn't lose attribution (docs/04). */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const stored = JSON.parse(sessionStorage.getItem("seguro_attribution") ?? "{}");

  let changed = false;
  for (const key of UTM_KEYS) {
    const value = params.get(PARAM_MAP[key]);
    if (value) {
      stored[key] = value;
      changed = true;
    }
  }
  if (changed) {
    sessionStorage.setItem("seguro_attribution", JSON.stringify(stored));
  }
  if (!stored.landingPage) {
    stored.landingPage = window.location.pathname;
    sessionStorage.setItem("seguro_attribution", JSON.stringify(stored));
  }
}

export function getStoredAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("seguro_attribution") ?? "{}");
  } catch {
    return {};
  }
}

async function postJson(path: string, body: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  return res.json();
}

type LeadSubmitCore = Omit<LeadSubmitInput, keyof Attribution>;

export async function submitLead(input: LeadSubmitCore) {
  const attribution = getStoredAttribution();
  return postJson("/v1/leads", {
    ...input,
    ...attribution,
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
    device: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  });
}

export async function submitPartialLead(input: LeadPartialInput) {
  const attribution = getStoredAttribution();
  return postJson("/v1/leads/partial", { ...input, ...attribution });
}
