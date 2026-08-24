import Figure from "@/components/primitives/Figure";
import {
  FIELD,
  lattice,
  placeCities,
} from "@/components/sections/community/cityField";
import { CITY_FIELD } from "@/components/sections/community/communityContent";

export type NetFieldProps = {
  /** Deduplicated, in feed order. Derived from the events feed by the view. */
  cities: readonly string[];
};

// The instrument's version of the page's one drawn figure: the calendar as a
// lit plane.
//
// The argument for the figure at all — and for a graticule instead of a map —
// is in `../cityField.ts`, and it is not restated here. What is decided in this
// file is the TREATMENT, which is the only thing that separates the three
// variants of this drawing.
//
// ── Why this one has volume, and A's does not ─────────────────────────────
// A is editorial: a 1px dot per city, a hairline leader, a name. It reads as a
// plate in a document, which is exactly right for a page that is otherwise
// hairlines and type.
//
// This variant is the centre of an APPARATUS — it shares its panel with four
// readouts and it has to hold that room on its own. A field of 1px dots inside
// a dark bordered panel reads as dust: the panel promises an object and the
// drawing delivers a texture. So each city stands up out of the plane as a
// small column with three faces, and the plane gets axes. That is the whole
// difference between this and A, and it is why the panel is worth having.
//
// ── Every column is the same height, and that is a claim ──────────────────
// The obvious next move is to vary the height by something — events per city,
// group size, anything. There is no such number in the feed, and inventing a
// mapping would make the drawing assert a magnitude nobody measured. Uniform
// height says exactly what the data says: this city is on the calendar. The
// figure gains volume without gaining a lie.
//
// ── The depth ramp is three bands, not 216 opacities ──────────────────────
// The graticule fades toward the top of the box so the plane reads as receding
// rather than as wallpaper. Done per dot that is 216 elements each carrying its
// own `opacity` attribute; done in three `<g>`s it is three. The banding is
// invisible at this dot spacing and the DOM is two orders of magnitude smaller.
//
// ── Strokes do not scale; the geometry does ───────────────────────────────
// `vector-effect="non-scaling-stroke"` on every stroked element keeps the line
// at one device pixel from ~950px down to ~255px — the same reason A uses it,
// and the same trap: the property is NOT inherited, so putting it on the
// wrapping `<g>` silently does nothing.
//
// The columns themselves are user-space geometry and DO scale with the box,
// which is correct for a solid: a prism that stayed 30px tall while the plane
// shrank would detach from the plane it is standing on.

const LATTICE = lattice(15);

/** Headroom above the box for the columns of the northernmost cities. */
const HEAD = 62;

const GRATICULE_PX = 1;

/** Column geometry, in field units. Uniform for every city — see above. */
const RISE = 46;
const HALF = 5.2;
/** The isometric offset of the side and top faces. */
const SKEW_X = 6.6;
const SKEW_Y = -4;
/** The footprint ring at the base of a column. */
const FOOT_R = 10;

/** Meridians and parallels, in degrees — the plane's axes. */
const MERIDIANS = [-120, -60, 0, 60, 120];
const PARALLELS = [60, 40, 20, 0, -20, -40];

/** The three depth bands of the graticule, top of the box to bottom. */
const BANDS = [
  { max: FIELD.H / 3, opacity: 0.18 },
  { max: (FIELD.H * 2) / 3, opacity: 0.28 },
  { max: Infinity, opacity: 0.4 },
] as const;

// A point in field units → a position in the overlay, as a percentage of the
// box. NOT `percent()` from `cityField.ts`: that one assumes a viewBox anchored
// at zero, and this one is raised by `HEAD` to make room for the columns. Same
// denominators, one extra term.
function place(x: number, y: number): { left: string; top: string } {
  const round = (n: number) => Math.round(n * 1e4) / 1e4;
  return {
    left: `${round((x / FIELD.W) * 100)}%`,
    top: `${round(((y + HEAD) / (FIELD.H + HEAD)) * 100)}%`,
  };
}

