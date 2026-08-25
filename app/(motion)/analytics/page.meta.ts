import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/analytics",
  title: "Analytics",
  description:
    "A live view of NEAR: network activity, revenue, and the tools and products built on top of it. Everything worth watching, in one place.",
  blurb: "Live onchain metrics",
  nav: { header: true, footer: false, label: "Analytics", order: 33 },
  // Deja de ser un stub: entra al sitemap y sale de `noindex`. Las dos
  // banderas estaban puestas mientras la página estaba en blanco —una página
  // vacía en sitemap.xml es una promesa que el sitio no cumple— y ahora tiene
  // contenido.
  sitemap: { changeFrequency: "daily", priority: 0.6 },
} satisfies PageMeta;

export default meta;
