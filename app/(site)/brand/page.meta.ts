import type { PageMeta } from "@/lib/page-meta";

// Nota: page.tsx NO usa `toMetadata(meta)` para su propio <title> — su
// `export const metadata` original ya tenía el título exacto sin el sufijo
// de marca (" — NEAR AI"), y toMetadata lo agrega siempre. Aplicarlo aquí
// cambiaría el título real (regresión). Este archivo sigue existiendo para
// que el manifiesto sepa que /brand no va en nav/sitemap y es noindex —
// título/descripción quedan duplicados a propósito, no por descuido.
const meta = {
  route: "/brand",
  title: "Typography — Design System",
  description:
    "The typographic guidelines for the new design system: type scale, pairing rules, hierarchy, and accessibility non-negotiables.",
  nav: false,
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
