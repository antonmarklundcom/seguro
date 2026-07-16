import type { SiteConfig } from "../site";
import type { VerticalConfig } from "../vertical";
import { seguroDeAuto, seguroDeMoto, seguroMedico, seguroSite, seguroVerticals } from "./seguro";

export const sites: SiteConfig[] = [seguroSite];

export const verticalsBySite: Record<string, VerticalConfig[]> = {
  [seguroSite.id]: seguroVerticals,
};

export function getSiteByDomain(domain: string): SiteConfig | undefined {
  return sites.find((s) => s.domain === domain);
}

export function getVerticalsForSite(siteId: string): VerticalConfig[] {
  return verticalsBySite[siteId] ?? [];
}

export function getVertical(siteId: string, verticalId: string): VerticalConfig | undefined {
  return getVerticalsForSite(siteId).find((v) => v.id === verticalId);
}

export { seguroDeAuto, seguroDeMoto, seguroMedico, seguroSite, seguroVerticals };
