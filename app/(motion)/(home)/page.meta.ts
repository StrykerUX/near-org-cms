import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/",
  title: "NEAR",
  description:
    "NEAR is open infrastructure for the agent economy. Quantum-resistant and confidential by design, NEAR lets you trade anything anywhere and own your intelligence.",
  blurb: "The homepage",
  // El header no la enlaza porque el logotipo ya lleva a `/`; el footer sí, y
  // primera. `order: 0` es lo que la mantiene arriba de su columna.
  nav: { header: false, footer: true, label: "Home", order: 0 },
  sitemap: { changeFrequency: "weekly", priority: 1 },
} satisfies PageMeta;

export default meta;
