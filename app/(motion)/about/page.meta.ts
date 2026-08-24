import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/about",
  title: "About",
  description:
    "From 2017 to now: how NEAR got here and where it is going.",
  blurb: "la historia, de 2017 a hoy",
  nav: { header: true, footer: false, label: "About", order: 40 },
  sitemap: { changeFrequency: "monthly", priority: 0.7 },
  robots: "index",
} satisfies PageMeta;

export default meta;
