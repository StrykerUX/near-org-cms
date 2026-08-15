// The page's copy, out of the components that render it.
//
// Every section under `quantum/` used to hold its own list of cards, FAQs, rows or
// stages as a module-level constant. That is fine while a page is a port of a
// design canvas, but this one is going to be the real page, in a repo whose whole
// point is a CMS: content that lives inside a `"use client"` component cannot be
// edited without a deploy, and cannot be reviewed without reading TSX.
//
// The source of truth for the wording is `docs/quantum-security-brief.md` — see the
// note at the top of `README.md`. This module is where that brief lands in code.
//
// Everything here is plain and serializable: strings, numbers, arrays of objects.
// No Date, no functions, no JSX — the same contract as
// `components/sections/types.ts`, so the day these come from the database the shape
// does not have to change.
//
// What is NOT here, on purpose:
//
//  · Geometry and timing (ring radii, scroll thresholds, colour ramps). Those are
//    mechanism, not content — they live with the animation that reads them.
//  · The section HEADLINES. They carry JSX today (`<Accent>`, `<br />`), and
//    splitting a headline into data means choosing a schema for "text with one
//    accented run" before knowing how the CMS will model it. `STAGES` below shows
//    the shape that would work (`when` + `whenAccent`), and that decision belongs
//    with the content model, not with this refactor.


// ── Enlaces externos ─────────────────────────────────────────────────────────
// En un solo sitio porque se repiten: el post del anuncio lo enlazan
// `ThreatSequence` y `ClosingRing`, y el de la CLI, `LiveToday` y `ClosingRing`.
// Cuando una de esas URLs cambie —y las de docs.near.org se mueven— hay que poder
// arreglarla una vez, no buscarla por el árbol.
export const EXTERNAL_LINKS = {
  announcement: "https://near.org/blog/making-near-protocol-post-quantum-safe",
  accountModel: "https://docs.near.org/protocol/accounts-contracts/account-model",
  rotateKeysCli: "https://docs.near.org/tools/cli#ml-dsa-65-post-quantum-2",
  nearOneBlog: "https://blog.nearone.org",
} as const;

export type NewsStory = {
  outlet: string;
  quote: string;
  cta: string;
  href: string;
  tone: "light" | "dark";
};

export type RoadmapStage = {
  when: string;
  whenAccent: string;
  /** Clave del mapa DOTS de `Roadmap.tsx` — es presentación, no contenido. */
  dot: "live" | "progress" | "research" | "horizon";
  title: string;
  body: string;
};


// ── de BeyondAccounts.tsx ──
// "Wallets, cross-chain, and research" — the three surfaces beyond the account
// itself, as image cards.
export const BEYOND_ACCOUNTS_CARDS = [
  {
    src: "/prototype/quantum/iso-22.png",
    title: "Wallets",
    body: "NEAR is working with software and hardware wallet builders, such as Ledger, on post-quantum support.",
  },
  {
    src: "/prototype/quantum/iso-07.png",
    title: "Cross-chain",
    body: "The NEAR Intents team is developing quantum-safe Chain Signatures, so users from any chain can hold assets in a quantum-safe environment even if their origin chain is slow to upgrade.",
  },
  {
    src: "/prototype/quantum/iso-16.png",
    title: "Ownership research",
    body: "A zero-knowledge approach lets a user prove they know the seed phrase behind an asset, a contingency for verifying rightful ownership if classical keys break.",
  },
] as const;

// ── de Comparison.tsx ──
// "How is NEAR different from other quantum-safe chains?" — four claims, each
// paired against what NEAR actually does.
export const COMPARISON_ROWS = [
  {
    them: "A quantum-safe vault or account users opt into, separate from the default wallet",
    us: "Quantum-safe keys secure the account itself, by default",
  },
  {
    them: "Protection for historical chain state or cross-chain proofs, not account balances",
    us: "Post-quantum signing protects the balance in the account",
  },
  {
    them: "Native quantum-safe accounts mapped years out, full migration targeting end of decade",
    us: "Post-quantum signing live on mainnet today",
  },
  {
    them: "A chain-wide migration to move to a new signature scheme",
    us: "A single key rotation, because accounts are decoupled from cryptography",
  },
] as const;

