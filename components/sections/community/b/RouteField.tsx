import Figure from "@/components/primitives/Figure";
import { FIELD, lattice, placeCities } from "@/components/sections/community/cityField";
import { CITY_FIELD } from "@/components/sections/community/communityContent";

export type RouteFieldProps = {
  /** Deduplicated, in feed order. Derived from the same feed the table renders. */
  cities: readonly string[];
};

// The Board's version of the page's one drawn figure — the destinations, over
// the timetable that lists them.
//
// The argument for the figure, and for a graticule instead of a map, is in
// `../cityField.ts`. What is decided here is the treatment.
//
// ── The Board's treatment: nothing is named on the drawing ─────────────────
// `a/` labels every dot and `c/` labels them large. This one labels none of
// them, and that is not a shortcut — it is the same restraint the rest of the
// variant runs on. The table directly underneath already spells out every city
// in its own column, at a size you can read, in the row that tells you what is
// happening there. Repeating those five names on top of the drawing would put
// the same data on the page twice within one screen, which is precisely the
// habit a timetable exists to avoid.
//
// What is left is the shape: how far apart the calendar is spread, which is the
// one thing a column of city names cannot show. The names still run under the
// field in mono, once, as the figure's own line of data — the shortest possible
// version, and the accessible text for a drawing that is otherwise hidden.
//
// ── Reticles, not pins ─────────────────────────────────────────────────────
// Each city is a 4px dot inside four hairline ticks with a gap around it. A pin
// is a picture of a pin; a reticle is what a board draws when it means "this
// coordinate, exactly", and it is the same registration vocabulary as
// `MediaFrame`'s corners. The gap is what keeps the ticks from muddying the dot
// at the small size this figure is rendered at.
//
// The lattice is coarser than `a/`'s (15° against 12°) for the same reason:
// this figure is about 815px wide, and a field that reads as texture at 955px
// reads as a screen door here.
const LATTICE = lattice(15);

const GRATICULE_PX = 1;
const CITY_PX = 4;

/** The reticle: a gap around the dot, then a tick, in field units. */
const TICK_GAP = 5;
const TICK_END = 12;

/** A dot of exactly `px` device pixels — see the long note in `a/CityField`. */
function Mark({ x, y, px }: { x: number; y: number; px: number }) {
  return (
    <line x1={x} y1={y} x2={x} y2={y} strokeWidth={px} vectorEffect="non-scaling-stroke" />
  );
}

export default function RouteField({ cities }: RouteFieldProps) {
  const { placed, unplaced } = placeCities(cities);

  return (
    <Figure caption={CITY_FIELD.caption}>
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
            <Mark key={`${d.x}-${d.y}`} x={d.x} y={d.y} px={GRATICULE_PX} />
          ))}
        </g>

        {placed.map((c) => (
          <g key={c.name}>
            {/* Four ticks: left, right, up, down. Written as a list rather than
                four literal lines so the gap and the length come from the two
                constants above and cannot drift apart. */}
            {[
              [c.x - TICK_END, c.y, c.x - TICK_GAP, c.y],
              [c.x + TICK_GAP, c.y, c.x + TICK_END, c.y],
              [c.x, c.y - TICK_END, c.x, c.y - TICK_GAP],
              [c.x, c.y + TICK_GAP, c.x, c.y + TICK_END],
            ].map(([x1, y1, x2, y2]) => (
              <line
                key={`${x1}-${y1}-${x2}-${y2}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <Mark x={c.x} y={c.y} px={CITY_PX} />
          </g>
        ))}
      </svg>

      <p className="mt-6 text-micro-mono uppercase text-gray-intermediate">
        {placed.map((c) => c.name).join(" · ")}
        {unplaced.length > 0 && (
          <>
            {" — "}
            {CITY_FIELD.unplaced}: {unplaced.join(" · ")}
          </>
        )}
      </p>
    </Figure>
  );
}
