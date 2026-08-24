"use client";

import StageSection from "@/components/sections/shells/stage/Section";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  STIFTUNG_FACTS,
  TRANSPARENCY,
} from "@/components/sections/foundation/foundationContent";

// §4 — the legal ground, and the one section of this variant with no drawing.
//
// ── Why nothing is drawn here ─────────────────────────────────────────────
// The claim this section carries — funds cannot leave except by fulfilling the
// purpose — is already drawn on this page, twice: as the sealed basin of the
// first pillar, and as the terrain the whole variant is measured on. Drawing
// it a third time would be the page repeating itself in its loudest register,
// and it is also the section where a reader most needs to simply read four
// facts. So this one is plates and prose, and the graphic budget goes to the
// section above it, where the argument is harder.
//
// ── White, once ───────────────────────────────────────────────────────────
// The DS allows a page one pure-white section and this is where it earns it:
// the record is the flattest thing the page says, and the flattest ground it
// has is the right place to say it.
//
// The plates are sans and not the serif of the instrument variant's readouts.
// Same four facts, different register: there they are the live values of a
// device, here they are the entries of a record.
export default function StiftungPlates() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  return (
    <div ref={rootRef}>
      <StageSection
        tone="white"
        eyebrow={TRANSPARENCY.eyebrow}
        title={TRANSPARENCY.headline}
        // `slice(0, -1)`: the last entry of `body` IS the kicker, set apart
        // below — see the note in foundationContent.ts.
        intro={TRANSPARENCY.body.slice(0, -1).join(" ")}
      >
        <ul className="grid-ds gap-y-6">
          {STIFTUNG_FACTS.map((fact) => (
            <li
              key={fact.id}
              data-reveal
              className="col-span-12 rounded-[1.25rem] bg-card-tint p-6 sm:col-span-6 lg:col-span-3 lg:p-7"
            >
              <p className="text-micro-mono uppercase text-gray-intermediate">{fact.term}</p>
              <p className="mt-4 max-w-[14ch] text-h4 text-ink text-pretty">{fact.value}</p>
            </li>
          ))}
        </ul>

        <p
          data-reveal
          className="mt-16 max-w-[22ch] text-h2 text-ink text-balance"
        >
          {TRANSPARENCY.kicker}
        </p>
      </StageSection>
    </div>
  );
}
