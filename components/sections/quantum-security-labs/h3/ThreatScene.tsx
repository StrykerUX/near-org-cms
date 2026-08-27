"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { ArrowUpRight } from "lucide-react";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { keyField, KEY_SLOTS, slotPoint, round4 } from "@/components/sections/quantum-security-labs/quantumArt";
import { PROBLEM_SOLUTION_LEAD } from "@/components/sections/quantum-security-labs/labContent";
import { NEAR_MARK_PATH } from "@/components/sections/quantum-security-copy/NearMark";
import { SEQUENCE_BEATS as BEATS_COPY } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H3 · §Problem + §Solution, as one sticky scene ─────────────────────────
// The page's two beats in one pinned frame, built on the site's own sticky
// mechanism: `enableScene` + `trackTimeline`, CSS `position: sticky`, never
// `pin: true`. It is `chain-ab-propuesta-b`'s `StickyScrollCapabilities` — same
// helpers, same travel maths, same scrubbed cross-fade — carrying this page's
// content instead of that one's.
//
// **The figure ACCUMULATES; it never resets between beats.** Beat one draws the
// population of accounts with the exposed ones marked. Beat two does not wipe
// it: the exposed ones reach for a single account, the orbit appears around it,
// the classical key drifts out and the quantum-safe key arrives — with every
// dot from beat one still on screen. That is the argument. A figure that
// cleared itself between beats would contradict on screen what the copy asserts,
// which is that the answer applies to the field you were just shown. Same rule
// `CapabilityStack` states, for the same reason.
//
// **The account mark never moves, in any beat.** It is the only element in the
// scene with no transform on it at any point. The whole page is that sentence:
// the key is an attachment, the account stays.
//
// **The exposed dots are the ones that converge — not all of them.** Drawing
// every dot reaching for the account would say the whole population migrates at
// once. Nothing in the deck gives a share, so the field carries a caption
// rather than a percentage: a lit fraction that looked measured would be
// reporting a statistic no source here supports.
//
// **The JSX renders the FINAL state and the scene winds it back.** Nothing is
// pre-hidden in CSS. Without JS, on a phone, or with reduced motion the reader
// gets the completed diagram plus the two text blocks stacked in flow — which
// is the whole section, just not animated. Same rule the sticky sections on the
// chain pages document.
//
// H2 takes this content unpinned: two halves of one section split by a rule,
// with the same figure laid out horizontally and revealed once. That is the
// comparison — who drives the argument, the page or the reader's wheel.

const BEATS = BEATS_COPY.length;
const TRAVEL_SVH = BEATS * 88;
const TRAVEL = `${TRAVEL_SVH}svh`;

const SPAN = 1 / BEATS;
const beatAt = (i: number) => i * SPAN;

// The cross-fade window, as a fraction of ONE beat's span. Narrower than about
// a fifth and a normal scroll crosses it in a single frame, which reads as a
// cut rather than a fade — the note `StickyScrollCapabilities` leaves after
// getting this wrong once.
const OVERLAP = SPAN * 0.32;
const TEXT_ENTER_Y = 64;
const TEXT_EXIT_Y = -56;

const PATH_LEN = 100;

// ── Geometry ───────────────────────────────────────────────────────────────
const SIZE = 640;
const FIELD = keyField(11, 11, 41);
const CORE = { x: 320, y: 330 };
const R = 118;

const OUT = slotPoint(CORE.x, CORE.y, R, KEY_SLOTS.outgoing);
const IN = slotPoint(CORE.x, CORE.y, R, KEY_SLOTS.incoming);

const DOTS = FIELD.map((d) => ({
  ...d,
  px: round4(40 + (d.x / 100) * (SIZE - 80)),
  py: round4(40 + (d.y / 100) * (SIZE - 80)),
}));

// One bowed thread per exposed dot, ending on the orbit rather than at the
// centre: the key ring is where an account's keys live, so that is where the
// threads land. Same curve family as the solver paths in `chainDiagram`.
const THREADS = DOTS.filter((d) => d.exposed).map((d) => {
  const mx = round4((d.px + CORE.x) / 2 + (CORE.y - d.py) * 0.12);
  const my = round4((d.py + CORE.y) / 2 - (CORE.x - d.px) * 0.12);
  return `M ${d.px} ${d.py} Q ${mx} ${my} ${CORE.x} ${round4(CORE.y - R)}`;
});

