// Copy compartida por las 2 propuestas de /chain-abstraction (A y B). Una
// sola fuente de verdad para que el texto no se desincronice entre las dos
// distribuciones — mismo criterio que `homepageUpdateContent.ts`: módulo
// puro, `readonly`, sin JSX y sin nada que no sobreviva un JSON.stringify.
//
// Todo el texto es el que trajo el usuario, verbatim. Donde el copy original
// venía como "Título: cuerpo" en una sola línea (Why it matters), se separó
// en `title`/`body` solo por la puntuación (dos puntos → dos campos), sin
// tocar palabras.

export const HERO_A = {
  headline: "Infrastructure for Everything That Transacts",
  sub: "Chain abstraction makes every chain feel like one. Hold, swap, and move any asset across 35+ chains from a single account. You set the outcome; NEAR handles the rest.",
} as const;

export const HERO_B = {
  headline: "The Chain Disappears. You don't.",
  sub: "Chain abstraction makes every chain feel like one system. Hold, swap, and move any asset across 35+ chains from a single account. No bridges, no wrapped tokens, no gas to juggle. The complexity goes away. Your control over it never does.",
} as const;

export const WHY_IT_MATTERS = [
  {
    title: "Your whole onchain life, in one place",
    body: "One account holds everything and reaches everything needed.",
  },
  {
    title: "Do it in one move",
    body: "What used to take six steps takes one. No bridging, wrapping, or checking gas.",
  },
  {
    title: "Built for what's next",
    body: "People use it today; the same rails are ready for the agents that will transact on your behalf tomorrow.",
  },
] as const;

// "What Chain Abstraction Unlocks" — 4 capacidades. `kicker` es el rótulo
// corto que trae el copy antes del header ("Multi-Chain Accounts", "Powered
// by your Intent", …); `link` es el texto del link de salida, sin href real
// todavía (estos son prototipos, no hay páginas destino).
export const CAPABILITIES = [
  {
    kicker: "Multi-Chain Accounts",
    header: "One account. Every chain.",
    body: "Your NEAR account isn't just a NEAR account. It controls assets and apps across 35+ chains from a single login. No separate wallets, no separate seed phrases for every network. One identity, everywhere.",
    link: "How multi-chain accounts work",
  },
  {
    kicker: "Powered by your Intent",
    header: "Swap anything for anything",
    body: "Express the outcome you want and solvers compete to deliver the best execution across every connected chain. Swap Bitcoin for NEAR. That's Intents today: financial outcomes, fulfilled automatically. But stating an intent and letting a network deliver it is a general idea, not a financial one, and as Intents grows, so does the range of outcomes it can settle. You define the result; the network finds the route.",
    link: "Explore NEAR Intents",
  },
  {
    kicker: "Omnibridge",
    header: "Move assets where they need to be",
    body: "Send value across chains natively, without the maze of wrapped tokens and fragile bridge contracts that usually comes with it. Assets move where you need them, and stay recognizably themselves when they arrive.",
    link: "Omnibridge overview",
  },
  {
    kicker: "Chain Signatures",
    header: "The primitive underneath it all",
    body: "The three capabilities above share one foundation. Most cross-chain systems move assets, they lock a token on one chain and mint a copy on another. Chain Signatures move authority instead: a NEAR account can directly sign and execute real transactions on other networks, no wrapped tokens or bridges in between. It's the cryptographic breakthrough that makes the single account, the swaps, and the native asset movement possible, and the part nothing else quite replicates.",
    link: "Chain Signatures overview",
  },
] as const;

export const PROOF_HEADLINE = "Already the rails for cross-chain value";

export const PROOF_STATS = [
  { value: "$20B+", label: "all-time cross-chain volume" },
  { value: "25M+", label: "swaps executed" },
  { value: "35+", label: "chains connected" },
  { value: "<$0.01", label: "typical swap fee" },
] as const;

export const GROWTH = {
  label: "Growth trajectory",
  milestones: [
    { value: "$5B", date: "Nov 2025" },
    { value: "$10B", date: "Jan 2026" },
    { value: "$20B", date: "Jun 2026" },
  ],
} as const;

export const ECOSYSTEM = {
  lead: "Built into the products people already use:",
  names: ["Ledger", "HOT Wallet", "Infinex", "SWEAT", "Rhea Finance", "Every major NEAR wallet"],
} as const;

export const COMPLETE_PICTURE = {
  header: "Four capabilities. One system.",
  body: "Chain Signatures give one account authority across every chain. Intents turn a stated outcome into settled execution. Omnibridge moves assets natively between networks. Your account ties it into a single identity. Each layer makes the others more useful, more chains reachable, more outcomes settleable, more value flowing through one place instead of many. That's chain abstraction fully realized: not a feature bolted onto a blockchain, but a system where the chain stops being something you manage and becomes something you no longer have to think about.",
} as const;

export const FORWARD_TURN = {
  header: "Built for what transacts next",
  body: "Today, people use this. They swap, move, and hold across chains from one account without touching a bridge. But the harder problem chain abstraction solves isn't convenience, it's continuity. As software begins to act on our behalf, discovering, deciding, and transacting across networks without us, it needs an identity that persists and authority that travels with it. Not asset mobility. Economic agency: the ability to act anywhere, from one account, over time. That's the same infrastructure. The account that simplifies crypto for a person today is the account an agent operates through tomorrow. Nothing gets rebuilt. The foundation was always the point.",
} as const;

export const BUILDERS_CTA = {
  header: "For builders: write once, reach everywhere",
  body: "Your logic lives on NEAR. Your reach doesn't stop there. A single smart contract can manage Bitcoin liquidity, execute Ethereum transactions, and coordinate assets across Solana, XRP, and 30+ other networks, from one execution environment, without deploying separately to each. The complexity moves off the user and onto the infrastructure, which is exactly where it belongs.",
  cta: "Start building",
} as const;
