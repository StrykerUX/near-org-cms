"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { HERO, STATS, STATS_NOTE } from "@/components/sections/community/communityContent";

// §1 of the Rally — the hero, with the figures inside it.
//
// ── Why there is no stats bar on this page ─────────────────────────────────
// `a/` and `b/` both give the four figures their own strip under the hero, which
// is the honest treatment when the figures are evidence: they arrive after the
// claim and support it. This variant is not making a claim that needs support.
// It is saying "there are a lot of us and we are everywhere", and that sentence
// IS the four figures — so they belong in the same breath as the headline rather
// than in a band beneath it, where they read as a footnote to something already
// finished.
//
// Practically that means: no rules, no cells, no separate ground. Four figures
// set large along the bottom of the opening, at a size that makes them part of
// the composition rather than instrumentation attached to it.
//
// They are set in the serif italic (`text-h1-serif`) and not the sans of `a/`.
// That is the one typographic decision that carries this whole variant: the
// serif is the site's warm voice, and a page about people counting themselves
// should not sound like a dashboard. `ProofBand` does the same on
// /chain-abstraction for the same reason.
//
// The provenance line still sits underneath. Warmth is not an excuse for four
// unaccountable numbers — see `STATS_NOTE` in the content module.
export default function RallyHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 95%", stagger: 0.1 });

  return (
    <section
      ref={rootRef}
      className="bg-cream pb-[6svh] pt-[calc(var(--site-header-block)+7svh)]"
    >
      <Container>
        <div data-reveal>
          <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>
        </div>

        <h1 data-reveal className="mt-8 max-w-[14ch] text-display text-balance">
          The people building the <Accent display>open web</Accent>
        </h1>

        <div className="mt-12 grid-ds items-end gap-y-8">
          <div className="col-span-12 lg:col-span-6">
            <p data-reveal className="max-w-[48ch] text-body-lg text-ink-soft text-pretty">
              {HERO.sub}
            </p>
          </div>
          <div
            data-reveal
            className="col-span-12 flex flex-wrap items-center gap-3 lg:col-span-5 lg:col-start-8 lg:justify-end"
          >
            <CtaPill href={HERO.primary.href} tone="filled">
              {HERO.primary.label}
            </CtaPill>
            <CtaPill href={HERO.secondary.href} tone="quiet">
              {HERO.secondary.label}
            </CtaPill>
          </div>
        </div>

        {/* One figure per line below `sm`: at 375px a half-width cell is ~120px
            and "4,000+" in serif at the bottom of the `text-h1` clamp does not
            fit. No rule above this row, either. On `a/` the hairline is what marks the
            figures as a separate register; here they are part of the opening,
            and a rule would put them back in a box. */}
        <div className="mt-20 grid-ds gap-y-10">
          {STATS.map((s) => (
            <div key={s.id} data-reveal className="col-span-12 sm:col-span-6 lg:col-span-3">
              <p className="text-h1-serif italic">{s.value}</p>
              <p className="mt-3 text-caption-mono uppercase text-gray-intermediate">{s.label}</p>
            </div>
          ))}
        </div>

        <p
          data-reveal
          className="mt-10 max-w-[62ch] text-caption text-gray-intermediate text-pretty"
        >
          {STATS_NOTE}
        </p>
      </Container>
    </section>
  );
}
