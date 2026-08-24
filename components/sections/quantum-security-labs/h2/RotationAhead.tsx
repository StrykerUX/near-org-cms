"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// ── H2 · §One rotation ahead ───────────────────────────────────────────────
// The deck gives this section three words and nothing else, which makes it the
// page's one full-bleed pause.
//
// **What it replaces.** The current break scrubs an 88vh video of a growing
// quantum field. The scrub is good work and stays available (`videoScrub.ts`,
// `FieldBreak.tsx`); what goes is the subject. The field says "quantum" the way
// a stock photo says "technology" — it is atmosphere, and it is the only thing
// on the page carrying no argument. On a page whose entire claim is *one
// rotation, not a migration*, the one wordless moment can say that.
//
// So: a rail, and one mark crossing it while the account label under the middle
// never moves. The reader's scroll drives the crossing — the same contract the
// video scrub had, kept deliberately. Everything else in this proposal plays
// once and stops; this is the only scrubbed thing in it, because it is the only
// place where the reader's own movement IS the subject.
//
// **Ink, not cream.** The page is cream and white all the way down. The house
// uses a solid `--ink` field for exactly this — the black statement card in
// `homepage-update/AgentEconomy`, the dark press card in `InTheNews` — so a
// full-bleed ink band is in the vocabulary and is the strongest pause available
// without inventing anything.
//
// Practical consequence worth stating: this drops a ~2MB mp4 off the page and
// degrades cleanly, with the mark simply parked at the start under reduced
// motion.
export default function RotationAhead() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const line = q("[data-break-line]")[0];
    if (line) {
      gsap.from(line, {
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        ease: EASE_OUT,
        scrollTrigger: { trigger: scope, start: "top 62%", once: true },
      });
    }

    const mark = q("[data-break-mark]")[0];
    const trail = q("[data-break-trail]")[0];
    const rail = q("[data-break-rail]")[0];
    if (!mark || !trail || !rail) return;

    // The rail's width is CACHED and refreshed by ScrollTrigger, never read
    // inside `onUpdate`. An `offsetWidth` in a scrub handler is a forced layout
    // on every scroll frame for a value that only changes on resize — the rule
    // `chain/ChainHero` states for its ticker field.
    let railW = rail.offsetWidth;
    const ease = gsap.parseEase("power2.inOut");

    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
      markers: DEBUG_MARKERS,
      onRefresh: () => {
        railW = rail.offsetWidth;
      },
      onUpdate: (self) => {
        const p = ease(self.progress);
        // `x` in pixels against the cached width, never `left` in percent:
        // `left` is a layout property and would reflow the band sixty times a
        // second.
        gsap.set(mark, { x: p * railW });
        gsap.set(trail, { scaleX: p });
      },
    });

    return () => st.kill();
  });

  return (
    <section ref={rootRef} data-nav-dark className="relative overflow-hidden bg-ink text-white">
      <Container className="flex min-h-[62svh] flex-col justify-between gap-20 py-20 lg:py-28">
        <p data-break-line className="text-display">
          One rotation <Accent display>ahead.</Accent>
        </p>

        <div className="flex flex-col gap-6">
          <div data-break-rail className="relative h-8">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/25"
            />
            {/* How far the rotation has got. `origin-left` is what makes the
                scaleX read as the line extending rather than growing from its
                own centre. */}
            <span
              data-break-trail
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-near-green-accent"
            />
            <span
              data-break-mark
              aria-hidden="true"
              className="absolute left-0 top-1/2 -ml-1.5 size-3 -translate-y-1/2 rounded-full bg-near-green-accent"
            />
          </div>

          <div className="flex items-baseline justify-between uppercase text-caption-mono text-white/45">
            <span>classical keys</span>
            <span className="text-white/70">the account never moves</span>
            <span>quantum-safe keys</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
