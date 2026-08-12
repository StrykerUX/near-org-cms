"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import NearMark from "@/components/sections/quantum/NearMark";
import { COMPARISON_ROWS as ROWS } from "@/components/sections/quantum/quantumContent";

// "How is NEAR different from other quantum-safe chains?" — four claims, each
// paired against what NEAR actually does.

export default function Comparison() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      // One trigger per row rather than one for the whole table: the rows are
      // tall enough that a single staggered reveal would have the last one
      // firing while it is still well below the fold.
      q("[data-cmp-row]").forEach((row) => {
        gsap.from(Array.from(row.children), {
          autoAlpha: 0,
          y: 18,
          duration: 0.7,
          stagger: 0.12,
          ease: EASE_OUT,
          scrollTrigger: { trigger: row, start: "top 84%", once: true },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-background text-foreground">
      <Container className="flex flex-col gap-20 py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-ink-soft">The difference</Eyebrow>
            <h2 className="text-h2 text-pretty">
              How is NEAR different from other
              <br />
              <Accent>quantum-safe chains?</Accent>
            </h2>
          </div>
          <p className="text-body-lg text-ink-soft text-pretty lg:pt-10">
            Most post-quantum protection in production today is narrower than it sounds. On
            NEAR, quantum safety is a default account-level property, live in production,
            not an opt-in tool or a roadmap item.
          </p>
        </div>

        <div className="flex flex-col">
          <div className="grid gap-8 pb-5 lg:grid-cols-2 lg:gap-16">
            <Eyebrow className="text-gray-blue">Alternatives</Eyebrow>
            <p className="flex items-center gap-2.5 text-eyebrow uppercase">
              <NearMark className="size-[17px] shrink-0" />
              On NEAR
            </p>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.us}
              data-cmp-row
              className={`grid gap-4 border-t border-dashed border-foreground/20 py-7 lg:grid-cols-2 lg:gap-16 ${
                i === ROWS.length - 1 ? "border-b" : ""
              }`}
            >
              <p className="max-w-[44ch] text-body text-gray-blue text-pretty">{row.them}</p>
              {/* text-label-lg and not `text-body font-medium`: the DS token for
                  "body copy carrying emphasis" already brings the weight. */}
              <p className="max-w-[44ch] text-label-lg text-pretty">{row.us}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
