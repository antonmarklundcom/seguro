import { getVertical, getVerticalsForSite, seguroSite } from "@seguro/config";

/**
 * Single-tenant for now: apps/web always serves seguro.com.py. Multi-tenant
 * (docs/09) resolves this by request hostname instead of a constant when
 * prestamo.com.py joins the platform.
 */
export const currentSite = seguroSite;

export function getSiteVertical(verticalId: string) {
  return getVertical(currentSite.id, verticalId);
}

export function getSiteVerticals() {
  return getVerticalsForSite(currentSite.id);
}
