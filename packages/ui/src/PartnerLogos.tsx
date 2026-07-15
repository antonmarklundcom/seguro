export interface PartnerLogo {
  name: string;
  logoUrl: string;
}

export interface PartnerLogosProps {
  logos: PartnerLogo[];
  title?: string;
}

export function PartnerLogos({ logos, title = "Trabajamos con" }: PartnerLogosProps) {
  if (logos.length === 0) return null;
  return (
    <section className="px-4 py-10 text-center">
      <p className="mb-6 text-sm font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 opacity-80">
        {logos.map((logo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={logo.name} src={logo.logoUrl} alt={logo.name} className="h-8 w-auto" />
        ))}
      </div>
    </section>
  );
}
