// Geometry for the four-node ring in `LoopScene`.
//
// A module and not inline constants because the JSX and the timeline both read
// it: the arcs are RENDERED from `ARCS` and the labels are POSITIONED from
// `STOPS`, so a number that lived in only one of the two would drift the moment
// the radius changed.
//
// ── Everything is rounded to four decimals ─────────────────────────────────
// Same reason `chain/chainDiagram.ts` states at length: `Math.cos`/`Math.sin`
// are explicitly NOT required by the ECMAScript spec to be correctly rounded,
// so Node and the browser disagree in the last ulp, React fails to hydrate the
// whole client tree, and the failure looks nothing like a trig problem. Four
// decimals is far below a pixel at any size this figure is drawn and is
// identical on both sides whatever libm is underneath.

export const SIZE = 480;
export const C = SIZE / 2;
/** Ring radius. The label ring sits `LABEL_GAP` further out. */
export const R = 146;
const LABEL_GAP = 40;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

/** Where a node's label hangs relative to the node itself. */
export type StopAlign = "center" | "start" | "end";

// Four stops, clockwise from the top — the reading order of the four steps.
// Clockwise and not counter-clockwise because the page is read top-to-bottom
// and a loop that runs backwards against that reads as rewinding.
const ANGLES = [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2 - Math.PI / 2);

const ALIGN: StopAlign[] = ["center", "start", "center", "end"];

export const STOPS = ANGLES.map((a, i) => ({
  x: round(C + Math.cos(a) * R),
  y: round(C + Math.sin(a) * R),
  // In % of the figure box, because the labels are HTML and not <text>: inside
  // a scaled viewBox an SVG label's size is multiplied by the figure's scale,
  // so it would stop matching the mono scale everywhere else on the page.
  leftPct: round(((C + Math.cos(a) * (R + LABEL_GAP)) / SIZE) * 100),
  topPct: round(((C + Math.sin(a) * (R + LABEL_GAP)) / SIZE) * 100),
  align: ALIGN[i],
}));

/**
 * One arc per leg: `ARCS[i]` runs from stop `i` to stop `i + 1`, and the last
 * one closes back onto stop 0 — which is the whole section. Separate paths and
 * not one closed circle because each leg has to draw on its own beat; a single
 * circle can only be drawn as one continuous stroke.
 */
export const ARCS = STOPS.map((s, i) => {
  const next = STOPS[(i + 1) % STOPS.length];
  // sweep-flag 1 is clockwise in SVG's y-down space, large-arc-flag 0 because
  // every leg is exactly a quarter turn.
  return `M ${s.x} ${s.y} A ${R} ${R} 0 0 1 ${next.x} ${next.y}`;
});
