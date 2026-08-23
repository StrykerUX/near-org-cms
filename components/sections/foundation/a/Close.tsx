"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING } from "@/components/sections/foundation/foundationContent";

// §8 — the page's one cut to ink, and its bookend.
//
// The whole variant is cream, so this is the only change of ground and it lands
// on the only sentence that is addressed to the reader rather than about the
// Foundation. One cut, at the end, where the page stops describing itself.
//
// The short rule above the headline is the last mark of the page's measure: the
// hero lays it down at full container width, `Devolution` runs it out, and what
// arrives here is the tick that was left. It is the same stroke in white/12
// because on ink the cream hairline is invisible — the rule of the house for
// dark ground.
//
// `CtaPill` comes from the quantum folder rather than being copied: the section
// contract allows `@/components/sections/*`, and the whole hover mechanism
// already lives in `[data-q-cta]` in globals.css.
export default function Close() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 72%" });

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink py-[16svh] text-cream">
      <Container>
        <div data-reveal className="h-px w-14 bg-white/12" aria-hidden="true" />

        <h2 data-reveal className="mt-10 max-w-[12ch] text-h1 text-balance">
          NEAR belongs to <Accent display>you</Accent>
        </h2>

        <p data-reveal className="mt-8 max-w-[38ch] text-body-lg text-cream/70 text-pretty">
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
