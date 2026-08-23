"use client";

import type { CSSProperties } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { OPERATIONS } from "@/components/sections/foundation/foundationContent";

// §6 of variant C — the hand-off, and the only place this page raises its voice.
//
// A mass of 1px marks starts packed inside the Foundation's own boundary and,
// over the length of the section, leaves it: every mark travels out to one of
// twelve places on the rim and stays there. At the end the centre is empty, the
// rim is populated, and the ring that used to hold everything is a faint circle
// around nothing. The three activities are the stations of that journey — the
// copy changes while the mass is moving, so what the reader is told is what
// they are watching.
//
// ── Why this and not an arrow diagram ──────────────────────────────────────
// Arrows radiating from a hub say "this thing distributes". They do not say the
// hub gets SMALLER, which is the page's actual claim, because an arrow diagram
// has the same amount of hub at the end as at the start. Here the material is
// conserved and finite: nothing is created at the rim, everything there came
// out of the middle. That is the difference between a distribution and a
// devolution, and it is the reason the marks travel rather than fade in.
//
// ── Why the twelve destinations ────────────────────────────────────────────
// Twelve because `ECOSYSTEM_MARKS` has twelve entries and the section directly
// below this one shows them. Nothing labels the clusters here — labelled, this
// becomes an org chart — but the reader who scrolls on meets twelve builders
// immediately after watching the mass settle into twelve places. If that list
// ever changes length, `CLUSTERS` should follow it.
//
// ── Degradation ────────────────────────────────────────────────────────────
// The JSX renders the FINAL state: marks already at the rim, the ring already
// faint, the three stations stacked in normal flow. The scene winds that back
// and replays it. Without JS, on a phone, or with reduced motion, the reader
// gets the finished picture plus all three station texts — the whole section,
// just not animated. Nothing here is pre-hidden in CSS, which is the rule
// `useScrollReveal` documents and the reason this file has no initial-state
// classes anywhere.

// Scroll length of the pinned stretch. Three stations, so it is a multiple of
// three: retiming one station means changing STATION_SVH, never this.
const STATION_SVH = 80;
const TRAVEL_SVH = STATION_SVH * OPERATIONS.activities.length;
const TRAVEL = `${TRAVEL_SVH}svh`;

// ── Figure ──────────────────────────────────────────────────────────────────
const W = 1000;
const H = 680;
const CX = W / 2;
const CY = H / 2;

const CLUSTERS = 12;
const PER_CLUSTER = 11;
const MARKS = CLUSTERS * PER_CLUSTER;

/** The Foundation's boundary, and the radius the mass starts packed inside. */
const CORE_R = 118;
const PACK_R = 96;
/** Where the rim sits, and how far a cluster spreads once it gets there. */
const RIM_R = 268;
const CLUSTER_R = 34;
/** Length of one mark. Short enough to read as a particle, long enough to have a direction. */
const MARK_LEN = 9;

// Trig-derived coordinates are rounded before they reach the DOM. `Math.sin`
// and `Math.cos` are explicitly NOT required to be correctly rounded, so Node
// and the browser disagree in the last ulp and React fails to hydrate over it.
// Four decimals is far below a pixel and identical on both sides. Same fix as
// `chain/chainDiagram.ts`.
const round = (n: number) => Math.round(n * 1e4) / 1e4;

const rand = createSeededRandom(9187);

const FIELD = Array.from({ length: MARKS }, (_, i) => {
  // The DOM order cycles through the clusters rather than filling one at a
  // time, so a linear stagger populates all twelve rims evenly. Filled in
  // order, the reader would watch the ecosystem being built clockwise, which is
  // a sequence the copy never claims.
  const cluster = i % CLUSTERS;

  // sqrt on the radius: without it a uniform draw piles the marks at the centre
  // of every disc, because area grows with r².
  const packA = rand() * Math.PI * 2;
  const packR = Math.sqrt(rand()) * PACK_R;
  const spreadA = rand() * Math.PI * 2;
  const spreadR = Math.sqrt(rand()) * CLUSTER_R;
  const tilt = rand() * Math.PI;

  const rimA = (cluster / CLUSTERS) * Math.PI * 2 - Math.PI / 2;
  const ex = CX + Math.cos(rimA) * RIM_R + Math.cos(spreadA) * spreadR;
  const ey = CY + Math.sin(rimA) * RIM_R + Math.sin(spreadA) * spreadR;

  return {
    // The mark is drawn at its DESTINATION and translated back by the effect,
    // which is what makes the rendered markup the final state.
    x1: round(ex - (Math.cos(tilt) * MARK_LEN) / 2),
    y1: round(ey - (Math.sin(tilt) * MARK_LEN) / 2),
    x2: round(ex + (Math.cos(tilt) * MARK_LEN) / 2),
    y2: round(ey + (Math.sin(tilt) * MARK_LEN) / 2),
    // The translation that takes it back into the core.
    dx: round(CX + Math.cos(packA) * packR - ex),
    dy: round(CY + Math.sin(packA) * packR - ey),
  };
});

// Opacity of the boundary at the start and at the end. It does not go to zero:
// the Foundation is not planning to disappear, it is planning to be smaller,
// and a ring that vanishes says the wrong one of those two.
const CORE_FROM = 0.5;
const CORE_TO = 0.1;

// The mass leaves over most of the timeline, but not all of it: the lead-in
// gives the reader a beat with a full core before anything moves, and the tail
// lets the last marks land before the section releases.
const DEPART_START = 0.05;
const DEPART_SPAN = 0.8;
const DEPART_DUR = 0.14;

const CUTS = OPERATIONS.activities.map((_, i) => i / OPERATIONS.activities.length);
const FADE = 0.05;

