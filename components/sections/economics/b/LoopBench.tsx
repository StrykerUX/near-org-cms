"use client";

import { useState } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import Panel from "@/components/sections/shells/instrument/Panel";
import ActRail from "@/components/sections/shells/instrument/ActRail";
import { FLYWHEEL } from "@/components/sections/economics/economicsContent";
import {
  W,
  H,
  STATIONS,
  LEGS,
  CONDUIT_EDGES,
  CONDUIT_CENTRE,
  GROUND,
} from "@/components/sections/economics/b/circuit";

// §3 of variant B — the flywheel as a rig on a bench, and the whole reason this
// variant exists.
//
// ── The one thing this section exists to prevent ───────────────────────────
// Step 4 only means anything as the thing that restarts step 1. Four cards, a
// grid or an accordion present four independent facts where there is one
// movement, and the argument is gone before the reader has read it. So the four
// steps are four STATIONS of one conduit: the reader cannot reach the third
// without watching the carrier leave the second, and the act rail says up front
// how many stations there are, so nobody abandons the scene halfway.
//
// ── Why the apparatus and not A's ring ────────────────────────────────────
// The long version is at the top of `circuit.ts`. Short version: a ring says
// "cycle" before it says what moves, and B's whole premise is that the machine
// exists and is running — so the figure has to show the thing that circulates
// and the volume of what it circulates through, and let "cycle" follow from the
// conduit closing.
//
// ── The carrier keeps moving, and that is not telemetry ───────────────────
// A single bead runs the closed centreline on its own loop, forever, unattached
// to the scroll. It is a mechanism drawing and it asserts no magnitude: nothing
// counts up, no reading changes on its own, and there is no rate anywhere on
// the page. The one thing it does say is the thing the copy says — that this
// does not stop — and it is what stops the diagram from reading as a static
// schematic of something that ran once.
//
// ── The act rail returns to 01 on the fifth beat ──────────────────────────
// There are five slots and four acts. On the fifth the rail lights 01 again
// rather than going dark, which is the whole claim of `FLYWHEEL.closing` stated
// by the instrument instead of by the sentence next to it. That is also why the
// active act is React state driven from the scrubbed trigger: `ActRail` is
// presentational on purpose, so there is one source of the current step.
//
// ── Degradation ───────────────────────────────────────────────────────────
// The JSX renders the FINAL state — every leg drawn, every station lit — and
// the scene winds it back. Never pre-hide in CSS: a failed bundle would leave
// the section blank forever. Without JS, on a phone or with reduced motion the
// reader gets the finished apparatus and five stacked blocks in order.
//
// Sticky is CSS, never `pin: true` — see components/sections/README.md.

const STEPS = FLYWHEEL.steps;

// Four steps plus the return. The return is a real slot: given no travel of its
// own it would play while step 4 is still being read, and the two collide.
const SLOTS = STEPS.length + 1;
const TRAVEL_SVH = SLOTS * 74;
const TRAVEL = `${TRAVEL_SVH}svh`;

const SPAN = 1 / SLOTS;
const slot = (i: number) => i * SPAN;

// Type lands fast and then HOLDS. The hold is the gap between the copy landing
// and the out-fade starting, not a tween — widen SPAN and it widens with it.
const IN_DUR = SPAN * 0.16;
const OUT_AT = SPAN * 0.82;
const OUT_DUR = SPAN * 0.11;

// The leg starts a beat into its own slot, after the copy has landed, and
// ARRIVES at the next station just as that station's copy begins. The overlap
// is what makes the carrier feel like it is pulling the reader along.
const LEG_AT = SPAN * 0.26;
const LEG_DUR = SPAN * 0.76;

// Colours are literals: GSAP interpolates colours, not declarations, so a
// `var(--token)` destination dies silently. `TRACE` mirrors
// `--near-green-accent` (#00dc8d), the green that is legible on ink.
const TRACE = "#00dc8d";
const SECOND_TURN = CTA_RAMP[2];
const GUIDE = "rgba(245,244,241,0.2)";
const GROUND_STROKE = "rgba(245,244,241,0.09)";
const EDGE_DIM = "rgba(245,244,241,0.24)";

// Three tones per station and not one flat fill: the top face catches the
// light, the right face less, the left face least. That ordering is the only
// thing telling the reader these are blocks standing on a plane and not
// diamonds lying on it.
const DIM = { top: "#191d1e", right: "#131718", left: "#0e1112" } as const;
const LIT = { top: "#1d6b4c", right: "#14523a", left: "#0d3a29" } as const;

