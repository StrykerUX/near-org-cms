"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { REASONS } from "@/components/sections/chain/chainContent";

// §2 — where → how easy → where it's going.
//
// ── Why not cards ──────────────────────────────────────────────────────────
// The copy deck calls these cards, and they were boxes first. On this page the
// boxes fought the hero: the hero's argument is made out of empty space, and
// three bordered rectangles immediately after it read as a different website.
// So the card became a COLUMN under a hairline — the rule does the separating a
// border was doing, without enclosing anything — and the columns are offset
// into a staircase, which turns three equal items into a sequence with a
// direction. Same three units of content, none of the enclosure.
//
// Each column carries a glyph that performs its own claim rather than
// illustrating it: many marks becoming one ring, six steps becoming one move,
// a line that leaves the frame instead of stopping in it. They are drawn from
// the same 1px stroke as the rest of the page.

// The staircase, in rem of downward offset per column. Read off the type: one
// step is roughly a line of body copy, so the columns land on a rhythm the page
// already has instead of an arbitrary slope.
const STEP = ["lg:mt-0", "lg:mt-16", "lg:mt-32"] as const;

// `pathLength` is 100 and not 1 because GSAP rounds pixel values by default
// (`autoRound`), and stroke-dashoffset is a pixel property: normalised to 1 the
// draw snaps from undrawn to drawn with nothing in between. See the long note in
// CapabilityStack.tsx.
const PATH_LEN = 100;

// One box for all three glyphs so their strokes align across the row.
const GLYPH_W = 120;
const GLYPH_H = 44;

// ── Glyph 1 geometry ────────────────────────────────────────────────────────
// At module scope because the JSX and the tween both need it: the marks are
// RENDERED at `SCATTER[i]` and ANIMATED to `RING_STOPS[i]`. Reading the target
// back off a `data-to-x` attribute (the first version) meant the numbers lived
// in the DOM as strings, which is both a parse per tween and a typing fight
// with GSAP's function-value signature.
const RING_R = 15;
const RING_CX = GLYPH_W - RING_R - 2;
const RING_CY = GLYPH_H / 2;

const SCATTER = [
  [6, 8], [22, 26], [4, 34], [34, 6], [18, 40], [40, 22],
] as const;

const RING_STOPS = SCATTER.map((_, i) => {
  const a = (i / SCATTER.length) * Math.PI * 2 - Math.PI / 2;
  return { x: RING_CX + Math.cos(a) * RING_R, y: RING_CY + Math.sin(a) * RING_R };
});

// ── Glyph 2 geometry ────────────────────────────────────────────────────────
const STEP_GAP = 20;
const STEP_COUNT = 6;

