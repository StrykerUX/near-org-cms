"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  TRANSPARENCY,
  STIFTUNG_FACTS,
} from "@/components/sections/foundation/foundationContent";

// §4 — the legal ground, in as few lines as it can be said.
//
// The four facts run as ONE line of mono under the paragraph rather than as a
// table. A table is the right form when the record is the point, which is what
// variant B is for; here the record is a credential the reader passes on the
// way to the scene, and a four-row table would stop them for longer than the
// section is worth. Same four facts, one line, one rule.
export default function HandoffStiftung() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 80%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div data-reveal className="col-span-12">
            <Eyebrow className="text-gray-intermediate">{TRANSPARENCY.eyebrow}</Eyebrow>
          </div>

          <h2 data-reveal className="col-span-12 max-w-[16ch] text-h2 lg:col-span-5 text-balance">
            {TRANSPARENCY.headline}
          </h2>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            {/* `slice(0, -1)`: the last entry of `body` IS the kicker, set apart
                below — see the note on MISSION in foundationContent.ts. */}
            {TRANSPARENCY.body.slice(0, -1).map((paragraph) => (
              <p
                key={paragraph}
                data-reveal
                className="max-w-[52ch] text-body text-ink-soft text-pretty"
              >
                {paragraph}
              </p>
            ))}

            <dl
              data-reveal
              className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule pt-5"
            >
              {STIFTUNG_FACTS.map((fact) => (
                <div key={fact.id} className="flex flex-col gap-0.5">
                  <dt className="text-micro-mono uppercase text-gray-intermediate">
                    {fact.term}
                  </dt>
                  <dd className="text-caption-mono text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <p data-reveal className="mt-12 max-w-[24ch] text-h3 text-ink text-balance">
              {TRANSPARENCY.kicker}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
