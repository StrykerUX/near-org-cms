// Copy for /community, out of the components.
//
// Same contract as `chain/chainContent.ts`: pure strings and arrays of objects,
// no JSX, no `Date`, no functions. Read by all three layouts (`a/`, `b/`, `c/`)
// so comparing them compares LAYOUT and never copy.
//
// ── Three things here are PLACEHOLDERS, and they are marked ────────────────
//
// This is the one page in the set whose content is partly live data, and the
// deck says so: the stats bar arrived as `{X}+`, and the events feed is meant to
// come from a Luma calendar. A layout cannot be judged against `{X}` — an
// unstyled brace where a figure goes makes every stat treatment look broken —
// so the placeholders carry shaped values and are flagged at each definition.
//
// Before this page ships: replace `STATS`, replace `EVENTS` with a real feed,
// and verify every URL in `SOCIALS`. Nothing else on the page is provisional.

export const META = {
  title: "Community",
  description:
    "NEAR is built in the open by a global community of developers, creators, and contributors.",
} as const;

/** §1 — the hero. */
export const HERO = {
  eyebrow: "Community",
  headline: "The people building the open web",
  sub: "NEAR is built in the open by a global community of developers, creators, and contributors. Join the Legion, find your local crew, and help build the user-owned internet.",
  primary: { label: "Get involved", href: "#get-involved" },
  secondary: { label: "See upcoming events", href: "#events" },
} as const;

/**
 * §2 — the stats bar.
 *
 * ⚠ PLACEHOLDER FIGURES. The deck specifies `{X}+ Contributors · {X}+ Countries ·
 * {X}+ Builder groups · {X}+ Events / year` and says "fill with real figures".
 * These four are shaped stand-ins so the treatment can be evaluated; none of
 * them is a claim. Replace before publishing.
 */
export const STATS = [
  { id: "contributors", value: "4,000+", label: "Contributors" },
  { id: "countries", value: "70+", label: "Countries" },
  { id: "groups", value: "60+", label: "Builder groups" },
  { id: "events", value: "300+", label: "Events a year" },
] as const;

/**
 * The line that keeps the figures from being four numbers floating on a rule.
 *
 * "4,000+" with the single word "Contributors" under it is the genre default,
 * and the genre default is unreadable: over what period, counted how, as of
 * when. One line of provenance under the row answers all three and costs a
 * caption.
 *
 * ⚠ PLACEHOLDER, and it moves WITH `STATS` — if the real figures turn out to be
 * all-time rather than trailing-twelve-month, this sentence is wrong before the
 * numbers are.
 */
export const STATS_NOTE =
  "Trailing twelve months, counted across the events calendar, the contributor programme, and the ecosystem repos. Updated quarterly.";

/** §3 — events. */
export const EVENTS = {
  eyebrow: "Events",
  headline: "Where the community meets",
  sub: "Hackathons, meetups, and builder nights happening around the world.",
  primary: { label: "View all events", href: "https://lu.ma/near" },
  secondary: { label: "Hosting something? Get it listed", href: "/contact-us" },
} as const;

/**
 * The shape of one row of the events feed.
 *
 * Declared here and not in a section because it is a CONTRACT between the
 * source (a Luma calendar, one day) and the three layouts that render it. All
 * three take `readonly CommunityEvent[]` as their only prop, so swapping the
 * sample list below for a real fetch in `page.tsx` touches nothing else.
 *
 * `dateLabel` is a formatted string and never a `Date` — see the sections
 * contract in `../README.md` and `../types.ts`.
 */
export type CommunityEvent = {
  id: string;
  dateLabel: string;
  title: string;
  city: string;
  kind: string;
  href: string;
  /**
   * The event's photograph, when there is one.
   *
   * Optional, and it stays optional forever: a Luma event has a cover image and
   * a meetup announced yesterday often does not. The layouts that render a
   * picture per event pass this straight to `MediaFrame`'s `src`, so an event
   * without one shows the reserved frame with its own commission written in it
   * — the same cell, the same height, nothing to lay out twice.
   *
   * ⚠ The day the Luma calendar is wired, THIS is the field its cover image
   * lands in. Nothing else about the sections has to change: the photo arrives
   * with the event, and the frames stop being frames one row at a time.
   */
  image?: string;
};

