"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import FactGlyph from "@/components/sections/economics/factGlyphs";
import { MATURITY } from "@/components/sections/economics/economicsContent";

// §2 of variant C — the four thresholds, compressed into one band.
//
// ── Why this section is TIGHT, and deliberately the smallest on the page ───
// C is a page of full-height panels. That is a lot of scrolling before the
// reader is given anything checkable, and an editorial page that spends four
// screens on a metaphor before offering a single fact is asking for a great
// deal of trust. This band is the answer: it sits immediately under the fold,
// it is one row, and it is over in a screen. Proof first, then the descent.
//
// The bodies are here too, but subordinated — `text-body-sm`, below the claim,
// at a narrow measure. They are for the reader who stops; the row is for the
// reader who does not.
//
// The rest of the page is full-bleed panels, so the band being contained,
// ruled and short is also what makes it read as an interruption rather than as
// the first panel.
//
// ── The glyphs matter more here than in the other two variants ────────────
// This band is the only thing standing between a very large hero and four
// screens of metaphor, and a reader moving at that speed reads figures, not
// paragraphs. The drawing from `../factGlyphs` doubles what that reader takes
// away per cell — the figure gives the quantity, the glyph gives its shape —
// without adding a line of copy to the shortest section on the page. It sits
// tight under the figure label, on the same rhythm as everything else in the
// cell, and enters with the cell's reveal.

export default function FactRow() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 85%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[10svh] pt-[6svh]">
      <Container>
        <div data-reveal className="grid-ds gap-y-6">
          <p className="col-span-12 text-caption-mono uppercase text-gray-intermediate lg:col-span-3">
            {MATURITY.eyebrow}
          </p>
          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <h2 className="max-w-[24ch] text-h3 text-pretty">{MATURITY.headline}</h2>
            <p className="mt-5 max-w-[62ch] text-body text-ink-soft text-pretty">
              {MATURITY.intro}
            </p>
          </div>
        </div>

        <div className="mt-14 grid-ds gap-y-12">
          {MATURITY.facts.map((f) => (
            <div key={f.id} data-reveal className="col-span-6 lg:col-span-3">
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <p className="mt-5 text-caption-mono text-gray-intermediate">{f.index}</p>
              <p className="mt-5 text-h2">{f.figure}</p>
              <p className="mt-2 max-w-[20ch] text-caption-mono text-gray-intermediate">
                {f.figureLabel}
              </p>
              <div className="mt-7 text-ink">
                <FactGlyph id={f.id} />
              </div>
              <h3 className="mt-7 max-w-[18ch] text-h4 text-pretty">{f.title}</h3>
              <p className="mt-3 max-w-[32ch] text-body-sm text-ink-soft text-pretty">{f.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