// `pathLength` is 100 and not 1: GSAP rounds pixel-unit values by default
// (`autoRound`) and `stroke-dashoffset` is a pixel property, so normalised to 1
// every draw SNAPS from undrawn to drawn with nothing in between, silently.
const PATH_LEN = 100;

/** One full trip of the carrier, in seconds. Slow enough to read as travel. */
const CARRIER_SECONDS = 9;

const ACTS = STEPS.map((s) => ({ id: s.id, label: s.short }));

export default function LoopBench() {
  const [active, setActive] = useState(0);

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk) return;

    const flow = q<SVGPathElement>("[data-flow]");
    // The carrier runs even where the sticky scene does not: on a phone the
    // figure is a static apparatus with one thing moving in it, which is the
    // cheapest way to keep "it is running" true on the layout that gets none of
    // the scene.
    const carrier = gsap.to(flow, {
      strokeDashoffset: -PATH_LEN,
      duration: CARRIER_SECONDS,
      ease: "none",
      repeat: -1,
    });

    if (!isDesktop) return () => carrier.kill();

    const track = q("[data-track]")[0];
    if (!track) return () => carrier.kill();

    const off = enableScene(scope, "bench");
    const tl = trackTimeline(track, {
      scrollTrigger: {
        onUpdate: (self) => {
          const i = Math.min(SLOTS - 1, Math.floor(self.progress * SLOTS));
          // The fifth slot is the first act again, which is the section's
          // entire point — see the note at the top.
          setActive(i === SLOTS - 1 ? 0 : i);
        },
      },
    });

    const panels = q("[data-panel]");
    const legs = q<SVGPathElement>("[data-leg]");
    const second = q<SVGPathElement>("[data-second]");
    const blocks = q<SVGGElement>("[data-station]");
    const labels = q("[data-station-label]");

    // ── wound back to a dark bench ──────────────────────────────────────────
    gsap.set([...legs, ...second], { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set(labels, { autoAlpha: 0 });
    gsap.set(panels.slice(1), { autoAlpha: 0 });
    blocks.forEach((b) => {
      gsap.set(b.querySelectorAll("[data-face]"), { stroke: EDGE_DIM });
      gsap.set(b.querySelectorAll('[data-face="top"]'), { fill: DIM.top });
      gsap.set(b.querySelectorAll('[data-face="right"]'), { fill: DIM.right });
      gsap.set(b.querySelectorAll('[data-face="left"]'), { fill: DIM.left });
    });

    // ── the copy ────────────────────────────────────────────────────────────
    // Panel 0 gets no entrance: the reader arrives with the section already on
    // screen, and fading its first words in makes the sticky lock look like a
    // page load.
    panels.forEach((el, i) => {
      if (i > 0) {
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: IN_DUR, ease: "power2.out" },
          slot(i)
        );
      }
      // The last panel never leaves: it has to still be there when the sticky
      // releases, or the section blanks for the final stretch of travel.
      if (i < panels.length - 1) {
        tl.to(el, { autoAlpha: 0, y: -16, duration: OUT_DUR, ease: "power2.in" }, slot(i) + OUT_AT);
      }
    });

    // ── the apparatus, station by station ───────────────────────────────────
    STEPS.forEach((_, i) => {
      const block = blocks[i];
      const at = slot(i) + SPAN * 0.04;
      const lightUp = SPAN * 0.14;

      tl.to(block.querySelectorAll('[data-face="top"]'), { fill: LIT.top, duration: lightUp }, at)
        .to(block.querySelectorAll('[data-face="right"]'), { fill: LIT.right, duration: lightUp }, at)
        .to(block.querySelectorAll('[data-face="left"]'), { fill: LIT.left, duration: lightUp }, at)
        .to(block.querySelectorAll("[data-face]"), { stroke: TRACE, duration: lightUp }, at)
        .to(labels[i], { autoAlpha: 1, duration: lightUp }, at + SPAN * 0.04)
        // One leg per slot: the leg LEAVING station `i` is what carries the
        // reader to station `i + 1`, and the fourth closes back onto 0.
        .to(
          legs[i],
          { strokeDashoffset: 0, duration: LEG_DUR, ease: "power1.inOut" },
          slot(i) + LEG_AT
        );
    });

    // ── the fifth beat: the circuit overruns its own start ──────────────────
    // The overlay rides the FIRST leg a second time in the bright end of the
    // ramp. Same path, second pass, which is the only honest way to draw "one
    // turn stronger" without inventing a second loop.
    tl.to(
      second,
      { strokeDashoffset: 0, duration: SPAN * 0.7, ease: "power1.inOut" },
      slot(STEPS.length) + SPAN * 0.08
    );

    return () => {
      carrier.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      off();
    };
  });

  return (
    // `data-bench` is NOT declared here — `enableScene` owns it, and a second
    // writer means the first re-render (this section HAS state) silently
    // disarms the sticky layout.
    <section
      ref={rootRef}
      id="how-it-works"
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/bench bg-ink py-[12svh] text-cream scroll-mt-[var(--site-header-block)]"
    >
      <Container>
        <div className="grid-ds items-end gap-y-6">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-white/40">{FLYWHEEL.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-[16ch] text-h1 text-balance">{FLYWHEEL.headline}</h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[42ch] text-body text-white/60 text-pretty">{FLYWHEEL.intro}</p>
          </div>
        </div>
      </Container>

      {/* No `overflow` on the track: any ancestor with a non-visible overflow
          becomes the sticky child's scroll container and the stickiness stops
          without an error anywhere. The clip belongs on the pinned child. */}
      <div
        data-track
        className="relative mt-16 group-data-[bench=on]/bench:mt-0 group-data-[bench=on]/bench:h-[calc(100svh+var(--travel))]"
      >
        <div className="group-data-[bench=on]/bench:sticky group-data-[bench=on]/bench:top-0 group-data-[bench=on]/bench:h-svh">
          <Container className="flex h-full items-center py-[7svh]">
            <Panel
              label="The loop · four stations"
              meta="One closed conduit"
              grid
              footer={<ActRail acts={ACTS} active={active} />}
              className="w-full"
            >
              <div className="grid-ds items-center gap-y-12 px-5 pb-10 pt-20 lg:px-8 lg:pb-12 lg:pt-24">
                {/* The figure is FIRST in source order below `lg` so a phone
                    reader meets the apparatus before five blocks of prose, and
                    both columns are placed explicitly into row 1 at `lg`: the
                    text column's `col-start-7` leaves auto-placement past
                    column 12, and without an explicit row it wraps below. */}
                <div className="order-first col-span-12 lg:order-none lg:col-span-6 lg:row-start-1">
                  {/* `relative` on the wrapper and not on a sibling: the labels
                      are positioned in % of the figure box, and a percentage
                      `top` resolves against the containing block's HEIGHT — an
                      empty relative div is 0 tall and every label would stack at
                      the origin. The svg's viewBox gives this box its height. */}
                  <div className="relative mx-auto w-full max-w-[40rem]">
                    <svg
                      viewBox={`0 0 ${W} ${H}`}
                      className="block w-full overflow-visible"
                      aria-hidden="true"
                    >
                      <polygon points={GROUND} fill="none" stroke={GROUND_STROKE} strokeWidth="1" />

                      {/* The conduit is present from the first frame on
                          purpose: the reader has to be able to see that it
                          closes before anything gets there, or the loop is a
                          surprise instead of an argument. */}
                      {CONDUIT_EDGES.map((d, i) => (
                        <path key={`edge-${i}`} d={d} fill="none" stroke={GUIDE} strokeWidth="1" />
                      ))}

                      {/* The carrier: one short dash on a 100-unit path, so the
                          gap is the rest of the loop and only one bead is ever
                          in the conduit. */}
                      <path
                        data-flow
                        d={CONDUIT_CENTRE}
                        fill="none"
                        stroke={TRACE}
                        strokeWidth="3"
                        strokeLinecap="round"
                        pathLength={PATH_LEN}
                        strokeDasharray="3 97"
                      />

                      {LEGS.map((d, i) => (
                        <path
                          key={`leg-${i}`}
                          data-leg
                          d={d}
                          fill="none"
                          stroke={TRACE}
                          strokeWidth="1.5"
                          pathLength={PATH_LEN}
                        />
                      ))}

                      <path
                        data-second
                        d={LEGS[0]}
                        fill="none"
                        stroke={SECOND_TURN}
                        strokeWidth="2.5"
                        pathLength={PATH_LEN}
                      />

                      {/* Blocks after the conduit: each one stands over the
                          joint where two legs meet and hides the un-mitred
                          corner. */}
                      {STATIONS.map((s, i) => (
                        <g key={STEPS[i].id} data-station>
                          <polygon
                            data-face="left"
                            points={s.leftFace}
                            fill={LIT.left}
                            stroke={TRACE}
                            strokeWidth="1"
                          />
                          <polygon
                            data-face="right"
                            points={s.rightFace}
                            fill={LIT.right}
                            stroke={TRACE}
                            strokeWidth="1"
                          />
                          <polygon
                            data-face="top"
                            points={s.topFace}
                            fill={LIT.top}
                            stroke={TRACE}
                            strokeWidth="1"
                          />
                        </g>
                      ))}
                    </svg>

                    {/* Labels in HTML and not <text>: inside a scaled viewBox an
                        SVG label is multiplied by the figure's scale and stops
                        matching the mono scale everywhere else on the page.
                        They are positioned as a % of the same geometry, so the
                        figure can be any width. */}
                    {STATIONS.map((s, i) => (
                      <span
                        key={STEPS[i].id}
                        data-station-label
                        // Wrapping and not `whitespace-nowrap`: the two side
                        // labels hang outward from the figure, and the longest
                        // of them ("04 A stronger base") runs past the panel's
                        // padding and gets sliced by its `overflow-hidden`. A
                        // measure in ch lets it take a second line instead.
                        className={`pointer-events-none absolute max-w-[12ch] text-micro-mono uppercase text-white/55 ${
                          s.labelAlign === "end"
                            ? "text-right"
                            : s.labelAlign === "start"
                              ? "text-left"
                              : "text-center"
                        }`}
                        style={{
                          left: `${s.labelLeftPct}%`,
                          top: `${s.labelTopPct}%`,
                          transform:
                            s.labelAlign === "center"
                              ? "translate(-50%, -50%)"
                              : s.labelAlign === "end"
                                ? "translate(-100%, -50%)"
                                : "translate(0, -50%)",
                        }}
                      >
                        {STEPS[i].index} {STEPS[i].short}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top-aligned, never centred: the beats are different heights
                    and centring makes the first line jump between them. */}
                <div className="col-span-12 space-y-14 lg:col-span-5 lg:col-start-8 lg:row-start-1 group-data-[bench=on]/bench:relative group-data-[bench=on]/bench:h-[42svh] group-data-[bench=on]/bench:space-y-0">
                  {STEPS.map((s) => (
                    <div
                      key={s.id}
                      data-panel
                      className="group-data-[bench=on]/bench:absolute group-data-[bench=on]/bench:inset-x-0 group-data-[bench=on]/bench:top-0"
                    >
                      <p className="text-micro-mono uppercase text-white/45">
                        {s.index} — {s.short}
                      </p>
                      <h3 className="mt-5 max-w-[18ch] text-h3 text-pretty">{s.title}</h3>
                      <p className="mt-5 max-w-[44ch] text-body-sm text-white/65 text-pretty">
                        {s.body}
                      </p>
                      <FlowRow intake={s.intake} emits={s.emits} />
                    </div>
                  ))}

                  {/* The fifth panel has no number, and that is the point: it is
                      not a step, it is what the four of them add up to. Its
                      in/out pair is step 01's, unchanged — the restart shown in
                      the readings rather than asserted in a sentence. */}
                  <div
                    data-panel
                    className="group-data-[bench=on]/bench:absolute group-data-[bench=on]/bench:inset-x-0 group-data-[bench=on]/bench:top-0"
                  >
                    <p className="text-micro-mono uppercase text-near-green-accent">
                      {STEPS[0].index} — {FLYWHEEL.restart.label}
                    </p>
                    <p className="mt-5 max-w-[30ch] text-h3-serif italic text-pretty">
                      {FLYWHEEL.closing}
                    </p>
                    <FlowRow intake={STEPS[0].intake} emits={STEPS[0].emits} />
                  </div>
                </div>
              </div>
            </Panel>
          </Container>
        </div>
      </div>
    </section>
  );
}

/**
 * What goes into the stage in view, and what comes out of it.
 *
 * Deliberately NOT a pair of `Readout`s. That piece sets its value in Kepler
 * italic so a FIGURE wins over its own label at a small size; hand it a
 * three-word phrase and all it does is make the phrase loud. These two are
 * mono, small, and identical in weight, because the argument is not either
 * phrase — it is that the left one is verbatim the right one of the step
 * before, all the way round.
 */
function FlowRow({ intake, emits }: { intake: string; emits: string }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6">
      <div>
        <p className="text-micro-mono uppercase text-white/35">In</p>
        <p className="mt-2 max-w-[22ch] text-caption-mono text-white/70">{intake}</p>
      </div>
      <div>
        <p className="text-micro-mono uppercase text-white/35">Out</p>
        <p className="mt-2 max-w-[22ch] text-caption-mono text-near-green-accent">{emits}</p>
      </div>
    </div>
  );
}
