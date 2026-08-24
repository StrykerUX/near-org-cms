import Figure from "@/components/primitives/Figure";
import {
  FIELD,
  lattice,
  percent,
  placeCities,
} from "@/components/sections/community/cityField";
import { CITY_FIELD } from "@/components/sections/community/communityContent";

export type CityFieldProps = {
  /** Deduplicated, in feed order. Derived from the events feed by the view. */
  cities: readonly string[];
};

// The Hub's version of the page's one drawn figure: the calendar, as places.
//
// The argument for the figure at all — and for a graticule instead of a map —
// is in `../cityField.ts`. What is decided HERE is the treatment, which is the
// only thing that differs between the three layouts.
//
// ── The Hub's treatment: named, and beside the number it explains ──────────
// This variant is the canonical directory, so its version is the plain one: a
// medium lattice, every placeable city named in mono, and a hairline leader
// from each dot to its name. It sits in `HubStats`, in the same breath as
// "70+ Countries", because that is the figure it makes checkable.
//
// ── Why no mark here has a radius ──────────────────────────────────────────
// This SVG is fluid: it renders around 955px wide in the stats block and around
// 255px on a phone, a 3.7× range. Anything sized in user units shrinks with it,
// so a 3-unit dot that reads correctly on a laptop is a sub-pixel smudge on a
// phone — the figure would quietly stop existing at the width where most people
// see it.
//
// So every mark is a ZERO-LENGTH line with a round cap and
// `vector-effect="non-scaling-stroke"`, which paints a circle of exactly
// `strokeWidth` device pixels at any scale: 1px for the graticule, 4px for a
// city. The geometry scales, the marks do not, and the drawing reads the same
// at both ends of the range. It is also, literally, the field of 1px dots the
// house style asks for.
//
// The attribute goes on every element and not on the wrapping `<g>`, which is
// the one trap here: `vector-effect` is a NON-inherited property, so on a group
// it applies to the group and to nothing inside it — silently, with the marks
// scaling again as if it were not there.
const LATTICE = lattice(12);

const GRATICULE_PX = 1;
const CITY_PX = 4;
/** The leader from a city dot to its label, in field units. */
const LEADER = 13;

// Past this x, a label set to the right of its dot would run off the box, so it
// flips to the left instead. A fraction of the width rather than a pixel
// threshold, because the box is fluid.
const FLIP_AT = FIELD.W * 0.7;

/** A dot of exactly `px` device pixels, wherever the box ends up. */
function Mark({ x, y, px }: { x: number; y: number; px: number }) {
  return (
    <line
      x1={x}
      y1={y}
      x2={x}
      y2={y}
      strokeWidth={px}
      vectorEffect="non-scaling-stroke"
    />
  );
}

export default function CityField({ cities }: CityFieldProps) {
  const { placed, unplaced } = placeCities(cities);

  return (
    <Figure caption={CITY_FIELD.caption}>
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${FIELD.W} ${FIELD.H}`}
          className="block h-auto w-full"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <g opacity="0.3">
            {LATTICE.map((d) => (
              <Mark key={`${d.x}-${d.y}`} x={d.x} y={d.y} px={GRATICULE_PX} />
            ))}
          </g>

          {placed.map((c) => {
            const end = c.x > FLIP_AT ? c.x - LEADER : c.x + LEADER;
            return (
              <g key={c.name}>
                <line
                  x1={c.x}
                  y1={c.y}
                  x2={end}
                  y2={c.y}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
                <Mark x={c.x} y={c.y} px={CITY_PX} />
              </g>
            );
          })}
        </svg>

        {/* The names are HTML on top of the SVG and not `<text>` inside it. SVG
            text is laid out in user units, so it would scale with the box —
            exactly what the type scale exists to prevent. Positioned in
            percent, which is the coordinate space the viewBox already uses. */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {placed.map((c) => {
            const flip = c.x > FLIP_AT;
            const { left, top } = percent(c);
            return (
              <span
                key={c.name}
                style={{ left, top }}
                className={`absolute -translate-y-1/2 whitespace-nowrap text-micro-mono uppercase text-gray-intermediate ${
                  flip ? "-translate-x-full pr-5" : "pl-5"
                }`}
              >
                {c.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Below `md` those labels would collide inside 255px, so the same names
          run as a list under the field instead. Each breakpoint carries them as
          real text exactly once — nothing here is duplicated to a screen reader
          and nothing is hidden from one. */}
      <p className="mt-6 text-caption-mono uppercase text-gray-intermediate md:hidden">
        {placed.map((c) => c.name).join(" · ")}
      </p>

      {unplaced.length > 0 && (
        <p className="mt-4 text-micro-mono uppercase text-gray-intermediate">
          {CITY_FIELD.unplaced}: {unplaced.join(" · ")}
        </p>
      )}
    </Figure>
  );
}