/**
 * ⚠ PLACEHOLDER FEED. The real page pulls this from the community Luma
 * calendar; a section cannot fetch (see the sections contract), so the feed
 * arrives as props from `page.tsx` the day it is wired. The shape below IS that
 * prop shape — `dateLabel` already formatted, never a `Date` — so wiring it is
 * swapping the source, not reworking the section.
 */
export const SAMPLE_EVENTS = [
  {
    id: "1",
    dateLabel: "Sep 04",
    title: "NEAR Builder Night",
    city: "Lisbon",
    kind: "Meetup",
    href: "https://lu.ma/near",
  },
  {
    id: "2",
    dateLabel: "Sep 12",
    title: "Agents & Intents Hack",
    city: "Bengaluru",
    kind: "Hackathon",
    href: "https://lu.ma/near",
  },
  {
    id: "3",
    dateLabel: "Sep 19",
    title: "NEAR on Campus kickoff",
    city: "Lagos",
    kind: "Campus",
    href: "https://lu.ma/near",
  },
  {
    id: "4",
    dateLabel: "Sep 26",
    title: "Chain Abstraction workshop",
    city: "Buenos Aires",
    kind: "Workshop",
    href: "https://lu.ma/near",
  },
  {
    id: "5",
    dateLabel: "Oct 03",
    title: "Legion regional call",
    city: "Online",
    kind: "Call",
    href: "https://lu.ma/near",
  },
] as const;

/**
 * §3b — the strip of places. Only `c/` uses it.
 *
 * There is no list of cities here on purpose. The strip is fed by the events
 * feed itself (`SAMPLE_EVENTS` today, Luma tomorrow), so it cannot claim a city
 * the calendar does not have, and it grows on its own the day the real feed
 * lands. `note` says exactly that, which is what keeps a scrolling list of five
 * places from reading as a claim about the whole community.
 */
export const CITIES = {
  eyebrow: "On the ground",
  note: "Every city on the calendar for the next few weeks.",
} as const;

/**
 * §3c — the page's one drawn figure, in all three layouts.
 *
 * The geometry, the projection and the coordinate table live in `cityField.ts`;
 * only the words are here. The caption is shared across the three variants on
 * purpose, like every other string in this module: the three treatments differ
 * in size, ground and density, and if they also differed in what they CLAIMED
 * the comparison would stop being about layout.
 *
 * The caption's second sentence is the figure's whole licence. A field of dots
 * behind a handful of cities looks like a map, and a map implies land, borders
 * and coverage this page is not claiming. Saying "graticule, not a coastline"
 * costs one line and makes the drawing honest.
 */
export const CITY_FIELD = {
  caption:
    "The calendar's cities, at their real coordinates. The field behind them is the graticule — a grid of latitude and longitude, not a coastline.",
  /** Prefix for the cities the coordinate table cannot place. "Online" is one. */
  unplaced: "Not a place",
} as const;

/**
 * §4 — the Legion.
 *
 * The deck asks for a wide, prominent placement, and all three layouts honour
 * that differently — it is the clearest single axis on which they can be
 * compared, so none of them treats it as one more card in a row.
 */
export const LEGION = {
  eyebrow: "The Legion",
  headline: "Join the Legion",
  body: "The Legion is NEAR's community of contributors — the people who host events, onboard builders, create content, and represent NEAR in their region. Get support, resources, and a direct line to the Foundation.",
  cta: { label: "Join the Legion", href: "https://legion.near.org" },
  /** ⚠ PLACEHOLDER — same status as `STATS`. */
  statLine: "1,200 members across 70 countries.",
} as const;

