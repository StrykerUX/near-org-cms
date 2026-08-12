"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// The proof ribbon between the hero and the rest: six fact-plus-gloss pairs
// running between two dashed rules.
//
// Same mechanism as `components/sections/TestimonialMarquee.tsx` (two copies of
// the set and `xPercent: -50`, which closes the loop without a jump) with two
// differences: this one does NOT slow on hover — they are one-line facts, not
// quotes anyone needs to finish reading — and the set is loose text rather than
// cards.

const PROOFS = [
  { fact: "Post-quantum signing", gloss: "Live on mainnet" },
  { fact: "FIPS-204 (ML-DSA)", gloss: "NIST-approved scheme" },
  { fact: "One transaction", gloss: "To rotate to quantum-safe keys" },
  { fact: "Account-level", gloss: "Default path, not an opt-in tool" },
  { fact: "5+ years", gloss: "100% mainnet uptime" },
  { fact: "Since 2019", gloss: "Account model designed for quantum safety" },
] as const;

// One set is ~6 × 340px ≈ 2040px, so this works out to ~51px/s. It is the
// default value of the original's `tickerSeconds` control.
const LOOP_SECONDS = 40;

export default function ProofMarquee() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const track = q("[data-marquee]")[0];
      if (!track) return;

      const tween = gsap.fromTo(
        track,
        { xPercent: 0 },
        { xPercent: -50, duration: LOOP_SECONDS, ease: "none", repeat: -1, force3D: true }
      );
      pauseOffscreen(tween, scope);
    });

    return () => mm.revert();
  }, []);

  const items = [...PROOFS, ...PROOFS];

  return (
    <section
      ref={rootRef}
      className="border-y border-dashed border-foreground/20 bg-cream py-7 text-foreground"
    >
      {/* With reduced motion the marquee does not run, so the overflow becomes
          manual scrolling: otherwise the pairs past the viewport edge would be
          unreachable. Same call as TestimonialMarquee. */}
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        {/* No `will-change` here: `pauseOffscreen` adds it on entering the viewport
            and drops it on leaving. Fixed in the class, the band would stay
            promoted to its own layer for the whole session. */}
        <div data-marquee className="flex w-max">
          {items.map((p, i) => {
            const isClone = i >= PROOFS.length;
            return (
              <div
                key={`${p.fact}:${i}`}
                // The spacing is a margin on EACH item rather than a `gap` on
                // the track: a gap adds n-1 spaces and breaks the exactness of
                // the -50% (see the long comment in TestimonialMarquee).
                {...(isClone ? { "aria-hidden": true } : {})}
                className="mr-[88px] flex shrink-0 items-baseline gap-3.5 whitespace-nowrap"
              >
                <span className="text-h4">{p.fact}</span>
                <span className="text-body-serif italic text-gray-blue">{p.gloss}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
