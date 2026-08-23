// Copy shared by the three hero variants — mirrors the [Hero] block of
// docs/quantum-security-brief.md (same block quantum-security-copy/QuantumHero.tsx
// carries). The headline stays in each variant's own JSX — it carries
// <Accent> and a <br/>, same reasoning as quantumContent.ts — only the body
// and CTA are pulled out here so the three files can't drift out of sync with
// each other.
export const HERO_BODY =
  "Quantum computing threatens the cryptography that secures every blockchain. NEAR accounts are decoupled from cryptography by design, so upgrading to post-quantum security takes a single key rotation. Post-quantum signing is live on NEAR mainnet today.";

export const HERO_CTA = {
  label: "See NEAR’s quantum roadmap",
  href: "#roadmap",
} as const;
