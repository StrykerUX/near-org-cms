// Minimal isometric box renderer, shared by the concept mockups.
//
// It is the same projection the reference's diagrams use — a 30° dimetric where
// +z goes straight up the screen — so a box drawn here sits in the same space as
// the isometric artwork already on the page.
//
// Pure and deterministic: evaluated during render, on the server too. Every
// coordinate is `toFixed(1)` for the same reason `home-v2/nearStackGeometry.ts`
// does it — the paths are compared at hydration, and any float-formatting
// difference reports as a mismatch per path.

const COS30 = 0.8660254;

export type IsoView = { cx: number; cy: number; s: number };

/** Project a point in box space to screen space. */
export function iso(x: number, y: number, z: number, v: IsoView): [number, number] {
  return [v.cx + (x - y) * COS30 * v.s, v.cy + ((x + y) * 0.5 - z) * v.s];
}

const fmt = (pts: [number, number][]) =>
  `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L")}Z`;

export type BoxFaces = { top: string; right: string; front: string };

/**
 * The three faces of an axis-aligned box that face the viewer. The hidden three
 * are never emitted — that is the whole back-face cull, and it is what lets the
 * solid fill read as occlusion.
 */
export function box(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  v: IsoView
): BoxFaces {
  const P = (x: number, y: number, z: number) => iso(x, y, z, v);
  return {
    top: fmt([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)]),
    right: fmt([P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0), P(x1, y0, z0)]),
    front: fmt([P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0), P(x0, y1, z0)]),
  };
}

/** The flat diamond a box sits on — the ground plane marker. */
export function pad(half: number, z: number, v: IsoView): string {
  const P = (x: number, y: number) => iso(x, y, z, v);
  return fmt([P(-half, 0), P(0, half), P(half, 0), P(0, -half)]);
}
