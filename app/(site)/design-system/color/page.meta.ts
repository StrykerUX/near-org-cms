import type { PageMeta } from "@/lib/page-meta";

// Mismo estatus que /design-system: documentación interna del DS, fuera del nav
// y del sitemap, noindex. Y por el mismo motivo que la de tipografía, page.tsx
// declara su propio `metadata` en vez de pasar por `toMetadata(meta)` — el
// título no lleva el sufijo de marca.
const meta = {
  route: "/design-system/color",
  title: "Color — Design System",
  description:
    "The colour system rendered in the browser: the primitives, the semantic tokens that reference them, the utilities they generate, and the measured contrast of every pair the site actually uses.",
  blurb: "Primitives, semantic tokens and measured contrast",
  nav: false,
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
