import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seguro Admin",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PY">
      <body>{children}</body>
    </html>
  );
}