const LIVE = "#00dc8d"; // --near-green
const DIM = "rgba(255,255,255,0.18)";
const RISK = "rgba(233,90,80,0.95)";

export default function ThreatScene() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    // Mobile and reduced motion fall back to the static composition — the SVG
    // already renders its FINAL state, so the reader gets the finished diagram
    // and the two text blocks stacked.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "seq");
    const tl = trackTimeline(scope);

    const beats = q("[data-beat]");
    const dots = q<SVGCircleElement>("[data-dot]");
    const risky = q<SVGCircleElement>("[data-dot-risk]");
    const threads = q<SVGPathElement>("[data-thread]");
    const orbit = q<SVGCircleElement>("[data-orbit]");
    const keyOut = q("[data-key-out]");
    const keyIn = q("[data-key-in]");

    // ── wind everything back ────────────────────────────────────────────
    gsap.set(threads, { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set(orbit, { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN });
    gsap.set(dots, { scale: 0, transformOrigin: "center", autoAlpha: 0 });
    gsap.set(risky, { autoAlpha: 0 });
    gsap.set(keyOut, { autoAlpha: 0 });
    gsap.set(keyIn, { autoAlpha: 0, scale: 0, transformOrigin: "center" });
    gsap.set(beats.slice(1), { autoAlpha: 0 });

    // ── beat 1 · the population, and what is exposed ────────────────────
    tl.to(
      dots,
      {
        scale: 1,
        autoAlpha: 1,
        duration: SPAN * 0.45,
        ease: "none",
        stagger: { amount: SPAN * 0.3, from: "random" },
      },
      beatAt(0)
    ).to(risky, { autoAlpha: 1, duration: SPAN * 0.3, ease: "none" }, beatAt(0) + SPAN * 0.45);

    // ── beat 2 · the answer, drawn ON TOP of beat 1 ─────────────────────
    tl.to(
      threads,
      {
        strokeDashoffset: 0,
        duration: SPAN * 0.55,
        ease: "none",
        stagger: { amount: SPAN * 0.25, from: "start" },
      },
      beatAt(1)
    )
      .to(orbit, { strokeDashoffset: 0, duration: SPAN * 0.4, ease: "none" }, beatAt(1) + SPAN * 0.2)
      .to(keyOut, { autoAlpha: 1, duration: SPAN * 0.15, ease: "none" }, beatAt(1) + SPAN * 0.4)
      // The classical key leaves along the orbit's tangent while the new one
      // arrives — the two overlap on purpose, because the deck's claim is that
      // it is ONE transaction and a hand-off shown in sequence would read as
      // two.
      .to(keyOut, { x: -46, autoAlpha: 0.35, duration: SPAN * 0.3, ease: "none" }, beatAt(1) + SPAN * 0.55)
      .to(
        keyIn,
        { autoAlpha: 1, scale: 1, duration: SPAN * 0.25, ease: "none" },
        beatAt(1) + SPAN * 0.58
      );

    // ── the copy, cross-faded on the same scrub ─────────────────────────
    // `ease: "none"` on purpose: with `scrub: true` the tween's "time" IS
    // scroll, and an eased curve breaks the linear relation between scroll
    // delta and visual delta — it feels like a lurch when reversing.
    for (let i = 0; i < BEATS - 1; i++) {
      const at = beatAt(i + 1) - OVERLAP / 2;
      tl.to(beats[i], { autoAlpha: 0, y: TEXT_EXIT_Y, duration: OVERLAP, ease: "none" }, at);
      tl.fromTo(
        beats[i + 1],
        { autoAlpha: 0, y: TEXT_ENTER_Y },
        { autoAlpha: 1, y: 0, duration: OVERLAP, ease: "none" },
        at
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      data-nav-dark
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/seq relative bg-ink-slate text-white data-[seq=on]:h-[calc(100svh+var(--travel))]"
    >
      {/* The pinned frame. `flex flex-col justify-center` and not a full-height
          grid, because the frame carries one constant element below the two
          beats — see the deck's framing paragraph at the foot. */}
      <div className="relative flex flex-col justify-center gap-12 overflow-hidden py-[12svh] group-data-[seq=on]/seq:sticky group-data-[seq=on]/seq:top-0 group-data-[seq=on]/seq:h-svh group-data-[seq=on]/seq:py-0">
        <Container className="grid grid-cols-12 items-center gap-x-[var(--grid-gutter)] gap-y-16">
          {/* ── the figure ───────────────────────────────────────────────── */}
          <div className="order-first col-span-12 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <div className="relative mx-auto aspect-square w-full max-w-[38rem]">
              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 size-full overflow-visible"
                aria-hidden="true"
              >
                {THREADS.map((d, i) => (
                  <path
                    key={`t-${i}`}
                    data-thread
                    d={d}
                    fill="none"
                    stroke={DIM}
                    strokeWidth="1"
                    pathLength={PATH_LEN}
                  />
                ))}

                <circle
                  data-orbit
                  cx={CORE.x}
                  cy={CORE.y}
                  r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                  pathLength={PATH_LEN}
                  transform={`rotate(-90 ${CORE.x} ${CORE.y})`}
                />

                {DOTS.map((d, i) => (
                  <g key={`d-${i}`}>
                    <circle data-dot cx={d.px} cy={d.py} r="3.4" fill="rgba(255,255,255,0.35)" />
                    {d.exposed ? (
                      <circle data-dot-risk cx={d.px} cy={d.py} r="6" fill={RISK} />
                    ) : null}
                  </g>
                ))}

                {/* The classical key, on its way out. */}
                <g data-key-out>
                  <circle cx={OUT.x} cy={OUT.y} r="13" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" />
                  <line
                    x1={OUT.x - 15}
                    y1={OUT.y}
                    x2={OUT.x - 40}
                    y2={OUT.y}
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="1.4"
                  />
                </g>

                {/* The quantum-safe key. The only green in the scene. */}
                <g data-key-in>
                  <circle cx={IN.x} cy={IN.y} r="13" fill={LIVE} />
                  <line x1={IN.x + 40} y1={IN.y} x2={IN.x + 15} y2={IN.y} stroke={LIVE} strokeWidth="1.4" />
                </g>

                {/* The fixed point — the only element with no transform in any
                    beat. The raw path and not <NearMark>: that component renders
                    its own <svg>, and a nested <svg> without explicit dimensions
                    resolves to 100% of the parent viewport rather than honouring
                    this transform. `tx = cx − 47 − 108 × s`. */}
                <g
                  transform={`translate(${round4(CORE.x - 47 - 108 * 0.2678)} ${round4(
                    CORE.y - 47 - 108 * 0.2678
                  )}) scale(0.2678)`}
                >
                  <path d={NEAR_MARK_PATH} fill="var(--sem-background-primary)" />
                </g>
              </svg>
            </div>
          </div>

          {/* ── the beats ────────────────────────────────────────────────── */}
          <div className="col-span-12 space-y-20 lg:col-span-5 lg:col-start-1 lg:row-start-1 group-data-[seq=on]/seq:relative group-data-[seq=on]/seq:h-[54svh] group-data-[seq=on]/seq:space-y-0">
            {BEATS_COPY.map((beat, i) => (
              <div
                key={beat.key}
                data-beat
                className="group-data-[seq=on]/seq:absolute group-data-[seq=on]/seq:inset-x-0 group-data-[seq=on]/seq:top-0"
              >
                <p className="uppercase text-caption-mono text-white/40">
                  {String(i + 1).padStart(2, "0")} — {i === 0 ? "The problem" : "On NEAR"}
                </p>
                <h2 className="mt-6 max-w-[17ch] text-pretty text-h2">
                  {beat.heading[0]}
                  <br />
                  <Accent>{beat.heading[1]}</Accent>
                </h2>
                <p className="mt-6 max-w-[46ch] text-pretty text-body text-white/70">{beat.body}</p>
                {beat.link ? (
                  <a
                    href={beat.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-label text-white transition-colors hover:border-white"
                  >
                    {beat.link.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </Container>

        {/* The deck's framing paragraph. It says the two beats are ONE thought,
            so it stays on screen through both instead of being spent above
            them — it is the part of the frame that does not change while the
            core does, which is the whole reason this section is pinned.

            It lives INSIDE the sticky child, never after it: anything placed
            after the pinned element is outside the frame but inside the
            section's declared `--travel` height, so it would sit in a blank
            band under the scene. */}
        <Container>
          <p className="max-w-[64ch] text-pretty text-body text-white/55">
            {PROBLEM_SOLUTION_LEAD}
          </p>
        </Container>
      </div>
    </section>
  );
}
