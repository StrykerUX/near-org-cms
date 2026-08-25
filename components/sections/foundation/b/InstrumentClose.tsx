"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING } from "@/components/sections/foundation/foundationContent";

// §8 — the close, and the one block of this variant without a panel.
//
// Everything above is an object with a case around it, which is the argument
// of the layout: the Foundation as a thing that can be read from outside. The
// last four lines are not addressed to the reader by an instrument, they are
// addressed by the people who run it, and putting them inside a bordered
// object would keep the case closed exactly where the page wants it open.
//
// It is also the only place a panel could not help: a short send-off needs
// air, and a border is the opposite of air. Same call as the graphics brief
// makes about closings — the target was never every section resolved.
export default function InstrumentClose() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef} className="bg-ink pb-[20svh] pt-[10svh] text-cream">
      <Container>
        <div data-reveal className="h-px w-full bg-white/12" aria-hidden="true" />

        <h2 data-reveal className="mt-12 max-w-[12ch] text-h1 text-balance">
          NEAR belongs to <Accent display>you</Accent>
        </h2>

        <p data-reveal className="mt-8 max-w-[38ch] text-body-lg text-white/60 text-pretty">
          {CLOSING.sub}
        </p>

        <div data-reveal className="mt-12 flex flex-wrap items-center gap-4">
          <CtaPill href={CLOSING.primary.href} tone="solid">
            {CLOSING.primary.label}
          </CtaPill>
          <CtaPill href={CLOSING.secondary.href} tone="dark" external>
            {CLOSING.secondary.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
