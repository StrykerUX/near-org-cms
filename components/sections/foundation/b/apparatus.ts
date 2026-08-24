// The drawing kit of variant B: one object, projected the same way everywhere.
//
// ── Why a shared projection instead of a figure per section ────────────────
// B reads the Foundation as a single piece of apparatus, and the page shows
// that same piece four times: closed in the hero, as a level with a setpoint
// under the mission, cut open under the Stiftung, and divided across the three
// acts of the operations scene. Four drawings of one object only hold together
// if the object keeps its size and its point of view, so the projection, the
// footprint and the wall height live here and nowhere else. A section that
// wants a new reading of the vessel adds a function to this file; a section
// that invents its own box breaks the through-line the variant is built on.
//
// ── The angle is deliberately shallow ──────────────────────────────────────
// `/prototype/protocol-a` already owns a field of isometric cubes at the
// canonical 30°, and at 30° any box on this site reads as that page's
// vocabulary. This one is flattened to ~20°: something sitting on a bench and
// being read from slightly above, rather than a stack of blocks in space.
//
// ── Why the numbers are here and not in the JSX ────────────────────────────
// The operations scene animates parcels that have to leave the slab exactly
// where the slab ends, so the tween and the markup must read the same
// coordinates. Precedent: `SCATTER` / `RING_STOPS` in `chain/WhyItMatters`.

/** Horizontal run per unit of x and y. */
const KX = 0.94;
/** How far a unit of depth drops on screen. Low on purpose — see the note above. */
const KY = 0.34;

/** Two decimals: far below a pixel, and identical on the server and the client. */
const round = (n: number) => Math.round(n * 100) / 100;

export type Point3 = readonly [number, number, number];

/** World (x right, y back, z up) to screen. */
export function iso(x: number, y: number, z = 0): [number, number] {
  return [round((x - y) * KX), round((x + y) * KY - z)];
}

/** One `x,y` pair for an SVG `points` list. */
export function at(x: number, y: number, z = 0): string {
  return iso(x, y, z).join(",");
}

/** A closed face, as an SVG `points` list. */
export function face(corners: readonly Point3[]): string {
  return corners.map((c) => at(c[0], c[1], c[2])).join(" ");
}

/**
 * The vessel: the Foundation, as an object with a footprint and walls.
 *
 * Wide and shallow rather than tall: this is a basin that things are put into
 * and taken out of, not a tank. The proportion is what keeps the mouth wide
 * enough for five inflows to be told apart at the width the panel gives it.
 */
export const V = { w: 168, d: 96, h: 104 } as const;

/**
 * Where the retained level sits, and where the declared setpoint sits.
 *
 * Shared because the mission section and the Stiftung section draw the same
 * vessel: if its level moved between the two, the page would be showing two
 * different objects and claiming they are one.
 */
export const LEVEL_Z = V.h * 0.74;
export const SETPOINT_Z = V.h * 0.3;

/** A horizontal plane inside the vessel — its mouth, its floor, or a level. */
export function plane(z: number): string {
  return face([
    [0, 0, z],
    [V.w, 0, z],
    [V.w, V.d, z],
    [0, V.d, z],
  ]);
}

/**
 * The two walls the viewer can see, as one open path each.
 *
 * The near corner is (w, d): screen x grows with `x - y` and screen y with
 * `x + y`, so the faces adjacent to that corner are the ones facing us. Drawing
 * the other two would be drawing through the object.
 */
export const NEAR_WALLS = [
  // The long wall, y = d.
  `M ${at(0, V.d, V.h)} L ${at(0, V.d, 0)} L ${at(V.w, V.d, 0)} L ${at(V.w, V.d, V.h)}`,
  // The short wall, x = w.
  `M ${at(V.w, 0, V.h)} L ${at(V.w, 0, 0)} L ${at(V.w, V.d, 0)}`,
] as const;

/** The back edges, drawn faint so the object reads as open rather than solid. */
export const FAR_EDGES = [
  `M ${at(0, 0, V.h)} L ${at(0, 0, 0)} L ${at(V.w, 0, 0)}`,
  `M ${at(0, 0, 0)} L ${at(0, V.d, 0)}`,
] as const;

/**
 * One canvas for the three static readings of the vessel.
 *
 * Shared so the object does not change size between the hero, the mission and
 * the Stiftung — which is the whole point of it being the same object: two
 * viewBoxes of different heights would scale the same geometry differently and
 * the reader would be looking at two vessels.
 *
 * `VIEW_BOX_DEEP` is the same drawing with room under the floor, and it exists
 * for one figure: the cutaway has a stroke that leaves through the aperture and
 * keeps going, and a stroke that stops at the edge of its own viewBox reads as
 * cropped rather than as leaving. Same origin, so the vessel lands in the same
 * place; only the canvas is longer. Giving every figure that room instead left
 * a band of empty canvas between the two static drawings and their captions.
 */
export const VIEW = { w: 268, h: 214, ox: 100, oy: 118 } as const;
export const VIEW_BOX = `0 0 ${VIEW.w} ${VIEW.h}` as const;
// The negative min-y is the head room: the inflows of the cutaway start well
// above the mouth, and the ones over the far end of the vessel start highest of
// all. Same width as `VIEW_BOX`, so both render at the same scale in a
// full-width figure — only the canvas is taller.
export const VIEW_BOX_DEEP = `0 -40 ${VIEW.w} 302` as const;
export const ORIGIN = `translate(${VIEW.ox} ${VIEW.oy})` as const;
