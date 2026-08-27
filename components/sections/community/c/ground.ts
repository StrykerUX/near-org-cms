import type { StagePalette } from "@/components/sections/shells/stage/Surface";

// The terrain this page stands on, calibrated once and used twice — the hero
// and the band under the map.
//
// ── Why a module and not a literal in each section ────────────────────────
// Two surfaces on one page have to be the SAME surface: the map band reads as
// more of the ground the hero opened on, and a palette copied into two files
// diverges the first time somebody nudges one of them. It is calibration, not
// copy, so it lives beside the drawing that reads it rather than in
// `communityContent.ts` — same split `cityField.ts` draws for coordinates.
//
// ── The warmest ground of the four pages, on purpose ──────────────────────
// The four B/C pages share one shader and are told apart by palette and scale.
// This is the page about people, and it is the only one of the four whose
// subject is warm — a foundation, an economy and a history are all institutions,
// and this is a room full of humans. So the terrain is sand and late light
// rather than the greens and cold greys the reference calibration uses.
//
// It also has to survive being a background for the map: a high-contrast ground
// under a field of 1px dots turns the drawing into noise. Hence a narrow range
// between the two plateaus and a line that is warm brown rather than black.
//
// ── Few bands, wide hills ─────────────────────────────────────────────────
// `bands: 7` and `scale: 1.55` is the flattest, broadest calibration of the set,
// and both numbers are doing the same job: making the plateaus wide enough to
// set a display headline on. Tight crests are what breaks a hero with a shader,
// and this hero has the longest headline of the four.
export const GROUND: StagePalette = {
  /** The low plateau. Also the colour with no WebGL, so it has to hold text. */
  bg: "#f2e8db",
  /** The high plateau: late afternoon on the sand. */
  high: "#f7d3ac",
  /** The contour: warm brown, never black — a black line here reads as a map. */
  line: "#a76a45",
};

/** Hero calibration: the widest, flattest version. */
export const GROUND_HERO = { bands: 7, scale: 1.55, tilt: 0.55 } as const;

/**
 * Map calibration: a touch more relief than the hero.
 *
 * The band under the drawing wants to read as SURVEYED ground rather than as an
 * atmosphere — more contour lines is what does that — while still staying quiet
 * enough that the graticule on top of it is legible.
 */
export const GROUND_MAP = { bands: 10, scale: 1.9, tilt: 0.25 } as const;
