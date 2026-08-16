import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/prototype/hover-lab",
  title: "Hover lab",
  description:
    "Interaction study: 39 hover treatments for the header CTA and 28 for the footer links, from a single CSS rule to a fragment shader.",
  // Es una demo interna, igual que /prototype/components: ni en el nav, ni en
  // el sitemap, ni indexable.
  nav: false,
  sitemap: false,
  robots: "noindex",
} satisfies PageMeta;

export default meta;
