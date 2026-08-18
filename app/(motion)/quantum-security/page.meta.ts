import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/quantum-security",
  title: "Quantum Security",
  description:
    "Quantum-adaptable from day one: post-quantum signatures and confidential compute, without asking anyone to migrate.",
  blurb: "Post-quantum signing, no migration",
  nav: { header: true, footer: true, label: "Quantum Security", order: 21 },
  sitemap: { changeFrequency: "monthly", priority: 0.8 },
} satisfies PageMeta;

export default meta;
