// Copy for both roadmap layouts (RoadmapVertical / RoadmapHorizontal), out of
// the components — same contract as quantumContent.ts / homeV2Content.ts:
// plain data, no JSX, no Date, no functions.
//
// Typos from the source comp already fixed here: "setp one" -> "step one",
// "Near One published" -> "publishes" (per the prototype's own PENDIENTE note
// — confirm with whoever wrote the copy before this ships for real).

export type RoadmapStep = {
  status: string;
  title: string;
  body: string;
};

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    status: "Live now",
    title: "Post-quantum signing",
    body: "EIPS-204 / ML-DSA at the account and protocol level. Rotate through the NEAR CLI.",
  },
  {
    status: "In progress",
    title: "Wallets and cross-chain",
    body: "Post-quantum support across software and hardware wallets. Quantum-safe Chain Signatures for cross-chain users on NEAR Intents.",
  },
  {
    status: "In research",
    title: "Ownership proofs",
    body: "Zero-knowledge seed-phrase ownership proofs as a quantum contingency.",
  },
  {
    status: "On the horizon",
    title: "Deep protocol layers",
    body: "Post-quantum consensus, validators, and epoch sync, the deeper protocol layers that complete the migration.",
  },
];

export const ROADMAP_HEADER = {
  eyebrow: "Roadmap",
  lede: "One future-proof migration, sequenced in public.",
  copy: [
    "Securing accounts is step one. Every layer of a live blockchain eventually needs post-quantum protection, and NEAR is sequencing that work so the ecosystem migrates once rather than repeatedly.",
    "Near One publishes ongoing technical details on this work as it ships.",
  ],
  ctaLabel: "follow the research",
};

// Per-row horizontal offset (--x) and dot position (--dot) from the source
// comp — layout geometry read by the animation, not design content (see
// components/sections/README.md's "Qué NO va ahí" table).
export const ROADMAP_ROW_GEOMETRY: { x: string; dot: string; ruleStartsRight?: boolean }[] = [
  { x: "8%", dot: "52%", ruleStartsRight: true },
  { x: "50%", dot: "26%" },
  { x: "13%", dot: "83%" },
  { x: "50%", dot: "37%" },
];
