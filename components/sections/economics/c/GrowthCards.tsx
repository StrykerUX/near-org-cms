"use client";

import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import StageSection from "@/components/sections/shells/stage/Section";
import StageCard from "@/components/sections/shells/stage/Card";
import FactRelief from "@/components/sections/economics/c/factReliefs";
import { MATURITY } from "@/components/sections/economics/economicsContent";

// §2 of variant C — the four structural facts, one per card.
//
// ── Cards, on a page whose house doctrine is against them ─────────────────
// The doctrine (`chain/WhyItMatters.tsx`) is that grouping with rules beats
// grouping with boxes, and it holds for a section of ARGUMENT: three columns of
// prose in three rectangles read as a form. It does not hold here, and the
// reason is written into the shell: every unit has a FIGURE, and a figure needs
// a ground of its own or it floats on the page with no frame of reference. The
// card is not enclosing text, it is giving the drawing a plate and dragging its
// caption along.
//
// ── The figure goes inside the art plate, not above the title ─────────────
// `Card` has a title and a body and no slot for `figure`, and it should not
// grow one — four variant props is the ceiling and this would be a fifth. So
// `100%` is composed INTO the art: the plate carries the reading and the solid
// that shows its shape, and the card's title carries the claim. A reader
// scanning only the white plates gets `100% · −50% · Onchain · 5 yrs` and has
// already had the section.
//
// ── Why this section is short and comes early ─────────────────────────────
// It is the only verifiable thing on the page before four screens of terrain
// metaphor, and a page that asks for that much trust has to hand over the
// proof first.
//
// ── One accent card ──────────────────────────────────────────────────────
// The same one variant B lights: a fully unlocked supply is the most checkable
// of the four and the one nothing downstream needs hedging around. Light all
// four and none of them is the argument.
//
// ── No count-up ──────────────────────────────────────────────────────────
// Two of the four cannot count — `Onchain` is not a number and `−50%` is a cut
// — so a tally would have to special-case half the row, which destroys the
// evenness that lets it be swept in one pass. Same objection `chain/ProofBand`
// documents for `<$0.01`, and on a tokenomics page a rising number is the genre
// default besides.

const ACCENT_ID = "supply";

export default function GrowthCards() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <StageSection
      eyebrow={MATURITY.eyebrow}
      title={MATURITY.headline}
      intro={MATURITY.intro}
      tone="tint"
    >
      <div ref={rootRef} className="grid-ds gap-y-8">
        {MATURITY.facts.map((f) => (
          <div key={f.id} data-reveal className="col-span-12 md:col-span-6 lg:col-span-3">
            <StageCard
              accent={f.id === ACCENT_ID}
              art={
                // Reading over solid, and the solid at the plate's full width.
                // The height budget is tight and it is worth checking before
                // touching this: the plate is 4/3 of the card's inner width with
                // `p-6` inside it, and the card clips — so a stack that
                // overflows loses its bottom SILENTLY, because a clip is not an
                // error. Reading + label ≈ 64px, the solid ≈ a third of the
                // plate's width, and the two together have to stay under the
                // plate's inner height at the narrowest column the grid makes.
                <div className="flex w-full flex-col gap-5">
                  <div>
                    <p className="text-h2-serif italic text-ink">{f.figure}</p>
                    <p className="mt-2 text-micro-mono uppercase text-gray-intermediate">
                      {f.figureLabel}
                    </p>
                  </div>
                  <FactRelief id={f.id} />
                </div>
              }
              title={f.title}
              body={f.body}
            />
          </div>
        ))}
      </div>
    </StageSection>
  );
}
