import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/",
  title: "Draft",
  description: "Site in progress — design system not yet defined.",
  blurb: "Index of every page here",
  nav: { header: false, footer: true, label: "Home", order: 0 },
  sitemap: { changeFrequency: "weekly", priority: 1 },
} satisfies PageMeta;

export default meta;
