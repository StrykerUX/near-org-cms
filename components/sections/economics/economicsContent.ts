// Copy for /economics, out of the components.
//
// Same contract as `chain/chainContent.ts`: pure strings and arrays of objects,
// no JSX, no `Date`, no functions. Read by all three layouts (`a/`, `b/`, `c/`)
// so that comparing them compares LAYOUT and never copy — see the long note at
// the top of `foundation/foundationContent.ts`.
//
// ── Three fixes to the source deck, on purpose ─────────────────────────────
//
// The deck arrived with three typos in section 2 and 3 ("in teh work",
// "builders,applications, agentas", "a small fee is generated"). They are
// corrected here rather than transcribed, and this note is the record that the
// change was deliberate and not a paraphrase — nothing else in the deck was
// touched.

export const META = {
  title: "Economics",
  description:
    "NEAR is an economic system where real usage generates real revenue, and that value flows back to the network itself.",
} as const;

/** §1 — the hero. */
export const HERO = {
  eyebrow: "NEAR economics",
  headline: "An economy that grows stronger the more it's used",
  sub: "NEAR isn't just a blockchain, it's an economic system where real usage generates real revenue, and that value flows back to the network itself. The more people and applications build and transact on NEAR, the more the whole system compounds. Here's how it works.",
  primary: { label: "See the live numbers", href: "https://revenue.near.org" },
  secondary: { label: "How it works", href: "#how-it-works" },
} as const;

/**
 * §2 — the four structural facts.
 *
 * These are the page's foundation in the literal sense: they are the claims
 * that do not move, so nothing downstream has to be hedged. The order is
 * argued — supply, then issuance, then control, then time — and it runs from
 * the most checkable fact to the longest one.
 *
 * `figure` is the number a layout can set large on its own; `title` is the
 * claim. Two fields and not one because the dense layouts lead with the figure
 * and the editorial ones lead with the claim.
 */
export const MATURITY = {
  eyebrow: "What makes it mature",
  headline: "Built on a foundation that's already set",
  intro:
    "Most crypto economies are still works in progress, supply still unlocking, inflation still high, governance still centralized. NEAR has already crossed the thresholds that most never reach.",
  facts: [
    {
      id: "supply",
      index: "01",
      figure: "100%",
      figureLabel: "of supply in circulation",
      title: "Supply is fully unlocked",
      body: "Every NEAR token is already in circulation. No locked allocations waiting to flood the market, no vesting cliffs hanging over holders. What you see is the whole supply.",
    },
    {
      id: "inflation",
      index: "02",
      figure: "−50%",
      figureLabel: "maximum annual issuance",
      title: "Inflation has been halved",
      body: "NEAR's maximum annual issuance was permanently cut by 50%. Fewer new tokens created means less dilution over time, a deliberate step toward a leaner economy, with more plans in the works to move toward a deflationary, fixed supply.",
    },
    {
      id: "governance",
      index: "03",
      figure: "Onchain",
      figureLabel: "binding proposals, live",
      title: "Governance is live and onchain",
      body: "NEAR's economic decisions are made through House of Stake, an onchain governance system that's already passing binding proposals. The community steers the system, not a company.",
    },
    {
      id: "uptime",
      index: "04",
      figure: "5 yrs",
      figureLabel: "mainnet, 100% uptime",
      title: "Five years, zero downtime",
      body: "NEAR has run for over five years of continuous mainnet operation with 100% uptime. The economy described here isn't a plan, it's running on infrastructure that's already proven.",
    },
  ],
} as const;

/**
 * §3 — the flywheel.
 *
 * Four steps, and the order is the whole content: step 4 is only meaningful as
 * the thing that restarts step 1. Any layout that lets the reader take these
 * out of sequence has broken the section, which is why every one of the three
 * spends its structural device here.
 *
 * `short` is the step reduced to the phrase a diagram can carry next to a node.
 * It is not a summary of `body` — it is the label of the same beat.
 *
 * ── `intake` / `emits`, and why they are data ─────────────────────────────
 *
 * The instrument layout shows the loop as an apparatus with a reading of what
 * goes IN to the stage in view and what comes OUT of it. That pair is not a
 * restatement of `body`: it is the chain itself, because `intake` of each step
 * is verbatim the `emits` of the one before it, and `emits` of the last step is
 * the `intake` of the first. That is the section's one rule — step 4 only means
 * anything as the thing that restarts step 1 — expressed as a constraint the
 * data either satisfies or visibly does not.
 *
 * Both are read out of the paragraphs above and add no claim: fees are
 * generated by usage, a portion of that revenue buys NEAR, buybacks pull tokens
 * out of circulation, and a leaner economy brings more builders. Nothing here
 * asserts the deflationary crossing, which stays hedged in `steps[2].body` and
 * in `PROJECTION`.
 */
