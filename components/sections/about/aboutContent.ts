// Copy for /about — the history of NEAR Protocol.
//
// Same contract as `chain/chainContent.ts`: pure strings and arrays of objects,
// no JSX, no `Date`, no functions. Read by all three layouts (`a/`, `b/`, `c/`)
// so comparing them compares LAYOUT and never copy.
//
// ── Why the years are data and not prose ───────────────────────────────────
//
// The deck arrived as eight titled chapters with no dates in the headings; the
// years are inside the sentences. On this page the ORDER carries information the
// reader needs — it is the one page on the site where a numbered structure is
// not decoration — so the year is lifted out of the prose and made a field.
// Every layout can then set it as a marker without any of them having to parse a
// paragraph for it.
//
// The two ranges are honest and not tidied: the sharding chapter has no single
// year in the deck (it describes a design stance held from the start), and the
// founding chapter spans the pivot. Rounding either to one year would invent a
// date the source does not claim.
//
// `marker` is the chapter reduced to the line a rail or an index can carry. It
// is not a summary of the body — it is the same beat said once, short.

export const META = {
  title: "About",
  description:
    "From 2017 to now: how NEAR got here and where it is going.",
} as const;

/** §1 — the opening. */
export const HERO = {
  eyebrow: "History",
  headline: "The History of NEAR Protocol",
  sub: "Before the world knew what it needed, NEAR was already building it.",
  standfirst:
    "Illia Polosukhin and Alexander Skidanov founded NEAR Protocol in 2018 with the goal of building a scalable, usable blockchain.",
} as const;

/**
 * The eight chapters.
 *
 * `note` is a chapter's own pull-out — a fact that stands beside the prose
 * rather than inside it. Only two chapters have one, and that is deliberate: a
 * device that fires on every chapter stops marking anything.
 */
