// Copy for the NEAR Foundation page, out of the components.
//
// Same contract as `quantum/quantumContent.ts` and `chain/chainContent.ts`:
// pure strings and arrays of objects, no JSX, no `Date`, no functions. The day
// this comes from the CMS the shape does not change.
//
// (Comments in this folder are in English, matching `components/sections/chain/`
// and `components/sections/quantum/` — see the language note in those READMEs.)
//
// ── One module, three layouts ──────────────────────────────────────────────
//
// `a/`, `b/` and `c/` are three ways to lay out THE SAME page, so they all read
// from here. That is the point of the split: when the three are compared side
// by side, any difference between them is a layout difference and never a copy
// difference. Editing a sentence here changes all three at once, which is what
// keeps the comparison honest.
//
// What is NOT here: the headlines that carry an `<Accent>` or a `<br />`. Moving
// those into data would mean choosing a schema for "text with an accented run",
// and that is a content-model decision rather than a refactor. Geometry and
// timing are not here either — those live next to the animation that reads them.

export const META = {
  title: "NEAR Foundation: Stewarding the Open Infrastructure for the Agent Economy",
  description:
    "NEAR Foundation is a Swiss nonprofit supporting a decentralized ecosystem building NEAR as the open infrastructure for the agent economy.",
} as const;

/** §1 — the hero. The H1 carries an accent, so it stays in the JSX. */
export const HERO = {
  eyebrow: "NEAR Foundation",
  headline: "Enabling community-driven innovation to benefit people around the world",
  sub: "NEAR Foundation is a Swiss nonprofit supporting the open infrastructure for the agent economy, where you own your assets, your intelligence, and your world. Our mandate is to place that infrastructure in the hands of the community it serves.",
} as const;

/**
 * §2 — the three pillars.
 *
 * `index` is not decoration: the three are read in order and the order is an
 * argument — what the Foundation IS, what it DOES, and what it is FOR. A layout
 * that reorders them breaks the sentence they make together.
 */
export const PILLARS = [
  {
    id: "nonprofit",
    index: "01",
    title: "Nonprofit",
    body: "A Swiss nonprofit foundation (Stiftung), legally bound to its purpose, operating with the transparency that structure demands.",
  },
  {
    id: "growth",
    index: "02",
    title: "Ecosystem growth",
    body: "We support the growth of the NEAR ecosystem, directing resources to the people and projects building on it rather than competing with them.",
  },
  {
    id: "decentralization",
    index: "03",
    title: "Decentralization",
    body: "We champion a decentralized, self-sufficient ecosystem, and work to devolve our own functions to it over time.",
  },
] as const;

/** §3 — the devolution thesis. The page's actual thesis, and its hardest claim. */
export const MISSION = {
  eyebrow: "Mission",
  headline: "Our goal is to make ourselves smaller",
  // Split into paragraphs at the deck's own turns so a layout can set them as
  // separate blocks without re-splitting a single string at render time.
  //
  // ── The last entry IS the kicker ─────────────────────────────────────────
  // Every layout sets the kicker apart, so the prose it comes out of must not
  // contain it as well: with the kicker buried at the end of the last paragraph
  // AND set large underneath, the reader meets the same sentence twice within
  // three lines and the second one reads as an editing mistake rather than as a
  // landing. So the sentence was cut out of its paragraph and left as the last
  // entry — layouts render `body.slice(0, -1)` as prose and `kicker` on its own.
  // `TRANSPARENCY` below follows the same convention, which is why both can be
  // laid out by the same code.
  body: [
    "Most organizations exist to grow. The NEAR Foundation exists to devolve. Our purpose is to support the ecosystem until it operates without us, moving functions and resources into the hands of the community and the decentralized infrastructure that carries them.",
    "This is what ownership means at the level of the network itself: NEAR is built to belong to the people who use it.",
    "We support the network. We do not control it, and by design we could not.",
  ],
  /** The line the whole section is built to land. Set apart by every layout. */
  kicker: "We support the network. We do not control it, and by design we could not.",
} as const;

/** §4 — the Stiftung. Legal facts, which is why the register goes flat and mono. */
export const TRANSPARENCY = {
  eyebrow: "Transparency",
  headline: "Transparency is at the heart of who we are",
  body: [
    "The NEAR Foundation is a Swiss Stiftung. It is neither simple nor flexible to operate, by design: Swiss jurisdiction imposes strict regulatory oversight, and a Stiftung is legally bound to pursue its purpose. Funds given to it cannot be removed for any reason except the fulfillment of that purpose.",
    "Transparency is not a value we chose. It is a condition of how we are built.",
  ],
  kicker: "Transparency is not a value we chose. It is a condition of how we are built.",
} as const;

