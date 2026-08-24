"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CHAPTERS, HERO, READOUTS } from "@/components/sections/about/aboutContent";

// §1 of variant B — the instrument, powered on.
//
// ── Why the hero ends in a panel of numbers ───────────────────────────────
//
// Variant A opens with a rule and a span, because what follows it is prose.
// What follows this one is an apparatus, and the hero has to say so before the
// reader meets it: a bordered object with four readings under a headline
// declares the unit of composition of the whole page. Every section below is
// something you look at, not something you read through.
//
// The four readings are the only numbers this history can honestly show, and
// three of them are the page's argument in a row: six months estimated, five
// years of uninterrupted mainnet, one million accounts. The lit one is the
// estimate — it is the number the rest of the page is the answer to, and the
// reader gets the joke eight chapters later.
//
// The span is derived from the chapters rather than typed, same as A: a
// hardcoded "2017 — 2026" is a caption that goes silently wrong the day a ninth
// chapter is added.
const SPAN = `${CHAPTERS[0].year} — ${CHAPTERS[CHAPTERS.length - 1].year}`;

export default function LogHero() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 90%" });

  return (
    <section
      ref={rootRef}
      data-nav-dark
      className="flex min-h-svh flex-col justify-end bg-ink pb-[10svh] pt-[calc(var(--site-header-block)+6svh)] text-cream"
    >
      <Container>
        <div className="grid-ds items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <div data-reveal>
              <Eyebrow className="text-white/40">{HERO.eyebrow}</Eyebrow>
            </div>
            <h1 data-reveal className="mt-8 max-w-[15ch] text-display text-cream text-balance">
              The <Accent display>History</Accent> of NEAR Protocol
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p data-reveal className="max-w-[34ch] text-h3 text-cream text-pretty">
              {HERO.sub}
            </p>
            <p data-reveal className="mt-6 max-w-[44ch] text-body text-white/55 text-pretty">
              {HERO.standfirst}
            </p>
          </div>
        </div>

        <div data-reveal className="mt-16 lg:mt-20">
          <Panel label={SPAN} meta="Log">
            {/* Two columns on a phone rather than one: a single stack of four
                readings is a list, and the point of a readout row is that the
                figures are read against each other. */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 p-6 pt-14 lg:grid-cols-4 lg:gap-x-10 lg:p-10 lg:pt-20">
              {READOUTS.map((r) => (
                <Readout
                  key={r.id}
                  value={r.value}
                  label={r.label}
                  note={r.note || undefined}
                  accent={r.id === "estimate"}
                />
              ))}
            </div>
          </Panel>
        </div>
      </Container>
    </section>
  );
}