export const CHAPTERS = [
  {
    id: "paper",
    year: "2017",
    yearLabel: "2017",
    title: "The paper that launched modern AI",
    marker: "A Google research paper, and a co-founder who wrote it.",
    body: [
      "Illia Polosukhin was a machine learning researcher at Google. In 2017, Illia co-authored a paper that would quietly rewrite the trajectory of the entire technology industry. Alex Skidanov had built one of the first production-grade distributed databases at MemSQL (now SingleStore), gaining deep expertise in distributed systems and scalability. Later the same year, they joined forces to co-found NEAR AI with a specific, concrete goal: build AI models that could write code from natural language descriptions.",
    ],
    note: {
      label: "Attention Is All You Need",
      body: "Co-authored by Illia, the paper introduced the Transformer architecture. GPT, Claude, Gemini, and every major LLM today is built on it. NEAR's AI credentials are not retrofitted. They're rooted in the research that grew into today's entire AI industry.",
    },
  },
  {
    id: "problem",
    year: "2018",
    yearLabel: "2018",
    title: "The problem that created NEAR",
    marker: "Paying contributors across borders turned out to be the harder problem.",
    body: [
      "Illia and Alex hired computer science students from around the globe to contribute to model training. Then reality hit: the models didn't scale, and there wasn't enough GPU capacity. It was too early.",
      "Paying contributors across borders exposed a second problem. Many didn't have bank accounts, and sending crypto in 2018 was prohibitively expensive. So they started looking closely at the blockchain space, and never really left. The research questions being asked about scalability, usability, and decentralization mapped directly onto their skill sets, and they saw a way to contribute. They decided to build the network they'd actually want to use as developers.",
      "They thought it would take six months.",
    ],
    note: null,
  },
  {
    id: "sharding",
    year: "2018",
    yearLabel: "2018 — 2020",
    title: "Designed for a billion users from the start",
    marker: "Scalability treated as a starting condition, not a future problem.",
    body: [
      "Coming from backgrounds in large-scale distributed systems and machine learning, Alex and Illia had an unusually concrete sense of what global-scale infrastructure actually required.",
      "That perspective shaped NEAR from the beginning. Rather than treating scalability as a future problem, they designed around the assumption that blockchains would eventually need to support millions of users and applications without sacrificing decentralization or usability. NEAR's answer was sharding: a technique that partitions computation and storage across parallel subsets of the network. By distributing work instead of requiring every node to process every transaction and store the entire state, NEAR can increase capacity as demand grows while preserving security and decentralization.",
    ],
    note: null,
  },
  {
    id: "unifying",
    year: "2021",
    yearLabel: "2021",
    title: "Unifying the onchain economy",
    marker: "One million accounts, and the first attack on the walls between chains.",
    body: [
      "By 2021, NEAR was becoming a network people built on. Developer infrastructure matured, standards took shape, and the ecosystem hit one million accounts, proof that the architectural decisions made years earlier were holding up under real usage.",
      "The next challenge was the walls between chains, another barrier to usability. Rainbow Bridge made trustless asset transfers between NEAR and Ethereum real. Aurora brought full EVM compatibility natively, letting any Ethereum project deploy on NEAR without rewrites. The goal was never to pull developers away from other ecosystems. It was to make the distance between them disappear. Each new integration chipped away at the same underlying problems: liquidity locked on separate chains, and users stuck managing bridges and gas. The outcome should matter. The route shouldn't.",
      "This was the early prototype of a thesis that would eventually become Chain Abstraction.",
    ],
    note: null,
  },
  {
    id: "chain-abstraction",
    year: "2023",
    yearLabel: "2023",
    title: "The dawn of Chain Abstraction",
    marker: "NEAR coined the term. The industry converged on it.",
    body: [
      "While the rest of the ecosystem debated which chain would win, NEAR was asking a different question: what if the user cares less about the chain and more about achieving the experience they want?",
      "2023 was a year of major technical progress under the hood. Meta transactions shipped, making gasless transactions possible for the first time. NEAR DA launched in November, extending the network's utility into the modular stack for rollups.",
      "But the idea that defined the year, and reframed how the broader industry thought about multi-chain, was Chain Abstraction. NEAR coined the term and built toward it: the fragmentation of blockchains was an infrastructure problem, not something users should have to manage. NEAR introduced this concept and the rest of the industry converged on it.",
    ],
    note: null,
  },
  {
    id: "ai",
    year: "2024",
    yearLabel: "2024",
    title: "The blockchain for AI",
    marker: "Chain Signatures ship. Intents follows. The thesis gets its name.",
    body: [
      "2024 was the year the chain abstraction thesis became infrastructure. Chain Signatures shipped to mainnet, enabling smart contracts to sign transactions on any blockchain. NEAR Intents (in beta) followed in November, a new primitive built on top of Chain Signatures that lets users and agents specify outcomes rather than transactions, with solvers competing to execute across any chain or system underneath.",
      "The bigger shift was strategic. NEAR named the thesis it had been building toward: Blockchain for AI. In May, NEAR Foundation announced its focus on user-owned AI. In November, NEAR AI launched as a research arm for the public development of large-scale models. With the advent of ChatGPT, the LLM functionality Alex and Illia needed in 2018 had finally arrived. The convergence of AI and crypto, which Illia had believed in for years, was no longer a vision. It was a roadmap.",
    ],
    note: {
      label: "The loop closes",
      body: "The models Alex and Illia needed in 2018 finally existed. The network they built while waiting for them turned out to be the one those models would need.",
    },
  },
  {
    id: "intents",
    year: "2025",
    yearLabel: "2025",
    title: "NEAR Intents expands",
    marker: "Chain abstraction stops being a concept and becomes operating infrastructure.",
    body: [
      "NEAR Intents moved from early infrastructure into broader ecosystem adoption. Wallets across the NEAR ecosystem integrated Intents functionality, enabling users to execute cross-chain actions through a unified experience rather than manually navigating multiple networks. What had previously required bridges, swaps, routing decisions, and fragmented liquidity could increasingly be expressed as a simple desired outcome.",
      "Chain Signatures expanded across additional ecosystems, relayer infrastructure matured, and wallet integrations extended NEAR's execution layer to a growing number of networks and applications. The vision of chain abstraction was no longer a concept. It was operating infrastructure. Intents also provided the first version of the execution layer for AI agents: outcome-based, cross-chain, and designed for autonomous actors.",
    ],
    note: null,
  },
  {
    id: "now",
    year: "2026",
    yearLabel: "2026",
    title: "The original thesis is arriving",
    marker: "The questions from the beginning, asked again — now with agents holding the keys.",
    body: [
      "AI agents are beginning to transact, coordinate resources, move assets, and carry out economic activities on behalf of users. The same questions that shaped NEAR from the beginning rise again: Who controls the infrastructure? Who owns the credentials? Who captures the value created by these systems?",
      "In 2026, NEAR's focus is on answering those questions.",
      "Confidential Intents extend the Intents model with privacy-preserving execution, allowing users and agents to transact without exposing sensitive information while preserving security and enabling selective disclosure where necessary.",
      "NEAR AI and IronClaw are building the foundations for a secure agent economy: encrypted execution environments, credential isolation, hardware-backed trust guarantees, and tooling designed to keep agents accountable to the people they serve.",
      "At the protocol layer, NEAR continues to advance the scaling architecture first envisioned years ago. Dynamic resharding, performance optimization, and quantum-safe signing schemes are pushing the protocol toward a future where infrastructure scales with demand rather than becoming constrained by it.",
    ],
    note: null,
  },
] as const;

/**
 * The three questions of the last chapter, lifted out.
 *
 * They are the page's refrain: the same questions that started the project are
 * the ones it is answering now. A layout that can state them twice — once at
 * the opening, once at the close — gets the history's shape for free.
 */
export const QUESTIONS = [
  "Who controls the infrastructure?",
  "Who owns the credentials?",
  "Who captures the value created by these systems?",
] as const;

/** The close. The deck's last line, which is also the first one. */
export const CLOSING = {
  headline: "The goal remains the same as it was in the beginning",
  body: "Make powerful technology accessible, usable, and open to everyone.",
  primary: { label: "Read the docs", href: "https://docs.near.org" },
  secondary: { label: "Explore the protocol", href: "/blockchain" },
} as const;

/**
 * One chapter, as a layout receives it.
 *
 * Declared structurally rather than as `(typeof CHAPTERS)[number]`: that union
 * carries the literal type of every string in the deck, so a component typed
 * against it would only accept the eight chapters that exist today and would
 * report a chapter's own `title` as a union of eight titles. The layouts need
 * the SHAPE, not the values.
 */
export type AboutChapter = {
  readonly id: string;
  readonly year: string;
  readonly yearLabel: string;
  readonly title: string;
  readonly marker: string;
  readonly body: readonly string[];
  readonly note: { readonly label: string; readonly body: string } | null;
};
