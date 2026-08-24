"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { FLYWHEEL } from "@/components/sections/economics/economicsContent";
import { SIZE, C, R, STOPS, ARCS } from "@/components/sections/economics/a/loopRing";

// §3 of variant A — the flywheel as ONE sticky scene, and the centre of gravity
// of the whole page.
//
// ── The one thing this section exists to prevent ───────────────────────────
// Step 4 only means anything as the thing that restarts step 1. Any layout that
// lets a reader take the four steps out of order — four cards, a grid, an
// accordion — has already lost the argument, because it presents as four
// independent facts what is actually one movement. So the steps are not
// four blocks: they are four positions on a single stroke, and the reader
// cannot reach the third without having watched the second arrive.
//
// ── Why the trace does not stop ────────────────────────────────────────────
// There is a FIFTH beat, and it is the point of the section. When the stroke
// closes back onto the first node it does not park there: it carries straight
// on into the first leg again, brighter, while the closing line reads. A loop
// that finishes its lap and halts is a diagram of a cycle. A loop that overruns
// its own start is a diagram of a flywheel, which is the claim.
//
// ── Degradation ────────────────────────────────────────────────────────────
// The JSX renders the figure in its FINAL state — every leg drawn, the second
// turn already begun — and the scene, when it runs, winds it back to an empty
// ring and rebuilds it. That ordering is the rule `useScrollReveal` documents:
// never pre-hide in CSS, or a failed bundle leaves the section blank forever.
// Without JS, on a phone, or with reduced motion, the reader gets the completed
// ring and five stacked text blocks in order — the whole argument, unanimated.
//
// Sticky is CSS, never `pin: true` — see components/sections/README.md.

const STEPS = FLYWHEEL.steps;
// Four steps plus the return. The return is a real slot and not a tail on the
// fourth: given no travel of its own it plays while the fourth step is still
// being read, and the two collide.
const SLOTS = STEPS.length + 1;
// Per slot, in svh of sticky travel. Slightly under `CapabilityStack`'s 78:
// there is one more slot here and the figure carries a larger share of the
// meaning, so each beat needs less dwell on its prose.
const TRAVEL_SVH = SLOTS * 72;
const TRAVEL = `${TRAVEL_SVH}svh`;

// ── Timeline map ───────────────────────────────────────────────────────────
// The scrubbed timeline runs 0 → 1 over the sticky travel, so one slot is
// exactly 1/SLOTS and every position below is expressed against `slot(i)`.
const SPAN = 1 / SLOTS;
const slot = (i: number) => i * SPAN;

// Type arrives fast and the beat then HOLDS. The hold is not a tween — it is
// the gap between the copy landing and the out-fade starting. Widen SPAN and
// the hold widens with it; that is the only knob.
const IN_DUR = SPAN * 0.16;
const OUT_AT = SPAN * 0.82;
const OUT_DUR = SPAN * 0.11;

// The leg starts drawing a beat into its own slot — after the copy has landed —
// and takes most of what is left, so it ARRIVES at the next node just as that
// node's copy begins. The overlap is what makes the stroke feel like it is
// pulling the reader rather than illustrating them.
const LEG_AT = SPAN * 0.24;
const LEG_DUR = SPAN * 0.78;

// Strokes. Literals and not `var(--token)`: GSAP interpolates colours, not
// declarations. `TRACE` mirrors `--near-green-accent` (#00dc8d), which is the
// green that is legible on ink; it is declared here rather than in
// `motionColors` because only this scene animates it — that module's own rule.
const GUIDE = "rgba(255,255,255,0.12)";
const TRACE = "#00dc8d";
const SECOND_TURN = CTA_RAMP[2];

// `pathLength` is 100 and not 1 because GSAP's CSSPlugin rounds pixel-unit
// values by default (`autoRound`) and `stroke-dashoffset` is a pixel property:
// normalised to 1 every draw SNAPS from undrawn to drawn with nothing in
// between, and nothing errors. The long version is in `chain/CapabilityStack`.
const PATH_LEN = 100;

