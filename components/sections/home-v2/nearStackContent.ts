// Copy de NearStack, separada del componente para que el JSX quede legible.
// Data plana y serializable — nada de JSX ni funciones acá. Es el precedente
// que cita components/sections/README.md para los módulos de copy.

export type Tier = {
  readonly name: string;
  readonly body: string;
  /** CTA del panel abierto. El label es copy visible ("Visit near.com"),
   *  no se deriva del href: los frames de referencia los escriben distinto. */
  readonly link: { readonly label: string; readonly href: string };
};

export const TIERS: readonly Tier[] = [
  {
    name: "NEAR Protocol",
    body: "NEAR Protocol is a fully sharded, quantum-resistant blockchain that has operated on mainnet for over five years with 100% uptime, built to support the agent economy at scale.",
    link: { label: "Visit nearprotocol.com", href: "https://nearprotocol.com" },
  },
  {
    name: "NEAR Intents",
    body: "The universal liquidity protocol. NEAR Intents uses a novel transaction architecture to abstract away cross-chain complexity and maximize performance, security, and efficiency for DeFi apps, AI agents, and end users.",
    link: { label: "Visit near-intents.org", href: "https://near-intents.org" },
  },
  {
    name: "NEAR AI",
    body: "NEAR AI runs sensitive workloads for enterprises, governments, and AI applications. Inference and agents execute inside encrypted enclaves where requests are confidential by design and outputs are independently verifiable.",
    link: { label: "Visit nearai.com", href: "https://nearai.com" },
  },
  {
    name: "near.com",
    body: "The only onchain account you need. Fully confidential swaps, transfers, deposits, and withdrawals. Trade perps, earn yield, and hold RWAs across 30+ chains, all from one account, your assets in your control. The way crypto should work.",
    link: { label: "Visit near.com", href: "https://near.com" },
  },
];
