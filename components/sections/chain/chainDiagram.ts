// The geometry behind `CapabilityStack`'s figure.
//
// Pure module: numbers and path strings, no JSX and no GSAP. It exists so the
// SVG layer and the HTML label layer are laid out from ONE source — they are
// two coordinate systems drawing the same picture, and the moment each carries
// its own copy of the ring radius they drift apart at the first edit.
//
// This is mechanism, not content, which is why it is here and not in
// `chainContent.ts` (see the table in components/sections/README.md).

/**
 * Every trig-derived number below is rounded through this before it reaches the
 * DOM, and that is not cosmetic — it is a hydration fix.
 *
 * `Math.sin`/`Math.cos` are explicitly NOT required by the ECMAScript spec to be
 * correctly rounded, so Node and the browser are allowed to disagree in the last
 * ulp — and they do. The server rendered `cy="495.7217412552831"` while the
 * client computed `495.72174125528306`, React compared the two strings, and the
 * whole client tree failed to hydrate with "some attributes of the server
 * rendered HTML didn't match".
 *
 * Four decimals is far below a pixel at any size this figure is drawn, and it is
 * identical on both sides no matter whose libm is underneath.
 */
const round = (n: number) => Math.round(n * 1e4) / 1e4;

/** The figure is square; every coordinate below is in these units. */
export const SIZE = 600;
export const C = SIZE / 2;

/** Where the satellites sit. Leaves room for the labels outside the ring. */
export const R_RING = 226;
/** The account mark at the centre. */
export const R_CORE = 34;

/** Twelve is the most that keeps the labels apart at the narrowest layout. */
export const SATELLITE_LABELS = [
  "BTC", "ETH", "SOL", "XRP", "DOGE", "ADA",
  "AVAX", "DOT", "ATOM", "TON", "SUI", "ARB",
] as const;

export type Satellite = {
  label: string;
  /** Radians, measured from twelve o'clock, clockwise. */
  angle: number;
  x: number;
  y: number;
  /** Percentages of the box, for the HTML label layer. */
  leftPct: number;
  topPct: number;
  /** Which side of its node the label hangs on, so it never sits over the ring. */
  align: "start" | "end" | "center";
};

export const SATELLITES: Satellite[] = SATELLITE_LABELS.map((label, i) => {
  const angle = (i / SATELLITE_LABELS.length) * Math.PI * 2 - Math.PI / 2;
  const x = round(C + Math.cos(angle) * R_RING);
  const y = round(C + Math.sin(angle) * R_RING);
  // The label is pushed a further 30 units out along the same spoke, so every
  // label clears its node by the same amount regardless of where it sits.
  const lx = C + Math.cos(angle) * (R_RING + 30);
  const ly = C + Math.sin(angle) * (R_RING + 30);
  const cos = Math.cos(angle);

  return {
    label,
    angle,
    x,
    y,
    leftPct: round((lx / SIZE) * 100),
    topPct: round((ly / SIZE) * 100),
    // Near the vertical axis the label is centred over the node; elsewhere it
    // hangs away from the centre so it reads outward.
    align: Math.abs(cos) < 0.25 ? "center" : cos > 0 ? "start" : "end",
  };
});

/** Centre → satellite. The spokes are straight, so a token can travel one with a plain x/y tween. */
export const SPOKES = SATELLITES.map((s) => `M ${C} ${C} L ${s.x} ${s.y}`);

// ── Beat 2: the solver race ────────────────────────────────────────────────
// Three candidate routes from one satellite to the centre. They are curves and
// not spokes on purpose: a solver's route is not the direct line, and three
// straight lines between the same two points would be one line.
export const RACE_FROM = 2; // SOL, on the right — clear of the text column
const BOW = [-92, 34, 118]; // how far each route bows off the direct line

export const RACE_PATHS = BOW.map((bow) => {
  const s = SATELLITES[RACE_FROM];
  const mx = (s.x + C) / 2;
  const my = (s.y + C) / 2;
  // Perpendicular to the direct line, so the bow is symmetric about it.
  const nx = -(C - s.y) / R_RING;
  const ny = (C - s.x) / R_RING;
  return `M ${s.x} ${s.y} Q ${round(mx + nx * bow)} ${round(my + ny * bow)} ${C} ${C}`;
});

/** The route that wins. Index into `RACE_PATHS`. */
export const RACE_WINNER = 1;

// ── Beat 3: the native move ────────────────────────────────────────────────
// One asset, satellite → centre → satellite. Two straight legs, so the token is
// animated with x/y and needs no motion-path plugin.
export const MOVE_FROM = 5;
export const MOVE_TO = 9;
