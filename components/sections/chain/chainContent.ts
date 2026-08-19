// Copy for /chain-abstraction, out of the components.
//
// Same contract as `quantum/quantumContent.ts`: pure strings and arrays of
// objects, no JSX, no `Date`, no functions. The day this comes from the CMS the
// shape does not change.
//
// (Comments on this page are in English, matching `components/sections/quantum/`
// — see the language note in that folder's README.)
//
// What is NOT here: the headlines. They carry `<Accent>` and `<br />`, so moving
// them into data would mean choosing a schema for "text with an accented run",
// and that is a content-model decision rather than a refactor. Geometry and
// timing are not here either — those live next to the animation that reads them.

/** The ticker field in the hero, and the ring of satellites in `CapabilityStack`. */
export const CHAINS = [
  "BTC", "ETH", "SOL", "XRP", "DOGE", "ADA", "AVAX", "DOT",
  "ATOM", "TON", "SUI", "APT", "TRX", "BNB", "POL", "ARB",
  "OP", "BASE", "LTC", "BCH", "XLM", "ALGO", "FIL", "ICP",
  "INJ", "SEI", "STX", "ZEC", "KAVA", "LINEA", "SCROLL", "MANTLE",
  "BLAST", "CELO", "GNO",
] as const;

export const HERO_SUB =
  "Chain abstraction makes every chain feel like one system. Hold, swap, and move any asset across 35+ chains from a single account. No bridges, no wrapped tokens, no gas to juggle. The complexity goes away. Your control over it never does.";

/** §2 — where → how easy → where it's going. */
export const REASONS = [
  {
    id: "one-place",
    index: "01",
    title: "Your whole onchain life, in one place",
    body: "One account holds everything and reaches everything needed.",
  },
  {
    id: "one-move",
    index: "02",
    title: "Do it in one move",
    body: "What used to take six steps takes one. No bridging, wrapping, or checking gas.",
  },
  {
    id: "whats-next",
    index: "03",
    title: "Built for what's next",
    body: "People use it today; the same rails are ready for the agents that will transact on your behalf tomorrow.",
  },
] as const;

/**
 * §3 — the four capabilities, as the beats of the sticky scene.
 *
 * `figure` is the diagram state each beat drives, not a decorative name: the
 * scene reads it to know which construction to build. Adding a beat without a
 * matching branch in `chainDiagram.ts` is a type error, which is the point.
 */
export const CAPABILITIES = [
  {
    id: "accounts",
    index: "01",
    eyebrow: "Multi-chain accounts",
    title: "One account. Every chain.",
    body: "Your NEAR account isn't just a NEAR account. It controls assets and apps across 35+ chains from a single login. No separate wallets, no separate seed phrases for every network. One identity, everywhere.",
    linkLabel: "How multi-chain accounts work",
    href: "https://docs.near.org/protocol/accounts-contracts/account-model",
    external: true,
    figure: "accounts",
  },
  {
    id: "intents",
    index: "02",
    eyebrow: "Powered by your intent",
    title: "Swap anything for anything",
    body: "Express the outcome you want and solvers compete to deliver the best execution across every connected chain. Swap Bitcoin for NEAR. That's Intents today: financial outcomes, fulfilled automatically. But stating an intent and letting a network deliver it is a general idea, not a financial one — as Intents grows, so does the range of outcomes it can settle. You define the result; the network finds the route.",
    linkLabel: "Explore NEAR Intents",
    href: "/intents",
    external: false,
    figure: "intents",
  },
  {
    id: "omnibridge",
    index: "03",
    eyebrow: "Omnibridge",
    title: "Move assets where they need to be",
    body: "Send value across chains natively, without the maze of wrapped tokens and fragile bridge contracts that usually comes with it. Assets move where you need them, and stay recognizably themselves when they arrive.",
    linkLabel: "Omnibridge overview",
    // The `_gl` analytics parameter from the source doc is stripped on purpose:
    // it is a cross-domain linker token, it expires, and it does not belong in
    // markup that ships.
    href: "https://docs.near.org/chain-abstraction/omnibridge/overview",
    external: true,
    figure: "omnibridge",
  },
  {
    id: "signatures",
    index: "04",
    eyebrow: "Chain Signatures",
    title: "The primitive underneath it all",
    body: "The three capabilities above share one foundation. Most cross-chain systems move assets: they lock a token on one chain and mint a copy on another. Chain Signatures move authority instead — a NEAR account can directly sign and execute real transactions on other networks, with no wrapped tokens or bridges in between. It's the cryptographic breakthrough that makes the single account, the swaps, and the native asset movement possible, and the part nothing else quite replicates.",
    linkLabel: "Chain Signatures overview",
    href: "https://docs.near.org/chain-abstraction/chain-signatures",
    external: true,
    figure: "signatures",
  },
] as const;

