import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/prototype/hover-lab",
  title: "Hover lab",
  description:
    "Estudio de interacción: 27 tratamientos de hover para el CTA del header y 16 para los links del footer.",
  // Es una demo interna, igual que /prototype/components: ni en el nav, ni en
  // el sitemap, ni indexable.
  nav: false,
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
