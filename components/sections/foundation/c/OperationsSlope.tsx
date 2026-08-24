"use client";

import StageSection from "@/components/sections/shells/stage/Section";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { OPERATIONS } from "@/components/sections/foundation/foundationContent";
import { HILL, levels, ring } from "@/components/sections/foundation/c/terrain";

// §6 — the three activities, as three terraces on one slope.
//
// ── The claim, and where it comes from ────────────────────────────────────
// Two of the three activities are things the Foundation keeps doing:
// allocating and supporting are functions it performs again next year, so
// their circuits close on the terrace they left. The third is the one whose
// product does not come back, because what it hands over is the doing of the
// thing — "the continuing devolution of functions and operations to the
// ecosystem itself". Its outlet runs off the right edge of the frame, and it
// is the only stroke on the drawing carrying the ramp.
//
// ── One wide figure and three columns under it ────────────────────────────
// Not three cards: the page has already spent its card row on the pillars, and
// a second one here would turn a composition into a template. A single
// drawing across the full measure with the copy sitting under its own terrace
// does something the cards cannot — it puts the three activities on the same
// slope, which is the part of this section that a paragraph makes the reader
// assemble for themselves.
//
// The figure does not animate. The outlet that leaves is a statement about
// where a thing goes, not about it going, and the section it follows already
// spends this page's one scrubbed drawing.

const W = 1200;
const H = 300;
const FLAT = 0.3;

/** One terrace per activity, stepping down to the right. */
const TERRACES = [
  { x: 170, y: 78 },
  { x: 560, y: 152 },
  { x: 950, y: 232 },
] as const;

const LEVELS = levels(3, 150, 84);

/** The two circuits that close, and the one that does not. */
const CIRCUITS = [
  "M 262 92 Q 348 40 300 22 Q 216 4 132 34 Q 92 50 118 68",
  "M 652 166 Q 738 114 690 96 Q 606 78 522 108 Q 482 124 508 142",
] as const;

const OUTFLOW = "M 1042 244 Q 1120 250 1200 226";

export default function OperationsSlope() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  return (
    <div ref={rootRef}>
      <StageSection
        eyebrow={OPERATIONS.eyebrow}
        title={OPERATIONS.headline}
        intro={OPERATIONS.intro}
      >
        <div data-reveal className="text-ink">
          {/* The figure scrolls sideways on a phone instead of being scaled to
              a 90px strip. Cropping was the other option and it drops a whole
              terrace, which on a drawing whose argument is the THIRD one is
              the one thing that cannot be cut. */}
          <div className="-mx-1 overflow-x-auto px-1">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full min-w-[680px]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="slope-ramp" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8bf29c" />
                <stop offset="100%" stopColor="#00b96f" />
              </linearGradient>
            </defs>

            {TERRACES.map((t) => (
              <g key={`${t.x}-${t.y}`}>
                <path
                  d={ring(HILL, t.x, t.y, LEVELS[LEVELS.length - 1], FLAT)}
                  fill="currentColor"
                  opacity="0.05"
                />
                {LEVELS.map((r, i) => (
                  <path
                    key={r}
                    d={ring(HILL, t.x, t.y, r, FLAT)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity={i === 0 ? 0.55 : 0.35}
                  />
                ))}
              </g>
            ))}

            {CIRCUITS.map((d) => (
              <path
                key={d}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.5"
                strokeDasharray="4 4"
              />
            ))}

            {/* The one that leaves. It runs to the edge of the viewBox and is
                cut by it: a stroke that stops short of the frame has arrived
                somewhere, and this one has not. */}
            <path d={OUTFLOW} fill="none" stroke="url(#slope-ramp)" strokeWidth="1.5" />
          </svg>
          </div>

          <p className="mt-6 text-caption-mono text-gray-intermediate">
            Two circuits close on the slope they left; the third runs off it.
          </p>
        </div>

        <ul className="mt-12 grid-ds gap-y-10">
          {OPERATIONS.activities.map((activity) => (
            <li key={activity.id} data-reveal className="col-span-12 md:col-span-6 lg:col-span-4">
              <p className="text-caption-mono text-gray-intermediate">{activity.index}</p>
              <h3 className="mt-5 max-w-[16ch] text-h3 text-pretty">{activity.title}</h3>
              <p className="mt-4 max-w-[36ch] text-body text-ink-soft text-pretty">
                {activity.body}
              </p>
            </li>
          ))}
        </ul>
      </StageSection>
    </div>
  );
}
