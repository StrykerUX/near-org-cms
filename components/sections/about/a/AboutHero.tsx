"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CHAPTERS, HERO } from "@/components/sections/about/aboutContent";

// §1 of variant A — the cover of a reading apparatus.
//
// ── Why the hero already draws the page's two columns ──────────────────────
// Everything below this section is a narrow rail of years on the left and a
// column of prose on the right. A centred hero would introduce that layout as a
// surprise on the reader's first scroll. So the hero states it: the span
// "2017 — 2026" sits in the rail's columns, set in the same mono the rail uses,
// and the standfirst sits in the prose column, at the prose column's measure.
// By the time the rail appears it has already been introduced.
//
// The span is DERIVED from the chapters rather than typed here. It is a fact
// about the data, and a hardcoded "2017 — 2026" is a caption that silently goes
// wrong the day a ninth chapter is added.
const SPAN = `${CHAPTERS[0].year} — ${CHAPTERS[CHAPTERS.length - 1].year}`;

export default function AboutHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 90%" });

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col justify-end bg-cream pb-[12svh] pt-[calc(var(--site-header-block)+4rem)]"
    >
      <Container>
        <div data-reveal>
          <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>
        </div>

        <h1 data-reveal className="mt-10 max-w-[16ch] text-display text-ink text-balance">
          The <Accent display>History</Accent> of NEAR Protocol
        </h1>

        <div data-reveal className="mt-16 h-px w-full bg-rule" aria-hidden="true" />

        <div className="grid-ds mt-8 gap-y-8">
          <p data-reveal className="col-span-12 text-caption-mono text-gray-intermediate lg:col-span-2">
            {SPAN}
          </p>

          <div className="col-span-12 lg:col-span-6 lg:col-start-4">
            <p data-reveal className="max-w-[42ch] text-h3 text-ink text-pretty">
              {HERO.sub}
            </p>
            <p data-reveal className="mt-6 max-w-[58ch] text-body text-ink-soft text-pretty">
              {HERO.standfirst}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
