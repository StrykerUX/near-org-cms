import Figure from "@/components/primitives/Figure";
import {
  FIELD,
  lattice,
  percent,
  placeCities,
} from "@/components/sections/community/cityField";
import { CITY_FIELD } from "@/components/sections/community/communityContent";

export type PlacesFieldProps = {
  /** Deduplicated, in feed order. The same list the marquee below runs. */
  cities: readonly string[];
};

// The Rally's version of the page's one drawn figure — the places, before they
// start running.
//
// The argument for the figure, and for a graticule instead of a map, is in
// `../cityField.ts`. What is decided here is the treatment.
//
// ── The Rally's treatment: the biggest of the three, and the only one on ink ─
// This variant is the one where the graphics are allowed to outweigh the type,
// and this is where that shows most plainly: the densest lattice of the three
// (10° against 12° and 15°), the largest labels, and the page's only dark
// ground under it. It goes directly above the marquee of the same city names,
// so the band reads as one movement — here is where they are, and now here they
// come — instead of as a strip of moving type with a diagram parked over it.
//
// ── The green is the same green the marquee already uses ───────────────────
// `RallyCities` sets a green dot between city names in its strip. The city
// marks here take that same accent, so the drawing and the marquee are visibly
// about the same five things. `currentColor` does the work: the class sits on
// the group and every mark inside inherits it, which is why the marks carry no
// colour of their own and the `Figure` tone still governs everything else.
//
// The ring around each dot is the one mark this variant adds over `a/`. At this
// size a 4px dot alone disappears into a 10° lattice; the ring is what
// separates a city from the grid it is drawn on, and it is the same hairline
// circle `chain/WhyItMatters` closes its first glyph with.
const LATTICE = lattice(10);

const GRATICULE_PX = 1;
const CITY_PX = 4;
const RING_R = 11;

const FLIP_AT = FIELD.W * 0.7;

/** A dot of exactly `px` device pixels — see the long note in `a/CityField`. */
function Mark({ x, y, px }: { x: number; y: number; px: number }) {
  return (
    <line x1={x} y1={y} x2={x} y2={y} strokeWidth={px} vectorEffect="non-scaling-stroke" />
  );
}

export default function PlacesField({ cities }: PlacesFieldProps) {
  const { placed, unplaced } = placeCities(cities);

  return (
    <Figure caption={CITY_FIELD.caption} tone="dark">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${FIELD.W} ${FIELD.H}`}
          className="block h-auto w-full"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <g opacity="0.35">
            {LATTICE.map((d) => (
              <Mark key={`${d.x}-${d.y}`} x={d.x} y={d.y} px={GRATICULE_PX} />
            ))}
          </g>

          <g className="text-near-green-accent">
            {placed.map((c) => (
              <g key={c.name}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={RING_R}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
                <Mark x={c.x} y={c.y} px={CITY_PX} />
              </g>
            ))}
          </g>
        </svg>

        {/* HTML over the SVG rather than `<text>` inside it, for the reason
            spelled out in `a/CityField`: SVG text scales with the viewBox and
            would leave the type scale behind. */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {placed.map((c) => {
            const flip = c.x > FLIP_AT;
            const { left, top } = percent(c);
            return (
              <span
                key={c.name}
                style={{ left, top }}
                className={`absolute -translate-y-1/2 whitespace-nowrap text-caption-mono uppercase text-cream/70 ${
                  flip ? "-translate-x-full pr-6" : "pl-6"
                }`}
              >
                {c.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* The phone version of the same names — the labels above would collide
          inside 255px. One breakpoint each, so nothing is read out twice. */}
      <p className="mt-6 text-caption-mono uppercase text-cream/60 md:hidden">
        {placed.map((c) => c.name).join(" · ")}
      </p>

      {unplaced.length > 0 && (
        <p className="mt-4 text-micro-mono uppercase text-cream/45">
          {CITY_FIELD.unplaced}: {unplaced.join(" · ")}
        </p>
      )}
    </Figure>
  );
}