/**
 * §5 — the channels.
 *
 * ⚠ VERIFY THE URLS before publishing. The deck gave handles, not links; these
 * are the canonical destinations for those handles and each one needs a check.
 */
export const SOCIALS = {
  eyebrow: "Channels",
  headline: "Join the conversation",
  sub: "Wherever you already hang out, NEAR is there.",
  channels: [
    {
      id: "x",
      name: "X",
      handle: "@NEARProtocol",
      body: "News, launches, and community signal.",
      href: "https://x.com/nearprotocol",
    },
    {
      id: "discord",
      name: "Discord",
      handle: "Join server",
      body: "Real-time chat, support, and dev help.",
      href: "https://near.chat",
    },
    {
      id: "telegram",
      name: "Telegram",
      handle: "Join",
      body: "Announcements and regional groups.",
      href: "https://t.me/cryptonear",
    },
    {
      id: "github",
      name: "GitHub",
      handle: "View repos",
      body: "The code. Contribute and file issues.",
      href: "https://github.com/near",
    },
    {
      id: "reddit",
      name: "Reddit",
      handle: "r/nearprotocol",
      body: "Long-form discussion and showcases.",
      href: "https://reddit.com/r/nearprotocol",
    },
    {
      id: "youtube",
      name: "YouTube",
      handle: "Subscribe",
      body: "Talks, tutorials, and recordings.",
      href: "https://youtube.com/@NEARProtocol",
    },
    {
      id: "farcaster",
      name: "Farcaster",
      handle: "Follow",
      body: "Onchain-native community chatter.",
      href: "https://farcaster.xyz/near",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      handle: "Follow",
      body: "Ecosystem and career updates.",
      href: "https://linkedin.com/company/near-protocol",
    },
  ],
} as const;

/**
 * §5b — the channels, grouped by what you would go there TO DO.
 *
 * Only `c/` uses this. Eight channels listed flat is a menu that makes the
 * reader do the sorting: they know they want help, or want to read code, or
 * want to follow along, and a flat list makes them infer which of eight
 * destinations answers that. Three groups answer it before they read a single
 * handle.
 *
 * Membership is by `id` rather than by nesting the channel objects, so
 * `SOCIALS.channels` stays the single list — a channel cannot be edited in one
 * place and stale in the other, and `a/` and `b/` keep rendering all eight
 * without knowing this exists.
 *
 * Every channel appears exactly once: 3 + 2 + 3.
 */
export const CHANNEL_GROUPS = [
  {
    id: "talk",
    label: "Talk to someone",
    note: "Ask a question, get an answer the same day.",
    channelIds: ["discord", "telegram", "reddit"],
  },
  {
    id: "build",
    label: "Build and learn",
    note: "The code, and the people explaining it.",
    channelIds: ["github", "youtube"],
  },
  {
    id: "follow",
    label: "Follow along",
    note: "The feed, wherever you already read one.",
    channelIds: ["x", "farcaster", "linkedin"],
  },
] as const;

/** §6 — ways to get involved. Four doors, each with a real destination. */
export const INVOLVEMENT = {
  eyebrow: "Get involved",
  headline: "Bring your ideas to life",
  ways: [
    {
      id: "host",
      index: "01",
      title: "Host an event",
      body: "Run a meetup, hackathon, or builder night with support from the Foundation.",
      linkLabel: "Apply to host",
      href: "/contact-us",
    },
    {
      id: "campus",
      index: "02",
      title: "NEAR on Campus",
      body: "Lead student builders at your university.",
      linkLabel: "Learn more",
      href: "/contact-us",
    },
    {
      id: "code",
      index: "03",
      title: "Contribute code",
      body: "Ship to the protocol and ecosystem repos.",
      linkLabel: "Start on GitHub",
      href: "https://github.com/near",
    },
    {
      id: "content",
      index: "04",
      title: "Create content",
      body: "Write, stream, or teach and get amplified.",
      linkLabel: "Get involved",
      href: "/contact-us",
    },
  ],
} as const;

