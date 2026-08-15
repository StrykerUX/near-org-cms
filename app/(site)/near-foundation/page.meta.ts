import type { PageMeta } from "@/lib/page-meta";

// Página del sitemap de near.org, todavía sin contenido.
//
// `sitemap: false` + `robots: "noindex"` mientras esté vacía: una página en
// blanco en sitemap.xml es una promesa que el sitio no cumple. Al escribir el
// contenido real se quitan las dos, se cambia la view por una propia y se
// vuelve a correr `pnpm gen:routes`.
const meta = {
  route: "/near-foundation",
  title: "NEAR Foundation",
  description: "Supporting a decentralized ecosystem.",
  nav: { header: true, footer: false, label: "NEAR Foundation", order: 41 },
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
