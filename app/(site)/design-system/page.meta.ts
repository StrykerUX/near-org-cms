import type { PageMeta } from "@/lib/page-meta";

// Nota: page.tsx NO usa `toMetadata(meta)` para su propio <title> — su
// `export const metadata` original ya tenía el título exacto sin el sufijo
// de marca (" — NEAR AI"), y toMetadata lo agrega siempre. Aplicarlo aquí
// cambiaría el título real (regresión). Este archivo sigue existiendo para
// que el manifiesto sepa que esta ruta no va en nav/sitemap y es noindex —
// título/descripción quedan duplicados a propósito, no por descuido.
//
// Vivía en `/brand` hasta que el sitemap reclamó esa URL para la página de
// marca (logos y guidelines). Esto es documentación interna del DS, no material
// de marca, así que la ruta descriptiva le corresponde más.
const meta = {
  route: "/design-system",
  title: "Typography — Design System",
  description:
    "The typographic guidelines for the new design system: type scale, pairing rules, hierarchy, and accessibility non-negotiables.",
  blurb: "Type scale, pairing and hierarchy",
  nav: false,
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