/**
 * §7 — the FAQ.
 *
 * The deck lists seven questions and no answers. Written here, short, because a
 * layout cannot be judged on an accordion of empty rows — and because an
 * accordion whose answers are one line each is a different design problem from
 * one whose answers are three paragraphs. Review the wording with the community
 * team; the questions are the deck's, verbatim.
 */
export const FAQ = {
  eyebrow: "Questions",
  headline: "Before you ask",
  items: [
    {
      id: "start",
      title: "How do I get started building on NEAR?",
      body: "Start with the docs — they take you from a first contract to a deployed app. When you get stuck, the Discord dev channels are the fastest place to get unstuck.",
    },
    {
      id: "legion",
      title: "What is the Legion and how do I join?",
      body: "The Legion is NEAR's contributor program: the people who host events, onboard builders, and represent NEAR in their region. Applications are open, and you do not need to be a developer to join.",
    },
    {
      id: "local",
      title: "How do I find or start a community group in my city?",
      body: "Check the events calendar for a group near you. If there isn't one, tell the community team — starting a group is the most common way people begin.",
    },
    {
      id: "support",
      title: "Can NEAR support my event or hackathon?",
      body: "Yes. The Foundation supports community events with resources, speakers, and funding. Apply through the contact form with your dates and format.",
    },
    {
      id: "help",
      title: "Where do I get technical help?",
      body: "Discord for real-time help, the docs for reference, and GitHub issues for anything that looks like a bug in the protocol or the tooling.",
    },
    {
      id: "featured",
      title: "How can I get my project featured?",
      body: "Ship something and tell us about it. Projects get featured across NEAR's channels, in ecosystem roundups, and at community events.",
    },
    {
      id: "reach",
      title: "How do I reach the community team?",
      body: "The contact form reaches them directly, and so does the community channel on Discord.",
    },
  ],
} as const;

/** §8 — the close, and the newsletter. */
export const CLOSING = {
  headline: "Start building the open web",
  sub: "Pick a channel, join the Legion, or come to an event — however you want in.",
  primary: { label: "Get involved", href: "#get-involved" },
  secondary: { label: "Read the docs", href: "https://docs.near.org" },
  newsletter: {
    title: "Community in your inbox",
    body: "Monthly highlights: events, featured builds, and ways to get involved.",
    cta: "Subscribe",
    // `ShineField` paints its own placeholder and needs a real accessible label
    // (the placeholder disappears on the first keystroke). Both are copy, so
    // both live here rather than as literals inside three closing sections.
    placeholder: "email address",
    fieldLabel: "Email address",
  },
} as const;
/**
 * The photography this page reserves space for — every commission in one place.
 *
 * ── These labels are rendered, so they are in English ──────────────────────
 *
 * A `MediaFrame` prints its label inside the reserved area, in mono, under the
 * registration marks. It is scaffolding — it disappears the instant a `src`
 * arrives — but it is scaffolding the reader can see, on an English page, so it
 * is written in English like everything else that reaches the screen. The
 * comments in these folders are the only thing here written for the editor
 * rather than the browser.
 *
 * ── Why they are here and not written into the components ──────────────────
 *
 * The community team needs one list to go shooting with. Spread across nine
 * components in three variant folders, "what photos do we need" is a grep; here
 * it is a block you read top to bottom, and the README's asset table is
 * transcribed from it. It is also how the same commission stays the same
 * commission across A, B and C — the Legion group shot is ONE photograph the
 * three layouts crop differently, not three requests.
 *
 * ── How to write one ───────────────────────────────────────────────────────
 *
 * A label has to be enough for somebody to go and take the picture: what is in
 * frame, how wide, and what it has to show. "Event photo" is not a commission.
 * Nothing here is decorative and nothing is stock — this is the one page on the
 * site whose subject can genuinely be photographed.
 */
