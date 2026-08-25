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
  secondary: { label: "Explore the protocol", href: "/protocol" },
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

/**
 * The archive: one asset per chapter, and what has to be produced for it.
 *
 * ── Why the work order is the label ───────────────────────────────────────
 *
 * This is the one page of the set whose material certainly exists somewhere —
 * the paper, the two founders, the whiteboard, the Rainbow Bridge screen, the
 * slide where Chain Abstraction got its name. None of it is in the repo, so
 * every layout renders a `MediaFrame`, and a `MediaFrame` prints its own label
 * under the reserved box. That label is read by two people who are not the same
 * person: the reader, who learns what will be there, and whoever has to go find
 * it. Written as "Photo" it fails both. Written as a brief it works for both,
 * which is why these are sentences and not titles.
 *
 * ── Why `shape` is here and placement is not ───────────────────────────────
 *
 * `shape` is a fact about the asset: a page of a paper is portrait, a whiteboard
 * is a panorama, an announcement card is a square. Deciding it once here is what
 * keeps the same photograph from being a portrait in one layout and a letterbox
 * in another — and it is also what stops the eight frames from becoming eight
 * identical 16/9 slots stacked down the page, which is a template rather than a
 * composition.
 *
 * WHERE each frame lands — margin, prose column, full plate, page bleed — is
 * composition, so it lives with each layout, in the same way `TONES` lives in
 * `AboutBView` and not here.
 */
export const ARCHIVE = {
  paper: {
    label:
      "Attention Is All You Need, page one — screenshot of the arXiv PDF, full page with the author list visible, uncropped",
    spec: "1200×1600 · PNG",
    shape: "3/4",
  },
  problem: {
    label:
      "Illia Polosukhin and Alexander Skidanov, 2018 — the two founders together, any NEAR AI archive frame from before the pivot",
    spec: "1600×1200 · JPG",
    shape: "4/3",
  },
  sharding: {
    label:
      "The sharding whiteboard — photograph of an architecture diagram of the period, or a scan of the design notebook, drawing legible edge to edge",
    spec: "2400×1030 · JPG",
    shape: "21/9",
  },
  unifying: {
    label:
      "Rainbow Bridge, 2021 — full browser capture of the transfer interface as it shipped, browser chrome included",
    spec: "2560×1440 · PNG",
    shape: "16/9",
  },
  "chain-abstraction": {
    label:
      "The slide where Chain Abstraction was named, 2023 — keynote frame, or the diagram from the original announcement post",
    spec: "2400×1350 · PNG",
    shape: "16/9",
  },
  ai: {
    label:
      "Chain Signatures on mainnet, 2024 — the announcement card, or an explorer capture of the first cross-chain signature",
    spec: "1400×1400 · PNG",
    shape: "1/1",
  },
  intents: {
    label:
      "Wallets shipping Intents, 2025 — three phone captures of the same cross-chain flow, mounted as one image",
    spec: "1080×1440 · PNG",
    shape: "3/4",
  },
  now: {
    label:
      "Confidential Intents and the agent runtime, 2026 — current NEAR AI / IronClaw product capture, or the TEE render",
    spec: "2400×960 · PNG",
    shape: "5/2",
  },
} as const;

/**
 * The two drawn figures, keyed by the chapter they belong to.
 *
 * Two, and not eight. A figure per chapter turns a history into a manual, and
 * six of these chapters make claims a drawing cannot say faster than the
 * sentence already does. These two can:
 *
 *   `sharding` — the paragraph spends four lines explaining that work is
 *     partitioned across parallel subsets instead of every node doing all of
 *     it. The drawing says it at a glance.
 *   `ai` — the page's whole shape, which is a circle: they built a network
 *     because the models were not ready, and the models arrived needing the
 *     network. Prose has to say that in two sentences and a reader has to hold
 *     both. Two lines converging holds it for them.
 *
 * The caption is not a title. `Figure` prints it under the drawing and it is
 * the thing that had to be writable for the figure to be worth drawing: if the
 * only sentence available is "diagram of sharding", the drawing shows nothing.
 */
export const FIGURES = {
  sharding: {
    caption:
      "One boundary around all twelve, or four boundaries around three each. The work does not change; how much of it can run at once does.",
  },
  ai: {
    caption:
      "The upper line is the models, and it stops in 2018. The detour it forced is the lower one. When the models come back, the two arrive at the same point — and keep going.",
  },
} as const;

/**
 * The eight chapters, grouped into four acts.
 *
 * Variant B needs this and the other two do not, so the obvious place for it is
 * `b/`. It lives here anyway, for the reason everything else on this page does:
 * it is a claim about the CONTENT — that these eight chapters are four
 * movements and not eight equal beats — and a claim about the content that lives
 * in one layout is a claim the other two silently contradict.
 *
 * ── Why these four cuts ────────────────────────────────────────────────────
 *
 * Each act is the span over which the thing they were building STAYS THE SAME
 * THING, and each boundary is a place where it changes:
 *
 *   research     — two people trying to make models write code, and the
 *                  payments problem that stopped them. Ends when they decide to
 *                  build the network instead.
 *   foundations  — the network itself: sharding, then the first attack on the
 *                  walls between chains. Ends when the question stops being
 *                  "how do we scale this" and becomes "why should a user know
 *                  which chain they are on".
 *   abstraction  — Chain Abstraction named, then shipped as Chain Signatures
 *                  and Intents. Ends when the models finally arrive.
 *   agents       — the infrastructure operating, and the original thesis
 *                  arriving with it.
 *
 * No labels. An act's label is derived from its chapters' own years
 * (`2017 — 2018`), so the rail carries data and not four headings someone wrote
 * to name four groups the deck never named.
 */
export const ACTS = [
  { id: "research", chapters: ["paper", "problem"] },
  { id: "foundations", chapters: ["sharding", "unifying"] },
  { id: "abstraction", chapters: ["chain-abstraction", "ai"] },
  { id: "agents", chapters: ["intents", "now"] },
] as const;

/**
 * The four numbers in this history, lifted out.
 *
 * A layout that reads as an instrument needs readings, and a reading is a
 * figure with a unit. These are the only four the page can honestly show, and
 * every one of them is already asserted somewhere on this site:
 *
 *   `6 months`  — this chapter's own last line, verbatim: "They thought it
 *                 would take six months." It is the best number on the page,
 *                 because the reader already knows how it ends.
 *   `1M`        — the 2021 chapter: "the ecosystem hit one million accounts".
 *   `5+ years`  — the site's standing uptime claim, worded exactly as
 *                 `quantum/quantumContent.ts` and `protocol-labs` word it.
 *   `35+`       — the site's standing chain count, worded exactly as
 *                 `chain/chainContent.ts` words it. It is what "Chain
 *                 Signatures expanded across additional ecosystems" means in
 *                 the 2025 chapter.
 *
 * `chapter` ties each reading back to the chapter that earns it, so a layout can
 * place a reading beside its own paragraph instead of collecting four figures
 * into a scoreboard that belongs to no part of the story.
 */
export const READOUTS = [
  {
    id: "estimate",
    value: "6 months",
    label: "The estimate, 2018",
    note: "They thought it would take six months.",
    chapter: "problem",
  },
  { id: "accounts", value: "1M", label: "Accounts, 2021", note: "", chapter: "unifying" },
  { id: "uptime", value: "5+ years", label: "100% mainnet uptime", note: "", chapter: "now" },
  { id: "chains", value: "35+", label: "Chains connected", note: "", chapter: "intents" },
] as const;
