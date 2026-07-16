export type ConsentState = "granted" | "denied";

export interface ConsentChoice {
  analytics: ConsentState;
  adStorage: ConsentState;
}

const STORAGE_KEY = "seguro_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Updates Google Consent Mode v2 via the same `gtag('consent', ...)` API
 * that GtmScript.tsx bootstraps with a 'denied' default. Call this from a
 * consent banner once the user makes a choice (docs/04).
 */
export function updateConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer!.push(args));
  window.gtag("consent", "update", {
    analytics_storage: choice.analytics,
    ad_storage: choice.adStorage,
    ad_user_data: choice.adStorage,
    ad_personalization: choice.adStorage,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
}

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentChoice) : null;
  } catch {
    return null;
  }
}