/**
 * The legal record, as a record. Not a rewrite of the section above — it is the
 * same four facts stated as entries rather than as prose, which is what lets a
 * layout show the structure and the argument at the same time without saying
 * anything twice in the same register.
 */
export const STIFTUNG_FACTS = [
  { id: "form", term: "Legal form", value: "Stiftung (foundation)" },
  { id: "seat", term: "Jurisdiction", value: "Switzerland" },
  { id: "purpose", term: "Bound to", value: "Its stated purpose" },
  { id: "oversight", term: "Oversight", value: "Swiss regulatory authority" },
] as const;

/** §5 — the Council. */
export const COUNCIL = {
  eyebrow: "Governing body",
  headline: "The NEAR Foundation Council",
  body: "The NEAR Foundation Council is the governing body of the Foundation, responsible for its ultimate oversight and its most significant decisions. The Council is separate from the executive team, which the Council empowers to manage day-to-day operations and which reports back to it.",
  /**
   * The separation of powers, as two named bodies and the relation between
   * them. A layout can draw this; prose alone makes the reader hold both halves
   * in their head to see the loop.
   */
  bodies: [
    {
      id: "council",
      label: "Council",
      role: "Ultimate oversight and the most significant decisions.",
    },
    {
      id: "executive",
      label: "Executive team",
      role: "Day-to-day operations, empowered by the Council and reporting back to it.",
    },
  ],
  /**
   * The two verbs of the relation, as labels for the leg of a drawing that runs
   * each way. They are the deck's own words, pulled out of `body` so that a
   * layout drawing the loop does not have to hardcode them — the alternative
   * was two English strings living inside a component, which is exactly what
   * this module exists to prevent.
   */
  relation: { out: "empowers", back: "reports to" },
} as const;

/** §6 — how it operates. Three activities, deliberately few. */
export const OPERATIONS = {
  eyebrow: "How we operate",
  headline: "How the Foundation operates",
  intro:
    "As one of the larger nodes supporting a decentralized ecosystem, the Foundation limits itself to indirect support. Its primary lever is the financial resources in its treasury, and its operations are deliberately lightweight, directed at three activities.",
  activities: [
    {
      id: "allocate",
      index: "01",
      title: "Allocate resources",
      body: "Ensure financial resources are properly allocated and distributed throughout the ecosystem.",
    },
    {
      id: "support",
      index: "02",
      title: "Support ecosystem functions",
      body: "Support ecosystem-level functions that do not yet have a steward, from communication and coordination to governance infrastructure and education.",
    },
    {
      id: "champion",
      index: "03",
      title: "Champion decentralization",
      body: "Support the continuing devolution of functions and operations to the ecosystem itself.",
    },
  ],
} as const;

/** §7 — the ecosystem. */
export const ECOSYSTEM = {
  eyebrow: "The ecosystem",
  headline: "Built by an ecosystem, not a company",
  body: "Hundreds of applications, wallets, and protocols build on NEAR. The Foundation supports the ecosystem that builds them. The builders own what they make.",
  linkLabel: "Explore the ecosystem",
  href: "/ecosystem",
} as const;

/**
 * The names, set in type rather than in artwork.
 *
 * The deck asks to retain the dApps logo grid from the current site. This repo
 * has exactly five logo assets (`public/logos`), so a grid here would be five
 * real marks next to a dozen placeholders — the same problem `chain/ProofBand`
 * hit, and it is solved the same way: names in the page's own face are honest,
 * and at this size more legible than a wall of foreign logos at a dozen optical
 * weights. Swap in the real grid when the assets land; the section's shape does
 * not change.
 */
export const ECOSYSTEM_NAMES = [
  "Ref Finance",
  "Meteor Wallet",
  "Aurora",
  "Rainbow Bridge",
  "Bitte",
  "Mintbase",
  "Sweat Economy",
  "HERE Wallet",
  "Burrow",
  "Pikespeak",
  "Keypom",
  "Nearblocks",
] as const;

/** §8 — the close. */
export const CLOSING = {
  headline: "NEAR belongs to you",
  sub: "Join the community, or build a career at the Foundation.",
  primary: { label: "Join the community", href: "/community" },
  secondary: { label: "Careers", href: "https://careers.near.org" },
} as const;
