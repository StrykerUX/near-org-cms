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
// los cubos de arriba hacia abajo (data-stack-cube 0…5). Son los seis claims
// de /blockchain — misma lista, mismo orden.
export const PROTOCOL_FEATURES: readonly string[] = [
  "Nightshade 3.0",
  "Dynamic resharding",
  "Speed. Scale. Access.",
  "Private Shard",
  "Quantum-safe accounts",
  "Chain Signatures",
];
