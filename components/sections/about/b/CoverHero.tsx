"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CHAPTERS, HERO } from "@/components/sections/about/aboutContent";

// §1 of variant B — the cover.
//
// Variant B reads as a book: every chapter opens on its own screen, and the
// ground changes with the era. A cover is the one page of a book that carries
// almost nothing, so this one carries the title, the two lines under it, and
// the span — and refuses the eyebrow-headline-subhead-CTA stack every other
// hero on the site uses. There is no call to action here on purpose: the only
// action a cover asks for is to turn the page.
const SPAN = `${CHAPTERS[0].year} — ${CHAPTERS[CHAPTERS.length - 1].year}`;

export default function CoverHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 90%", stagger: 0.12 });

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col bg-cream pb-[10svh] pt-[calc(var(--site-header-block)+3rem)]"
    >
      <Container className="flex flex-1 flex-col">
        <div data-reveal className="flex items-baseline justify-between gap-6">
          <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>
          <p className="text-caption-mono text-gray-intermediate">{SPAN}</p>
        </div>

        <div className="flex flex-1 items-center justify-center py-[8svh]">
          <h1
            data-reveal
            className="max-w-[14ch] text-center text-display text-ink text-balance"
          >
            The <Accent display>History</Accent> of NEAR Protocol
          </h1>
        </div>

        <div data-reveal className="h-px w-full bg-rule" aria-hidden="true" />

        <div className="grid-ds mt-8 gap-y-6">
          <p
            data-reveal
            className="col-span-12 max-w-[30ch] text-h3 text-ink text-pretty lg:col-span-5"
          >
            {HERO.sub}
          </p>
          <p
            data-reveal
            className="col-span-12 max-w-[52ch] text-body text-ink-soft text-pretty lg:col-span-5 lg:col-start-8"
          >
            {HERO.standfirst}
          </p>
        </div>
      </Container>
    </section>
  );
}
