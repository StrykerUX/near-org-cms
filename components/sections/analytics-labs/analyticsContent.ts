// Copy for /analytics, transcribed from the brief "NEAR Analytics — Page Layout
// & Copy". Flat data, no JSX — same contract as
// quantum-security-copy/quantumContent.ts, of which this is a sibling and not a
// fork: the three proposals explore ONE brief, so they share this shape and
// this file, and what changes between them is the composition, never the copy.
//
// THE NUMBERS ARE PLACEHOLDERS. The real page will pull them from an API; here
// they are plausible values frozen so the hierarchy can be designed. Each one
// is marked `placeholder: true` so nobody mistakes them for data, and so that
// the day the source is wired the compiler points at exactly what to replace.

export type Delta = {
  /** "24h" | "30d" — the window the change is measured over. */
  window: string;
  /** Sign of the change; `flat` when it does not move. */
  direction: "up" | "down" | "flat";
  /** Already formatted, without the sign: "2.4%". */
  value: string;
};

export type Stat = {
  id: string;
  label: string;
  /** Already formatted for display: "$1.24B". */
  value: string;
  /** Short qualifier under the label, optional. */
  note?: string;
  deltas: Delta[];
  /** Where the figure comes from, when that is public. */
  sourceHref?: string;
  placeholder: boolean;
};

// Five, in the brief's order. The brief also says: "Keep top 3 stats, if it
// feels crowded" — which is why each proposal picks how many it mounts and none
// of them assumes there are five.
export const CORE_STATS: Stat[] = [
  {
    id: "fees",
    label: "Total fees generated",
    value: "$41.8M",
    note: "All time, protocol-wide",
    deltas: [
      { window: "24h", direction: "up", value: "1.9%" },
      { window: "30d", direction: "up", value: "12.4%" },
    ],
    placeholder: true,
  },
  {
    id: "confidential-tvl",
    label: "Intents confidential TVL",
    value: "$312.6M",
    deltas: [
      { window: "24h", direction: "down", value: "0.8%" },
      { window: "30d", direction: "up", value: "23.1%" },
    ],
    placeholder: true,
  },
  {
    id: "intents-volume",
    label: "Intents all-time volume",
    value: "$4.72B",
    deltas: [
      { window: "24h", direction: "up", value: "3.2%" },
      { window: "30d", direction: "up", value: "18.7%" },
    ],
    placeholder: true,
  },
  {
    id: "shards",
    label: "Shards online",
    value: "6 / 6",
    note: "Nightshade sharding",
    deltas: [{ window: "30d", direction: "flat", value: "0" }],
    sourceHref: "https://nearblocks.io/",
    placeholder: true,
  },
  {
    id: "price",
    label: "NEAR price",
    value: "$2.87",
    deltas: [
      { window: "24h", direction: "up", value: "2.4%" },
      { window: "30d", direction: "down", value: "6.1%" },
    ],
    placeholder: true,
  },
];

// ── Hero ──────────────────────────────────────────────────────────────────
export const HERO = {
  title: "NEAR by the numbers",
  lead: "A live view of NEAR: network activity, revenue, and the tools and products built on top of it. Everything worth watching, in one place.",
  statusLabel: "All systems operational",
  /** Anchors to the status card further down the same page. */
  statusHref: "#network-health",
} as const;

// ── Card 3: revenue dashboard ─────────────────────────────────────────────
export const REVENUE = {
  eyebrow: "Revenue dashboard",
  title: "NEAR is earning revenue, in real time.",
  body: "Track fees, token burn, emissions, and more.",
  metricLabel: "Share of total fees captured as protocol revenue",
  metricValue: "48.2%",
  metricDelta: { window: "30d", direction: "up", value: "4.6%" } as Delta,
  ctaLabel: "Open revenue dashboard",
  ctaHref: "/revenue",
  placeholder: true,
} as const;

/** Sparkline series, normalised 0..1. Placeholder: 24 points, one per hour.
 * The shape matters (upward trend with noise), the values do not. */
export const REVENUE_SERIES = [
  0.32, 0.35, 0.31, 0.38, 0.42, 0.39, 0.45, 0.44, 0.5, 0.47, 0.55, 0.58, 0.54,
  0.61, 0.66, 0.63, 0.69, 0.74, 0.71, 0.78, 0.82, 0.79, 0.86, 0.91,
];

// ── Card 4: network status ────────────────────────────────────────────────
export type StatusTile = {
  id: string;
  label: string;
  state: "operational" | "degraded" | "down";
  /** 60-day uptime, already formatted. */
  uptime: string;
};

export const STATUS = {
  eyebrow: "Network health",
  /** Dynamic headline: the real page picks one based on the aggregate state. */
  titleOk: "No problems detected",
  titleIssue: "Investigating an issue",
  updatedLabel: "Last updated 14:20 UTC",
  ctaLabel: "Full status & history",
  ctaHref: "https://status.near.org",
  placeholder: true,
} as const;

