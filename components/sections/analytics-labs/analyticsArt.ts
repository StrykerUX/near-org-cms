// Geometry shared by the three /analytics proposals. Pure computation, no JSX
// and no GSAP — same status as `chain/chainDiagram.ts`: each proposal draws its
// own SVG with its own treatment, and the only thing in common is where the
// points land.
//
// Sharing the GEOMETRY and not the component is deliberate. If all three
// imported a `<Sparkline />` they would all look the same and the comparison
// would stop measuring design; if each recomputed the path, three separate
// files would say different things about the same series.

// ── Rounding, for hydration ────────────────────────────────────────────────
// Same reason as `chainDiagram.ts`: the ECMAScript spec does not require
// `Math.sin`/`Math.cos` to be correctly rounded, so Node and the browser
// disagree in the last ulp and React throws away the whole client tree over a
// `d=` that does not match. Four decimals is far below a pixel at any size
// these figures are drawn, and is identical on both sides whatever libm is
// underneath.
export const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

export type SparkBox = {
  /** viewBox width. */
  w: number;
  /** viewBox height. */
  h: number;
  /** Vertical inset, so the peak never touches the edge. */
  padY?: number;
};

export type SparkGeometry = {
  /** The line path: `M … L …`. */
  line: string;
  /** The same stroke closed against the baseline, for the area fill. */
  area: string;
  /** Last point — where the live dot goes. */
  last: { x: number; y: number };
  /** Every point, in case a variant wants to mark them all. */
  points: { x: number; y: number }[];
};

/**
 * Normalised 0..1 series → path. The vertical scale is **linear against the
 * series' own extremes**, not against zero: a series moving between 0.32 and
 * 0.91 drawn from zero is a near-flat line pinned to the top, and the point of
 * a sparkline is precisely the SHAPE of the recent movement.
 *
 * That decision has an honest cost, and it should be known: it exaggerates the
 * variation. It is acceptable here because the sparkline accompanies a figure
 * that is written out (48.2%) and the chart only says "it has been going up" —
 * it is never the only source of the magnitude.
 */
export function sparkGeometry(series: number[], box: SparkBox): SparkGeometry {
  const { w, h, padY = 6 } = box;
  const min = Math.min(...series);
  const max = Math.max(...series);
  // Flat series: without this guard the denominator is 0 and the whole path
  // comes out NaN.
  const span = max - min || 1;

  const points = series.map((v, i) => ({
    x: round4((i / (series.length - 1)) * w),
    y: round4(h - padY - ((v - min) / span) * (h - padY * 2)),
  }));

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  return { line, area, last: points[points.length - 1], points };
}

// ── The uptime strip ───────────────────────────────────────────────────────
// The status-page convention: one bar per day, sixty days. Chosen over a bare
// number ("99.98%") because an aggregate percentage hides exactly what the
// reader wants to know — when did it go down, how long ago, was it once or five
// times — and the strip answers all of it at a glance without adding a word.
//
// The percentage still shows next to it: the strip says the SHAPE and the
// number says the magnitude. Neither is enough on its own.

export type UptimeBar = {
  /** 1 = full day up; 0..1 = fraction of the day in service. */
  health: number;
};

/**
 * Builds the 60 days from the declared uptime, **deterministically**.
 *
 * Deterministic rather than random for two reasons, and the second is the one
 * that matters: `Math.random()` during render produces different HTML on the
 * server and the client and breaks hydration; and a strip that changes on every
 * refresh reads as decorative noise rather than as data.
 *
 * The distribution is deliberately not uniform: real outages cluster. The total
 * deficit (60 × (1 − uptime)) is concentrated in one or two days instead of
 * being spread as an invisible 0.02 per bar, which is what would produce a
 * visually perfect and therefore useless strip.
 *
 * PLACEHOLDER, like every number on this page: the real one will receive the
 * actual 60 days from the status API.
 */
export function uptimeBars(uptime: number, seed: number, days = 60): UptimeBar[] {
  const deficit = days * (1 - uptime);
  const bars: UptimeBar[] = Array.from({ length: days }, () => ({ health: 1 }));
  if (deficit <= 0) return bars;

  // Cheap, stable integer generator — the same LCG family as the motion
  // toolkit's `seededRandom`, replicated here so a module that animates nothing
  // does not drag in an import from `@/components/primitives/motion/*`.
  let state = (seed * 2654435761) >>> 0;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  let left = deficit;
  // At most three incidents: more than that spreads the deficit again and the
  // strip loses the clustering that makes it readable.
  for (let i = 0; i < 3 && left > 0.001; i++) {
    const at = Math.floor(next() * days);
    const take = Math.min(left, 0.35 + next() * 0.5);
    bars[at] = { health: round4(Math.max(0, bars[at].health - take)) };
    left -= take;
  }

  return bars;
}

// ── The tick field behind proposal B's hero ────────────────────────────────
// A forest of vertical hairlines of varying height: the silhouette of a time
// series without being any particular series. Deterministic for the same reason
// as the strip above.
export function tickField(count: number, seed: number): { x: number; h: number }[] {
  let state = (seed * 2246822519) >>> 0;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  return Array.from({ length: count }, (_, i) => {
    // Two waves of different period plus noise: gives a silhouette with relief
    // — crests and troughs — instead of the even grass that noise alone makes.
    const t = i / count;
    const wave = 0.5 + 0.28 * Math.sin(t * Math.PI * 3.1) + 0.16 * Math.sin(t * Math.PI * 11.7);
    return {
      x: round4(t * 100),
      h: round4(Math.max(0.04, Math.min(1, wave * (0.55 + next() * 0.65)))),
    };
  });
}

// ── The area behind proposal C's hero ──────────────────────────────────────
// The same revenue series, resampled to more points with smooth interpolation,
// so it can be drawn the width of the viewport without showing the staircase of
// 24 samples. It is not a new series: it is the SAME one, which is why it
// cannot contradict the one in the card.
export function resample(series: number[], to: number): number[] {
  const last = series.length - 1;
  return Array.from({ length: to }, (_, i) => {
    const pos = (i / (to - 1)) * last;
    const lo = Math.floor(pos);
    const hi = Math.min(last, lo + 1);
    const f = pos - lo;
    // Smoothstep rather than linear: linear interpolation leaves a visible kink
    // at every original sample, which at viewport width reads as a polyline
    // instead of a curve.
    const s = f * f * (3 - 2 * f);
    return round4(series[lo] * (1 - s) + series[hi] * s);
  });
}