// ── de InTheNews.tsx ──
export const NEWS_STORIES: NewsStory[] = [
  {
    outlet: "Bloomberg",
    quote:
      "As much as $470 billion of Bitcoin could be at risk as quantum computing advances.",
    cta: "Read the coverage",
    href: "https://www.bloomberg.com/news/articles/2026-07-07/will-quantum-computers-hack-bitcoin-and-other-cryptocurrencies",
    tone: "light",
  },
  {
    outlet: "Project Eleven",
    quote: "Research estimating over 7 million BTC in quantum-exposed addresses.",
    cta: "See the research",
    href: "https://bitcoin-risq-list.projecteleven.com/",
    tone: "light",
  },
  {
    outlet: "NEAR Protocol Brings Quantum-Safe Signing to Mainnet",
    quote:
      "With the 2.13 upgrade, NEAR becomes one of the first blockchains to add a NIST-approved post-quantum signature scheme in production.",
    cta: "Read the announcement",
    href: "https://www.prnewswire.com/news-releases/near-protocol-brings-quantum-safe-signing-to-mainnet-302829646.html",
    tone: "dark",
  },
];

// ── de LiveToday.tsx ──
// "Post-quantum signing, live on mainnet": what exists today, in three points.
export const LIVE_TODAY_POINTS = [
  {
    title: "Signature agility",
    body: "The protocol already supported EdDSA and ECDSA. A post-quantum scheme extends a model built for multiple signature types.",
  },
  {
    title: "Account-level by default",
    body: "Quantum-safe keys secure the account itself, not a separate vault users opt into.",
  },
  {
    title: "Live in production",
    body: "Post-quantum signing runs on mainnet, not on testnet or in a research demo.",
  },
] as const;

// ── de ProofMarquee.tsx ──
// The proof ribbon between the hero and the rest: six fact-plus-gloss pairs
// running between two dashed rules.
//
// Same mechanism as `components/sections/TestimonialMarquee.tsx` (two copies of
// the set and `xPercent: -50`, which closes the loop without a jump) with two
// differences: this one does NOT slow on hover — they are one-line facts, not
// quotes anyone needs to finish reading — and the set is loose text rather than
// cards.
export const MARQUEE_PROOFS = [
  { fact: "Post-quantum signing", gloss: "Live on mainnet" },
  { fact: "FIPS-204 (ML-DSA)", gloss: "NIST-approved scheme" },
  { fact: "One transaction", gloss: "To rotate to quantum-safe keys" },
  { fact: "Account-level", gloss: "Default path, not an opt-in tool" },
  { fact: "5+ years", gloss: "100% mainnet uptime" },
  { fact: "Since 2019", gloss: "Account model designed for quantum safety" },
] as const;

