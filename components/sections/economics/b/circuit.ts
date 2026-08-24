// Geometry for the four-stage circuit in `LoopBench`.
//
// ── Why a circuit with volume and not a second ring ────────────────────────
//
// Variant A already draws this loop, and it draws it as one hairline circle:
// four positions on a single stroke on ink. That figure is right for an
// editorial page and it is the whole reason A works. Repeating it here in a
// darker box would make B "A painted black", which is the one outcome this
// variant is not allowed to have.
//
// So B draws the same claim as an APPARATUS. The four steps are four stations
// standing on a ground plane, the thing that connects them is a conduit with a
// measurable width instead of a line, and what travels is visible inside it. A
// ring says "cycle" before it says what moves; a duct with a carrier in it says
// what moves first and lets "cycle" follow from the fact that it closes. That
// is the difference between a metaphor and a machine, and B is the machine.
//
// ── The projection ─────────────────────────────────────────────────────────
//
// A 2:1 isometric-ish plane: the loop is a square duct seen from above at an
// angle, so its four legs are the four sides of a rhombus. Deliberately NOT the
// cube field of `/prototype/protocol-a` — same lighting and weight, different
// object. The client asked for one graphic vocabulary per page, and a second
// isometric cube grid would read as the protocol page in another colour.
//
// ── Everything is a module constant, and rounded ──────────────────────────
//
// House rule (`a/loopRing.ts`, `chain/chainDiagram.ts`): the JSX renders these
// and the timeline positions against them, so a number living in only one of
// the two drifts the first time the box changes. Values are rounded to four
// decimals because `Math` trig is not required to be correctly rounded and Node
// and the browser then disagree in the last ulp, which fails hydration for the
// entire client tree.

export const W = 560;
export const H = 430;

const CX = W / 2;
/** The ground plane sits low in the box: the stations stand UP out of it. */
const CY = 250;

/** Half-diagonals of the loop on the ground. 2:1 is the isometric ratio. */
const RX = 178;
const RY = 89;

/** How far a station's top face floats above its footprint. */
const LIFT = 34;
/** Half-width of a station's footprint, and its 2:1 half-depth. */
const SW = 30;
const SH = SW / 2;

/** Half-width of the conduit, measured on the ground plane. */
const BAND = 7;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

export type Corner = "top" | "right" | "bottom" | "left";

/** Clockwise from the top — the reading order of the four steps. */
const CORNERS: Corner[] = ["top", "right", "bottom", "left"];

const FOOT = [
  { x: CX, y: CY - RY },
  { x: CX + RX, y: CY },
  { x: CX, y: CY + RY },
  { x: CX - RX, y: CY },
];

/**
 * Where each station's label hangs, relative to its footprint.
 *
 * A table and not one radial push factor: the blocks stand UP out of the plane,
 * so a single outward offset that clears the top station's block drives the
 * bottom station's label straight through its own. Each corner needs its own
 * escape direction, and writing them out is shorter than the formula that would
 * have to special-case two of the four.
 */
const LABEL_OFFSET = {
  top: { dx: 0, dy: -(LIFT + 30) },
  right: { dx: SW + 20, dy: -(LIFT * 0.5) },
  bottom: { dx: 0, dy: SH + 26 },
  left: { dx: -(SW + 20), dy: -(LIFT * 0.5) },
} as const;

export type Station = {
  corner: Corner;
  /** Centre of the footprint on the ground plane. */
  x: number;
  y: number;
  /** The three visible faces of the standing block. */
  topFace: string;
  leftFace: string;
  rightFace: string;
  /** Where the conduit meets this station, in and out. */
  labelLeftPct: number;
  labelTopPct: number;
  labelAlign: "center" | "start" | "end";
};

const ALIGN = {
  top: "center",
  right: "start",
  bottom: "center",
  left: "end",
} as const;

const poly = (pts: readonly (readonly [number, number])[]) =>
  pts.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");

export const STATIONS: Station[] = FOOT.map((f, i) => {
  const corner = CORNERS[i];
  // Footprint rhombus, then the same rhombus lifted. The two side faces are
  // what carry the depth: without them the block is a flat diamond and the
  // figure goes back to being a line drawing.
  const n: [number, number] = [f.x, f.y - SH];
  const e: [number, number] = [f.x + SW, f.y];
  const s: [number, number] = [f.x, f.y + SH];
  const w: [number, number] = [f.x - SW, f.y];
  const up = ([x, y]: [number, number]): [number, number] => [x, y - LIFT];

  return {
    corner,
    x: round(f.x),
    y: round(f.y),
    topFace: poly([up(n), up(e), up(s), up(w)]),
    leftFace: poly([w, s, up(s), up(w)]),
    rightFace: poly([s, e, up(e), up(s)]),
    labelLeftPct: round(((f.x + LABEL_OFFSET[corner].dx) / W) * 100),
    labelTopPct: round(((f.y + LABEL_OFFSET[corner].dy) / H) * 100),
    labelAlign: ALIGN[corner],
  };
});

/**
 * One leg per gap: `LEGS[i]` runs from station `i` to station `i + 1`, and the
 * fourth closes back onto station 0 — which is the entire section. Separate
 * paths and not one closed rhombus because each leg has to draw on its own
 * beat, and a single closed shape can only be drawn as one continuous stroke.
 */
export const LEGS = FOOT.map((f, i) => {
  const next = FOOT[(i + 1) % FOOT.length];
  return `M ${round(f.x)} ${round(f.y)} L ${round(next.x)} ${round(next.y)}`;
});

/**
 * The two edges of the conduit, as one closed shape per side.
 *
 * Offsetting in Y and not along the leg normal is deliberate: on a ground plane
 * seen at 2:1, a constant vertical offset IS the constant width of a flat band
 * lying on that plane. A true perpendicular offset would draw a ribbon standing
 * on edge, which is the wrong object.
 *
 * The corners are left un-mitred — each station's block stands over the joint
 * and hides it, which is also why the blocks are drawn after the conduit.
 */
export const CONDUIT_EDGES = [BAND, -BAND].map((d) =>
  FOOT.map((f, i) => `${i === 0 ? "M" : "L"} ${round(f.x)} ${round(f.y + d)}`).join(" ") + " Z"
);

/** The centreline of the conduit, closed. What the carrier runs along. */
export const CONDUIT_CENTRE =
  FOOT.map((f, i) => `${i === 0 ? "M" : "L"} ${round(f.x)} ${round(f.y)}`).join(" ") + " Z";

/** The bench plate the loop stands on. Outline only — it is a reference, not a surface. */
// The margins are chosen so the plate stays INSIDE the viewBox. The svg draws
// with `overflow-visible` (the conduit's carrier needs it), so a plate that
// overshoots is not clipped by the svg — it is clipped by the panel, and a
// bench plate cut off by the edge of its own panel reads as a mistake.
export const GROUND = poly([
  [CX, CY - RY - 58],
  [CX + RX + 100, CY],
  [CX, CY + RY + 58],
  [CX - RX - 100, CY],
]);
