"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { PILLARS } from "@/components/sections/foundation/foundationContent";

// §2 — what the Foundation is, does, and is for.
//
// Columns under a hairline, not cards: the doctrine is written out in
// `chain/WhyItMatters.tsx` and the reason it applies here is the same one — the
// hero's argument is made out of empty space and three bordered rectangles
// right after it read as a different website.
//
// Where this parts company with `WhyItMatters` is the STAIRCASE. There the
// three columns are offset downward because they are a sequence with a
// direction (where → how easy → where it is going). These three are not a
// sequence, they are three standings of equal weight, and offsetting them would
// claim a hierarchy the copy does not have. So the three rules sit on ONE line
// — which is also the hero's rule, cut in three. The page's measure being
// divided for the first time.
export default function Pillars() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 76%", once: true, markers: DEBUG_MARKERS },
    });

    tl.from(q("[data-pillar-rule]"), { scaleX: 0, duration: 0.85, stagger: 0.12 }, 0).from(
      q("[data-pillar]"),
      { y: 26, autoAlpha: 0, duration: 0.85, stagger: 0.12 },
      0.12
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[8svh]">
      <Container>
        <div className="grid-ds gap-y-14">
          {PILLARS.map((p) => (
            <div key={p.id} className="col-span-12 md:col-span-6 lg:col-span-4">
              <div
                data-pillar-rule
                className="h-px w-full origin-left bg-rule"
                aria-hidden="true"
              />
              <div data-pillar>
                <p className="mt-5 text-caption-mono text-gray-intermediate">{p.index}</p>
                <h2 className="mt-8 max-w-[16ch] text-h3 text-pretty">{p.title}</h2>
                <p className="mt-4 max-w-[38ch] text-body text-ink-soft text-pretty">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
