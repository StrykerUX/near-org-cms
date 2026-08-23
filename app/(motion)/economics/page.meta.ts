import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/economics",
  title: "Economics",
  description:
    "NEAR isn't just a blockchain, it's an economic system where real usage generates real revenue, and that value flows back to the network itself.",
  blurb: "el volante: uso, ingreso, oferta",
  nav: { header: true, footer: false, label: "Economics", order: 42 },
  sitemap: { changeFrequency: "monthly", priority: 0.7 },
  robots: "index",
} satisfies PageMeta;

export default meta;
