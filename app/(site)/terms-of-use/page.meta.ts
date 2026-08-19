import type { PageMeta } from "@/lib/page-meta";

// Página del sitemap de near.org, todavía sin contenido.
//
// `sitemap: false` + `robots: "noindex"` mientras esté vacía: una página en
// blanco en sitemap.xml es una promesa que el sitio no cumple. Al escribir el
// contenido real se quitan las dos, se cambia la view por una propia y se
// vuelve a correr `pnpm gen:routes`.
const meta = {
  route: "/terms-of-use",
  title: "Terms of Use",
  description: "The terms that govern use of NEAR's sites and services.",
  blurb: "Terms governing sites and services",
  nav: { header: true, footer: false, label: "Terms of Use", order: 91 },
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
