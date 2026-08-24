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
  // ⚠ `/ecosystem` NO EXISTE todavía — hoy es un 404. Es la URL que pide el
  // deck y la que la página tendrá, así que se deja escrita en vez de
  // desviarla a una ruta parecida: un link correcto que aún no resuelve se
  // arregla creando la página; uno desviado hay que acordarse de volver a
  // apuntar. Antes de publicar: crear la página o quitar este bloque.
  href: "/ecosystem",
} as const;

/**
 * The ecosystem, as twelve marks — five that exist and seven that do not.
 *
 * The deck asks to retain the dApps logo grid from the current site. The first
 * answer here was names set in type, on the grounds that this repo holds
 * exactly five logo assets and a grid would have been five real marks beside
 * seven blanks. `MediaFrame` is what changed the answer: a blank is no longer a
 * blank, it is a reserved cell carrying its own work order. So the grid can be
 * built today, at its real state — half served, half commissioned — which is
 * both more honest and more useful than twelve names in a typeface. The reader
 * sees the ecosystem; whoever produces the assets sees exactly what is missing.
 *
 * The five with `src` are NEAR case studies whose wordmarks are already in
 * `public/logos`. They are WORDMARKS and not symbols, which is why nothing
 * outside the frame repeats the name: the mark says it, and a name set beside
 * a mark that already reads as the name is the caption of a caption. Five of
 * the twelve names the deck listed came out to make room for them rather than
 * mapping a real file onto a project it does not depict.
 *
 * Still twelve, and that is load-bearing: `c/HandoffScene` sends the
 * Foundation's mass to twelve clusters and this section names twelve builders.
 * If this list ever changes length, `CLUSTERS` there has to follow it.
 */
export const ECOSYSTEM_MARKS = [
  { id: "ref-finance", name: "Ref Finance" },
  { id: "ledger", name: "Ledger", src: "/logos/ledger.png" },
  { id: "meteor-wallet", name: "Meteor Wallet" },
  { id: "aurora", name: "Aurora" },
  { id: "venice", name: "Venice", src: "/logos/venice.png" },
  { id: "rainbow-bridge", name: "Rainbow Bridge" },
  { id: "abound", name: "Abound", src: "/logos/abound.png" },
  { id: "mintbase", name: "Mintbase" },
  { id: "sweat-economy", name: "Sweat Economy" },
  { id: "brave", name: "Brave", src: "/logos/brave.png" },
  { id: "burrow", name: "Burrow" },
  { id: "zodl", name: "ZODL", src: "/logos/zodl.png" },
] as const;

/**
 * Four reserved portraits, and deliberately not the Council.
 *
 * The section above declares a governing body and an executive team and shows
 * no one, which on the one page arguing that transparency is structural rather
 * than chosen is the contradiction the section itself names. So the portraits
 * get a place. What they do NOT get is invented people: the deck does not say
 * how many members the Council has, and making up a roster on this page would
 * be fabricating the record it claims to keep.
 *
 * Four slots, therefore — a count chosen because it composes at every
 * breakpoint (4 · 2 · 1) and for no other reason. When the real roster lands,
 * this array becomes the people, each entry gains a `src` and a name, and no
 * layout changes.
 *
 * `label` and `spec` are a work order and not page copy — they are what
 * `MediaFrame` prints inside the reserved cell for whoever produces the asset,
 * and they disappear the moment `src` arrives. They are still written in
 * ENGLISH, like everything else that reaches the screen: a placeholder is
 * temporary, but it is on the page today and the page has one language.
 */
export const COUNCIL_PORTRAITS = [
  { id: "seat-01", label: "Council member 01 — portrait", spec: "1200×1600 · JPG" },
  { id: "seat-02", label: "Council member 02 — portrait", spec: "1200×1600 · JPG" },
  { id: "seat-03", label: "Council member 03 — portrait", spec: "1200×1600 · JPG" },
  { id: "seat-04", label: "Executive team — portrait", spec: "1200×1600 · JPG" },
] as const;

/** §8 — the close. */
export const CLOSING = {
  headline: "NEAR belongs to you",
  sub: "Join the community, or build a career at the Foundation.",
  primary: { label: "Join the community", href: "/community" },
  secondary: { label: "Careers", href: "https://careers.near.org" },
} as const;
