"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CONTENT_BLOCK as C } from "@/components/sections/quantum-security-labs/labContent";

// ── H2 · §Content block ────────────────────────────────────────────────────
// The deck's `[Content Block]` is one sentence sitting between two sections
// with no heading and no eyebrow. This proposal treats it as exactly that: a
// pull-quote between rules.
//
// **`text-statement` and not `text-h1`.** The token exists for "the short
// phrase that occupies the width of the section without being the page's
// headline", which is precisely what a content block is. At `h1` it reads as
// another section heading and the reader waits for the section that follows it;
// at `statement` it reads as an aside the page stops to make. `ForwardTurn` on
// `/chain-abstraction` uses the token for the same job.
//
// **The two rules are the whole treatment.** No ground change, no figure, no
// eyebrow. Everything around this section is dense — a ruled proof row above, a
// staircase of three columns below — so the thing that makes this one land is
// that it is nearly empty.
//
// The serif accent falls on "Only NEAR", the contrast phrase, which is the same
// call the current build makes. What changes is the scale it sits at and the
// fact that nothing else is in the section with it.
export default function OnlyNearLine() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 82%", y: 30 });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <div ref={ref} className="border-y border-rule py-16 lg:py-24">
          <p data-reveal className="max-w-[24ch] text-pretty text-statement">
            {C.before} <Accent display>{C.accent}</Accent> {C.after}
          </p>
        </div>
      </Container>
    </section>
  );
}
