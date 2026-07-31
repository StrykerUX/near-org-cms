import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { montreal } from "@/lib/fonts";
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
      className={`${montreal.variable} ${GeistSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/gtm1rhn.css" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
