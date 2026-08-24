"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING, HERO } from "@/components/sections/foundation/foundationContent";

// §8 — the execution block.
//
// It keeps the document's measure — rail on the left, argument on the right,
// one ruling above — but does NOT use `Clause`, and the reason is a colour and
// not a preference: `border-rule` is #c9c7c1, which is a hairline on cream and
// nothing at all on ink. On dark ground the house rule is `bg-white/12`, so the
// ruling is drawn here rather than inherited. Everything else about the grid is
// the same by hand, which is the trade: one section repeating four class names
// against every section on the page owning its own spans.
//
// This is the variant's only ink ground. A filed document ends by being signed,
// and the change of ground is that: the same measure, in the register of an
// execution page rather than a clause.
//
// Its rail carries the document's name and nothing else, and that is one of the
// two blocks on the page where an empty-ish rail is right rather than a miss:
// an execution page has no clause data — it is where the clauses stop. The
// other is the annex.
export default function DossierClose() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 76%" });

  return (
    <section ref={rootRef} data-nav-dark className="bg-ink py-[16svh] text-cream">
      <Container>
        <div className="grid-ds gap-y-10 border-t border-white/12 pt-8">
          <div data-reveal className="col-span-12 lg:col-span-2">
            <p className="text-micro-mono uppercase text-cream/50">{HERO.eyebrow}</p>
          </div>

          <div className="col-span-12 lg:col-span-9 lg:col-start-4">
            <h2 data-reveal className="max-w-[12ch] text-h1 text-balance">
              NEAR belongs to <Accent display>you</Accent>
            </h2>

            <p data-reveal className="mt-8 max-w-[40ch] text-body-lg text-cream/70 text-pretty">
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
          </div>
        </div>
      </Container>
    </section>
  );
}