// ── de QuantumFaq.tsx ──
// Quantum security FAQ. One panel open at a time.
//
// The open/close is `grid-template-rows: 0fr → 1fr` in CSS, not GSAP animating
// `height` to `scrollHeight` and then setting `auto` on complete like the
// original does. Same reason the homepage rebuild made the swap: the measured
// version has to re-measure on every reflow (font swap, viewport change, a link
// wrapping) and gets it wrong in between, while the grid version has no
// measurement to get wrong. It also means no JS at all beyond the toggle, so
// this component needs no motion context.
export const FAQS = [
  {
    q: "Is NEAR quantum-safe?",
    a: "Yes. NEAR supports post-quantum signing with FIPS-204 (ML-DSA), a NIST-approved signature scheme, live on mainnet. Any NEAR account holder can rotate to quantum-safe keys in a single transaction.",
  },
  {
    q: "What is post-quantum cryptography?",
    a: "Post-quantum cryptography, also called quantum-safe or quantum-resistant cryptography, refers to signature and encryption schemes designed to stay secure against both classical and quantum computers. NEAR uses FIPS-204 (ML-DSA), a lattice-based scheme approved by NIST.",
  },
  {
    q: "How does NEAR protect against the quantum threat?",
    a: "NEAR accounts are decoupled from cryptography and controlled through rotatable access keys. Adding a post-quantum signature scheme is a key rotation rather than a chain-wide migration, so account holders upgrade to quantum-safe keys with one transaction while keeping the same account.",
  },
  {
    q: "What is the quantum threat to cryptocurrency?",
    a: "A powerful enough quantum computer running Shor’s algorithm could derive a private key from an exposed public key and take the assets it controls. Addresses whose public keys are already visible onchain are the most exposed. Galaxy Digital estimates as much as $470 billion of Bitcoin sits in such addresses.",
  },
  {
    q: "When will quantum computers threaten blockchains?",
    a: "Estimates vary, but industry and research timelines increasingly cluster around the end of the decade, and Google’s 2026 research lowered the resources thought necessary. Because exposed keys can be harvested now and attacked later, security teams recommend migrating before a working attack exists.",
  },
];

// ── de Roadmap.tsx ──
export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    when: "Live",
    whenAccent: "now",
    dot: "live",
    title: "Post-quantum signing",
    body: "FIPS-204 / ML-DSA at the account and protocol level. Rotate through the NEAR CLI.",
  },
  {
    when: "In",
    whenAccent: "progress",
    dot: "progress",
    title: "Wallets and cross-chain",
    body: "Post-quantum support across software and hardware wallets. Quantum-safe Chain Signatures for cross-chain users on NEAR Intents.",
  },
  {
    when: "In",
    whenAccent: "research",
    dot: "research",
    title: "Ownership proofs",
    body: "Zero-knowledge seed-phrase ownership proofs as a quantum contingency.",
  },
  {
    when: "On the",
    whenAccent: "horizon",
    dot: "horizon",
    title: "Deep protocol layers",
    body: "Post-quantum consensus, validators, and epoch sync, the deeper protocol layers that complete the migration.",
  },
];

// `NAV_LINKS` vivía acá: la lista plana de cuatro etiquetas del nav viejo. Se fue al
// integrar el menú real, cuyas entradas llevan un `icon` que es un componente de React —
// y este módulo es de datos puros, sin JSX, para que la forma no cambie el día que la
// copy venga de la base de datos. El menú se declara en `components/site/SiteHeader.tsx`, con la
// excepción anotada ahí.

// ── de StatementWipe.tsx ──
// The transition line between the proof ribbon and the dark section. It fills
// in letter by letter as you scroll, with a lime-to-teal front running half a
// step ahead of the fill and fading out behind it.
//
// Two text layers, not a measured clone: the original duplicates the <h2> with
// `cloneNode`, positions it absolutely and syncs `left/top/width` with a
// ResizeObserver. Here both layers live in the SAME grid cell, so they share
// width and line breaking by layout — which removes the clone, the observer,
// and the drift when the font swaps or the width changes.
//
// Both layers holding the same text is what makes `split.chars` line up index
// for index between them.
export const WIPE_STATEMENT =
  "Every blockchain will have to replace its cryptography. NEAR designed accounts so that day is a single transaction, not a migration.";

// ── de ThreatSequence.tsx ──
// ── Copy ─────────────────────────────────────────────────────────────────────
// Every line below is from docs/quantum-security-brief.md. Beat 1 is §3, beat 3
// is §4, and beat 2 is assembled from §3, §9 and the fourth and fifth answers of
// the §10 FAQ. Nothing here is sourced from outside the deck — see the README
// before adding anything that is.
export const SEQUENCE_HEAD = "Defending against quantum attack means";

