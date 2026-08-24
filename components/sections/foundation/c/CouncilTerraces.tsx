"use client";

import StageSection from "@/components/sections/shells/stage/Section";
import MediaFrame from "@/components/primitives/MediaFrame";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  COUNCIL,
  COUNCIL_PORTRAITS,
} from "@/components/sections/foundation/foundationContent";
import { HILL, levels, ring } from "@/components/sections/foundation/c/terrain";

// §5 — the two bodies, as two terraces and the circuit between them.
//
// ── Why this variant draws the relation and the instrument one files it ───
// It is one relation and there are three layouts, so it gets drawn once. Here
// it is ground: an upper terrace and a lower one, with two lanes running
// between them — authority going down and account coming back up. Variant B
// states the same thing as two readings in a panel's value band. Same
// information, two claims about what kind of document the reader is holding;
// drawing it twice would have made the difference between the variants
// decorative, which is the one thing the shared copy exists to prevent.
//
// The two verbs come from `COUNCIL.relation` — the deck's own words, already
// pulled out of the prose so that a drawing does not have to hide two English
// strings inside a component.
//
// ── The labels are HTML, not `<text>` ─────────────────────────────────────
// Inside a scaled viewBox an SVG label is multiplied by the figure's scale and
// stops matching the mono scale everywhere else on the page. Same fix, same
// reason, as `chain/CapabilityStack` and `economics/LoopScene`: positions come
// from the geometry, type comes from the DS.
//
// ── No ramp on the terraces ───────────────────────────────────────────────
// On this page the CTA ramp fills ground that has passed to somebody else by
// the end of the drawing. Nothing here passes anywhere: the circuit is closed
// and both ends stay inside the Foundation. Colouring it would spend the one
// signal the page has, on the one section that is not about devolution.

const W = 760;
const H = 300;

const UPPER = { x: 216, y: 96 };
const LOWER = { x: 540, y: 206 };
const TERRACE = levels(3, 152, 88);
const FLAT = 0.32;

/** Where the two lanes start and end. Two lanes and not one line each way:
 *  a single line with two labels is one relation described twice. */
const LANES = [
  { d: "M 322 118 Q 430 128 452 186", dot: [452, 186] },
  { d: "M 436 226 Q 330 224 306 168", dot: [306, 168] },
] as const;

function Terraces() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      {[UPPER, LOWER].map((c) => (
        <g key={`${c.x}-${c.y}`}>
          <path d={ring(HILL, c.x, c.y, TERRACE[TERRACE.length - 1], FLAT)} fill="currentColor" opacity="0.05" />
          {TERRACE.map((r, i) => (
            <path
              key={r}
              d={ring(HILL, c.x, c.y, r, FLAT)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity={i === 0 ? 0.55 : 0.35}
            />
          ))}
        </g>
      ))}

      {LANES.map((lane) => (
        <g key={lane.d}>
          <path
            d={lane.d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.55"
            strokeDasharray="4 4"
          />
          {/* The lane ends in a point rather than an arrowhead: a dot says
              where this leg arrives without adding a second stroke weight to a
              page drawn entirely at 1px. */}
          <circle cx={lane.dot[0]} cy={lane.dot[1]} r="2.5" fill="currentColor" opacity="0.75" />
        </g>
      ))}
    </svg>
  );
}

export default function CouncilTerraces() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  const [council, executive] = COUNCIL.bodies;

  return (
    <div ref={rootRef}>
      <StageSection
        tone="tint"
        eyebrow={COUNCIL.eyebrow}
        title={COUNCIL.headline}
        intro={COUNCIL.body}
      >
        <div className="grid-ds gap-y-10">
          <div
            data-reveal
            className="col-span-12 rounded-[1.75rem] bg-background p-5 lg:col-span-7 lg:p-8"
          >
            <div className="relative text-ink">
              <Terraces />

              <span className="absolute left-[46%] top-[30%] -translate-y-1/2 whitespace-nowrap text-micro-mono uppercase text-gray-intermediate">
                {COUNCIL.relation.out}
              </span>
              <span className="absolute left-[41%] top-[86%] -translate-x-full -translate-y-1/2 whitespace-nowrap text-micro-mono uppercase text-gray-intermediate">
                {COUNCIL.relation.back}
              </span>
            </div>

            <p className="mt-6 text-caption-mono text-gray-intermediate">
              Authority runs down the slope; account comes back up it.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-center">
            {[council, executive].map((body) => (
              <div key={body.id} data-reveal className="mt-10 first:mt-0">
                <div className="h-px w-full bg-rule" aria-hidden="true" />
                <h3 className="mt-5 text-h3-serif italic text-ink">{body.label}</h3>
                <p className="mt-3 max-w-[32ch] text-body-sm text-ink-soft text-pretty">
                  {body.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The faces of the two bodies the section names. Four cells and not a
            roster: the deck never says how many members the Council has, and
            inventing one on the page that argues its transparency is
            structural would be fabricating the record it claims to keep.
            No `data-reveal` on any of them — see `EcosystemMark`. */}
        <ul className="mt-[10svh] grid-ds gap-y-8">
          {COUNCIL_PORTRAITS.map((seat, i) => (
            <li
              key={seat.id}
              className={`col-span-6 sm:col-span-3 lg:col-span-2 ${i === 0 ? "lg:col-start-5" : ""}`}
            >
              <MediaFrame label={seat.label} spec={seat.spec} ratio="3/4" />
            </li>
          ))}
        </ul>
      </StageSection>
    </div>
  );
}
