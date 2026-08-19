"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { CTA_RAMP, NEAR_TEAL } from "@/components/primitives/motion/motionColors";
import { CAPABILITIES } from "@/components/sections/chain/chainContent";
import {
  SIZE, C, R_CORE, SATELLITES, SPOKES,
  RACE_PATHS, RACE_FROM, RACE_WINNER, MOVE_FROM, MOVE_TO,
} from "@/components/sections/chain/chainDiagram";

// §3 — the four capabilities, as ONE sticky composition with a figure that
// never resets.
//
// ── The idea the section is built on ───────────────────────────────────────
// The copy's last beat says the other three "share one foundation", and the
// closing section says each layer makes the others more useful. A figure that
// wiped between beats would contradict that on screen while the type asserted
// it. So the diagram ACCUMULATES: the account and its spokes are drawn in beat
// one and are still there in beat four, when authority finally travels down
// them. By the end the reader is looking at everything at once, which is the
// argument.
//
// ── Degradation ────────────────────────────────────────────────────────────
// The JSX renders the figure in its FINAL state — every spoke drawn, the race
// decided, the asset arrived. The scene, when it runs, sets it back to empty
// and rebuilds it. That ordering is deliberate and is the same rule
// `useScrollReveal` documents: never pre-hide in CSS, or a failed bundle leaves
// the section blank forever. Without JS, on a phone, or with reduced motion,
// the reader gets the completed diagram and four stacked text blocks.
//
// Sticky via CSS, never `pin: true` — see components/sections/README.md.

const BEATS = CAPABILITIES.length;
// Per beat, in svh of pinned travel. Four beats at ~78 lands the section a
// little under ThreatSequence's per-beat pace, which is right: these beats are
// shorter to read and the figure carries part of the load.
const TRAVEL_SVH = BEATS * 78;
const TRAVEL = `${TRAVEL_SVH}svh`;

// ── Timeline map ───────────────────────────────────────────────────────────
// The scrubbed timeline runs 0 → 1 over the pinned travel, so one beat is
// exactly 1/BEATS and every position below is expressed against `beat(i)`.
const SPAN = 1 / BEATS;
const beat = (i: number) => i * SPAN;

// Type arrives fast and then the beat HOLDS. The hold is not a tween — it is
// the gap between the body landing and the out-fade starting. Widen SPAN and
// the hold widens with it; that is the only knob.
const IN_DUR = 0.045;
const OUT_AT = SPAN * 0.84; // into the beat
const OUT_DUR = 0.04;

// Strokes. Literals and not `var(--token)`: GSAP interpolates colours, not
// declarations. The dim value is the resting spoke on `--ink-slate`.
const DIM = "rgba(255,255,255,0.16)";
const LIVE = CTA_RAMP[0];

// ── Why every stroke below carries `pathLength="100"` and not `pathLength={PATH_LEN}` ──
// GSAP's CSSPlugin rounds pixel-unit values to whole numbers by default
// (`autoRound`), and `stroke-dashoffset` is a pixel property. Normalised to 1,
// every draw on this page therefore SNAPPED: the offset was rounded to 1 until
// it crossed 0.5 and then to 0, so a spoke was either undrawn or fully drawn
// with nothing in between. It looked like a stagger of instant appearances,
// which is exactly what it was.
//
// Normalising to 100 puts the whole animation on integers — 100 steps down to
// 0 — so the rounding has nothing left to destroy. `autoRound: false` on each
// tween would also work, but it has to be remembered on every tween that ever
// touches a dash, and forgetting it fails silently in exactly this way.
const PATH_LEN = 100;

// The travelling pulse in beat four, as a percentage of a spoke.
//
// The dash and its gap sum to exactly 1 — one whole path — which is what makes
// the dash travel the spoke as the offset winds down. The consequence is that
// the pattern REPEATS with period 1, so an offset of 0 is the same picture as an
// offset of 1: the dash back at the centre. Animating to 0 therefore ran the
// pulse out to the node and then wrapped it home, and twelve of them landing at
// once read as a blob over the account mark.
//
// Ending at PULSE_DASH instead stops one dash-length short of the wrap, which
// puts the dash exactly on the satellite — the pulse arrives and stays arrived.
const PULSE_DASH = 14;

