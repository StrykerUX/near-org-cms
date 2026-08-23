// The city field — the projection, the lattice and the coordinate table that
// the three layouts of /community share.
//
// ── Why this page needs one figure, and why it is this one ─────────────────
//
// "70+ countries, 60+ builder groups" is the page's least believable line, not
// because it is false but because a number cannot be pictured. The reader has
// no way to turn it into anything. Every city on the events calendar is a real,
// checkable place, and placing them is the one thing this page can DRAW that
// the copy takes a paragraph to fail at.
//
// ── Why it is not a map ────────────────────────────────────────────────────
//
// The genre answer is a world map with pins. It was not taken, for three
// reasons, in order of how much they matter:
//
//  1. A coastline is a picture of the world, and this figure is not about the
//     world — it is about five entries in a calendar. Drawing seven continents
//     to carry five dots makes the continents the subject and lies about the
//     coverage by implication: the eye reads a filled map as "everywhere".
//  2. Any real coastline is either a GeoJSON payload this project has no
//     business shipping for one figure, or a hand-traced path that is a
//     drawing of a map rather than a map.
//  3. Neither survives the house style. The rest of this site is 1px strokes
//     and small filled dots; a landmass is a filled shape, and there is no
//     version of one that does not read as an illustration pasted on.
//
// So the ground is the GRATICULE and nothing else: a regular lattice of 1px
// dots, one per whole step of latitude and longitude. It is honest — it claims
// nothing about land — it is the same vocabulary as `MediaFrame`'s registration
// corners, and it makes the cities read as coordinates, which is what they are.
// The `Figure` caption says so out loud, which is the whole reason a figure on
// this site carries one.
//
// ── The equirectangular projection, on purpose ─────────────────────────────
//
// x is linear in longitude and y is linear in latitude, so Lisbon and Lagos sit
// at the same x because they share a meridian, and that relationship is the only
// thing this figure asserts. A projection that preserved area would bend the
// lattice into curves and buy nothing — nobody is measuring Greenland here.
//
// ── The table, and what happens when the Luma feed lands ───────────────────
//
// Coordinates are DATA about the world, not copy, so they are here and not in
// `communityContent.ts` — same split the sections README draws for geometry.
// The list below covers the sample feed plus the cities the community calendar
// actually recurs in.
//
// The important part is what happens to a city that is NOT in the table. It is
// not silently dropped: `placeCities` returns it in `unplaced`, and every layout
// renders that list. So the day the real calendar arrives with Ulaanbaatar, the
// page says so in mono instead of quietly showing one dot fewer than the table
// below it — and "Online", which is in the sample feed and is not a place at
// all, lands there correctly and permanently.

/** A point in the figure's own coordinate space. */
export type FieldPoint = { x: number; y: number };

export const FIELD = {
  /** viewBox width in units — 360° of longitude at `PER_DEG`. */
  W: 720,
  /** viewBox height — +80° to −60°, the band every populated city falls in. */
  H: 280,
  PER_DEG: 2,
  LON_MIN: -180,
  LAT_MAX: 80,
} as const;

const LAT_MIN = FIELD.LAT_MAX - FIELD.H / FIELD.PER_DEG;

// Four decimals, everywhere a coordinate becomes a number in the DOM. Nothing
// here is random or trigonometric, but the float that comes out of an
// accumulating loop is not guaranteed to print identically on both sides of a
// hydration boundary, and a mismatched `cx` is a React warning nobody enjoys
// tracking down. Rounding once, here, removes the class of bug.
const round4 = (n: number) => Math.round(n * 1e4) / 1e4;

/** Longitude/latitude in degrees → the figure's units. */
export function project(lon: number, lat: number): FieldPoint {
  return {
    x: round4((lon - FIELD.LON_MIN) * FIELD.PER_DEG),
    y: round4((FIELD.LAT_MAX - lat) * FIELD.PER_DEG),
  };
}

/** The point as a percentage of the box — for HTML overlaid on the SVG. */
export function percent(p: FieldPoint): { left: string; top: string } {
  return {
    left: `${round4((p.x / FIELD.W) * 100)}%`,
    top: `${round4((p.y / FIELD.H) * 100)}%`,
  };
}

/**
 * The graticule, at one dot per `stepDeg` in both axes.
 *
 * Inset by half a step on every side so no dot is bisected by the edge of the
 * box — a clipped half-dot reads as a rendering fault rather than as a field.
 * Step is a parameter and not a constant because the three layouts render this
 * at three sizes: a lattice that reads as texture at 700px reads as a screen
 * door at 300px.
 */