// How much of the timeline the release takes and how far the content lifts. A
// sticky element releases instantly — one frame held, the next at full scroll
// speed — and lifting the content slightly over the last stretch means it is
// already moving when the release happens, so the two speeds meet instead of
// colliding. Same fix, same numbers, as `quantum/ThreatSequence`.
const RELEASE_SPAN = 0.14;
const RELEASE_LIFT = 0.055;

export default function HandoffScene() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const panels = q("[data-station]");
    if (panels.length !== OPERATIONS.activities.length) return;

    const sceneOff = enableScene(scope, "hand");
    const tl = trackTimeline(scope, { scrub: 0.35 });

    const marks = q<SVGLineElement>("[data-mark]");
    gsap.set(panels.slice(1), { autoAlpha: 0 });

    tl.from(
      marks,
      {
        x: (i: number) => FIELD[i].dx,
        y: (i: number) => FIELD[i].dy,
        duration: DEPART_DUR,
        // `power2.inOut` and not an out-ease: a mark that leaves fast and
        // coasts reads as being thrown. Easing in and out means it detaches,
        // travels and settles, which is what a hand-off looks like.
        ease: "power2.inOut",
        stagger: { each: DEPART_SPAN / (marks.length - 1) },
      },
      DEPART_START
    ).fromTo(
      q("[data-core]"),
      { opacity: CORE_FROM },
      { opacity: CORE_TO, duration: DEPART_SPAN, ease: "none" },
      DEPART_START
    );

    // ── the stations ────────────────────────────────────────────────────────
    // Hard-cut in, cross-fade out. The copy changes while the mass is mid-flight
    // and both fading at once leaves a stretch where neither station is legible.
    panels.forEach((panel, i) => {
      if (i > 0) {
        tl.to(panel, { autoAlpha: 1, duration: FADE, ease: "none" }, CUTS[i]);
        tl.to(panels[i - 1], { autoAlpha: 0, duration: FADE, ease: "none" }, CUTS[i]);
      }
    });

    const stuck = q("[data-hand-content]")[0];
    if (stuck) {
      tl.fromTo(
        stuck,
        { y: 0 },
        // Function-based value plus `invalidateOnRefresh` (which `trackTimeline`
        // sets): GSAP does not parse `svh`, and the distance has to survive a
        // resize.
        { y: () => -window.innerHeight * RELEASE_LIFT, ease: "power2.in", duration: RELEASE_SPAN },
        1 - RELEASE_SPAN
      );
    }

    return () => {
      sceneOff();
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(panels, { clearProps: "opacity,visibility" });
      gsap.set(marks, { clearProps: "transform" });
      if (stuck) gsap.set(stuck, { clearProps: "transform" });
    };
  });

  return (
    // No `overflow-hidden` on the track: an ancestor with overflow other than
    // visible becomes the sticky child's scroll container and it silently stops
    // sticking. `data-hand` is NOT declared here — `enableScene` writes it from
    // the effect and nothing else touches it, which is the rule that helper
    // exists to enforce.
    <section
      ref={rootRef}
      data-nav-dark
      style={{ "--travel": TRAVEL } as CSSProperties}
      className="group/hand relative bg-ink text-cream data-[hand=on]:h-[calc(100svh+var(--travel))]"
    >
      <div className="relative group-data-[hand=on]/hand:sticky group-data-[hand=on]/hand:top-0 group-data-[hand=on]/hand:h-svh">
        <Container
          data-hand-content
          className="flex flex-col justify-center gap-[5svh] py-[12svh] group-data-[hand=on]/hand:h-full group-data-[hand=on]/hand:pt-[14svh]"
        >
          {/* The frame: what does not change while the mass moves. It is set
              small — the section's own heading at `text-h4` under a station
              title at `text-h3` — because the station is what the reader is
              here for and the heading is only telling them which section they
              are in. Inverting the two makes the scene look like a chapter
              opener with a diagram attached. */}
          <div className="grid-ds gap-y-5">
            <div className="col-span-12">
              <Eyebrow className="text-cream/50">{OPERATIONS.eyebrow}</Eyebrow>
            </div>
            <h2 className="col-span-12 max-w-[20ch] text-h4 lg:col-span-4 text-pretty">
              {OPERATIONS.headline}
            </h2>
            <p className="col-span-12 max-w-[64ch] text-body-sm text-cream/60 lg:col-span-7 lg:col-start-6 text-pretty">
              {OPERATIONS.intro}
            </p>
          </div>

          <div className="grid-ds items-center gap-y-14">
            {/* One grid cell for all three stations when the scene is on, so
                the frame never reflows between them; with the scene disarmed
                they fall back into normal flow and stack. */}
            <div className="col-span-12 grid gap-y-14 lg:col-span-4">
              {OPERATIONS.activities.map((activity) => (
                <div
                  key={activity.id}
                  data-station
                  className="group-data-[hand=on]/hand:[grid-area:1/1]"
                >
                  <p className="text-caption-mono text-cream/50">{activity.index}</p>
                  <h3 className="mt-6 max-w-[16ch] text-h3 text-balance">{activity.title}</h3>
                  <p className="mt-6 max-w-[36ch] text-body-lg text-cream/70 text-pretty">
                    {activity.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="mx-auto w-full max-w-[38rem] text-cream"
                aria-hidden="true"
              >
                <circle
                  data-core
                  cx={CX}
                  cy={CY}
                  r={CORE_R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity={CORE_TO}
                />
                {FIELD.map((m, i) => (
                  <line
                    key={i}
                    data-mark
                    x1={m.x1}
                    y1={m.y1}
                    x2={m.x2}
                    y2={m.y2}
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.62"
                  />
                ))}
              </svg>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
