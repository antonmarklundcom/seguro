declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function push(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/**
 * Lead lifecycle events (docs/04-google-ads-landing-pages.md). These feed
 * GA4 -> Google Ads import so bidding optimizes on lead quality, not just
 * form-fills. `lead_valid`/`lead_accepted`/`policy_sold` additionally get
 * pushed server-side via Offline Conversion Import once the worker knows
 * partner outcomes (docs/05) -- these client events cover the funnel half.
 */
export const trackEvent = {
  lpView(slug: string): void {
    push("lp_view", { lp_slug: slug });
  },
  funnelStart(verticalId: string): void {
    push("funnel_start", { vertical_id: verticalId });
  },
  funnelStep(verticalId: string, step: number): void {
    push("funnel_step", { vertical_id: verticalId, step });
  },
  leadSubmit(verticalId: string, leadId: string): void {
    push("lead_submit", { vertical_id: verticalId, lead_id: leadId });
  },
  whatsappClick(context: string): void {
    push("whatsapp_click", { context });
  },
};