// ── de ThreatSequence.tsx ──
export const SEQUENCE_TAIL = "rotating one key.";

// ── de ThreatSequence.tsx ──
export type SequenceBeat = {
  key: string;
  body: string;
};

export const SEQUENCE_BEATS: SequenceBeat[] = [
  {
    key: "mechanism",
    body: "Most blockchains derive account ownership from elliptic-curve cryptography. The moment an address signs, the key it was derived from is visible onchain.",
  },
  {
    key: "attack",
    body: "A quantum computer running Shor’s algorithm could derive a private key from an exposed public key and take the assets it controls. Those keys can be harvested now and attacked later, so the deadline is already behind us.",
  },
  {
    key: "answer",
    body: "NEAR accounts are decoupled from cryptography, so an account holder rotates to quantum-safe keys in a single transaction and keeps the same account.",
  },
];

// ── de wordField.ts ──
// The word field that fills the foot of the "Mathematics" section: rows of
// crypto vocabulary in monospace, with the letters that land on the silhouette
// of the NEAR mark lit green. The mark is never drawn — it is IMPLIED by which
// letters are on.
//
// How the cut-out is resolved: the mark's path is rasterised into an offscreen
// canvas and the alpha channel is sampled at the centre of every character. A
// geometric test against the path would be slower and less accurate (the path
// has interior contours), and `background-clip: text` is no use because we need
// to light INDIVIDUAL letters, not clip a continuous fill.
//
// ── Why any of this survives a resize ──────────────────────────────────────
// Three things had to be true, and originally none of them were:
//
//  1. The weave is CENTRED, not left-anchored. It is built wider than the host
//     and centred on it, so widening the window keeps the lit pattern under the
//     middle of the section instead of leaving it stranded to the left. When the
//     rows were left-anchored, "centre" moved away from the pattern and the mark
//     visibly drifted.
//  2. The mark's geometry is entirely PROPORTIONAL to the host. It used to carry
//     an absolute `- 180px` in its vertical placement, so its position drifted
//     against its own size at every viewport but the one it was tuned at.
//  3. Metrics are MEASURED, not assumed. The host's type is sized in vw so the
//     weave scales with the window; a hard-coded character width and line height
//     would desynchronise from it immediately.
//
// It also rebuilds on a real size change. Overscan absorbs small ones so the
// rebuild is rare, but nothing here can survive an arbitrary resize by
// arithmetic alone — the lit letters are baked by a pixel test.
//
// Imperative factory, created and destroyed by the section's `gsap.matchMedia()`
// — same contract as `quantumLattice.ts` and `glyphShine`.
export const FIELD_WORDS = [
  "quantum-safe", "ML-DSA-65", "FIPS-204", "rotate the key", "alice.near", "same account",
  "one transaction", "post-quantum", "lattice", "access key", "no migration",
  "live on mainnet", "the key is an attachment", "the account stays", "NEAR",
  "signed, not seen", "Ed25519", "secp256k1", "add_key", "delete_key", "full access key",
  "function call key", "nonce", "signature", "public key", "private key", "key pair",
  "seed phrase", "account model", "named account", "implicit account", "sub-account",
  "key rotation", "cryptographic agility", "hybrid signatures", "Shor’s algorithm",
  "Grover", "qubit", "superposition", "entanglement", "decoherence",
  "quantum Fourier transform", "discrete log", "elliptic curve", "period finding",
  "harvest now, decrypt later", "module lattice", "short vector", "learning with errors",
  "Dilithium", "hash-based", "SPHINCS+", "NIST", "forward secrecy", "no new address",
  "Nightshade", "sharding", "chain abstraction", "intents", "chain signatures",
  "mainnet 2.13", "validator", "finality", "receipts", "storage staking",
  "cross-contract call", "access key list", "state", "gas", "RPC", "self-custody",
];
