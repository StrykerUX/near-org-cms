"use client";

import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import CtaPill from "@/components/primitives/CtaPill";
import ConvergenceRelief from "@/components/sections/about/c/ConvergenceRelief";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CLOSING, FIGURES, QUESTIONS } from "@/components/sections/about/aboutContent";

// §3 of variant C — the circle, then the refrain, then the close.
//
// ── Why the big picture is last and not beside its chapter ────────────────
//
// The convergence drawing belongs to the 2024 chapter and every other variant
// prints it there. Here it is the last image on the page, at the width of the
// page, and the reason is what this variant is: a terrain that formed. The
// drawing is the shape of the whole history — set out, stop, detour, return,
// meet, keep going — so it is not an illustration of one chapter, it is the
// survey of the ground the reader has just walked across. Printed halfway up
// it would be a diagram; printed here it is the page saying what it was.
//
// It runs past the container to the page edges. It is the only element in the
// variant that does, which is what keeps the gesture worth anything.
//
// ── The three questions, in the clear ─────────────────────────────────────
//
// They are the last chapter's, and they are also the first one's: two people
// asking who owns the thing they are building. So they are set large, on the
// bare cream, with nothing else on screen — no card, no frame, no rule between
// them but air. The whole page has been boxes and grounds; the refrain is what
// happens when those stop.
//
// No figure here, in any of the three variants. The obvious drawing is three
// lines running 2017 to 2026 to show these are the questions from the
// beginning, and the only caption it could carry is "these are the same
// questions" — which is what the page has already done by asking them after
// the eight chapters that answer them. A figure that repeats the device beside
// it is ornament.

export default function ClosingCircle() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 80%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[18svh] pt-[16svh]">
      <Container>
        <div data-reveal>
          <Eyebrow className="text-gray-intermediate">The shape of it</Eyebrow>
        </div>
      </Container>

      {/* The drawing runs to the page edges, but its caption does not: `Figure`
          would set the two at the same width, and a line of mono running the
          full 1500px is one nobody can track from end to end. So the frame is
          assembled by hand here — the same rule above, the same mono caption
          below, just brought back inside the container. */}
      <div className="mt-12 text-ink">
        <div className="h-px w-full bg-rule" aria-hidden="true" />
        <div className="mt-10">
          <ConvergenceRelief />
        </div>
      </div>

      <Container>
        <div className="grid-ds mt-10">
          <p
            data-reveal
            className="col-span-12 max-w-[70ch] text-caption-mono text-gray-intermediate lg:col-span-8 lg:col-start-4"
          >
            {FIGURES.ai.caption}
          </p>
        </div>
      </Container>

      {/* ── the refrain ────────────────────────────────────────────────── */}
      <Container>
        <ol className="mt-[18svh] flex flex-col gap-y-14 lg:gap-y-20">
          {QUESTIONS.map((question, i) => (
            <li key={question} data-reveal className="grid-ds items-baseline gap-y-4">
              <p className="col-span-12 text-caption-mono text-green-ink lg:col-span-2">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="col-span-12 max-w-[22ch] text-h1 text-ink text-balance lg:col-span-9 lg:col-start-4">
                {question}
              </p>
            </li>
          ))}
        </ol>

        {/* ── the close ────────────────────────────────────────────────── */}
        <div className="grid-ds mt-[18svh] gap-y-10">
          <div className="col-span-12 lg:col-span-6 lg:col-start-4">
            <h2 data-reveal className="max-w-[20ch] text-h1 text-ink text-balance">
              The goal remains the <Accent>same</Accent> as it was in the beginning
            </h2>
            <p data-reveal className="mt-8 max-w-[44ch] text-body-lg text-ink-soft text-pretty">
              {CLOSING.body}
            </p>
            <div data-reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
              <CtaPill href={CLOSING.primary.href} tone="filled" external>
                {CLOSING.primary.label}
              </CtaPill>
              {/* `next/link` and not a second pill: internal destination, and the
                  pill always renders a plain `<a>`. Two pills side by side would
                  also leave the pair with no hierarchy. */}
              <Link
                href={CLOSING.secondary.href}
                className="text-label-lg text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
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
