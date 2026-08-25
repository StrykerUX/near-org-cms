import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/dir",
  title: "Directory",
  description:
    "Índice de todas las páginas del repo, derivado del manifiesto de rutas: las del sitio, los prototipos, los laboratorios y la referencia del design system.",
  blurb: "Index of every page here",
  // Es una herramienta interna, no una página del sitio: fuera del header, del
  // footer y del sitemap, y con `noindex`. Vivió en `/` mientras el sitio no
  // tenía homepage; ahora que la tiene, esto es lo que es.
  nav: false,
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
