"use client";

import { useRef } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { createShardField, type ShardFieldHandle } from "@/components/sections/protocol/shardField";

// Section 1. Structurally a sibling of QuantumHero — full viewport, optically
// centred, a generative field behind it, an animated gradient through part of
// the headline — because the two pages have to read as the same site.
//
// It is NOT a copy. Quantum's field is a static lattice that reacts to the
// pointer; this one subdivides on its own, because the page's subject is
// sharding. The metaphor does the work, not the technique.

export default function ProtocolHero() {
  const fieldRef = useRef<HTMLDivElement>(null);

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      // Built on the client, not during render: the cell grid comes from
      // measuring the host. It is purely decorative and aria-hidden, so
      // nothing is lost server-side.
      let field: ShardFieldHandle | null = null;
      if (fieldRef.current) {
        field = createShardField(fieldRef.current, { motionOk });
      }

      if (motionOk) {
        const heading = q("[data-hero-heading]")[0];
        if (heading) {
          SplitText.create(heading, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => {
              // "agent economy" has a g and a y; the line mask shears both at
              // this line-height.
              allowDescenders(self.lines);
              return gsap.from(self.lines, {
                yPercent: 115,
                autoAlpha: 0,
                stagger: 0.13,
                duration: 1,
                ease: EASE_OUT,
              });
            },
          });
        }
        gsap.from(q("[data-hero-item]"), {
          autoAlpha: 0,
          y: 26,
          duration: 0.85,
          stagger: 0.14,
          delay: 0.45,
          ease: EASE_OUT,
        });
      }

      return () => field?.destroy();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-cream text-foreground"
    >
      {/* The shard field. Behind everything, and it keeps its own stacking
          context so the canvas never lands over the copy. */}
      <div ref={fieldRef} aria-hidden="true" className="absolute inset-0 z-0" />

      {/* The field runs edge to edge, but it must not compete with the
          headline. This fades it out through the middle band where the type
          sits — the same trick the quantum hero uses to keep its lattice
          readable under display type. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,var(--cream)_0%,rgba(245,244,241,0.72)_28%,rgba(245,244,241,0.72)_66%,var(--cream)_100%)]"
      />

      <Container className="relative z-20 flex flex-1 flex-col items-center justify-center gap-7 pb-36 pt-14 text-center">
        {/* `data-q-sheen` is the continuously travelling gradient from the
            quantum hero. It goes on the FIRST clause only: the accent italic
            below is already carrying colour, and running the sheen through
            both flattens the statement and its accent into one moving green. */}
        <h1 data-hero-heading className="text-display text-balance">
          <span data-q-sheen>The settlement layer</span>
          <br />
          for the <Accent display>agent economy</Accent>
        </h1>

        <p data-hero-item className="max-w-[38rem] text-body-lg text-ink-soft text-pretty">
          1 million TPS scalability, confidential by default, quantum ready. Proven on
          mainnet for five years.
        </p>

        <div data-hero-item>
          <CtaPill href="https://docs.near.org" tone="filled" external>
            Start building
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
