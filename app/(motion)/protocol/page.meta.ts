import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/blockchain",
  title: "Protocol",
  description:
    "The settlement layer for the agent economy — sub-second finality, zero downtime, quantum-adaptable from day one.",
  blurb: "Settlement layer, sub-second finality",
  nav: { header: true, footer: true, label: "Protocol", order: 20 },
  sitemap: { changeFrequency: "monthly", priority: 0.8 },
} satisfies PageMeta;

export default meta;