export default function LoopScene() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    // Mobile and reduced-motion both fall through to the static composition,
    // which is already correct — see the note above.
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    if (!track) return;

    const off = enableScene(scope, "loop");
    const tl = trackTimeline(track);

    const panels = q("[data-panel]");
    const legs = q<SVGPathElement>("[data-leg]");
    const nodes = q<SVGGElement>("[data-node]");
    const second = q<SVGPathElement>("[data-second]");
    const labels = q("[data-node-label]");

    // ── wound back to an empty ring ─────────────────────────────────────────
    gsap.set([...legs, ...second], { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set(nodes, { scale: 0, transformOrigin: "center", autoAlpha: 0 });
    gsap.set(labels, { autoAlpha: 0 });
    gsap.set(panels.slice(1), { autoAlpha: 0 });

    // ── the copy ────────────────────────────────────────────────────────────
    // Panel 0 gets no entrance: the reader arrives with the section already on
    // screen, and fading its first words in from nothing makes the sticky lock
    // look like a page load.
    panels.forEach((el, i) => {
      if (i > 0) {
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: IN_DUR, ease: "power2.out" },
          slot(i)
        );
      }
      // The last panel never leaves: it has to still be on screen when the
      // sticky releases, or the section blanks for the final stretch of travel.
      if (i < panels.length - 1) {
        tl.to(el, { autoAlpha: 0, y: -16, duration: OUT_DUR, ease: "power2.in" }, slot(i) + OUT_AT);
      }
    });

    // ── the ring, node by node ──────────────────────────────────────────────
    STEPS.forEach((_, i) => {
      tl.to(
        nodes[i],
        { scale: 1, autoAlpha: 1, duration: SPAN * 0.12, ease: "back.out(2)" },
        slot(i) + SPAN * 0.04
      )
        .to(labels[i], { autoAlpha: 1, duration: SPAN * 0.12 }, slot(i) + SPAN * 0.08)
        // One leg per slot, and the leg leaving node `i` is what carries the
        // reader to node `i + 1`. The fourth leg closes onto node 0.
        .to(
          legs[i],
          { strokeDashoffset: 0, duration: LEG_DUR, ease: "power1.inOut" },
          slot(i) + LEG_AT
        );
    });

    // ── the fifth beat: the trace overruns its own start ────────────────────
    // The overlay rides the FIRST leg again, in the brighter end of the ramp.
    // Same path, second pass — which is the only honest way to draw "one turn
    // stronger" without inventing a second ring.
    tl.to(
      nodes[0],
      { scale: 1.35, duration: SPAN * 0.14, ease: "power2.out", yoyo: true, repeat: 1 },
      slot(STEPS.length) + SPAN * 0.02
    ).to(
      second,
      { strokeDashoffset: 0, duration: SPAN * 0.7, ease: "power1.inOut" },
      slot(STEPS.length) + SPAN * 0.1
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      off();
    };
  });

  return (
    // `data-loop` is NOT declared here — `enableScene` owns it, and a second
    // writer means the first re-render silently disarms the sticky layout.
    <section
      ref={rootRef}
      id="how-it-works"
      data-nav-dark
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/loop bg-ink text-cream"
    >
      <Container>
        <div className="pt-[14svh]">
          <Eyebrow className="text-white/45">{FLYWHEEL.eyebrow}</Eyebrow>
          <div className="mt-12 grid-ds gap-y-10">
            <h2 className="col-span-12 max-w-[16ch] text-h1 text-pretty lg:col-span-6">
              {FLYWHEEL.headline}
            </h2>
            <p className="col-span-12 max-w-[54ch] text-body-lg text-white/65 text-pretty lg:col-span-5 lg:col-start-8">
              {FLYWHEEL.intro}
            </p>
          </div>
        </div>
      </Container>

      {/* No `overflow` on the track: any ancestor with a non-visible overflow
          becomes the sticky child's scroll container and the stickiness stops
          without any error. The clip belongs on the pinned child, which may
          have it. */}
      <div
        data-track
        className="relative mt-[10svh] pb-[14svh] group-data-[loop=on]/loop:mt-0 group-data-[loop=on]/loop:h-[calc(100svh+var(--travel))] group-data-[loop=on]/loop:pb-0"
      >
        <div className="relative overflow-hidden group-data-[loop=on]/loop:sticky group-data-[loop=on]/loop:top-0 group-data-[loop=on]/loop:h-svh">
          <Container className="grid h-full grid-cols-12 items-center gap-x-[var(--grid-gutter)] gap-y-16">
            {/* The figure is FIRST in source order below `lg`, so a phone
                reader meets the picture before five blocks of prose, and moves
                to the right-hand column once there are two columns to have.
                Both columns are placed explicitly into row 1 at `lg`: the
                figure's `col-start-7` leaves grid auto-placement past column
                12, so without an explicit row the text column wraps below it
                instead of sitting beside it. */}
            <div className="order-first col-span-12 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-1">
              <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
                <svg
                  viewBox={`0 0 ${SIZE} ${SIZE}`}
                  className="absolute inset-0 h-full w-full overflow-visible"
                  aria-hidden="true"
                >
                  {/* The unlit ring. It is present from the first frame on
                      purpose: the reader should be able to see that the path
                      closes before the stroke gets there, or the loop is a
                      surprise rather than an argument. */}
                  <circle cx={C} cy={C} r={R} fill="none" stroke={GUIDE} strokeWidth="1" />

                  {ARCS.map((d, i) => (
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

                  {/* The second turn, on the first leg. */}
                  <path
                    data-second
                    d={ARCS[0]}
                    fill="none"
                    stroke={SECOND_TURN}
                    strokeWidth="2.5"
                    pathLength={PATH_LEN}
                  />

                  {STOPS.map((s, i) => (
                    <g key={STEPS[i].id} data-node>
                      <circle cx={s.x} cy={s.y} r="9" fill="#101010" />
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r="4.5"
                        fill={i === 0 ? SECOND_TURN : TRACE}
                      />
                    </g>
                  ))}
                </svg>

                {/* Labels in HTML rather than <text>: inside a scaled viewBox
                    an SVG label's size is multiplied by the figure's scale, so
                    it would stop matching the mono scale on the rest of the
                    page. Positions come from the same geometry module. */}
                {STOPS.map((s, i) => (
                  <span
                    key={STEPS[i].id}
                    data-node-label
                    className="absolute whitespace-nowrap text-caption-mono text-white/55"
                    style={{
                      left: `${s.leftPct}%`,
                      top: `${s.topPct}%`,
                      transform:
                        s.align === "center"
                          ? "translate(-50%, -50%)"
                          : s.align === "end"
                            ? "translate(-100%, -50%)"
                            : "translate(0, -50%)",
                    }}
                  >
                    {STEPS[i].index} {STEPS[i].short}
                  </span>
                ))}
              </div>
            </div>

            {/* Top-aligned, never centred: the beats are different heights, and
                centring makes the first line jump between them. */}
            <div className="col-span-12 space-y-16 lg:col-span-5 lg:col-start-1 lg:row-start-1 group-data-[loop=on]/loop:relative group-data-[loop=on]/loop:h-[54svh] group-data-[loop=on]/loop:space-y-0">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  data-panel
                  className="group-data-[loop=on]/loop:absolute group-data-[loop=on]/loop:inset-x-0 group-data-[loop=on]/loop:top-0"
                >
                  <p className="text-caption-mono text-white/45">
                    {s.index} — {s.short}
                  </p>
                  <h3 className="mt-6 max-w-[16ch] text-h2 text-pretty">{s.title}</h3>
                  <p className="mt-6 max-w-[46ch] text-body text-white/70 text-pretty">{s.body}</p>
                </div>
              ))}

              {/* The fifth panel has no number, and that is the point: it is not
                  a step, it is what the four of them add up to. */}
              <div
                data-panel
                className="group-data-[loop=on]/loop:absolute group-data-[loop=on]/loop:inset-x-0 group-data-[loop=on]/loop:top-0"
              >
                <p className="text-caption-mono text-near-green-accent">
                  {STEPS[0].index} — {STEPS[0].short}, again
                </p>
                <p className="mt-6 max-w-[30ch] text-h3-serif italic text-pretty">
                  {FLYWHEEL.closing}
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
