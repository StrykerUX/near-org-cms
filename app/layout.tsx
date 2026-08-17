import type { Metadata } from "next";
import { geistSans, kepler, keplerDisplay, montreal, montrealMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Draft",
  description: "Site in progress — design system not yet defined.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montreal.variable} ${montrealMono.variable} ${kepler.variable} ${keplerDisplay.variable} ${geistSans.variable} h-full antialiased`}
    >
      {/* Sin <head> propio: sus dos únicos hijos eran el preconnect y el
          stylesheet de Typekit, que servía Kepler. Ahora la serif es
          self-hosteada vía next/font/local (ver lib/fonts.ts), así que no hay
          ningún tercero en el camino crítico de render. */}
      {/* El <Toaster> de sonner vivía acá y se hidrataba en TODA página del
          sitio para servir un único `toast()` del formulario de contacto, que
          solo existe en app/(site). Ahora está en el layout de esa sección;
          /admin ya montaba el suyo. */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
