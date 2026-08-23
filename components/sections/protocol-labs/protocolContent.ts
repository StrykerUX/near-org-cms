// Toda la copy de la página Protocol, en un solo módulo, consumida por las TRES
// alternativas (`a/`, `b/`, `c/`).
//
// ── Por qué se comparte en vez de copiarse ──────────────────────────────────
//
// El README de `components/sections/` dice que un laboratorio se COPIA y no se
// importa, y ese criterio sigue en pie para los COMPONENTES: si `b/` cambia un
// layout, `a/` no se puede enterar.
//
// La copy es el caso opuesto y por un motivo que es el objeto mismo de esta
// comparación: las tres alternativas presentan EL MISMO contenido con tres
// jerarquías distintas. Si cada carpeta llevara su transcripción, la primera
// corrección de un dato dejaría tres páginas diciendo cosas distintas y la
// comparación pasaría a medir el error de transcripción en vez del diseño.
//
// Módulo puro —strings y arrays de objetos, sin JSX, sin Date, sin funciones—
// igual que `quantum/quantumContent.ts`: el día que esto venga de la base de
// datos, la forma no cambia.
//
// Fuente: doc de sitemap, pestaña Protocol (near.org/protocol).

export const HERO = {
  eyebrow: "NEAR Protocol",
  // El titular se parte en dos porque el acento serif cae sobre la segunda
  // mitad en las tres alternativas. Qué etiqueta lo envuelve lo decide cada
  // una; dónde corta la frase, no.
  lead: "The settlement layer",
  accent: "for the agent economy",
  body: "1 million TPS scalability, confidential by default, quantum ready. Proven on mainnet for five years.",
  cta: { label: "Start building", href: "https://docs.near.org" },
} as const;

// La franja de prueba. Seis cifras con la MISMA forma —valor, unidad, nota— y
// no seis formas distintas: en el doc, tres traen una línea de contexto y tres
// no, y transcribir esa irregularidad obliga a cada alternativa a resolver un
// caso especial que no significa nada. `note` opcional es el único hueco.
export type ProofStat = {
  id: string;
  value: string;
  label: string;
  /** Contexto de la cifra, cuando el doc lo trae. */
  note?: string;
};

// Anotado como `readonly ProofStat[]` y no dejado a inferencia con `as const`:
// con la inferencia, TypeScript arma la unión de los seis literales y `note`
// deja de existir en las tres que no la traen, así que `stat.note` no compila
// en ningún consumidor. Un tipo declarado es también dónde está escrito que
// `note` es opcional.
export const PROOF: readonly ProofStat[] = [
  { id: "uptime", value: "100%", label: "Uptime", note: "5+ years on mainnet" },
  { id: "tps", value: "1M+", label: "TPS", note: "Publicly verifiable" },
  { id: "block", value: "600ms", label: "Block time" },
  { id: "finality", value: "1.2s", label: "Finality" },
  { id: "shards", value: "10", label: "Shards", note: "Plus a private shard" },
  { id: "fee", value: "<$0.002", label: "Avg transaction fee" },
];

export const AI_SCALE = {
  title: { lead: "Built for AI scale", accent: "from day one" },
  body: "A machine-speed economy needs three properties at once. NEAR ships all three today.",
  points: [
    {
      title: "Scalable sharding",
      body: "More shards, more throughput, no change for the developer.",
    },
    {
      title: "Confidential execution",
      body: "A private shard runs confidential transactions at the protocol layer.",
    },
    {
      title: "Quantum-safe accounts",
      body: "Post-quantum signing, live on mainnet, rotated in a single transaction.",
    },
  ],
} as const;

// Las seis capacidades del protocolo — sections 4 a 9 del doc, EN EL ORDEN DEL
// DOC. La página viva (`sections/protocol/ProtocolSpine`) las reagrupa; acá se
// dejan como vienen porque reordenar es una de las variables que las tres
// alternativas ponen a prueba, y una lista ya reordenada esconde esa decisión.
//
// `key` es la palabra con la que la alternativa C titula la entrada y con la
// que A y B rotulan el diagrama: una sola palabra por capacidad, decidida acá
// para que las tres coincidan.
export type Capability = {
  id: string;
  /** La palabra con la que C titula la entrada y con la que A y B rotulan la figura. */
  key: string;
  index: string;
  name: string;
  subhead: string;
  body: string;
  /** Solo cuatro de las seis traen destino externo en el doc. */
  link?: { label: string; href: string };
  /** El `id` de la cifra de `PROOF` que esta capacidad sostiene. */
  metric: string;
};

