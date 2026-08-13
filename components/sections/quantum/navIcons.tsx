import type { SVGProps } from "react";

/**
 * Custom nav icons for the quantum rebuild's dropdown menus.
 *
 * Drawn rather than pulled from a library because the page has a specific
 * geometric language — hairline strokes, isometric planes, concentric rings,
 * solid nodes — and a stock icon set reads as a second vocabulary pasted on
 * top. These are built from the same parts the page already uses.
 *
 * Each one is a slightly ABSTRACT reading of its destination's description,
 * not a literal picture of the noun: "Chain Abstraction" is many nodes
 * resolving into one, not a chain; "History" is a timeline whose last marker
 * is the only filled one; "Quantum Security" is a key rotated inside the
 * ring field the page already draws.
 *
 * House rules, so additions stay coherent:
 *   · 24x24 canvas, 1.25 stroke, round caps and joins
 *   · `currentColor` throughout — the tile sets the colour, never the icon
 *   · one filled element at most, reserved for the subject of the idea
 */

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ── Products ────────────────────────────────────────────────────────────── */

/** near.com — many chains arriving at one interface. */
export const IconInterface = (p: IconProps) => (
  <Svg {...p}>
    <rect x="13.5" y="4.5" width="7" height="15" rx="2" />
    <path d="M3 8h7.5M3 12h7.5M3 16h7.5" />
  </Svg>
);

/** Intents — liquidity crossing in both directions. */
export const IconIntents = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 9h15l-3.5-3.5" />
    <path d="M21 15H6l3.5 3.5" />
  </Svg>
);

/** NEAR AI — inference sealed inside its container. */
export const IconAgents = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5l4.5 4.5L12 16.5 7.5 12z" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </Svg>
);

/* ── Stack ───────────────────────────────────────────────────────────────── */

/** Protocol — the settlement layer, as isometric planes. */
export const IconLayers = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l8.5 4.2L12 11.4 3.5 7.2z" />
    <path d="M3.5 12l8.5 4.2L20.5 12" />
    <path d="M3.5 16.8L12 21l8.5-4.2" />
  </Svg>
);

/** Chain Abstraction — many origins resolving into one destination. */
export const IconAbstraction = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="4.75" cy="5" r="1.6" />
    <circle cx="4.75" cy="12" r="1.6" />
    <circle cx="4.75" cy="19" r="1.6" />
    <path d="M6.5 5.7L17 11M6.5 12h10M6.5 18.3L17 13" />
    <circle cx="18.75" cy="12" r="2.4" fill="currentColor" stroke="none" />
  </Svg>
);

/** Quantum Security — one key rotated inside the ring field. */
export const IconQuantum = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <rect
      x="8.2"
      y="8.2"
      width="7.6"
      height="7.6"
      rx="1.2"
      transform="rotate(45 12 12)"
    />
  </Svg>
);

/* ── Resources · Build ───────────────────────────────────────────────────── */

/** Docs — two planes opening from a spine. */
export const IconDocs = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 7.2v13" />
    <path d="M12 7.2L4 5v13l8 2.2" />
    <path d="M12 7.2L20 5v13l-8 2.2" />
  </Svg>
);

/** Solutions — a field of cases with one chosen. */
export const IconSolutions = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect
      x="13.5"
      y="13.5"
      width="7"
      height="7"
      rx="1.5"
      fill="currentColor"
      stroke="none"
    />
  </Svg>
);

/* ── Resources · Learn ───────────────────────────────────────────────────── */

/** Research — a paper read closely. */
export const IconResearch = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <circle cx="12" cy="13" r="3.2" />
  </Svg>
);

/** Blog — a running column of writing. */
export const IconBlog = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 10h10M7 14h6" />
  </Svg>
);

/** Analytics — a live metric, with the latest point filled. */
export const IconAnalytics = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 19.5h17" />
    <path d="M6 15.5l4-4 3 3 4.5-6" />
    <circle cx="17.5" cy="8.5" r="1.6" fill="currentColor" stroke="none" />
  </Svg>
);

/* ── Resources · Connect ─────────────────────────────────────────────────── */

/** Brand — the form language itself: circle meeting square. */
export const IconBrand = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9.5" cy="12" r="6.2" />
    <rect x="9.5" y="5.8" width="11.2" height="12.4" rx="1.5" />
  </Svg>
);

/** Contact — a message folded. */
export const IconContact = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3.8 7.5L12 12.8l8.2-5.3" />
  </Svg>
);

/** Careers — a climb. */
export const IconCareers = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 20.5h17" />
    <path d="M6.5 17V13M12 17V8.5M17.5 17V4.5" />
  </Svg>
);

/* ── About · Fundamentals ────────────────────────────────────────────────── */

/** History — a timeline whose present is the solid marker. */
export const IconHistory = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12h18" />
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="2.4" fill="currentColor" stroke="none" />
  </Svg>
);

/** Roadmap — a route with the next stop ahead. */
export const IconRoadmap = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 19.5v-4a3 3 0 013-3h5a3 3 0 003-3v-4" />
    <circle cx="4.5" cy="19.5" r="1.8" />
    <circle cx="17.5" cy="5.5" r="2.4" fill="currentColor" stroke="none" />
  </Svg>
);

/** Economics — supply divided. */
export const IconEconomics = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9l7.8 4.5" />
  </Svg>
);

/* ── About · Ecosystem ───────────────────────────────────────────────────── */

/** NEAR Foundation — something held up by a base. */
export const IconFoundation = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 20.5h18" />
    <path d="M6.5 20.5V10L12 5l5.5 5v10.5" />
  </Svg>
);

/** Community — many around a centre. */
export const IconCommunity = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="4.5" r="1.8" />
    <circle cx="19.5" cy="12" r="1.8" />
    <circle cx="12" cy="19.5" r="1.8" />
    <circle cx="4.5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
  </Svg>
);

/** Governance — weight on both sides of a beam. */
export const IconGovernance = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5.5v15M5.5 20.5h13" />
    <path d="M4 10h16" />
    <circle cx="4" cy="10" r="1.9" />
    <circle cx="20" cy="10" r="1.9" />
  </Svg>
);
