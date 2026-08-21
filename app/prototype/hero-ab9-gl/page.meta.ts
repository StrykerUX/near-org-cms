import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/prototype/hero-ab9-gl",
  title: "Hero AB9 · GL",
  description:
    "Tres reconstrucciones en WebGL del fondo de follaje en motion blur del hero de ab9, con panel de calibración y superposición del frame de referencia. A · stretch (1 muestra/px), B · sweep (blur direccional, 13 taps), C · zoom (blur radial desde el centro de fuga).",
  blurb: "tres shaders para el fondo del hero de ab9",
  nav: false,
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
