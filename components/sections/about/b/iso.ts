// The axonometric that variant B draws in, and the slab it draws with.
//
// ── Why a module and not numbers in the figure ─────────────────────────────
//
// Two figures share this projection — the four-act machine and the convergence
// trace — and they have to agree, because the second one is a detail of the
// first: the same story, told once as a growing solid and once as two lines
// that meet. If each carried its own idea of where the ground plane sits, the
// two would read as two different objects that happen to be on the same page.
//
// ── Why this projection and not the protocol page's ────────────────────────
//
// `/prototype/protocol-a` draws a field of isometric cubes and it was
// explicitly out of bounds to copy it: the graphic vocabulary is per page. What
// is shared with it is the CAMERA, and only because a camera is not a
// vocabulary — it is the fact that this variant draws solids at all. The solid
// here is a SLAB, not a cube: this page's argument is that layers accumulated
// over eight years, so the unit of the drawing is a stratum with a footprint
// and a thickness, and the machine is the pile of them.
//
// The plan is 10 units wide (x, running right-and-down on screen) by 3 deep
// (y, running left-and-down), and `z` is height in projected pixels rather than
// plan units — the thicknesses of the strata are a drawing decision, not a
// measurement of anything.

/** Plan units to projected pixels. */
const UNIT = 46;

/** cos(30°). Rounded here, once, so nothing downstream rounds differently. */
const K = 0.866;

// Where plan (0, 0, 0) lands in the viewBox. Chosen so the whole machine —
// x 0→10, y 0→3, z 0→192 — sits inside VIEW with an even margin.
const ORIGIN_X = 240;
const ORIGIN_Y = 230;

export const VIEW = { w: 720, h: 560 } as const;

/** The plan footprint every stratum shares. */
export const PLAN = { x0: 0, x1: 10, y0: 0, y1: 3 } as const;

// The three levels the machine stacks on. `z0`/`z1` are the underside and the
// top of each stratum.
export const LEVEL = {
  ground: { z0: 0, z1: 26 },
  plane: { z0: 96, z1: 112 },
  merged: { z0: 112, z1: 132 },
  models: { z0: 176, z1: 192 },
} as const;

const round = (n: number) => Math.round(n * 100) / 100;

/** Plan point to viewBox point. */
export function project(x: number, y: number, z: number): [number, number] {
  return [round(ORIGIN_X + (x - y) * K * UNIT), round(ORIGIN_Y + (x + y) * 0.5 * UNIT - z)];
}

/** Same point, as percentages of the viewBox — for HTML labels laid over the SVG. */
export function projectPct(x: number, y: number, z: number): { left: string; top: string } {
  const [px, py] = project(x, y, z);
  return { left: `${round((px / VIEW.w) * 100)}%`, top: `${round((py / VIEW.h) * 100)}%` };
}

const poly = (pts: Array<[number, number]>) =>
  `M ${pts.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`;

export type Box = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  z0: number;
  z1: number;
};

/**
 * The three visible faces of a slab, as path data.
 *
 * From this camera the top face and the two near sides are visible and the rest
 * are not, so the box is exactly three polygons — no hidden-surface work, no
 * z-sorting inside a slab. Order matters at the call site: paint back to front
 * (sides, then top) or a stratum's own lid ends up under its wall.
 */
export function slab(box: Box): { top: string; left: string; right: string } {
  const { x0, x1, y0, y1, z0, z1 } = box;
  return {
    top: poly([
      project(x0, y0, z1),
      project(x1, y0, z1),
      project(x1, y1, z1),
      project(x0, y1, z1),
    ]),
    // The wall at the far edge of y — the one facing down-left on screen.
    left: poly([
      project(x0, y1, z1),
      project(x1, y1, z1),
      project(x1, y1, z0),
      project(x0, y1, z0),
    ]),
    // The wall at the far edge of x — facing down-right.
    right: poly([
      project(x1, y0, z1),
      project(x1, y1, z1),
      project(x1, y1, z0),
      project(x1, y0, z0),
    ]),
  };
}

/** A straight segment in plan space, as path data. */
export function edge(a: [number, number, number], b: [number, number, number]) {
  const [ax, ay] = project(...a);
  const [bx, by] = project(...b);
  return `M ${ax} ${ay} L ${bx} ${by}`;
}

// ── The strata, in plan ─────────────────────────────────────────────────────

/**
 * The four shards, laid across the SAME footprint one unsharded ground plane
 * occupies. That is the whole claim of the 2018–2020 chapter and it is why the
 * numbers below are derived rather than typed: change `SHARDS` and the four
 * still tile exactly the plan, gaps included, so the act-two state can never
 * quietly start covering less ground than act one did.
 */
const SHARDS = 4;
const SHARD_GAP = 0.42;
const SHARD_W = (PLAN.x1 - PLAN.x0) / SHARDS - SHARD_GAP;

export const SHARD_BOXES: Box[] = Array.from({ length: SHARDS }, (_, k) => {
  const x0 = PLAN.x0 + (k * (PLAN.x1 - PLAN.x0)) / SHARDS + SHARD_GAP / 2;
  return { x0, x1: x0 + SHARD_W, y0: PLAN.y0, y1: PLAN.y1, ...LEVEL.ground };
});

/**
 * Twelve units of work, three to a shard, at fixed plan positions.
 *
 * They are in the same place before and after the ground plane is partitioned,
 * which is the point the flat `ShardingDiagram` in `../figures/` makes with
 * twelve dots in two bands: sharding does not make the work smaller, it makes
 * more of it able to run at once. Here the same twelve sit on whichever
 * stratum is current, so the reader watches boundaries appear underneath marks
 * that never move.
 */
const WORK = 12;
export const WORK_MARKS = Array.from({ length: WORK }, (_, i) => {
  const step = (PLAN.x1 - PLAN.x0) / WORK;
  return { x: PLAN.x0 + (i + 0.5) * step, y: (PLAN.y0 + PLAN.y1) / 2 };
});

/**
 * Where the models stratum breaks.
 *
 * The upper line of the convergence drawing stops in 2018 and picks up again
 * when the LLMs arrive; here it is a stratum with a gap in it, at the same
 * proportion of the plan. The gap is the years the models did not exist, and it
 * is drawn — an unmarked hole in a solid reads as a rendering fault.
 */
export const MODELS_BREAK = { end: 4.4, resume: 6.2 } as const;

/** Where the pivot column drops, and the two chains the abstraction plane reaches. */
export const PIVOT_X = MODELS_BREAK.end;
export const STUB_Y = [0.4, 1.5, 2.6] as const;

// ── Ink ─────────────────────────────────────────────────────────────────────
//
// Literals and not `var(--token)`: these are SVG fills, and half of them are
// alpha variants of a colour the token system does not carry an alpha channel
// for. `--near-green-accent` is #00dc8d; the cream is #00dc8d.

export const FACE = {
  live: { top: "rgba(0,220,141,0.22)", left: "rgba(0,220,141,0.11)", right: "rgba(0,220,141,0.05)", stroke: "#00dc8d" },
  idle: { top: "rgba(245,244,241,0.08)", left: "rgba(245,244,241,0.04)", right: "rgba(245,244,241,0.02)", stroke: "rgba(245,244,241,0.42)" },
  dim: { top: "rgba(245,244,241,0.03)", left: "rgba(245,244,241,0.02)", right: "rgba(245,244,241,0.01)", stroke: "rgba(245,244,241,0.18)" },
} as const;

export type FaceTone = keyof typeof FACE;