export const FLYWHEEL = {
  eyebrow: "How the economy works",
  headline: "The loop at the center of it all",
  intro:
    "Most blockchains don't capture much from the activity happening on them. When people trade, swap, and transact, the fees mostly go to middlemen, validators, bots, liquidity providers, while the network itself earns little. NEAR is built differently. Here's the loop that makes it work.",
  steps: [
    {
      id: "usage",
      index: "01",
      short: "Usage",
      intake: "Swaps, transfers, agent calls",
      emits: "Protocol fees",
      title: "Usage generates revenue",
      body: "Every time someone uses NEAR's infrastructure rails — swapping assets, moving value across chains, running AI agents — a small fee is generated. Nothing unusual so far; most systems charge fees. What's different is where those fees go next.",
    },
    {
      id: "revenue",
      index: "02",
      short: "Revenue",
      intake: "Protocol fees",
      emits: "NEAR bought on the market",
      title: "Revenue flows back to the network",
      body: "Instead of leaking out to intermediaries, that revenue flows back toward NEAR itself. A portion is used to buy NEAR — real demand, funded by real usage, not by printing new tokens.",
    },
    {
      id: "supply",
      index: "03",
      short: "Supply",
      intake: "NEAR bought on the market",
      emits: "Tokens out of circulation",
      title: "The supply tightens",
      body: "New tokens still enter circulation to secure the network, but usage-funded buybacks pull tokens back out. As usage grows, more is pulled back. Reach a high enough level of activity, and more tokens leave circulation than enter it, a point the system is designed to approach as it scales.",
    },
    {
      id: "base",
      index: "04",
      short: "A stronger base",
      intake: "Tokens out of circulation",
      emits: "More builders, apps and agents",
      title: "A stronger base attracts more usage",
      body: "A leaner, more transparent economy makes NEAR a more credible place to build and transact. More builders, applications, and agents bring more usage, which starts the loop again, one turn stronger.",
    },
  ],
  closing:
    "That's the flywheel: usage creates revenue, revenue reinforces the network, a stronger network attracts more usage. It doesn't depend on hype or speculation. It depends on people actually using the system.",
  /**
   * The fifth beat, for the layouts that show the loop overrunning its own
   * start instead of parking on step 4. A string and not a component-side
   * concatenation of `steps[0].short`: two layouts print it, and a phrase
   * assembled from a data field in one component and from another in the next
   * is the kind of thing that drifts silently.
   */
  restart: {
    label: "Usage, again",
    note: "The loop does not close and stop. It comes back round one turn stronger.",
  },
} as const;

/**
 * §3b — the two curves behind step 3, for the layouts that DRAW the loop's
 * supply beat instead of only stating it.
 *
 * Added here rather than written into a component for the reason the whole file
 * exists, and with one extra obligation: the copy above is careful to say the
 * system is "designed to approach" a point where more tokens leave circulation
 * than enter it. A chart is much better than a paragraph at accidentally
 * asserting that this has already happened, so the honesty has to be part of
 * the DATA and not a caption someone can drop while re-laying-out the section.
 * That is what `axisNote` and `note` are: not decoration, the terms on which the
 * figure is allowed to be drawn at all.
 *
 * There are no values here, and that is deliberate — the shape is the claim.
 */
export const PROJECTION = {
  eyebrow: "The supply beat, drawn",
  label: "Projection",
  headline: "Issuance down, buybacks up",
  seriesA: "New tokens issued",
  seriesB: "Tokens bought back by revenue",
  axisNote: "Both axes unscaled. Time runs left to right.",
  note: "Neither curve is a record of what happened. They are the shape the two lines are designed to take as usage grows, and the point where they meet is a threshold the system is built to approach — not one it has crossed.",
  source: { label: "See the live numbers", href: "https://revenue.near.org" },
} as const;

/** §4 — where the revenue comes from. Two products, not a taxonomy. */
export const PRODUCTS = {
  eyebrow: "Where the revenue comes from",
  headline: "Real products. Real revenue.",
  items: [
    {
      id: "intents",
      index: "01",
      name: "NEAR Intents",
      claim: "Settling billions in cross-chain value",
      body: "Intents lets anyone swap and move assets across dozens of chains by simply stating what they want. It's already settling billions in cross-chain volume, and every transaction generates fees that feed the loop. As more wallets, apps, and platforms plug in, that volume — and the revenue behind it — grows.",
      linkLabel: "Explore NEAR Intents",
      href: "/intents",
    },
    {
      id: "ai",
      index: "02",
      name: "NEAR AI",
      claim: "Powering the agent economy",
      body: "NEAR AI provides the confidential, verifiable infrastructure that AI applications and autonomous agents run on. As agents begin to transact, compute, and operate at scale, they pay for those services, and increasingly, they'll settle in NEAR. It's a second engine, pointed at one of the largest emerging markets in technology.",
      linkLabel: "Explore NEAR AI",
      href: "/near-ai",
    },
  ],
  tieBack:
    "These aren't side projects bolted onto a blockchain. They're the sources of the revenue that powers everything on this page, and they're built directly into the protocol, so the value they create stays in the system.",
} as const;

/**
 * §5 — the synthesis. One asset, three jobs.
 *
 * The three roles are the section's structure, so they are data and not a
 * sentence: every layout has to be able to set them apart, then show them
 * reinforcing each other. `reinforces` is the second half of each role's claim
 * and belongs to it, not to a separate paragraph.
 */
export const CENTER = {
  eyebrow: "Why NEAR sits at the center",
  headline: "One asset, holding it all together",
  intro:
    "Every part of this system — the products, the revenue, the governance — connects through a single asset: NEAR.",
  roles: [
    {
      id: "settlement",
      index: "01",
      role: "Settlement asset",
      body: "The thing value is ultimately settled in when assets move and agents transact.",
      reinforces: "More usage means more settlement in NEAR.",
    },
    {
      id: "unit",
      index: "02",
      role: "Unit of account",
      body: "The currency the network's own services are priced and paid in.",
      reinforces: "More products mean more services paid in NEAR.",
    },
    {
      id: "coordination",
      index: "03",
      role: "Coordination mechanism",
      body: "What secures the network, and what governance runs on.",
      reinforces: "More at stake means more reason to participate in governance.",
    },
  ],
  body: "Most tokens do one of these. NEAR does all three, and each reinforces the others. The asset isn't a bystander to the economy — it's the thing the economy is built around.",
  forward:
    "The agentic economy is just getting started. As it grows, more flows through NEAR, and the loop compounds.",
  cta: { label: "See the live numbers", href: "https://revenue.near.org" },
} as const;
