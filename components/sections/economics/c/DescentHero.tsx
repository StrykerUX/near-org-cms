import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/economics/economicsContent";

// §1 of variant C — the statement at full size, and nothing under it but air.
//
// C is the editorial variant: it is read by FALLING through it, and the first
// screen has to establish that scale before the first panel arrives. So the
// headline is `text-display` at a measure that forces it onto three or four
// lines, and the qualification is pushed into a narrow column beside it rather
// than set at the same width — the contrast between a very wide line and a very
// narrow one is the page's whole typographic idea, stated once at the top.
//
// The section is `min-h-svh` so the fold is a real edge: whatever comes next
// starts below it, which is what makes the first fact row read as the page's
// second beat and not as part of the hero.

export default function DescentHero() {
  return (
    <section className="flex min-h-svh flex-col justify-between bg-cream pb-[8svh] pt-[calc(var(--site-header-block)+10svh)]">
      <Container>
        <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>
      </Container>

      <Container>
        <div className="grid-ds gap-y-14">
          <h1 className="col-span-12 max-w-[13ch] text-display text-balance lg:col-span-8">
            {HERO.headline}
          </h1>

          <div className="col-span-12 lg:col-span-3 lg:col-start-10 lg:self-end">
            <p className="max-w-[34ch] text-body text-ink-soft text-pretty">{HERO.sub}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CtaPill href={HERO.primary.href} tone="filled" external>
                {HERO.primary.label}
              </CtaPill>
              {/* A fragment, so `CtaPill`'s `<a href>` is the right element. */}
              <CtaPill href={HERO.secondary.href} tone="quiet">
                {HERO.secondary.label}
              </CtaPill>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
