import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/community",
  title: "Community",
  description:
    "NEAR is built in the open by a global community of developers, creators, and contributors. Join the Legion, find your local crew, and help build the user-owned internet.",
  blurb: "la Legión, los eventos y los canales",
  nav: { header: true, footer: false, label: "Community", order: 43 },
  sitemap: { changeFrequency: "monthly", priority: 0.7 },
  robots: "index",
} satisfies PageMeta;

export default meta;
