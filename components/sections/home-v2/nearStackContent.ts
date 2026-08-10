// Copy de NearStack, separada del componente para que el JSX quede legible.
// Data plana y serializable — nada de JSX ni funciones acá.
//
// En el original esto vivía como <div style="display:none"> que el JS copiaba
// con innerHTML al popover flotante. Acá es data y React la renderiza.

export type Tier = {
  /** clave del popover; coincide con el índice del array */
  readonly name: string;
  readonly body: string;
};

export const TIERS: readonly Tier[] = [
  {
    name: "NEAR Protocol",
    body: "NEAR Protocol is a fully sharded, quantum-resistant blockchain that has operated on mainnet for over five years with 100% uptime, built to support the agent economy at scale.",
  },
  {
    name: "NEAR Intents",
    body: "The universal liquidity protocol. NEAR Intents uses a novel transaction architecture to abstract away cross-chain complexity and maximize performance, security, and efficiency for DeFi apps, AI agents, and end users.",
  },
  {
    name: "NEAR AI",
    body: "NEAR AI runs sensitive workloads for enterprises, governments, and AI applications. Inference and agents execute inside encrypted enclaves where requests are confidential by design and outputs are independently verifiable.",
  },
  {
    name: "near.com",
    body: "The only onchain account you need. Fully confidential swaps, transfers, deposits, and withdrawals. Trade perps, earn yield, and hold RWAs across 30+ chains, all from one account, your assets in your control. The way crypto should work.",
  },
];

export type Popover = {
  readonly eyebrow: string;
  readonly items: readonly { readonly title: string; readonly blurb: string }[];
};

/**
 * Clave → popover. Las numéricas son índices de tier; las de texto, segmentos
 * del anillo de NEAR AI (que se resaltan uno por uno, no como bloque).
 *
 * Falta el tier 3 (near.com) A PROPÓSITO: el original tampoco lo tiene. Su
 * geometría se ilumina al hover pero no abre popover. No se inventa copy para
 * tapar el hueco; si hace falta, se agrega la clave "3" acá y aparece solo.
 */
export const POPOVERS: Record<string, Popover> = {
  "0": {
    eyebrow: "NEAR Protocol",
    items: [
      { title: "Dynamic Resharding", blurb: "Shards split and merge with demand" },
      { title: "Post-Quantum Signing", blurb: "FIPS-204 / ML-DSA, live on mainnet" },
      { title: "Chain Signatures", blurb: "Threshold MPC across chains, no bridges" },
      { title: "Private Shard", blurb: "Restricted-visibility execution environment" },
      { title: "Top-Level Accounts", blurb: "Programmable keys, governed by House of Stake" },
    ],
  },
  "1": {
    eyebrow: "NEAR Intents",
    items: [
      { title: "Confidential Intents", blurb: "Trades execute inside a NEAR private shard" },
    ],
  },
  "ai-cloud": {
    eyebrow: "NEAR AI · 1 of 3",
    items: [{ title: "NEAR AI Cloud", blurb: "Scalable and verifiable confidential inference" }],
  },
  "ai-ironclaw": {
    eyebrow: "NEAR AI · 2 of 3",
    items: [{ title: "IronClaw", blurb: "Always-on agents inside encrypted enclaves" }],
  },
  "ai-market": {
    eyebrow: "NEAR AI · 3 of 3",
    items: [{ title: "Agent Market", blurb: "Directory of agents you can hire by the job" }],
  },
};

/** La banda que sube en la fase final, debajo del objeto. */
export const FOUNDATION: readonly { readonly title: string; readonly body: string }[] = [
  {
    title: "Governance",
    body: "NEAR’s House of Stake gives participants who generate value a proportional say in how the system runs. Live on mainnet, with binding proposals already passed.",
  },
  {
    title: "Economics",
    body: "NEAR is the coordination asset of the agent economy. As usage grows, product revenue feeds buybacks that offset emissions, accelerating NEAR’s deflationary trajectory and strengthening the network as activity scales.",
  },
];
