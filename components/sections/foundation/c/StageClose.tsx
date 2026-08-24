"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING } from "@/components/sections/foundation/foundationContent";

// §8 — the close, on plain cream and with nothing drawn on it.
//
// The variant ends on the flattest ground it has, which is the point: the page
// has spent eight screens describing terrain the Foundation holds and hands
// over, and the last thing it says is addressed to the person reading rather
// than about the body being described. A drawing here would keep the page
// talking about itself through its own send-off.
//
// Cream and not another shader band: the surface is the page's opening
// statement, and using it again at the end would fold the ending back into the
// beginning instead of releasing the reader out of it.
export default function StageClose() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[18svh] pt-[10svh]">
      <Container>
        <div data-reveal className="h-px w-full bg-rule" aria-hidden="true" />

        <h2 data-reveal className="mt-12 max-w-[12ch] text-h1 text-balance">
          NEAR belongs to <Accent display>you</Accent>
        </h2>

        <p data-reveal className="mt-8 max-w-[38ch] text-body-lg text-ink-soft text-pretty">
          {CLOSING.sub}
        </p>

        <div data-reveal className="mt-12 flex flex-wrap items-center gap-4">
          <CtaPill href={CLOSING.primary.href} tone="filled">
            {CLOSING.primary.label}
          </CtaPill>
          <CtaPill href={CLOSING.secondary.href} tone="quiet" external>
            {CLOSING.secondary.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
