"use client";

import { WhatsAppButton, type WhatsAppButtonProps } from "@seguro/ui";
import { trackEvent } from "@seguro/tracking";

export function TrackedWhatsAppButton(props: WhatsAppButtonProps) {
  return (
    <span onClick={() => trackEvent.whatsappClick("lp")}>
      <WhatsAppButton {...props} />
    </span>
  );
}
