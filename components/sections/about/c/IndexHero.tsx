"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CHAPTERS, HERO, QUESTIONS } from "@/components/sections/about/aboutContent";

// §1 of variant C — the opening, with the refrain stated up front.
//
// C is built for the reader who came for a fact and not for three thousand
// words. So the hero does not fill a screen: it states the title, the two lines
// under it, and — beside them — the three questions the history is about to
// answer.
//
// ── Why the questions are here at all ──────────────────────────────────────
// In the deck they belong to the last chapter. Stated only at the end they are
// a conclusion; stated at both ends they are a refrain, and the page stops
// being a line and becomes a circle, which is what the history actually is.
// This variant is the one that commits to that: the same three questions open
// the page and close it, and the reader who scans past everything in between
// still gets the shape.
//
// The closing section repeats them at heading scale. If either instance is
// edited, the other has to move with it — half a rhyme is a leftover.
const SPAN = `${CHAPTERS[0].year} — ${CHAPTERS[CHAPTERS.length - 1].year}`;

export default function IndexHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 90%" });

  return (
    <section
      ref={rootRef}
      className="bg-cream pb-[10svh] pt-[calc(var(--site-header-block)+5rem)]"
    >
      <Container>
        <div data-reveal className="flex items-baseline justify-between gap-6">
          <Eyebrow className="text-gray-intermediate">{HERO.eyebrow}</Eyebrow>
          <p className="text-caption-mono text-gray-intermediate">{SPAN}</p>
        </div>

        <div data-reveal className="mt-6 h-px w-full bg-rule" aria-hidden="true" />

        <div className="grid-ds mt-14 gap-y-14">
          <div className="col-span-12 lg:col-span-7">
            <h1 data-reveal className="max-w-[14ch] text-display text-ink text-balance">
              The <Accent display>History</Accent> of NEAR Protocol
            </h1>

            <p data-reveal className="mt-10 max-w-[38ch] text-h3 text-ink text-pretty">
              {HERO.sub}
            </p>

            <p data-reveal className="mt-6 max-w-[58ch] text-body text-ink-soft text-pretty">
              {HERO.standfirst}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p data-reveal className="uppercase text-micro-mono text-gray-intermediate">
              What the history asks
            </p>
            <ol className="mt-6 flex flex-col">
              {QUESTIONS.map((question, i) => (
                <li
                  key={question}
                  data-reveal
                  className="flex gap-x-4 border-t border-rule py-5 last:pb-0"
                >
                  <span className="text-caption-mono text-gray-intermediate" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-[28ch] text-body text-ink text-pretty">{question}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
