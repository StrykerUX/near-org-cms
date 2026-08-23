"use client";

import Container from "@/components/primitives/Container";
import MediaFrame from "@/components/primitives/MediaFrame";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { PROJECTION } from "@/components/sections/economics/economicsContent";

// §3b of variant B — the signed gesture: two curves, drawn, converging.
//
// ── What this figure is allowed to claim, and what it is not ───────────────
// The copy says the system is "designed to approach" a point where more tokens
// leave circulation than enter it. It has NOT reached that point, and a chart is
// far better than a paragraph at asserting otherwise by accident: put numbers on
// an axis and dates under it and the reader will read a record, whatever the
// caption says.
//
// So three things are deliberately withheld, and none of them is an oversight:
//
//   1. **No values on either axis.** There is no scale, because there is no
//      dataset. The shape is the claim.
//   2. **The meeting mark is HOLLOW.** Every filled dot on this site is a real
//      plotted point (see `chain/ProofBand`). An outline says "this is where the
//      lines are headed", which is exactly the status of that point.
//   3. **The word `Projection` is set in the figure itself**, not in a caption
//      under it. Captions get dropped when a section is re-laid-out; a chip
//      inside the plot travels with the drawing.
//
// The wording of all three lives in `PROJECTION` in the content module, with a
// note there saying why it is data and not decoration.
//
// ── Why the public dashboard is reserved HERE and nowhere else on the page ──
// The section already ends on `PROJECTION.source` — a link to revenue.near.org,
// which is a public panel of what the network has actually earned. That link is
// the answer to the only fair objection this figure invites ("then where are
// the numbers?"), and a link is a weak way to answer it, because the reader has
// to leave to find out whether there is anything behind it.
//
// So the left column reserves a capture of that panel. It is the strongest slot
// on the whole page: the two things now sit opposite each other and say
// different things on purpose — drawn shape on the right, which claims nothing
// about magnitude, and photographed record on the left, which does not have to,
// because it is a picture of a page anyone can open.
//
// It is a CAPTURE and not an embed, and that distinction is the honesty of this
// slot. An embed, or worse a live-looking widget, would be telemetry this site
// does not have. A dated screenshot inside registration marks, with its brief
// written under it in mono, cannot be mistaken for a feed.
//
// It goes on the left, under the legend, and not beneath the plot: under the
// plot it would read as the chart's source data, which is precisely what it is
// not. Across the gutter it reads as the other kind of evidence.
//
// ── Mechanism ──────────────────────────────────────────────────────────────
// `pathLength={PATH_LEN}` + `strokeDashoffset`, the same plugin-free draw as
// every other stroke on this site. 100 and not 1 because GSAP's CSSPlugin
// rounds pixel-unit values by default and `stroke-dashoffset` is a pixel
// property: normalised to 1 the draw SNAPS from undrawn to drawn with nothing in
// between, and nothing errors. Long version in `chain/CapabilityStack`.

const PATH_LEN = 100;

// The panel this section reserves a picture of. `spec` asks for the crop and
// not the whole browser window: a screenshot with a URL bar in it is a
// screenshot of a browser, and the subject here is the panel.
const DASHBOARD = {
  label:
    "revenue.near.org — screenshot of the public dashboard: cumulative revenue and buybacks, with the date of the snapshot visible",
  spec: "1600×1200 · PNG @2x, panel crop, no browser chrome",
} as const;

// ── Chart box ──────────────────────────────────────────────────────────────
const W = 640;
const H = 250;
const AXIS_X = 10;
const AXIS_Y = 206;
const START_X = 26;
const END_X = 612;
// Where the two curves meet. One constant and not two, because the whole figure
// is the fact that they arrive at the SAME place — two numbers that happened to
// match would drift the first time someone nudged a curve.
const MEET_Y = 142;

// Issuance falls and flattens: the halving already happened, and what is left is
// a floor, not a slide to zero. The control points hold it high through the
// first third so the fall reads as a decision rather than a decay.
const ISSUANCE = `M ${START_X} 44 C 210 44, 300 112, ${END_X} ${MEET_Y}`;
// Buybacks rise, slowly at first and then faster: they are funded by usage, and
// usage compounds. The mirror of the curve above would have been easier to draw
// and would have said the two things are the same kind of movement.
const BUYBACKS = `M ${START_X} 196 C 240 196, 340 178, ${END_X} ${MEET_Y}`;

