"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { lattice } from "@/components/sections/quantum-security-labs/quantumArt";

// ── H3 · §One rotation ahead ───────────────────────────────────────────────
// The deck gives this section three words and nothing else. Both proposals read
// that as the page's one wordless moment and replace the video break with
// something drawn; they disagree about what it draws.
//
// H2 draws the CROSSING — a rail with a key travelling it. This one draws the
// GROUND that is already in place: a lattice, fully drawn from the first frame,
// with light travelling across it as the reader passes.
//
// **Why the lattice and why it is already there.** ML-DSA is lattice-based, so
// it is the right family of shape rather than atmosphere standing in for
// mathematics. And the page's actual claim is not "quantum is coming" — the
// video's growing field says that — it is that the structure is already
// shipped. So nothing grows: the field is complete before the reader arrives
// and what moves is only their own light across it.
//
// **What it replaces.** An 88vh scrubbed mp4 of a growing quantum field. The
// scrub is good work and stays available (`videoScrub.ts`, `FieldBreak.tsx`);
// the subject goes, along with ~2MB off the page. The gesture is kept exactly:
// the reader's scroll drives it, which is the only reason a scrub is ever
// right. With reduced motion the lattice is simply lit, which says the same
// thing without the sweep.
//
// **Cream, not ink.** H2 spends its one dark band here; this proposal spends
// its dark on two statement cards instead (`OnlyNearCard`, `ClosingCard`), and
// a third dark ground would make the break one more panel rather than a pause.
const LATTICE = lattice(30, 8, 0.28);

export default function RotationAhead() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const line = q("[data-break-line]")[0];
    if (line) {
      gsap.from(line, {
        autoAlpha: 0,
        y: 28,
        duration: 0.9,
        ease: EASE_OUT,
        scrollTrigger: { trigger: scope, start: "top 72%", once: true },
      });
    }

    const dots = q<SVGCircleElement>("[data-lat-dot]");
    if (!dots.length) return;

    // Each dot's x is read ONCE, off a data attribute. A `getAttribute` inside
    // the scrub handler would be a DOM read per dot per frame for a value that
    // never changes.
    const xs = dots.map((d) => Number(d.dataset.x));

    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
      markers: DEBUG_MARKERS,
      onUpdate: (self) => {
        // A front travelling left to right with a soft falloff either side.
        // `WIDTH` sets how many columns are lit at once: much below 20 it
        // flickers dot by dot, much above 34 the whole field just brightens and
        // the travel disappears.
        const front = self.progress * 130 - 15;
        const WIDTH = 26;
        dots.forEach((dot, i) => {
          const lit = Math.max(0, 1 - Math.abs(xs[i] - front) / WIDTH);
          gsap.set(dot, { opacity: 0.16 + lit * 0.84 });
        });
      },
    });

    return () => st.kill();
  });

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-cream text-foreground">
      <Container className="flex flex-col gap-14 py-20 lg:py-28">
        <p data-break-line className="text-display">
          One rotation <Accent display>ahead.</Accent>
        </p>

        <div aria-hidden="true" className="h-[26svh] w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
            {LATTICE.points.map((p, i) => (
              <circle
                key={i}
                data-lat-dot
                data-x={p.x}
                cx={p.x}
                cy={p.y}
                // A small radius on purpose: with `preserveAspectRatio="none"`
                // the box is stretched, and `vectorEffect` does not apply to
                // fills — at this size the distortion stays under a pixel at any
                // real width.
                r="0.3"
                className="fill-near-green-accent"
                opacity="0.16"
              />
            ))}
          </svg>
        </div>
      </Container>
    </section>
  );
}
