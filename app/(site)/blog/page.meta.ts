import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/blog",
  title: "Blog",
  description: "Insights on AI, private compute, and the future of the open web.",
  blurb: "Posts on AI and protocol",
  nav: { header: true, footer: true, label: "Blog", order: 10 },
  sitemap: { changeFrequency: "daily", priority: 0.9 },
} satisfies PageMeta;

export default meta;
