import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/near-foundation",
  title: "NEAR Foundation",
  description:
    "NEAR Foundation is a Swiss nonprofit supporting a decentralized ecosystem building NEAR as the open infrastructure for the agent economy.",
  blurb: "una fundación que planea achicarse",
  nav: { header: true, footer: false, label: "NEAR Foundation", order: 41 },
  sitemap: { changeFrequency: "monthly", priority: 0.7 },
  robots: "index",
} satisfies PageMeta;

export default meta;
