"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";

// Closing call to action: the copy sits inside an orbit that assembles once on
// entry and then keeps turning slowly.

export default function ClosingRing() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const ring = q("[data-cta-ring]")[0];
      const arc = q("[data-cta-arc]")[0];
      const orbit = q("[data-cta-orbit]")[0];
      const inner = q("[data-cta-ring-inner]")[0];
      const items = q("[data-cta-item]");

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope, start: "top 72%", once: true },
      });

      if (ring) tl.from(ring, { scale: 0.86, autoAlpha: 0, duration: 1.1, ease: EASE_OUT }, 0);
      // The arc draws itself by growing its dash, not by animating
      // `stroke-dashoffset`: the visible arc is one dash, so its length IS the
      // animation. Offset stays put and keeps the gap where the copy sits.
      if (arc) {
        tl.from(
          arc,
          { attr: { "stroke-dasharray": "0 314" }, duration: 1.3, ease: "power2.inOut" },
          0.15
        );
      }
      if (orbit) {
        tl.from(
          orbit,
          { rotate: -210, transformOrigin: "50% 50%", duration: 1.6, ease: "power2.out" },
          0.15
        );
      }
      if (inner) {
        tl.from(inner, { scale: 1.08, autoAlpha: 0, duration: 0.9, ease: "power2.out" }, 0.25);
      }
      if (items.length) {
        tl.from(items, { y: 22, autoAlpha: 0, duration: 0.75, stagger: 0.1, ease: EASE_OUT }, 0.3);
      }

      // Idle: once it has landed, the orbit keeps turning. 42s per revolution
      // is slow enough that it reads as drift rather than as an animation.
      if (orbit) {
        pauseOffscreen(
          gsap.to(orbit, {
            rotate: "+=360",
            transformOrigin: "50% 50%",
            duration: 42,
            ease: "none",
            repeat: -1,
          }),
          scope
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    // z-10 and no overflow clipping: the ring is wider than the copy block and
    // has to be allowed to bleed past it, and it must stack above the footer
    // that follows.
    // The 10px margin pushes the footer — and everything after it — clear of the
    // outer ring, which bleeds past this section's own box and was meeting the
    // footer's top edge. It is a MARGIN rather than extra bottom padding because
    // the gap belongs between the two sections, not inside this one; and it goes
    // here rather than on PrototypeFooter because that footer is shared with
    // three other prototype pages that have no ring to clear.
    // Invisible as a gap: the page and the footer are both `--cream`.
    <section ref={rootRef} className="relative z-10 mb-2.5 bg-cream text-foreground">
      <Container className="flex justify-center pb-32 pt-30">
        <div className="relative flex w-full max-w-[1240px] justify-center px-8 py-26">
          <div
            data-cta-ring
            aria-hidden="true"
            // 5% down from 920px / 86%. One value shrinks BOTH rings and the
            // orbit: the inner ring is inset by a percentage of this box and the
            // arc is sized to it, so they all scale off this number.
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(874px,81.7%)] -translate-x-1/2 -translate-y-1/2"
          >
            <span className="absolute inset-0 rounded-full border border-dashed border-foreground/20" />
            <span
              data-cta-ring-inner
              className="absolute inset-[11%] rounded-full border border-foreground/10"
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
              {/* 180 of the 314-unit circumference drawn, the rest gap. The
                  -46 offset is what parks that gap behind the copy. */}
              <circle
                data-cta-arc
                cx="50"
                cy="50"
                r="50"
                fill="none"
                stroke="var(--near-green-accent)"
                strokeWidth="0.5"
                strokeDasharray="180 314"
                strokeDashoffset="-46"
                transform="rotate(-90 50 50)"
              />
            </svg>
            {/* The node rides its own full-size wrapper so a plain rotation of
                that wrapper carries it around the circle — no path maths. */}
            <span data-cta-orbit className="absolute inset-0">
              <span className="absolute -top-2 left-1/2 -ml-2 size-4 rounded-full bg-near-green-accent" />
            </span>
          </div>

          <div className="relative flex max-w-[34rem] flex-col items-center gap-6 text-center">
            <h2 data-cta-item className="text-h2 text-pretty">
              Upgrade to a
              <br />
              <Accent>quantum-safe account</Accent>
            </h2>
            <p data-cta-item className="max-w-[30rem] text-body text-ink-soft text-pretty">
              Post-quantum signing is live on NEAR mainnet. Rotate your keys today, and read
              how NEAR is securing the ecosystem for the quantum era.
            </p>
            <div
              data-cta-item
              className="mt-1.5 flex flex-wrap items-center justify-center gap-4"
            >
              <CtaPill
                href="https://docs.near.org/tools/cli#ml-dsa-65-post-quantum-2"
                tone="filled"
                external
              >
                Rotate your keys
              </CtaPill>
              <CtaPill
                href="https://near.org/blog/making-near-protocol-post-quantum-safe"
                tone="quiet"
                external
              >
                Read the deep-dive
              </CtaPill>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
