// The ground of variant C, and the geometry that borrows its grammar.
//
// ── One palette, and why it is cold ────────────────────────────────────────
// Four pages share the contour surface of `shells/stage`, and the shell says
// what keeps them apart: the palette and the calibration. This page is a Swiss
// foundation — a legal body, an oversight regime, a jurisdiction — so its
// terrain is mineral and cold, with the bands packed tight enough to read as a
// survey rather than as scenery. Wide warm hills would put this page in the
// same room as a community or a history page, which is exactly the confusion
// the shell warns about.
//
// `bands` stays low enough that the plateaus between two curves are wide: the
// hero headline sits on one of them, and a headline over the crest of a
// gradient is the failure mode of every shader hero.
export const TERRAIN = {
  palette: { bg: "#f5f4f1", high: "#e1e1e1", line: "#e1e1e1" },
  // Ten bands and not fourteen: the curves have to crowd enough to read as a
  // survey and still leave a plateau wide enough to set a headline on. At the
  // density this started at, the hero was legible but the ground behind it was
  // noise, which is the exact failure the shell picked this shader to avoid.
  bands: 10,
  scale: 2.45,
  tilt: 0.32,
} as const;

// ── The contour figures ────────────────────────────────────────────────────
//
// The page's drawings are level curves, which is not decoration: the surface
// behind the hero already taught the reader that this page draws ground, so a
// figure made of the same curves is read as a measurement of the same terrain
// rather than as an illustration dropped on top of it.
//
// Every ring on this page comes out of ONE outline, scaled. That is what a real
// contour map looks like — nested curves that never cross, because they are the
// same hill sliced at different heights — and it is also the only way to get
// nesting for free: two independently wobbled outlines intersect as soon as
// their wobbles disagree, and an intersection is the one thing a contour map
// cannot contain.

const TAU = Math.PI * 2;
const STEPS = 72;

/** Four decimals, like every trig-derived coordinate in this repo: `Math.sin`
 *  is not required to be correctly rounded, so Node and the browser disagree in
 *  the last ulp and React refuses to hydrate over it. */
const round = (n: number) => Math.round(n * 1e4) / 1e4;

/**
 * A closed outline, as a radius per angle. Three harmonics: one for the overall
 * lean of the hill, one for its shoulders, one for the roughness. Fewer and it
 * reads as an ellipse; more and it reads as noise.
 */
function outline(harmonics: readonly [number, number, number]) {
  const [a3, a5, a7] = harmonics;
  return Array.from({ length: STEPS }, (_, i) => {
    const a = (i / STEPS) * TAU;
    return 1 + a3 * Math.sin(a * 2 + 0.6) + a5 * Math.sin(a * 3 - 1.1) + a7 * Math.sin(a * 5 + 2.2);
  });
}

export type Outline = readonly number[];

/** The page's hill. One shape, used by every ring of every figure on it. */
export const HILL: Outline = outline([0.13, 0.07, 0.035]);

/** A tighter, rounder outline — for the small figures inside a card. */
export const KNOLL: Outline = outline([0.09, 0.05, 0.025]);

/**
 * One level curve: the outline at radius `r`, squashed by `flat` so the ring
 * reads as ground seen at an angle rather than as a circle seen head on.
 */
export function ring(
  shape: Outline,
  cx: number,
  cy: number,
  r: number,
  flat = 0.52
): string {
  const points = shape.map((k, i) => {
    const a = (i / STEPS) * TAU;
    return `${round(cx + Math.cos(a) * r * k)} ${round(cy + Math.sin(a) * r * k * flat)}`;
  });
  return `M ${points.join(" L ")} Z`;
}

/**
 * `n` nested curves from `outer` down to `inner`.
 *
 * Geometric spacing rather than linear: on a real hill the curves crowd where
 * the slope steepens, and a hill whose curves are evenly spaced is a cone.
 */
export function levels(n: number, outer: number, inner: number): number[] {
  const k = (inner / outer) ** (1 / (n - 1));
  return Array.from({ length: n }, (_, i) => round(outer * k ** i));
}

/**
 * Every `every`-th point of a level curve, with the direction that points into
 * the hill.
 *
 * It exists for one mark: the inward ticks that a map draws on a closed
 * DEPRESSION, which is the only way a contour map distinguishes a basin from a
 * summit — the curves are identical otherwise. The pillar that says the
 * Foundation is legally bound to its purpose is drawn as a basin, so the ticks
 * are carrying the whole claim rather than decorating the ring.
 */
export function ringPoints(
  shape: Outline,
  cx: number,
  cy: number,
  r: number,
  flat = 0.52,
  every = 6
): { x: number; y: number; ix: number; iy: number }[] {
  const out: { x: number; y: number; ix: number; iy: number }[] = [];
  for (let i = 0; i < shape.length; i += every) {
    const a = (i / shape.length) * TAU;
    const x = cx + Math.cos(a) * r * shape[i];
    const y = cy + Math.sin(a) * r * shape[i] * flat;
    const dx = cx - x;
    const dy = cy - y;
    const len = Math.hypot(dx, dy) || 1;
    out.push({
      x: round(x),
      y: round(y),
      ix: round(dx / len),
      iy: round(dy / len),
    });
  }
  return out;
}
