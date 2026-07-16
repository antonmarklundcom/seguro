"use client";

import { useEffect } from "react";
import { trackEvent } from "@seguro/tracking";

/** Fires the lp_view event once on mount (docs/04). No visible output. */
export function LpView({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent.lpView(slug);
  }, [slug]);
  return null;
}