export const STATUS_TILES: StatusTile[] = [
  { id: "mainnet", label: "NEAR Network (mainnet)", state: "operational", uptime: "99.98%" },
  { id: "rpc", label: "NEAR RPC (mainnet) · near.org", state: "operational", uptime: "99.95%" },
  { id: "testnet", label: "NEAR Network (testnet)", state: "operational", uptime: "99.71%" },
  { id: "nearblocks", label: "NEAR Blocks (mainnet)", state: "operational", uptime: "99.89%" },
];

// ── Section 5: third-party analytics ──────────────────────────────────────
export type Tool = {
  id: string;
  name: string;
  blurb: string;
  href: string;
  /** Domain, to show under the name in the variants that use it. */
  domain: string;
};

export const TOOLS_HEADER = {
  title: "Go deeper",
  lead: "NEAR lives across the best analytics and research platforms. Learn more below.",
} as const;

// Allium is left out at the brief's request ("Jeremy is working on getting
// proper coverage") — not an oversight.
export const TOOLS: Tool[] = [
  {
    id: "the-tie",
    name: "The Tie",
    blurb: "Institutional data, analytics, and research for digital assets",
    href: "https://terminal.thetie.io/networks/near",
    domain: "thetie.io",
  },
  {
    id: "blockworks",
    name: "Blockworks",
    blurb: "Research-grade network dashboards",
    href: "https://blockworks.com/analytics/near",
    domain: "blockworks.com",
  },
  {
    id: "artemis",
    name: "Artemis",
    blurb: "Industry investment metrics",
    href: "https://www.artemis.ai/company/NEAR",
    domain: "artemis.ai",
  },
  {
    id: "dune",
    name: "Dune",
    blurb: "Community-built onchain dashboards",
    href: "https://dune.com/blockchains/near",
    domain: "dune.com",
  },
  {
    id: "defillama",
    name: "DefiLlama",
    blurb: "Open-source data aggregator",
    href: "https://investors.defillama.com/near",
    domain: "defillama.com",
  },
  {
    id: "token-terminal",
    name: "Token Terminal",
    blurb: "Blockchain data",
    href: "https://tokenterminal.com/explorer/projects/near-protocol",
    domain: "tokenterminal.com",
  },
  {
    id: "pikespeak",
    name: "Pikespeak",
    blurb: "Third-party NEAR data & analytics platform",
    href: "https://pikespeak.ai/",
    domain: "pikespeak.ai",
  },
  {
    id: "yahoo-finance",
    name: "Yahoo Finance",
    blurb: "Stock quotes and live market data",
    href: "https://finance.yahoo.com/quote/NEAR-USD/",
    domain: "finance.yahoo.com",
  },
];

// ── Section 6: public products ────────────────────────────────────────────
export const PRODUCTS_HEADER = {
  title: "Get exposure to NEAR",
  lead: "Regulated products and vehicles offering NEAR exposure.",
  disclaimer:
    "Listing is informational only and not an endorsement or investment advice. Availability varies by jurisdiction.",
} as const;

export const SVRN = {
  name: "SVRN",
  lead: "Ensuring the power of technology remains under your control will require the right infrastructure and the right individuals.",
  ctaLabel: "Learn more",
  href: "https://svrn.net/",
} as const;

export type Product = {
  id: string;
  issuer: string;
  product: string;
  href: string;
  /** Which wrapper it trades under, for context without inventing copy. */
  kind: "ETP" | "Trust";
};

export const PRODUCTS_GRID_TITLE = "Active NEAR ETPs & Trusts";

export const PRODUCTS: Product[] = [
  {
    id: "bitwise",
    issuer: "Bitwise",
    product: "NEAR Staking ETP",
    href: "https://bitwiseinvestments.eu/products/bitwise-near-staking-etp/",
    kind: "ETP",
  },
  {
    id: "grayscale",
    issuer: "Grayscale",
    product: "NEAR Trust (GSNR)",
    href: "https://www.grayscale.com/funds/grayscale-near-trust",
    kind: "Trust",
  },
  {
    id: "21shares",
    issuer: "21Shares",
    product: "NEAR Staking ETP",
    href: "https://www.21shares.com/en-eu/product/near",
    kind: "ETP",
  },
  {
    id: "virtune",
    issuer: "Virtune",
    product: "Staked NEAR ETP",
    href: "https://www.virtune.com/en/product/near",
    kind: "ETP",
  },
  {
    id: "valour",
    issuer: "Valour",
    product: "NEAR SEK",
    href: "https://www.valour.com/en/products/valour-near",
    kind: "ETP",
  },
];

export const LEGAL = "For informational purposes only, not investment advice.";