export const MEDIA = {
  /**
   * The page's most important asset by a distance. The Legion is the primary
   * conversion and it is currently a paragraph asking people to join something
   * they have never seen; a wide shot of an actual room of actual people is
   * what makes the ask credible. All three layouts give it their biggest slot,
   * at three different crops of the same photograph.
   */
  legion: {
    label:
      "The Legion together — wide group shot at a regional event, 40+ people, faces to camera and recognisable",
    spec: "2800×1200 · JPG",
  },

  /**
   * The lead photograph of an events block. Its label is BUILT FROM THE FEED
   * (`title` + `city` + this suffix), so the commission can never ask for a
   * photograph of an event the page does not list, and it re-points itself the
   * day the Luma calendar replaces the sample. Same discipline as
   * `RallyCities` deriving its strip from the feed instead of a hand-written
   * list of impressive places.
   */
  eventsLead: {
    suffix: "— wide shot of the full room, lead image for the section",
    spec: "2000×800 · JPG",
  },

  /** The per-event picture, for the layout that gives every row one. */
  eventRow: {
    suffix: "— event photo, room or stage",
    spec: "1200×675 · JPG",
  },

  /**
   * The four doors. Four small pictures, one per way in, and the point of them
   * is DIFFERENTIATION: four paragraphs under four headings read as one thing
   * said four times, and four pictures of four visibly different activities do
   * not. Keys match `INVOLVEMENT.ways[].id`.
   */
  ways: {
    host: {
      label:
        "Host an event — someone presenting on their feet to about 30 people, borrowed room, late-afternoon light",
      spec: "1200×900 · JPG",
    },
    campus: {
      label:
        "NEAR on Campus — long table of students with laptops in a lecture room or library, shot on the diagonal",
      spec: "1200×900 · JPG",
    },
    code: {
      label:
        "Contribute code — close shot of a screen with an open pull request on a NEAR repo, hands in frame",
      spec: "1200×900 · JPG",
    },
    content: {
      label:
        "Create content — someone recording a stream or a workshop, with the camera or the mic inside the frame",
      spec: "1200×900 · JPG",
    },
  },
} as const;

/**
 * §9 — the chrome the instrument layout prints on its panels.
 *
 * Only `b/` reads this. A `Panel` carries two mono strings in its top corners —
 * the identity of the apparatus on the left, its reading on the right — and
 * both are rendered text, so they live here with the rest of the copy rather
 * than as literals inside six sections. Same precedent as `CHANNEL_GROUPS` and
 * `CITIES`, which only `c/` reads.
 *
 * ── `state.meta` is load-bearing and is not a joke ─────────────────────────
 *
 * A dark panel with four figures in it looks like a dashboard, and a dashboard
 * implies a live feed. These four numbers are placeholders (see `STATS`) and
 * even the real ones will be a quarterly count, so the panel says so out loud
 * in the corner where a real instrument would print its status. It is the
 * cheapest possible defence against the one misreading this treatment invites.
 */
export const INSTRUMENT = {
  /** The routing index in the hero. Labels come from each section's eyebrow. */
  index: "Jump to",
  state: {
    label: "Community · state",
    meta: "Declared figures · not telemetry",
  },
  schedule: {
    label: "Calendar",
    meta: "In feed order · next entries",
  },
  /**
   * Not a panel label: the three channel groups each carry their own, so this
   * one runs as a footnote under the row. It is the line that keeps "eight" a
   * checkable claim — if a ninth channel is ever added without being filed into
   * a group, this is the sentence that goes wrong first.
   */
  channels: {
    meta: "Eight destinations · each filed once",
  },
  doors: {
    label: "Get involved · four inputs",
    meta: "Each one ends in a link",
  },
  faq: {
    label: "Questions",
    meta: "Open one",
  },
  close: {
    label: "Community · close",
    meta: "Pick a door",
  },
} as const;
