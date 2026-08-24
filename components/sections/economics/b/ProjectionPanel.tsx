"use client";

import { ArrowUpRight } from "lucide-react";
import MediaFrame from "@/components/primitives/MediaFrame";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import { PROJECTION } from "@/components/sections/economics/economicsContent";

// §3b of variant B — the supply beat of the loop, drawn.
//
// ── Why this section exists in B and nowhere else ─────────────────────────
// `FLYWHEEL.steps[2]` is the only beat of the loop whose shape a sentence
// carries badly: two quantities moving in opposite directions toward each
// other. It is also the beat with the highest chance of being overstated, which
// is why the layout that draws it has to be the one built to hold readings
// honestly. That is this one.
//
// ── The four things this figure refuses to do ─────────────────────────────
// The copy says the system is DESIGNED TO APPROACH a point where more tokens
// leave circulation than enter it. It does not say it has arrived, and a chart
// is far better than a paragraph at asserting that by accident. So:
//
// 1. **No values on either axis.** There is no scale because there is no
//    dataset. The shape is the entire claim.
// 2. **The meeting mark is hollow.** On this site a filled dot is a plotted
//    fact (`chain/ProofBand`); an outline says "this is where the two lines are
//    designed to arrive", which is exactly that point's status.
// 3. **`Projection` is printed INSIDE the plotting area.** Captions get
//    dropped when somebody re-lays-out a section; a word standing in the middle
//    of the drawing travels with it.
// 4. **Neither curve continues past the meeting point.** Drawing them crossing
//    would be drawing the deflationary threshold as something already passed.
//    The drawing stops where the claim stops.
//
// The three strings that carry those terms — `label`, `axisNote` and `note` —
// live in the copy module and not here, because they are the conditions under
// which the figure is allowed to exist and have to be as hard to delete as the
// data.
//
// ── The screenshot faces the drawing, and says the opposite thing ─────────
// The section ends in a link to revenue.near.org, which answers the one fair
// objection the figure invites ("so where are the numbers?"). A link is a weak
// answer: it makes the reader leave to check. So the public dashboard is
// reserved as a dated CAPTURE, once on this page, facing the curves. Shape on
// the right, which asserts no magnitude; record on the left, which does not
// have to.
//
// It is a screenshot and not an embed, and that distinction IS the honesty of
// the slot: a live widget inside a dark panel is manufactured currency for
// telemetry this site does not have.
//
// ── Both curves draw at once, at the same speed ───────────────────────────
// Staggered, one would reach the meeting point and wait, and waiting reads as
// one line causing the other. They are two independent movements that happen to
// arrive at the same place.

const W = 560;
const H = 300;

// Plot frame. Left and bottom only — a closed box would read as a chart with
// its axes cropped, and there is nothing to crop.
const PLOT = { left: 40, right: 520, top: 30, bottom: 250 };

// Where the two are designed to arrive. Named because the mark, the end of both
// curves and the chip's clearance all read it.
const MEET = { x: 476, y: 194 };

const ISSUANCE = `M 60 68 C 176 82, 306 142, ${MEET.x} ${MEET.y}`;
const BUYBACKS = `M 60 240 C 176 236, 322 213, ${MEET.x} ${MEET.y}`;

const TRACE = "#00dc8d";
const NEUTRAL = "rgba(245,244,241,0.5)";
const AXIS = "rgba(245,244,241,0.16)";
const MARK = CTA_RAMP[2];

// 100 and not 1: GSAP rounds pixel-unit values by default and
// `stroke-dashoffset` is a pixel property, so at 1 the draw snaps.
const PATH_LEN = 100;

const SHOT = {
  label:
    "revenue.near.org — screenshot of the public dashboard: cumulative revenue and buybacks, with the date of the snapshot visible",
  spec: "1600×1200 · PNG @2x",
} as const;

export default function ProjectionPanel() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const curves = q<SVGPathElement>("[data-curve]");
    const mark = q("[data-meet]");

    gsap.set(curves, { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set(mark, { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 70%", once: true, markers: DEBUG_MARKERS },
    });

    tl.to(curves, { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" }, 0)
      // The mark lands after both curves are there, never before: a target drawn
      // ahead of the lines would read as a point the data was fitted to.
      .to(mark, { autoAlpha: 1, duration: 0.5 }, 1.5);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <InstrumentSection eyebrow={PROJECTION.eyebrow} title={PROJECTION.headline}>
      <div ref={rootRef}>
        <Panel label="Fig. 01 · Issuance and buybacks" meta={PROJECTION.label} tone="slate">
          <div className="grid-ds items-center gap-y-12 px-5 pb-10 pt-20 lg:px-8 lg:pb-14 lg:pt-24">
            <div className="col-span-12 lg:col-span-5">
              <MediaFrame label={SHOT.label} spec={SHOT.spec} ratio="4/3" tone="dark" />
            </div>

            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <div className="relative w-full">
                <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" aria-hidden="true">
                  <path
                    d={`M ${PLOT.left} ${PLOT.top} V ${PLOT.bottom} H ${PLOT.right}`}
                    fill="none"
                    stroke={AXIS}
                    strokeWidth="1"
                  />

                  <path
                    data-curve
                    d={ISSUANCE}
                    fill="none"
                    stroke={NEUTRAL}
                    strokeWidth="1.5"
                    pathLength={PATH_LEN}
                  />
                  <path
                    data-curve
                    d={BUYBACKS}
                    fill="none"
                    stroke={TRACE}
                    strokeWidth="1.5"
                    pathLength={PATH_LEN}
                  />

                  <circle
                    data-meet
                    cx={MEET.x}
                    cy={MEET.y}
                    r="6"
                    fill="none"
                    stroke={MARK}
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Inside the plotting area, on the empty upper-right quadrant
                    the two curves leave behind. Positioned in % of the same box
                    so it stays inside the drawing at any width. */}
                <span className="pointer-events-none absolute left-[52%] top-[14%] text-micro-mono uppercase text-white/45">
                  {PROJECTION.label}
                </span>
              </div>

              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {[
                  { key: "a", label: PROJECTION.seriesA, colour: NEUTRAL },
                  { key: "b", label: PROJECTION.seriesB, colour: TRACE },
                ].map((s) => (
                  <div key={s.key} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="block h-px w-6"
                      style={{ backgroundColor: s.colour }}
                    />
                    <dt className="text-micro-mono uppercase text-white/55">{s.label}</dt>
                    {/* The series has no value, which is the point of the
                        figure. The list still needs its pair to be valid. */}
                    <dd className="sr-only">Shape only — no scale</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 text-micro-mono uppercase text-white/35">{PROJECTION.axisNote}</p>

              <p className="mt-8 max-w-[52ch] text-body-sm text-white/60 text-pretty">
                {PROJECTION.note}
              </p>

              <a
                href={PROJECTION.source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-label text-cream transition-colors hover:border-white"
              >
                {PROJECTION.source.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Panel>
      </div>
    </InstrumentSection>
  );
}