function Column({ x, y }: { x: number; y: number }) {
  const top = y - RISE;
  const front = `M${x - HALF} ${y} L${x - HALF} ${top} L${x + HALF} ${top} L${x + HALF} ${y} Z`;
  const side = `M${x + HALF} ${y} L${x + HALF + SKEW_X} ${y + SKEW_Y} L${x + HALF + SKEW_X} ${
    top + SKEW_Y
  } L${x + HALF} ${top} Z`;
  const cap = `M${x - HALF} ${top} L${x - HALF + SKEW_X} ${top + SKEW_Y} L${
    x + HALF + SKEW_X
  } ${top + SKEW_Y} L${x + HALF} ${top} Z`;

  return (
    <g stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke">
      {/* Painted back to front: side, front, cap. The cap is the brightest face
          because the light in every other drawing on this site comes from
          above — there is only one lighting convention in the repo and this
          figure is not the place to invent a second. */}
      <path d={side} fill="currentColor" fillOpacity={0.1} vectorEffect="non-scaling-stroke" />
      <path d={front} fill="currentColor" fillOpacity={0.22} vectorEffect="non-scaling-stroke" />
      <path d={cap} fill="currentColor" fillOpacity={0.6} vectorEffect="non-scaling-stroke" />
    </g>
  );
}

export default function NetField({ cities }: NetFieldProps) {
  const { placed, unplaced } = placeCities(cities);

  return (
    <Figure caption={CITY_FIELD.caption} tone="dark">
      <div className="relative w-full">
        <svg
          viewBox={`0 ${-HEAD} ${FIELD.W} ${FIELD.H + HEAD}`}
          className="block h-auto w-full"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {/* The axes. Faint enough to be structure and not content: they say
              the plane is measured, they do not compete with the columns. */}
          <g opacity="0.14">
            {MERIDIANS.map((lon) => {
              const x = (lon - FIELD.LON_MIN) * FIELD.PER_DEG;
              return (
                <line
                  key={`m${lon}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={FIELD.H}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            {PARALLELS.map((lat) => {
              const y = (FIELD.LAT_MAX - lat) * FIELD.PER_DEG;
              return (
                <line
                  key={`p${lat}`}
                  x1={0}
                  y1={y}
                  x2={FIELD.W}
                  y2={y}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>

          {BANDS.map((band, i) => {
            const min = i === 0 ? -Infinity : BANDS[i - 1].max;
            return (
              <g key={band.max} opacity={band.opacity}>
                {LATTICE.filter((d) => d.y > min && d.y <= band.max).map((d) => (
                  <line
                    key={`${d.x}-${d.y}`}
                    x1={d.x}
                    y1={d.y}
                    x2={d.x}
                    y2={d.y}
                    strokeWidth={GRATICULE_PX}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            );
          })}

          {/* The footprints stay in the plane's colour: the ring belongs to the
              graticule, the column belongs to the community. */}
          <g opacity="0.4">
            {placed.map((c) => (
              <circle
                key={c.name}
                cx={c.x}
                cy={c.y}
                r={FOOT_R}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          <g className="text-near-green-accent">
            {placed.map((c) => (
              <Column key={c.name} x={c.x} y={c.y} />
            ))}
          </g>
        </svg>

        {/* Names are HTML on top of the SVG, never `<text>` inside it: SVG text
            is laid out in user units and would scale with the box, which is the
            one thing the type scale exists to prevent.

            They hang off the CAP of the column, not off the base. A's labels
            sit beside a dot on the plane; here the plane is where the footprint
            rings are, and a name set there lands on top of the ring of whatever
            city shares its meridian — Lisbon and Lagos, in the sample feed. At
            cap height the two names separate by the difference in latitude,
            which is the one thing this projection guarantees. */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {placed.map((c) => (
            <span
              key={c.name}
              style={place(c.x + HALF + SKEW_X, c.y - RISE + SKEW_Y)}
              className="absolute -translate-y-1/2 whitespace-nowrap pl-2 text-micro-mono uppercase text-cream/70"
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* Under `md` the labels would collide inside 255px, so the same names run
          as one mono line instead. Each breakpoint carries them as real text
          exactly once: nothing is duplicated to a screen reader, nothing hidden
          from one. */}
      <p className="mt-6 text-caption-mono uppercase text-cream/60 md:hidden">
        {placed.map((c) => c.name).join(" · ")}
      </p>

      {unplaced.length > 0 && (
        <p className="mt-4 text-micro-mono uppercase text-white/40">
          {CITY_FIELD.unplaced}: {unplaced.join(" · ")}
        </p>
      )}
    </Figure>
  );
}
