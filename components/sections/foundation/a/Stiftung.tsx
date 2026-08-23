"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  TRANSPARENCY,
  STIFTUNG_FACTS,
} from "@/components/sections/foundation/foundationContent";

// §4 — the legal ground.
//
// The four facts are set as a RECORD and not as prose: term on the left, value
// on the right, one hairline per entry. The register change is the argument —
// the paragraph beside them explains the constraint, and the list shows that it
// is a filing, not a promise. Same four facts, said once each, in the two
// registers the section needs.
//
// The kicker gets the width the record does not use, so the section resolves
// from a column of small type into one line of large type.
export default function Stiftung() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 76%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <div className="grid-ds gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <div data-reveal>
              <Eyebrow className="text-gray-intermediate">{TRANSPARENCY.eyebrow}</Eyebrow>
            </div>

            <h2 data-reveal className="mt-10 max-w-[18ch] text-h2 text-balance">
              {TRANSPARENCY.headline}
            </h2>

            {/* `slice(0, -1)`: the last entry of `body` IS the kicker, which is
                set apart below. See the note on MISSION in foundationContent.ts. */}
            {TRANSPARENCY.body.slice(0, -1).map((paragraph) => (
              <p
                key={paragraph}
                data-reveal
                className="mt-8 max-w-[46ch] text-body text-ink-soft text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="col-span-12 lg:col-span-5 lg:col-start-8 lg:mt-4">
            {STIFTUNG_FACTS.map((fact) => (
              <div
                key={fact.id}
                data-reveal
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t border-rule py-5"
              >
                <dt className="text-caption-mono text-gray-intermediate">{fact.term}</dt>
                <dd className="text-body text-ink">{fact.value}</dd>
              </div>
            ))}
            {/* The record closes with a rule of its own: without it the last
                entry has a top edge and no bottom one, which reads as a list
                that was cut off rather than as a complete filing. */}
            <div className="h-px w-full bg-rule" aria-hidden="true" />
          </dl>
        </div>

        <p
          data-reveal
          className="mt-[10svh] max-w-[24ch] text-h1 text-ink text-balance"
        >
          {TRANSPARENCY.kicker}
        </p>
      </Container>
    </section>
  );
}
