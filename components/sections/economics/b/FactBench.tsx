"use client";

import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import Readout from "@/components/sections/shells/instrument/Readout";
import FactGlyph from "@/components/sections/economics/factGlyphs";
import { MATURITY } from "@/components/sections/economics/economicsContent";

// §2 of variant B — the four structural facts as the instrument's face.
//
// ── Why the row of gauges and the row of claims are separate ──────────────
// Variant A puts figure, glyph and claim in one column, in that order, and it
// is right to: an editorial page reads down a column. B is not reading down a
// column, it is reading an APPARATUS, and an apparatus has a face — one band
// where every reading sits at the same height and can be swept in one pass —
// with its legend under it. Splitting the two is what turns `100% · −50% ·
// Onchain · 5 yrs` from four headings into one row of instruments.
//
// The two rows are the same grid inside the same panel, in the same order, and
// both print the index, so the mapping needs no line drawn between them. Both
// stay inside the panel for a plainer reason: outside it the claims would sit
// on the container's grid while the gauges sit on the panel's inset grid, and
// the two would miss each other by a quarter of a column.
//
// ── The glyphs are the ones from `../factGlyphs`, not new ones ────────────
// Four claims with one right drawing each, and the drawings are not layout —
// that is why they were pulled out of the variants in the first place. What
// changes here is their HOUSING: each one sits in a recessed plate under its
// reading, which is the difference between a drawing in a column and a window
// on an instrument. A second hand-drawn set for B would drift from A's the
// first time anyone touched one, and would say nothing A's does not.
//
// The volume this variant owes lives in `LoopBench`, where the figure is the
// argument. Extruding four line-height glyphs as well would spend the same
// gesture twice and make the section compete with the scene below it.
//
// ── One accent, and it is 01 ──────────────────────────────────────────────
// `Readout`'s rule: light one per block or the block has no argument. It is
// `100%` because a fully unlocked supply is the most checkable of the four and
// the one nothing else on the page can be hedged around.
//
// ── No count-up ───────────────────────────────────────────────────────────
// Two of these four cannot count: `Onchain` is not a number and `−50%` is a
// cut, so a tally would run it the wrong way up and have to special-case half
// the row — the same concrete objection `chain/ProofBand.tsx` documents for
// `<$0.01`. And a rising number inside a dark panel is exactly the fake
// telemetry this variant has to stay clear of: nothing here is connected to
// anything.

const ACCENT_ID = "supply";

export default function FactBench() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <InstrumentSection
      eyebrow={MATURITY.eyebrow}
      title={MATURITY.headline}
      intro={MATURITY.intro}
    >
      <div ref={rootRef}>
        <Panel label="Structural readings" meta="Thresholds already crossed">
          <div className="px-5 pb-10 pt-20 lg:px-8 lg:pb-14 lg:pt-24">
            <div className="grid-ds gap-y-12">
              {MATURITY.facts.map((f) => (
                <div key={f.id} data-reveal className="col-span-6 lg:col-span-3">
                  <p className="text-micro-mono text-white/30">{f.index}</p>
                  <div className="mt-4">
                    <Readout
                      value={f.figure}
                      label={f.figureLabel}
                      accent={f.id === ACCENT_ID}
                      size="lg"
                    >
                      {/* The recessed plate: a flat slot with a rule across its
                          top, not a rounded card. A bordered box here would
                          read as an icon tile, which is the one thing a
                          hairline drawing must never be mistaken for. */}
                      <div className="mt-7 border-t border-white/10 bg-white/[0.03] px-4 py-5 text-white/70">
                        <FactGlyph id={f.id} />
                      </div>
                    </Readout>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 h-px w-full bg-white/10" aria-hidden="true" />

            <div className="mt-16 grid-ds gap-y-12">
              {MATURITY.facts.map((f) => (
                <div key={f.id} data-reveal className="col-span-6 lg:col-span-3">
                  <h3 className="max-w-[18ch] text-h4 text-pretty">
                    <span className="text-micro-mono text-white/30">{f.index} </span>
                    {f.title}
                  </h3>
                  <p className="mt-4 max-w-[34ch] text-body-sm text-white/60 text-pretty">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </InstrumentSection>
  );
}
