import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/ecosystem",
  title: "Ecosystem",
  description:
    "Hundreds of applications, wallets, and protocols build on NEAR. The builders own what they make.",
  blurb: "quién construye sobre NEAR",
  nav: { header: false, footer: true, label: "Ecosystem", order: 44 },
  sitemap: { changeFrequency: "monthly", priority: 0.6 },
  robots: "index",
} satisfies PageMeta;

export default meta;
