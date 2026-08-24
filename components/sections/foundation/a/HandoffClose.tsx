"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING } from "@/components/sections/foundation/foundationContent";

// §8 — the close, and the only page of the three that ends on cream.
//
// A and B both cut to ink at the end, because on those pages the black is the
// one change of ground and it lands on the one sentence addressed to the
// reader. This variant already spent its black on the scene, and three screens
// of it: closing dark again would make the ending read as the tail of the
// scene rather than as the page speaking to the reader afterwards. Coming back
// to cream is what marks the scene as over.
export default function HandoffClose() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[18svh] pt-[6svh]">
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