export const CAPABILITIES: readonly Capability[] = [
  {
    id: "nightshade",
    key: "Nightshade",
    index: "01",
    name: "Nightshade 3.0",
    subhead: "Stateless validation is here",
    body: "The newest protocol upgrade decouples consensus from execution, adds multi-contract atomic interactions, and introduces a private shard for confidential transactions.",
    metric: "tps",
  },
  {
    id: "resharding",
    key: "Resharding",
    index: "02",
    name: "Dynamic resharding",
    subhead: "Capacity is a property of the network, not a governance decision.",
    body: "A shard now splits automatically when it hits its state-size threshold, validated by state witnesses, with no vote and no human intervention.",
    link: {
      label: "Learn more",
      href: "https://near.org/blog/introducing-dynamic-resharding",
    },
    metric: "shards",
  },
  {
    id: "speed",
    key: "Speed",
    index: "03",
    name: "Speed. Scale. Access.",
    subhead: "Deploy once, run network-wide",
    body: "600ms blocks and 1.2s finality. Global contracts deploy once and run network-wide. In-memory state removes database latency.",
    metric: "finality",
  },
  {
    id: "private-shard",
    key: "Private",
    index: "04",
    name: "Private Shard",
    subhead: "Confidential execution, directly at the protocol layer",
    body: "Transactions are shielded from public view, with selective disclosure for compliance-readiness. The foundation for Confidential Intents.",
    link: {
      label: "Learn more",
      href: "https://near.org/blog/announcing-general-availability-confidential-intents",
    },
    metric: "block",
  },
  {
    id: "quantum",
    key: "Quantum",
    index: "05",
    name: "Quantum security",
    subhead: "Post-quantum signing is live on mainnet",
    body: "NEAR accounts are decoupled from cryptography, so upgrading to quantum-safe keys takes a single key rotation. NEAR supports FIPS-204 (ML-DSA), a NIST-approved post-quantum signing scheme.",
    link: {
      label: "Preparing NEAR for the Quantum Computing Era",
      href: "https://near.org/blog/making-near-protocol-post-quantum-safe",
    },
    metric: "uptime",
  },
  {
    id: "chain-signatures",
    key: "Signatures",
    index: "06",
    name: "Chain Signatures",
    subhead: "Native transactions across the multi-chain ecosystem",
    body: "Through threshold MPC, a single NEAR account signs and triggers native transactions across 30+ chains, including Bitcoin, Ethereum, Solana, and more, with no bridge contracts. Support spans both ECDSA and EdDSA signature schemes.",
    link: { label: "Explore chain abstraction", href: "https://near.org/chain-abstraction" },
    metric: "fee",
  },
];

export const DEVELOPERS = {
  title: { lead: "A blockchain", accent: "for developers" },
  subhead: "Build in familiar languages, ship without friction",
  points: [
    { title: "Rust or JS", body: "A WebAssembly runtime for smart contracts." },
    { title: "Gasless UX", body: "Meta-transactions cover gas on behalf of your users." },
    { title: "Earn as they run", body: "30% of burned gas returns to the contract's developer." },
  ],
  cta: { label: "Start building", href: "https://docs.near.org" },
} as const;

export const AI_LAYER = {
  title: { lead: "A new operating", accent: "layer for AI" },
  subhead: "A blockchain agents can actually use",
  body: "Confidential compute in Trusted Execution Environments, low-latency finality, and resharding that scales with agent demand.",
  cta: { label: "Explore NEAR AI", href: "https://www.near.ai/" },
} as const;

export const NEAR_ONE = {
  title: "NEAR One",
  subhead: "The engineering team building NEAR Protocol",
  body: "NEAR One develops the core technology, drives research on architecture and scaling, and delivers the sharding roadmap that takes NEAR to billions of users.",
  cta: { label: "Learn more", href: "https://nearone.org" },
} as const;

export const PARTICIPATE = {
  title: { lead: "Secure NEAR.", accent: "Evolve NEAR." },
  ways: [
    {
      title: "Validators",
      body: "Run a node or chunk validator and help safeguard the protocol.",
    },
    {
      title: "NEAR Enhancement Proposals",
      body: "Weigh in on the protocol's specifications and standards.",
    },
  ],
} as const;

export const GALLERY = {
  title: { lead: "Go deeper", accent: "on NEAR" },
  subhead: "Protocol deep dives, coverage, and more",
  items: [
    {
      title: "Introducing Dynamic Resharding",
      note: "How the network adds shards automatically.",
      href: "https://near.org/blog/introducing-dynamic-resharding",
    },
    {
      title: "Preparing NEAR for the Quantum Computing Era",
      note: "The post-quantum roadmap.",
      href: "https://near.org/blog/making-near-protocol-post-quantum-safe",
    },
    {
      title: "Confidential Intents: Now Open to All",
      note: "Confidential execution, generally available.",
      href: "https://near.org/blog/announcing-general-availability-confidential-intents",
    },
    {
      title: "The Agent Economy: Who Owns the Rails AI Runs On",
      note: "The thesis behind the stack.",
      href: "https://www.near.org/blog/agent-economy",
    },
    {
      title: "NEAR Foundation Joins the x402 Foundation",
      note: "Advancing open infrastructure for the agent economy.",
      href: "https://www.near.org/blog/near-foundation-joins-x402-foundation",
    },
  ],
} as const;

export const CLOSING = {
  lead: "The settlement layer for the",
  accent: "agent economy.",
  body: "Proven on mainnet. Ready for what agents need next.",
  cta: { label: "Start building", href: "https://docs.near.org" },
} as const;

// Un índice por id para las alternativas que atan una capacidad a su cifra
// (B la usa como telemetría del diagrama). Se deriva acá y no en cada
// componente para que el par capacidad→cifra sea un dato del contenido y no una
// decisión repetida en tres lugares.
export const PROOF_BY_ID: Record<string, ProofStat> = Object.fromEntries(
  PROOF.map((p) => [p.id, p])
);
