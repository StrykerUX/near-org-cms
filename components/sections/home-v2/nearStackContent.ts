// Copy de NearStack, separada del componente para que el JSX quede legible.
// Data plana y serializable — nada de JSX ni funciones acá.
//
// COPY BORRADOR (2026-08-14): redactada nueva a pedido de Lawrence, pendiente
// de su revisión — el doc fuente del stack no llegó al hilo. La estructura
// narrativa es la que él fijó: el Protocol es la columna central y todo se
// construye alrededor, de adentro hacia afuera: Intents → NEAR AI (con sus
// tres productos) → near.com como cáscara exterior.

export type StackKey =
  | "protocol"
  | "intents"
  | "ai"
  | "ironclaw"
  | "cloud"
  | "market"
  | "nearcom";

export type StackLeaf = {
  readonly key: StackKey;
  readonly name: string;
  readonly body: string;
  readonly link?: { readonly label: string; readonly href: string };
};

export const PROTOCOL_BLOCK: StackLeaf = {
  key: "protocol",
  name: "NEAR Protocol",
  body: "The settlement layer at the center of the stack — everything else is built around it. Fully sharded and quantum-resistant, with five years on mainnet at 100% uptime, built to clear the agent economy at scale.",
  link: { label: "Visit nearprotocol.com", href: "https://nearprotocol.com" },
};

export const INTENTS_BLOCK: StackLeaf = {
  key: "intents",
  name: "NEAR Intents",
  body: "The first ring out from the protocol. Intents deal in outcomes, not transactions: say what should happen — a swap, a transfer, a settlement across 30+ chains — and a network of solvers competes to make it true. No bridges, no juggling gas.",
  link: { label: "Visit near-intents.org", href: "https://near-intents.org" },
};

export const AI_BLOCK = {
  name: "NEAR AI",
  intro:
    "Confidential AI infrastructure, wrapped around the core. Inference and agents run inside encrypted enclaves: requests stay private by design, and every output can be independently verified.",
  link: { label: "Visit nearai.com", href: "https://nearai.com" },
  subs: [
    {
      key: "ironclaw",
      name: "IronClaw",
      body: "The private AI assistant. Conversations and data live inside the enclave — verifiably out of reach of everyone, including the people running the hardware.",
    },
    {
      key: "cloud",
      name: "NEAR AI Cloud",
      body: "Confidential inference for enterprises and governments. Sensitive workloads run encrypted end to end, with attestation that proves exactly what code touched them.",
    },
    {
      key: "market",
      name: "Agent Market",
      body: "Where always-on agents live: published, discovered, and paid onchain, running around the clock inside secure enclaves.",
    },
  ] as readonly StackLeaf[],
} as const;

export const NEARCOM_BLOCK: StackLeaf = {
  key: "nearcom",
  name: "near.com",
  body: "The outer shell — one onchain account for everything. Confidential swaps, transfers, perps, yield, and RWAs across 30+ chains, with your assets in your control the whole way. The way crypto should work.",
  link: { label: "Visit near.com", href: "https://near.com" },
};

// Los seis features del protocolo, UNO POR CUBO de la columna, en el orden de
// los cubos de arriba hacia abajo (data-stack-cube 0…5). Copy VERBATIM del
// doc "near.org - sitemap" (tab Protocol, secciones 4–9): `sub` es el
// subhead del doc y `desc` el body. "Speed. Scale. Access." no tiene subhead
// en el doc, así que solo lleva body.
export const PROTOCOL_FEATURES: readonly { name: string; sub?: string; desc: string }[] = [
  {
    name: "Nightshade 3.0",
    sub: "Stateless validation is here",
    desc: "The newest protocol upgrade decouples consensus from execution, adds multi-contract atomic interactions, and introduces a private shard for confidential transactions.",
  },
  {
    name: "Dynamic resharding",
    sub: "Capacity is a property of the network, not a governance decision.",
    desc: "A shard now splits automatically when it hits its state-size threshold, validated by state witnesses, with no vote and no human intervention.",
  },
  {
    name: "Speed. Scale. Access.",
    desc: "600ms blocks and 1.2s finality. Global contracts deploy once and run network-wide. In-memory state removes database latency.",
  },
  {
    name: "Private Shard",
    sub: "Confidential execution, directly at the protocol layer",
    desc: "Transactions are shielded from public view, with selective disclosure for compliance-readiness. The foundation for Confidential Intents.",
  },
  {
    name: "Quantum security",
    sub: "Post-quantum signing is live on mainnet",
    desc: "NEAR accounts are decoupled from cryptography, so upgrading to quantum-safe keys takes a single key rotation. NEAR supports FIPS-204 (ML-DSA), a NIST-approved post-quantum signing scheme.",
  },
  {
    name: "Chain Signatures",
    sub: "Native transactions across the multi-chain ecosystem",
    desc: "Through threshold MPC, a single NEAR account signs and triggers native transactions across 30+ chains, including Bitcoin, Ethereum, Solana, and more, with no bridge contracts. Support spans both ECDSA and EdDSA signature schemes.",
  },
];