/** Six marks scattered on the left, pulled onto one ring. */
function GlyphOnePlace() {
  return (
    <svg viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`} className="h-11 w-30 overflow-visible" aria-hidden="true">
      <circle
        data-glyph-ring
        cx={RING_CX}
        cy={RING_CY}
        r={RING_R}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        pathLength={PATH_LEN}
      />
      {SCATTER.map(([x, y], i) => (
        <circle key={i} data-glyph-dot r="1.8" fill="currentColor" cx={x} cy={y} />
      ))}
    </svg>
  );
}

/** Six steps; five of them fold into the first. */
function GlyphOneMove() {
  return (
    <svg viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`} className="h-11 w-30 overflow-visible" aria-hidden="true">
      {Array.from({ length: STEP_COUNT }, (_, i) => (
        <line
          key={i}
          data-glyph-step
          x1={2 + i * STEP_GAP}
          y1={GLYPH_H / 2 - 9}
          x2={2 + i * STEP_GAP}
          y2={GLYPH_H / 2 + 9}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

/** A line that does not stop at the edge of its box. */
function GlyphNext() {
  const Y = GLYPH_H / 2;
  return (
    <svg viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`} className="h-11 w-30 overflow-visible" aria-hidden="true">
      <line
        data-glyph-run
        x1="2"
        y1={Y}
        x2={GLYPH_W + 24}
        y2={Y}
        stroke="currentColor"
        strokeWidth="1"
        pathLength={PATH_LEN}
      />
      {[GLYPH_W - 34, GLYPH_W - 16, GLYPH_W + 2].map((x, i) => (
        <circle key={i} data-glyph-tip={i} cx={x} cy={Y} r="1.8" fill="currentColor" />
      ))}
    </svg>
  );
}

const GLYPHS = [GlyphOnePlace, GlyphOneMove, GlyphNext];

export default function WhyItMatters() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: scope,
        start: "top 72%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    tl.from(q("[data-col]"), { y: 34, autoAlpha: 0, duration: 0.9, stagger: 0.14 })
      .from(q("[data-rule]"), { scaleX: 0, duration: 0.8, stagger: 0.14 }, 0);

    // ── glyph 1: the marks find the ring ──────────────────────────────────
    const dots = q<SVGCircleElement>("[data-glyph-dot]");
    tl.to(
      dots,
      {
        // `attr` and not x/y: these are circles placed by cx/cy, and a
        // transform would move the dot away from the coordinates the ring was
        // computed in.
        attr: {
          cx: (i: number) => RING_STOPS[i].x,
          cy: (i: number) => RING_STOPS[i].y,
        },
        duration: 1,
        stagger: 0.05,
        ease: "power2.inOut",
      },
      0.35
    ).fromTo(
      q("[data-glyph-ring]"),
      // `pathLength={PATH_LEN}` on the circle is what makes this plugin-free: the dash
      // array is in the same normalised unit, so one full turn is exactly 1 and
      // the offset does not have to know the radius. DrawSVGPlugin would do the
      // same thing and is not part of this project's GSAP.
      { strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN },
      { strokeDashoffset: 0, duration: 0.9 },
      0.5
    );

    // ── glyph 2: six become one ───────────────────────────────────────────
    // Steps 1..5 slide onto step 0. The first one never moves, which is what
    // makes the result read as "the one move that was always there".
    const steps = q<SVGLineElement>("[data-glyph-step]");
    tl.to(
      steps.slice(1),
      {
        // `steps` is sliced, so index 0 here is step 1 in the drawing — hence
        // the +1. Each one travels exactly the distance back to step 0.
        x: (i: number) => -((i + 1) * STEP_GAP),
        autoAlpha: 0,
        duration: 0.85,
        // Last step first: the tail collapses forward into the head.
        stagger: { each: 0.07, from: "end" },
        ease: "power2.inOut",
      },
      0.5
    );

    // ── glyph 3: the line leaves the frame ────────────────────────────────
    tl.from(q("[data-glyph-run]"), { scaleX: 0, transformOrigin: "left center", duration: 1.1 }, 0.65)
      .from(q("[data-glyph-tip]"), { autoAlpha: 0, duration: 0.4, stagger: 0.1 }, 1.2);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <Eyebrow className="text-gray-intermediate">Why it matters</Eyebrow>

        <div className="mt-14 grid-ds gap-y-16">
          {REASONS.map((r, i) => {
            const Glyph = GLYPHS[i];
            return (
              <div
                key={r.id}
                data-col
                className={`col-span-12 md:col-span-6 lg:col-span-4 ${STEP[i]}`}
              >
                <div
                  data-rule
                  className="h-px w-full origin-left bg-rule"
                  aria-hidden="true"
                />
                <p className="mt-5 text-caption-mono text-gray-intermediate">{r.index}</p>

                <div className="mt-8 text-ink" aria-hidden="true">
                  <Glyph />
                </div>

                <h3 className="mt-8 max-w-[18ch] text-h3 text-pretty">{r.title}</h3>
                <p className="mt-4 max-w-[38ch] text-body text-ink-soft text-pretty">
                  {r.body}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