export type CapabilityFigure = (typeof CAPABILITIES)[number]["figure"];

/**
 * §4 — assert nothing, show everything.
 *
 * `ProofBand` renders these as ONE uniform row, in this order, at one size, so
 * the array order is the reading order. The `id`s are React keys — stable ones,
 * unlike the labels, which are prose and can be reworded.
 */
export const PROOF_STATS = [
  { id: "volume", value: "$20B+", label: "all-time cross-chain volume" },
  { id: "swaps", value: "25M+", label: "swaps executed" },
  { id: "chains", value: "35+", label: "chains connected" },
  { id: "fee", value: "<$0.01", label: "typical swap fee" },
] as const;

/**
 * The growth trajectory, drawn as a line rather than written as a sentence.
 * `value` is what the line is plotted against; `display` is what the reader
 * sees. Keeping both means the chart cannot drift from the label.
 */
export const GROWTH = [
  { display: "$5B", value: 5, when: "Nov 2025" },
  { display: "$10B", value: 10, when: "Jan 2026" },
  { display: "$20B", value: 20, when: "Jun 2026" },
] as const;

export const ECOSYSTEM = [
  "Ledger",
  "HOT Wallet",
  "Infinex",
  "SWEAT",
  "Rhea Finance",
  "Meteor Wallet",
  "Bitte",
  "Mintbase",
] as const;

/** §5 — four parts → one system → where it's going. */
export const CONVERGENCE = [
  { id: "signatures", label: "Chain Signatures", note: "one account, authority everywhere" },
  { id: "intents", label: "Intents", note: "a stated outcome, settled" },
  { id: "omnibridge", label: "Omnibridge", note: "assets move natively" },
  { id: "account", label: "Your account", note: "a single identity" },
] as const;

export const COMPLETE_BODY = [
  "Chain Signatures give one account authority across every chain. Intents turn a stated outcome into settled execution. Omnibridge moves assets natively between networks. Your account ties it into a single identity. Each layer makes the others more useful — more chains reachable, more outcomes settleable, more value flowing through one place instead of many.",
  "That's chain abstraction fully realized: not a feature bolted onto a blockchain, but a system where the chain stops being something you manage and becomes something you no longer have to think about.",
] as const;

export const FORWARD_BODY = [
  "Today, people use this. They swap, move, and hold across chains from one account without touching a bridge.",
  "But the harder problem chain abstraction solves isn't convenience, it's continuity. As software begins to act on our behalf — discovering, deciding, and transacting across networks without us — it needs an identity that persists and authority that travels with it. Not asset mobility. Economic agency: the ability to act anywhere, from one account, over time.",
  "That's the same infrastructure. The account that simplifies crypto for a person today is the account an agent operates through tomorrow. Nothing gets rebuilt.",
] as const;

/**
 * The deck's last sentence, pulled out of the paragraph above it.
 *
 * Not a rewrite — the words are the deck's, in the deck's order. It is set
 * apart because it is the only line in the section that stops arguing and just
 * lands, and buried at the end of a paragraph it reads as one more clause. This
 * is the page's closing thought; it gets to be a line.
 */
export const FORWARD_CODA = "The foundation was always the point.";

export const BUILDER_BODY = [
  "Your logic lives on NEAR. Your reach doesn't stop there. A single smart contract can manage Bitcoin liquidity, execute Ethereum transactions, and coordinate assets across Solana, XRP, and 30+ other networks — from one execution environment, without deploying separately to each.",
  "The complexity moves off the user and onto the infrastructure, which is exactly where it belongs.",
] as const;
