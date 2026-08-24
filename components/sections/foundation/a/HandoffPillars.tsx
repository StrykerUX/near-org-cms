"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { PILLARS } from "@/components/sections/foundation/foundationContent";

// §2 — one row, one rule, no ornament.
//
// Variant A gives each pillar its own hairline, which turns the row into three
// units. Here there is a single rule across all three and the columns hang off
// it: one object rather than three, which is the quietest form the same content
// can take. Everything before and after the scene in this variant is built to
// be forgettable — that is the deal the scene is paid for.
export default function HandoffPillars() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 80%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[4svh]">
      <Container>
        <div className="h-px w-full bg-rule" aria-hidden="true" />

        <div className="grid-ds gap-y-14 pt-10">
          {PILLARS.map((pillar) => (
            <div key={pillar.id} data-reveal className="col-span-12 md:col-span-6 lg:col-span-4">
              <p className="text-caption-mono text-gray-intermediate">{pillar.index}</p>
              <h2 className="mt-6 max-w-[16ch] text-h3 text-pretty">{pillar.title}</h2>
              <p className="mt-4 max-w-[38ch] text-body text-ink-soft text-pretty">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
