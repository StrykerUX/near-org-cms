import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { kepler, keplerDisplay, montreal } from "@/lib/fonts";
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
      className={`${montreal.variable} ${kepler.variable} ${keplerDisplay.variable} ${GeistSans.variable} h-full antialiased`}
    >
      {/* Sin <head> propio: sus dos únicos hijos eran el preconnect y el
          stylesheet de Typekit, que servía Kepler. Ahora la serif es
          self-hosteada vía next/font/local (ver lib/fonts.ts), así que no hay
          ningún tercero en el camino crítico de render. */}
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
