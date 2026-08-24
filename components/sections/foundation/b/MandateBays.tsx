"use client";

import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { PILLARS, PLATES } from "@/components/sections/foundation/foundationContent";

// §2 — the mandate, as one case with three bays.
//
// ── Three bays, and deliberately no glyphs ─────────────────────────────────
// The obvious move here is an icon per pillar, and it is the one the graphics
// brief names as forbidden. It was tried in variant A and thrown out for a
// specific reason worth repeating: the three only earn a drawing if each one
// EXECUTES its claim the way the glyphs of `chain/WhyItMatters` do — something
// closed that cannot open, resources leaving, a centre dissolving. What comes
// out otherwise is three pictograms. Variant C does draw them, because a card
// is a box with an art well in it and an empty well is a hole; a panel bay is
// not, so here the three stay as engraved text.
//
// What makes this a panel rather than a row of columns is the divider: one
// case, three bays cut into it. Three separate panels would be three objects,
// and the copy says these are three aspects of one mandate — the order is the
// argument (what it IS, what it DOES, what it is FOR), which is why the plate
// says so and why a layout must not reorder them.
//
// ── Why the reveal hangs off a wrapper ─────────────────────────────────────
// `InstrumentSection` is a shell and takes no ref, so the scope goes on a div
// around it. Same box, same trigger; the alternative is forking the shell,
// which is exactly what the shells exist to prevent.
export default function MandateBays() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  return (
    <div ref={rootRef}>
      <InstrumentSection>
        <Panel label={PLATES.mandate.label} meta={PLATES.mandate.meta}>
          <div className="grid-ds gap-y-px px-5 pb-10 pt-20 lg:px-7 lg:pb-14 lg:pt-24">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.id}
                data-reveal
                className={`col-span-12 py-8 lg:col-span-4 lg:py-0 lg:pr-8 ${
                  i === 0
                    ? ""
                    : "border-t border-white/10 lg:border-l lg:border-t-0 lg:pl-8"
                }`}
              >
                <p className="text-caption-mono text-white/40">{pillar.index}</p>
                <h2 className="mt-6 max-w-[16ch] text-h3 text-pretty">{pillar.title}</h2>
                <p className="mt-5 max-w-[36ch] text-body text-white/60 text-pretty">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </InstrumentSection>
    </div>
  );
}
