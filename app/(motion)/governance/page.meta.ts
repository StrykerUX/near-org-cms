import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/governance",
  title: "Governance",
  description:
    "Who decides what on NEAR: the onchain layer that passes binding proposals, and the foundation that is working to hand its own functions over.",
  blurb: "quién decide, y qué capa es temporal",
  nav: { header: false, footer: true, label: "Governance", order: 45 },
  sitemap: { changeFrequency: "monthly", priority: 0.6 },
  robots: "index",
} satisfies PageMeta;

export default meta;
