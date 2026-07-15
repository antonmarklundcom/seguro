import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteVertical, getSiteVerticals } from "@/lib/site";
import { QuoteFunnel } from "./QuoteFunnel";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return getSiteVerticals().map((v) => ({ vertical: v.id }));
}

export default async function CotizarPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: verticalId } = await params;
  const vertical = getSiteVertical(verticalId);
  if (!vertical) notFound();

  return (
    <main>
      <h1 className="sr-only">Cotizar {vertical.name}</h1>
      <QuoteFunnel vertical={vertical} />
    </main>
  );
}
