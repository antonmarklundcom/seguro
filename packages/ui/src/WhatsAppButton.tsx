export interface WhatsAppButtonProps {
  phoneE164: string;
  message: string;
  label?: string;
  className?: string;
}

/**
 * Click-to-WhatsApp CTA. In Paraguay a WhatsApp conversation *is* a lead
 * (docs/04) — this must sit next to the form on every funnel/LP, not
 * replace it.
 */
export function WhatsAppButton({
  phoneE164,
  message,
  label = "Cotizar por WhatsApp",
  className,
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phoneE164.replace("+", "")}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
      }
    >
      {label}
    </a>
  );
}
