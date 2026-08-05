import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/",
  title: "Draft",
  description: "Site in progress — design system not yet defined.",
  nav: { header: false, footer: true, label: "Home", order: 0 },
  sitemap: { changeFrequency: "weekly", priority: 1 },
} satisfies PageMeta;

export default meta;
