import { FIELD, lattice, percent, type PlacedCity } from "@/components/sections/community/cityField";

export type PlacesFieldProps = {
  /** Already placed by `RallyPlaces`, which also renders what it could not place. */
  placed: readonly PlacedCity[];
};

// The stage's version of the page's one drawn figure: the calendar as inhabited
// ground. This file is the DRAWING only — its rule, its caption and its list of
// unplaceable cities are assembled by `RallyPlaces`, for a reason given there.
//
// The argument for the figure at all, and for a graticule rather than a map,
// lives in `../cityField.ts` and is not restated here. What is decided here is
// the treatment.
//
// ── Big, and on the terrain ───────────────────────────────────────────────
// A's version is a plate in a column of a stats block; B's is the display of an
// instrument. This one runs the full width of the viewport, on the same contour
// surface the hero opens with, and it is meant to be legible from across the
// room. The sentence it has to deliver is "this happens everywhere", and that is
// a sentence about size before it is a sentence about data.
//
// Putting it on the shader is what separates it from the other two. The
// graticule is a grid of coordinates and the contour is a terrain; together they
// read as ground somebody surveyed and somebody lives on. Neither half says that
// alone — the lattice on flat cream is a plate, and the contour without it is a
// backdrop.
//
// ── The lattice is denser here, and that is a function of size ────────────
// 10° against A's 12° and B's 15°. `lattice()` takes the step as a parameter
// precisely because these three render at three widths: a grid that reads as
// texture at 1500px reads as a screen door at 300px.
//
// It is also lighter than A's. It is sitting on a shader rather than on flat
// cream, and at A's value it would fight the contour lines for the same pixel.
//
// ── Marks, not radii ──────────────────────────────────────────────────────
// Each city dot is a zero-length line with a round cap and
// `vector-effect="non-scaling-stroke"`, which paints a circle of exactly
// `strokeWidth` device pixels at any width. The ring around it is the one
// deliberate exception: it is a footprint ON the ground and has to scale with
// the ground it sits on.
//
// `vector-effect` is not inherited — on the wrapping `<g>` it would apply to the
// group and to nothing inside it, silently, and the marks would scale again.
const LATTICE = lattice(10);

const GRATICULE_PX = 1;
const CITY_PX = 7;
/** The footprint, in field units. */
const RING_R = 11;

export default function PlacesField({ placed }: PlacesFieldProps) {
  return (
    <div className="relative w-full text-ink">
      <svg
        viewBox={`0 0 ${FIELD.W} ${FIELD.H}`}
        className="block h-auto w-full"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <g opacity="0.28">
          {LATTICE.map((d) => (
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

        {placed.map((c) => (
          <g key={c.name}>
            <circle
              cx={c.x}
              cy={c.y}
              r={RING_R}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              opacity="0.55"
            />
            <line
              x1={c.x}
              y1={c.y}
              x2={c.x}
              y2={c.y}
              strokeWidth={CITY_PX}
              vectorEffect="non-scaling-stroke"
              className="text-green-ink"
              stroke="currentColor"
            />
          </g>
        ))}
      </svg>

      {/* Names as HTML over the SVG, never `<text>` inside it: SVG text is laid
          out in user units and would scale with the box, which is the one thing
          the type scale exists to prevent.

          `caption-mono` and not A's `micro-mono`: this drawing is five times the
          width of A's, and a label that stayed at micro would disappear into the
          terrain. Set in `text-ink`, which clears 7:1 on both plateaus of the
          palette — the labels are the only text this band carries, so they carry
          the contrast budget alone. */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {placed.map((c) => {
          const { left, top } = percent(c);
          return (
            <span
              key={c.name}
              style={{ left, top }}
              className="absolute -translate-x-1/2 whitespace-nowrap pt-4 text-caption-mono uppercase text-ink"
            >
              {c.name}
            </span>
          );
        })}
      </div>
      {/* Under `md` the drawing is about 340px wide and those labels would land
          on top of each other, so the same names run as one mono line beneath
          it instead. Each breakpoint carries them as real text exactly once —
          nothing duplicated to a screen reader, nothing hidden from one. */}
      <p className="mt-6 text-caption-mono uppercase text-ink md:hidden">
        {placed.map((c) => c.name).join(" · ")}
      </p>
    </div>
  );
}
