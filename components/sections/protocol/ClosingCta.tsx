"use client";

import { useRef } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { createShardField, type ShardFieldHandle } from "@/components/sections/protocol/shardField";

// Section 15. The shard field returns, on the dark ground, at full strength —
// the page opened on it splitting and closes on it whole. That bookend is the
// reason this section is dark rather than another cream block: the field reads
// as texture on cream and as structure on ink, and the closing statement wants
// the structure.

export default function ClosingCta() {
  const fieldRef = useRef<HTMLDivElement>(null);

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };
      let field: ShardFieldHandle | null = null;
      if (fieldRef.current) field = createShardField(fieldRef.current, { motionOk });

      if (motionOk) {
        gsap.from(q("[data-close-item]"), {
          autoAlpha: 0,
          y: 26,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: scope, start: "top 70%", once: true },
        });
      }
      return () => field?.destroy();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-dark
      className="relative overflow-hidden bg-ink-slate text-cream"
    >
      <div ref={fieldRef} aria-hidden="true" className="absolute inset-0 z-0 opacity-70" />
      {/* Same scrim idea as the hero, inverted for the dark ground. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(34,38,39,0.92)_0%,rgba(34,38,39,0.55)_55%,rgba(34,38,39,0.2)_100%)]"
      />

      <Container className="relative z-20 flex flex-col items-center gap-7 py-44 text-center">
        <h2 data-close-item className="max-w-[20ch] text-h1 text-balance">
          The settlement layer for the <Accent>agent economy</Accent>
        </h2>
        <p data-close-item className="max-w-[34rem] text-body-lg text-cream/70 text-pretty">
          Proven on mainnet for five years. Build on it today.
        </p>
        <div data-close-item className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <CtaPill href="https://docs.near.org" tone="filled" external>
            Start building
          </CtaPill>
          <CtaPill href="https://near.org/blog/agent-economy" tone="quiet" external>
            Read the thesis
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
