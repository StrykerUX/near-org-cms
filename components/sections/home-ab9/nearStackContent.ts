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
  body: "NEAR Protocol is a fully sharded, quantum-resistant blockchain that has operated on mainnet for over five years with 100% uptime, built to support the agent economy at scale.",
  // Destinos confirmados: intents.near.org, near.ai y near.com. No salen ni de
  // `main` ni de la rama del rediseño tal cual — la rama apuntaba este a
  // `/prototype/protocol`, ruta que ya no existe.
  link: { label: "Visit nearprotocol.com", href: "https://nearprotocol.com" },
};

export const INTENTS_BLOCK: StackLeaf = {
  key: "intents",
  name: "NEAR Intents",
  body: "The universal liquidity protocol. NEAR Intents uses a novel transaction architecture to abstract away cross-chain complexity and maximize performance, security, and efficiency for DeFi apps, AI agents, and end users.",
  link: { label: "Visit intents.near.org", href: "https://intents.near.org" },
};

export const AI_BLOCK = {
  name: "NEAR AI",
  intro:
    "NEAR AI runs sensitive workloads for enterprises, governments, and AI applications. Inference and agents execute inside encrypted enclaves where requests are confidential by design and outputs are independently verifiable.",
  link: { label: "Visit near.ai", href: "https://near.ai" },
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
  body: "The only onchain account you need. Fully confidential swaps, transfers, deposits, and withdrawals. Trade perps, earn yield, and hold RWAs across 30+ chains, all from one account, your assets in your control. The way crypto should work.",
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

// ── Lo que agrega la composición de `StackAnchors` ──────────────────────────
//
// Las cuatro fichas de las esquinas llevan dos cosas que el stack no tenía:
// una lista corta de piezas y una fila de capacidades.

/**
 * Las piezas que cada capa expone, como una lista de marcas.
 *
 * No es lo mismo que `AI_BLOCK.subs` ni que `PROTOCOL_FEATURES`, aunque se
 * solapen: aquellos son entidades con cuerpo propio —los tres productos de AI
 * viven en el arte y tienen su tarjeta al pasar el puntero; los seis features
 * son el único texto de los cubos de la columna—, y estos son ETIQUETAS. Un
 * nombre y nada más, para que la ficha diga de qué está hecha la capa sin
 * gastar un párrafo.
 *
 * Solo la llevan `intents` y `ai`. Las otras dos no, y por motivos distintos:
 *
 *   · `nearcom` es la cáscara — lo que expone son las capacidades de abajo, no
 *     piezas;
 *   · `protocol` la tuvo (Dynamic Resharding, Post-Quantum Signing, Chain
 *     Signatures, Private Shard, Top-Level Accounts) y se quitó. Sus piezas ya
 *     están dichas donde importan: son los cubos de la columna central, y cada
 *     uno cuenta la suya con su subhead al pasar el puntero, vía
 *     `PROTOCOL_FEATURES`. Repetirlas como etiquetas planas debajo del cuerpo
 *     duplicaba el contenido y le quitaba el motivo a explorar la columna.
 */
export const STACK_PIECES: Readonly<Record<string, readonly string[]>> = {
  intents: ["Confidential Intents"],
  ai: ["NEAR AI Cloud", "IronClaw", "Agent Market"],
};

/**
 * Las capacidades, iguales en las cuatro fichas.
 *
 * Que se repitan es el mensaje, no un descuido de la copy: son propiedades del
 * STACK, no de una capa. Da igual por dónde entres —la cuenta, los intents, la
 * IA o el protocolo—, las seis siguen valiendo. Por eso son una constante
 * compartida y no un campo por bloque: un campo invitaría a que alguna se
 * quedara con cinco y la afirmación dejaría de ser cierta sin que nadie lo note.
 */
export const STACK_CAPABILITIES = [
  "Confidential",
  "Cross-chain",
  "Permissionless",
  "RWAs",
  "Perps",
  "Earn",
] as const;