export default function CapabilityStack() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    // Mobile and reduced-motion both fall through to the static composition.
    // The figure is already correct there — see the note above.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "stack");
    const tl = trackTimeline(scope);

    const beats = q("[data-beat]");
    const spokes = q<SVGPathElement>("[data-spoke]");
    const nodes = q<SVGCircleElement>("[data-node]");
    const labels = q("[data-node-label]");
    const races = q<SVGPathElement>("[data-race]");
    const pulses = q<SVGPathElement>("[data-pulse]");

    // ── initial state ───────────────────────────────────────────────────────
    // Everything the scene will build, wound back to nothing. `pathLength={PATH_LEN}`
    // on every stroke is what makes this plugin-free: a dash array of 1 is one
    // whole path, whatever its real length, so the draw is the same two lines
    // for a 226-unit spoke and a bowed solver curve.
    gsap.set([...spokes, ...races], { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set(spokes, { stroke: DIM });
    gsap.set(nodes, { scale: 0, transformOrigin: "center", autoAlpha: 0 });
    gsap.set(labels, { autoAlpha: 0 });
    gsap.set(q("[data-core]"), { scale: 0, transformOrigin: "center" });
    gsap.set(q("[data-core-inner]"), { autoAlpha: 0, scale: 0.4, transformOrigin: "center" });
    gsap.set(q("[data-token]"), { autoAlpha: 0 });
    gsap.set(q("[data-ghost]"), { autoAlpha: 0 });
    gsap.set(pulses, {
      strokeDasharray: `${PULSE_DASH} ${PATH_LEN - PULSE_DASH}`,
      strokeDashoffset: PATH_LEN,
      autoAlpha: 0,
    });
    gsap.set(beats.slice(1), { autoAlpha: 0 });

    // ── beat copy ───────────────────────────────────────────────────────────
    // Beat 0 is already visible, so it gets no entrance: the section is dark and
    // the reader arrives with it on screen. Fading it in from nothing would make
    // the sticky lock look like a load.
    beats.forEach((el, i) => {
      if (i > 0) {
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: IN_DUR, ease: "power2.out" },
          beat(i)
        );
      }
      // The last beat never leaves: it has to still be on screen when the
      // sticky releases, or the section blanks for the last stretch of travel.
      if (i < BEATS - 1) {
        tl.to(
          el,
          { autoAlpha: 0, y: -18, duration: OUT_DUR, ease: "power2.in" },
          beat(i) + OUT_AT
        );
      }
    });

    // ── beat 1 · the account and its reach ──────────────────────────────────
    tl.to(q("[data-core]"), { scale: 1, duration: 0.05, ease: "back.out(1.6)" }, beat(0) + 0.01)
      .to(spokes, { strokeDashoffset: 0, duration: 0.11, stagger: 0.006, ease: "power2.out" }, beat(0) + 0.04)
      // Each node lands as its own spoke arrives, not after all of them: the
      // same 0.006 stagger, offset by the length of one draw.
      .to(nodes, { scale: 1, autoAlpha: 1, duration: 0.05, stagger: 0.006, ease: "back.out(2)" }, beat(0) + 0.09)
      .to(labels, { autoAlpha: 1, duration: 0.05, stagger: 0.006 }, beat(0) + 0.1);

    // ── beat 2 · solvers compete ────────────────────────────────────────────
    // The three routes draw at DIFFERENT speeds and that is the whole point:
    // the race is the animation, not a decoration on top of it. The winner is
    // simply the one that finishes first.
    races.forEach((path, i) => {
      const isWinner = i === RACE_WINNER;
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: isWinner ? 0.09 : 0.15 + i * 0.02,
          ease: "power1.inOut",
        },
        beat(1) + 0.03
      );
    });

    tl.to(races[RACE_WINNER], { stroke: LIVE, strokeOpacity: 1, duration: 0.04 }, beat(1) + 0.12)
      // The losers do not vanish — they stay as faint evidence that there WAS a
      // choice. A route that disappears never competed.
      .to(
        races.filter((_, i) => i !== RACE_WINNER),
        { strokeOpacity: 0.18, duration: 0.05 },
        beat(1) + 0.12
      )
      .to(q("[data-race-node]"), { fill: LIVE, duration: 0.04 }, beat(1) + 0.13);

    // ── beat 3 · the asset moves, and stays itself ──────────────────────────
    const from = SATELLITES[MOVE_FROM];
    const to = SATELLITES[MOVE_TO];

    tl.set(q("[data-token]"), { x: from.x - C, y: from.y - C }, beat(2) + 0.01)
      .to(q("[data-token]"), { autoAlpha: 1, duration: 0.02 }, beat(2) + 0.01)
      .to(spokes[MOVE_FROM], { stroke: LIVE, duration: 0.03 }, beat(2) + 0.02)
      // Two straight legs through the centre. Straight because the spokes are
      // straight, which is also why this needs no motion-path plugin.
      .to(q("[data-token]"), { x: 0, y: 0, duration: 0.07, ease: "power1.inOut" }, beat(2) + 0.04)
      .to(spokes[MOVE_TO], { stroke: LIVE, duration: 0.03 }, beat(2) + 0.09)
      .to(
        q("[data-token]"),
        { x: to.x - C, y: to.y - C, duration: 0.07, ease: "power1.inOut" },
        beat(2) + 0.11
      )
      // The wrapped copy that does NOT happen: a dashed duplicate tries to form
      // at the destination and dissolves. It is the only thing on this page drawn
      // as a negative, and it earns it — "no wrapped tokens" is the claim the
      // reader is most likely to have heard before and least likely to believe.
      .to(q("[data-ghost]"), { autoAlpha: 0.5, duration: 0.03 }, beat(2) + 0.14)
      .to(q("[data-ghost]"), { autoAlpha: 0, scale: 1.5, duration: 0.06 }, beat(2) + 0.18);

    // ── beat 4 · authority travels ──────────────────────────────────────────
    // Every spoke at once, and only here. The first three beats each lit ONE
    // path; the primitive underneath lights all twelve, which is the difference
    // the copy is making.
    tl.to(q("[data-core-inner]"), { autoAlpha: 1, scale: 1, duration: 0.06, ease: "back.out(1.8)" }, beat(3) + 0.02)
      .to(pulses, { autoAlpha: 1, duration: 0.02 }, beat(3) + 0.04)
      .to(pulses, { strokeDashoffset: PULSE_DASH, duration: 0.12, ease: "power1.inOut" }, beat(3) + 0.04)
      .to(spokes, { stroke: NEAR_TEAL, strokeOpacity: 0.7, duration: 0.06, stagger: 0.004 }, beat(3) + 0.1)
      .to(nodes, { fill: LIVE, duration: 0.05, stagger: 0.004 }, beat(3) + 0.12)
      .to(pulses, { autoAlpha: 0, duration: 0.03 }, beat(3) + 0.18);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      off();
    };
  });

  return (
    // No overflow-hidden on the track: any ancestor with a non-visible overflow
    // becomes the sticky child's scroll container and the stickiness silently
    // stops. `data-stack` is NOT declared here — `enableScene` owns it.
    <section
      ref={rootRef}
      data-nav-dark
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/stack relative bg-ink-slate text-white data-[stack=on]:h-[calc(100svh+var(--travel))]"
    >
      <div className="relative overflow-hidden py-[12svh] group-data-[stack=on]/stack:sticky group-data-[stack=on]/stack:top-0 group-data-[stack=on]/stack:h-svh group-data-[stack=on]/stack:py-0">
        <Container className="grid h-full grid-cols-12 items-center gap-x-[var(--grid-gutter)] gap-y-16">
          {/* ── the figure ───────────────────────────────────────────────── */}
          {/* First in the source order on small screens so the reader meets the
              picture before four blocks of prose; back to the right-hand column
              once there are two columns to have. */}
          {/* Both columns are placed EXPLICITLY into row 1 at lg. Without the
              row-start, the figure's `col-start-7` leaves the auto-placement
              cursor past column 12, so the text column — which has no explicit
              placement — wraps to a second row and the two stack instead of
              sitting side by side. Below lg neither has a row-start, so they
              stack in source order, which is what mobile wants. */}
          <div className="order-first col-span-12 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                {/* spokes */}
                {SPOKES.map((d, i) => (
                  <path
                    key={`spoke-${i}`}
                    data-spoke
                    d={d}
                    fill="none"
                    stroke={DIM}
                    strokeWidth="1"
                    pathLength={PATH_LEN}
                  />
                ))}

                {/* the pulse layer rides the same spokes, one dash each */}
                {SPOKES.map((d, i) => (
                  <path
                    key={`pulse-${i}`}
                    data-pulse
                    d={d}
                    fill="none"
                    stroke={CTA_RAMP[1]}
                    strokeWidth="2"
                    pathLength={PATH_LEN}
                    opacity="0"
                  />
                ))}

                {/* the solver race */}
                {RACE_PATHS.map((d, i) => (
                  <path
                    key={`race-${i}`}
                    data-race
                    d={d}
                    fill="none"
                    stroke={i === RACE_WINNER ? LIVE : "rgba(255,255,255,0.9)"}
                    strokeOpacity={i === RACE_WINNER ? 1 : 0.18}
                    strokeWidth={i === RACE_WINNER ? 1.75 : 1}
                    pathLength={PATH_LEN}
                  />
                ))}

                {/* satellites */}
                {SATELLITES.map((s, i) => (
                  <circle
                    key={s.label}
                    data-node
                    data-race-node={i === RACE_FROM ? "" : undefined}
                    cx={s.x}
                    cy={s.y}
                    r="5"
                    fill={i === RACE_FROM ? LIVE : "#ffffff"}
                  />
                ))}

                {/* the account */}
                <g data-core>
                  <circle cx={C} cy={C} r={R_CORE} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                  <circle cx={C} cy={C} r="4" fill="#ffffff" />
                </g>
                {/* the authority mark, revealed in beat four */}
                <g data-core-inner>
                  <circle cx={C} cy={C} r={R_CORE - 11} fill="none" stroke={CTA_RAMP[1]} strokeWidth="1" />
                  <circle cx={C} cy={C} r={R_CORE + 13} fill="none" stroke={LIVE} strokeWidth="1" strokeOpacity="0.5" />
                </g>

                {/* the asset in transit, parked where it ends up */}
                {/* Two nested translates, and the order matters: GSAP's x/y REPLACES
                    the transform attribute of the element it animates, so the outer
                    group carries the offset FROM the centre (which the scene overwrites)
                    and the inner one carries the centre itself (which it must not). At
                    rest the two compose to the destination satellite — where the asset
                    ends up. */}
                <g
                  data-token
                  transform={`translate(${SATELLITES[MOVE_TO].x - C} ${SATELLITES[MOVE_TO].y - C})`}
                >
                  <g transform={`translate(${C} ${C})`}>
                    <rect x="-7" y="-7" width="14" height="14" fill={CTA_RAMP[1]} transform="rotate(45)" />
                  </g>
                </g>

                {/* the wrapped copy that never forms */}
                <g data-ghost opacity="0">
                  <rect
                    x={SATELLITES[MOVE_TO].x - 11}
                    y={SATELLITES[MOVE_TO].y - 11}
                    width="22"
                    height="22"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                </g>
              </svg>

              {/* Labels in HTML rather than <text>: inside a scaled viewBox an
                  SVG label's size is multiplied by the figure's scale, so it
                  would stop matching the mono scale everywhere else on the
                  page. Positions come from the same geometry module. */}
              {SATELLITES.map((s) => (
                <span
                  key={s.label}
                  data-node-label
                  className="absolute -translate-y-1/2 whitespace-nowrap text-caption-mono text-white/45"
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
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── the beats ────────────────────────────────────────────────── */}
          {/* Top-aligned, never centred: the beats are different heights, and
              centring makes the first line jump between them. */}
          <div className="col-span-12 space-y-20 lg:col-span-5 lg:col-start-1 lg:row-start-1 group-data-[stack=on]/stack:relative group-data-[stack=on]/stack:h-[50svh] group-data-[stack=on]/stack:space-y-0">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.id}
                data-beat
                className="group-data-[stack=on]/stack:absolute group-data-[stack=on]/stack:inset-x-0 group-data-[stack=on]/stack:top-0"
              >
                <p className="text-caption-mono text-white/40">
                  {cap.index} — {cap.eyebrow}
                </p>
                <h3 className="mt-6 max-w-[16ch] text-h2 text-pretty">{cap.title}</h3>
                <p className="mt-6 max-w-[46ch] text-body text-white/70 text-pretty">
                  {cap.body}
                </p>

                {cap.external ? (
                  <a
                    href={cap.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-label text-white transition-colors hover:border-white"
                  >
                    {cap.linkLabel}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={cap.href}
                    className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-label text-white transition-colors hover:border-white"
                  >
                    {cap.linkLabel}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
