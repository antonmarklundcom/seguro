import type { Metadata } from "next";
import { currentSite } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${currentSite.brandName} - Comparador de seguros en Paraguay`,
    template: `%s | ${currentSite.brandName}`,
  },
  description:
    "Compara seguros en Paraguay y cotiza gratis con las mejores aseguradoras. Respuesta rapida por WhatsApp.",
  metadataBase: new URL(`https://${currentSite.domain}`),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PY">
      <body>{children}</body>
    </html>
  );
}