export default function EmissionChart() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: scope,
        start: "top 74%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(q("[data-axis]"), { autoAlpha: 0, duration: 0.5 }, 0)
      // Both curves draw at once and at the same speed. Staggered, one would
      // arrive at the meeting point and wait, which reads as one line causing
      // the other — and the claim is that they converge, not that issuance
      // pulls buybacks up to it.
      .fromTo(
        q("[data-curve]"),
        { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN },
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" },
        0.1
      )
      .from(q("[data-meet]"), { scale: 0, transformOrigin: "center", duration: 0.4 }, 1.35)
      .from(q("[data-chart-label]"), { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.1 }, 1.4);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream py-[14svh]">
      <Container>
        <div className="grid-ds gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <p className="text-caption-mono uppercase text-gray-intermediate">
              {PROJECTION.eyebrow}
            </p>
            <h2 className="mt-6 max-w-[14ch] text-h2 text-pretty">{PROJECTION.headline}</h2>

            <dl className="mt-10">
              {[
                { label: PROJECTION.seriesA, className: "bg-gray-intermediate" },
                { label: PROJECTION.seriesB, className: "bg-green-ink" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-4 border-t border-rule py-3">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="flex items-center gap-4">
                    <span className={`h-px w-8 ${s.className}`} aria-hidden="true" />
                    <span className="text-body-sm-mono text-ink-soft">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* No `data-chart-label`: that selector belongs to the plot's own
                timeline, and the left column of this section does not animate
                at all. A large block fading in a second and a half after the
                reader arrives, on the side that was legible from the start,
                reads as a page still loading. */}
            <div className="mt-12">
              <MediaFrame label={DASHBOARD.label} spec={DASHBOARD.spec} ratio="4/3" />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <div className="relative w-full">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full overflow-visible"
                role="img"
                aria-label={`${PROJECTION.label}. ${PROJECTION.note}`}
              >
                <g data-axis className="text-rule">
                  {/* Two bare axes and no gridlines: gridlines are the promise
                      of a scale, and there is no scale here. */}
                  <line
                    x1={AXIS_X}
                    y1={AXIS_Y}
                    x2={W - 10}
                    y2={AXIS_Y}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <line
                    x1={AXIS_X}
                    y1="20"
                    x2={AXIS_X}
                    y2={AXIS_Y}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </g>

                <path
                  data-curve
                  d={ISSUANCE}
                  fill="none"
                  stroke="#6c7477"
                  strokeWidth="1.5"
                  pathLength={PATH_LEN}
                />
                <path
                  data-curve
                  d={BUYBACKS}
                  fill="none"
                  stroke="#00a86b"
                  strokeWidth="1.5"
                  pathLength={PATH_LEN}
                />

                {/* Hollow, and that is the honest part: on this site a filled
                    dot is a plotted fact. */}
                <circle
                  data-meet
                  cx={END_X}
                  cy={MEET_Y}
                  r="6"
                  fill="none"
                  stroke="#00a86b"
                  strokeWidth="1.5"
                />
              </svg>

              {/* The chip lives inside the plot area so it cannot be separated
                  from the drawing by a future re-layout. */}
              <span
                data-chart-label
                className="absolute left-0 top-0 border border-rule px-3 py-1 text-micro-mono uppercase text-gray-intermediate"
              >
                {PROJECTION.label}
              </span>
            </div>

            <p data-chart-label className="mt-8 text-caption-mono text-gray-intermediate">
              {PROJECTION.axisNote}
            </p>
            <p
              data-chart-label
              className="mt-4 max-w-[62ch] text-body-sm text-ink-soft text-pretty"
            >
              {PROJECTION.note}
            </p>
            <a
              href={PROJECTION.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block border-b border-foreground/30 pb-1 text-label text-ink transition-colors hover:border-foreground"
            >
              {PROJECTION.source.label}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
