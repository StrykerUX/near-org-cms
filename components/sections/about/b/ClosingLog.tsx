"use client";

import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Panel from "@/components/sections/shells/instrument/Panel";
import CtaPill from "@/components/primitives/CtaPill";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CHAPTERS, CLOSING, QUESTIONS } from "@/components/sections/about/aboutContent";

// §4 of variant B — the three questions, and the close.
//
// The questions are the last chapter's, and they are also the first one's: two
// people asking who owns the thing they are building. The page's shape is a
// circle and this is where it shuts.
//
// ── Why the questions are in a panel and the close is not ─────────────────
//
// Everything above this is inside a border, because everything above this is
// the apparatus. The questions are the last thing the apparatus has on screen —
// they are the machine's open items, so they keep the border. Then the panel
// ends and the closing statement is on the bare ground, at the width of the
// page, with nothing around it. Leaving the frame is the only gesture available
// to a variant whose whole grammar is frames, and it is worth spending once.
//
// No figure here, deliberately, and the same call as in variants A and C: the
// obvious drawing for the refrain is three lines running from 2017 to 2026 to
// show that these are the questions from the beginning — and the only caption
// that drawing could carry is "these are the same questions", which is what the
// page has already done by printing them after the eight chapters that answer
// them. A remate needs room, not one more object.
const LAST_YEAR = CHAPTERS[CHAPTERS.length - 1].year;

export default function ClosingLog() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section
      ref={rootRef}
      data-nav-dark
      className="bg-ink pb-[18svh] pt-[8svh] text-cream"
    >
      <Container>
        <div data-reveal>
          <Eyebrow className="text-white/40">The refrain</Eyebrow>
        </div>

        <div data-reveal className="mt-10">
          <Panel tone="slate" label={LAST_YEAR} meta="Open">
            <ol className="flex flex-col p-6 pt-16 lg:p-10 lg:pt-20">
              {QUESTIONS.map((question, i) => (
                <li
                  key={question}
                  className="grid-ds items-baseline gap-y-3 border-t border-white/10 py-8 first:border-t-0 first:pt-0"
                >
                  <p className="col-span-12 text-micro-mono text-near-green-accent lg:col-span-2">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="col-span-12 max-w-[26ch] text-h3 text-cream text-pretty lg:col-span-9 lg:col-start-3">
                    {question}
                  </p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="grid-ds mt-[14svh] gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <h2 data-reveal className="max-w-[18ch] text-h1 text-cream text-balance">
              The goal remains the <Accent>same</Accent> as it was in the beginning
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p data-reveal className="max-w-[40ch] text-body-lg text-white/60 text-pretty">
              {CLOSING.body}
            </p>

            <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <CtaPill href={CLOSING.primary.href} tone="solid" external>
                {CLOSING.primary.label}
              </CtaPill>
              {/* `next/link` and not a second pill: this destination is internal,
                  the pill always renders a plain `<a>`, and two pills side by
                  side leave the pair with no hierarchy. */}
              <Link
                href={CLOSING.secondary.href}
                className="text-label-lg text-cream underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
              >
                {CLOSING.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