export function lattice(stepDeg: number): readonly FieldPoint[] {
  const dots: FieldPoint[] = [];
  const half = stepDeg / 2;

  for (let lon = FIELD.LON_MIN + half; lon < 180; lon += stepDeg) {
    for (let lat = FIELD.LAT_MAX - half; lat > LAT_MIN; lat -= stepDeg) {
      dots.push(project(lon, lat));
    }
  }

  return dots;
}

// Accents and case are stripped on both sides of the lookup, so "São Paulo",
// "Sao Paulo" and "sao paulo" are one key. A feed that spells a city three ways
// should not produce three misses.
const normalise = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** [longitude, latitude], in degrees. */
const CITY_COORDS: Record<string, readonly [number, number]> = {
  // The sample feed.
  lisbon: [-9.14, 38.72],
  bengaluru: [77.59, 12.97],
  lagos: [3.38, 6.52],
  "buenos aires": [-58.38, -34.6],

  // Europe.
  london: [-0.13, 51.51],
  berlin: [13.4, 52.52],
  paris: [2.35, 48.86],
  amsterdam: [4.9, 52.37],
  madrid: [-3.7, 40.42],
  barcelona: [2.17, 41.39],
  dublin: [-6.26, 53.35],
  zurich: [8.54, 47.37],
  warsaw: [21.01, 52.23],
  belgrade: [20.46, 44.79],
  kyiv: [30.52, 50.45],
  istanbul: [28.98, 41.01],
  tbilisi: [44.79, 41.72],

  // Africa and the Middle East.
  accra: [-0.19, 5.6],
  nairobi: [36.82, -1.29],
  "cape town": [18.42, -33.92],
  cairo: [31.24, 30.04],
  dubai: [55.27, 25.2],

  // Asia and the Pacific.
  mumbai: [72.88, 19.08],
  delhi: [77.21, 28.61],
  "kuala lumpur": [101.69, 3.14],
  singapore: [103.82, 1.35],
  jakarta: [106.85, -6.21],
  bangkok: [100.5, 13.76],
  hanoi: [105.83, 21.03],
  "ho chi minh city": [106.63, 10.82],
  manila: [120.98, 14.6],
  "hong kong": [114.17, 22.32],
  taipei: [121.56, 25.03],
  seoul: [126.98, 37.57],
  tokyo: [139.69, 35.69],
  sydney: [151.21, -33.87],

  // The Americas.
  "san francisco": [-122.42, 37.77],
  "los angeles": [-118.24, 34.05],
  seattle: [-122.33, 47.61],
  denver: [-104.99, 39.74],
  austin: [-97.74, 30.27],
  chicago: [-87.63, 41.88],
  "new york": [-74.01, 40.71],
  miami: [-80.19, 25.76],
  toronto: [-79.38, 43.65],
  vancouver: [-123.12, 49.28],
  "mexico city": [-99.13, 19.43],
  bogota: [-74.07, 4.71],
  medellin: [-75.56, 6.24],
  lima: [-77.04, -12.05],
  "sao paulo": [-46.63, -23.55],
  santiago: [-70.65, -33.46],
};

export type PlacedCity = FieldPoint & { name: string };

/**
 * Split a list of city names into the ones the table can place and the ones it
 * cannot. The second list is rendered, not discarded — see the note at the top.
 */
export function placeCities(cities: readonly string[]): {
  placed: readonly PlacedCity[];
  unplaced: readonly string[];
} {
  const placed: PlacedCity[] = [];
  const unplaced: string[] = [];

  for (const name of cities) {
    const coords = CITY_COORDS[normalise(name)];
    if (coords) {
      placed.push({ name, ...project(coords[0], coords[1]) });
    } else {
      unplaced.push(name);
    }
  }

  return { placed, unplaced };
}

/**
 * The cities of a feed, deduplicated, in the feed's own order.
 *
 * `Set` keeps insertion order while dropping repeats, so a month with three
 * Lisbon events shows Lisbon once and in the position of its first event.
 * Lives here rather than in each view so the three layouts cannot disagree
 * about what "the cities on the calendar" means.
 */
export function citiesFromEvents(events: readonly { city: string }[]): string[] {
  return Array.from(new Set(events.map((e) => e.city)));
}
