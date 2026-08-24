// Geometry for the full-bleed figure in `AscentLoop`.
//
// ── The idea, and why it is not a ring ────────────────────────────────────
//
// Variant A draws this loop as a circle and variant B as a closed conduit. Both
// are right for what they are, and both share one limitation: a closed shape
// returns to exactly where it started, so "one turn stronger" has to be added
// on top of the drawing — A does it with a second, brighter pass over the first
// leg, B with the same trick in a duct.
//
// C draws it on a TERRAIN, which is the one surface where the return can land
// somewhere else. The four steps are four stations on a traverse that climbs
// left to right; the return sweeps back across the foreground and arrives at
// the first station's position — higher than the start. The loop closes in x
// and does not close in y, which is the whole of `FLYWHEEL.closing` with
// nothing written next to it.
//
// This is also why the page's shader is a contour map and why it is worth the
// repetition: the hero establishes "this is measured ground", and the figure
// then uses the ground's own vocabulary to argue. The lines here are drawn and
// not shaded, because a figure has to be deterministic and a shader is not
// something a `<path>` can share coordinates with.
//
// ── Everything is rounded to four decimals ────────────────────────────────
// The contours come out of `Math.sin`, which the spec does not require to be
// correctly rounded: Node and the browser then disagree in the last ulp, React
// refuses to hydrate the whole client tree, and the failure looks nothing like
// a trigonometry problem. Four decimals is far under a pixel at any size this
// is drawn.

export const W = 1200;
export const H = 470;

const round = (n: number) => Math.round(n * 1e4) / 1e4;

// ── the drawn terrain ─────────────────────────────────────────────────────
// Level curves, each one the previous lifted by `BAND_GAP` and phase-shifted so
// they do not read as one shape repeated. They all rise to the right by the
// same `RISE`, which is what makes the ground a slope and not a texture.
const BANDS = 7;
const BAND_GAP = 46;
const RISE = 132;
const AMPLITUDE = 15;
const SAMPLES = 32;

export const CONTOURS = Array.from({ length: BANDS }, (_, k) => {
  const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const t = i / SAMPLES;
    const x = round(t * W);
    const y = round(
      H - 24 - k * BAND_GAP - t * RISE + Math.sin(t * Math.PI * 2.2 + k * 0.8) * AMPLITUDE
    );
    return `${x} ${y}`;
  });
  return `M ${pts.join(" L ")}`;
});

// ── the four stations ─────────────────────────────────────────────────────
// Evenly spaced across the box and climbing. Even in x because the four steps
// are four equal beats of one movement and nothing in the copy makes one of
// them longer; climbing in y because the copy's claim is that each turn leaves
// the system stronger than it found it.
export const STATIONS = [
  { x: 150, y: 372 },
  { x: 450, y: 300 },
  { x: 750, y: 226 },
  { x: 1050, y: 146 },
] as const;

/**
 * Where the return lands: the first station's column, one band higher than the
 * first station itself.
 *
 * This single number is the argument of the whole figure, so it is derived from
 * the station it has to beat rather than typed as a coordinate — nudge station
 * 01 and the restart stays exactly one band above it.
 */
export const RESTART = { x: STATIONS[0].x, y: STATIONS[0].y - BAND_GAP };

/**
 * The climb itself, as bezier commands with no `moveto` in front of them.
 *
 * Split out because three different paths need the same curve and each needs it
 * to start from somewhere different: the visible route starts at station 01,
 * the relief fill starts off the left edge, and the carrier's circuit continues
 * into the return. A second copy of these numbers is the one thing that would
 * make the three disagree.
 */
const CLIMB_CURVES = (() => {
  const [a, b, c, d] = STATIONS;
  return [
    `C ${a.x + 130} ${a.y - 10}, ${b.x - 130} ${b.y + 22}, ${b.x} ${b.y}`,
    `C ${b.x + 130} ${b.y - 22}, ${c.x - 130} ${c.y + 22}, ${c.x} ${c.y}`,
    `C ${c.x + 130} ${c.y - 22}, ${d.x - 130} ${d.y + 26}, ${d.x} ${d.y}`,
  ].join(" ");
})();

export const ROUTE = `M ${STATIONS[0].x} ${STATIONS[0].y} ${CLIMB_CURVES}`;

/**
 * The return: out of the last station, down across the FOREGROUND, and back up
 * to `RESTART`. Two curves and not one, because a single cubic from the summit
 * to the restart either cuts the corner through the middle of the climb or
 * needs control points outside the box — and control points outside the box
 * mean the sweep is clipped by the viewBox and arrives as three disconnected
 * fragments, which is what it did the first time.
 *
 * It crosses the climb once, near the left edge, and it has to: the whole point
 * is that it comes back ABOVE where the climb started.
 */
const RETURN_CURVES = [
  `C ${STATIONS[3].x + 90} ${H - 160}, ${STATIONS[3].x - 180} ${H - 40}, 600 ${H - 45}`,
  // The last control point sits LEFT of the station column, so the final rise
  // comes up outside it. Approached from directly below, the return spends its
  // last stretch behind station 01's own mark — which has an opaque fill, so the
  // line simply disappears for the one segment that has to connect.
  `C 380 ${H - 38}, 88 ${H - 92}, ${RESTART.x} ${RESTART.y}`,
].join(" ");

export const RETURN = `M ${STATIONS[3].x} ${STATIONS[3].y} ${RETURN_CURVES}`;

/**
 * Climb and return as ONE path, for the carrier that runs them.
 *
 * One path and not two, because a bead handed two paths has to be told which to
 * take next, and the point of the figure is that nothing decides — it just
 * keeps going. No second `moveto` in the middle either: a `moveto` lifts the
 * pen, and the dash offset would jump the gap instead of travelling it.
 */
export const CIRCUIT = `${ROUTE} ${RETURN_CURVES}`;

/**
 * The ground under the climb, for the ramp fill.
 *
 * It runs off BOTH edges of the box rather than dropping straight down at the
 * first and last station. Closed at the stations, the fill gets two hard
 * verticals inside the frame, and a vertical edge in a landscape reads as a
 * wall — the one thing a drawing of rising ground must not have.
 */
export const RELIEF_FILL = [
  `M 0 ${STATIONS[0].y}`,
  `L ${STATIONS[0].x} ${STATIONS[0].y}`,
  CLIMB_CURVES,
  `L ${W} ${STATIONS[3].y}`,
  `L ${W} ${H}`,
  `L 0 ${H}`,
  "Z",
].join(" ");
