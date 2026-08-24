import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/economics/economicsContent";

// §1 of variant A — the statement, and nothing performing next to it.
//
// The hero is deliberately the quietest thing on this page. Variant A spends
// its entire structural budget on `LoopScene`, which is a sticky, drawn,
// scrubbed figure; a hero with its own animated field would arrive first and
// spend the reader's attention on the wrong section. So this one is a server
// component with no motion at all: a headline, its qualification set off to the
// right, and two links.
//
// The sub is pushed into the right half rather than sitting under the headline
// at full width. On a page whose argument is a circle, the opening asymmetry is
// what says "this is not a list" before any figure is drawn.

export default function Hero() {
  return (
    <section className="bg-cream pb-[14svh] pt-[calc(var(--site-header-block)+10svh)]">
      <Container>
        <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>

        <h1 className="mt-10 max-w-[15ch] text-display text-balance">{HERO.headline}</h1>

        <div className="mt-16 grid-ds gap-y-10">
          <p className="col-span-12 max-w-[54ch] text-body-lg text-ink-soft text-pretty lg:col-span-6 lg:col-start-7">
            {HERO.sub}
          </p>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <CtaPill href={HERO.primary.href} tone="filled" external>
            {HERO.primary.label}
          </CtaPill>
          {/* Same-page anchor: `CtaPill` renders an `<a href>`, which is the
              correct element for a fragment. `next/link` would route. */}
          <CtaPill href={HERO.secondary.href} tone="quiet">
            {HERO.secondary.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
