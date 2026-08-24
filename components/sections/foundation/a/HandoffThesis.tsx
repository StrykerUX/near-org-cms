"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { MISSION } from "@/components/sections/foundation/foundationContent";

// §3 — the thesis, stated and left alone.
//
// In variants A and B this is where the page performs: a measure that retreats,
// a block that breaks the document's format. Here it is set plainly, because
// the performance of this exact sentence happens two sections later and lasts
// three screens. Doing it twice would leave the reader watching the same idea
// being made twice, and the second time is the one with the scene in it.
//
// What the block does keep is the kicker on its own, in the right-hand column
// with nothing beside it. It is the sentence the scene is built out of, so it
// has to be the last thing read before the page goes dark.
export default function HandoffThesis() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <div className="grid-ds gap-y-12">
          <div data-reveal className="col-span-12">
            <Eyebrow className="text-gray-intermediate">{MISSION.eyebrow}</Eyebrow>
          </div>

          <h2 data-reveal className="col-span-12 max-w-[14ch] text-h1 lg:col-span-6 text-balance">
            Our goal is to make ourselves <Accent display>smaller</Accent>
          </h2>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            {/* `slice(0, -1)`: the last entry of `body` IS the kicker, set
                apart below — see the note on MISSION in foundationContent.ts. */}
            {MISSION.body.slice(0, -1).map((paragraph) => (
              <p
                key={paragraph}
                data-reveal
                className="mt-8 max-w-[44ch] text-body text-ink-soft first:mt-0 text-pretty"
              >
                {paragraph}
              </p>
            ))}

            <p data-reveal className="mt-12 max-w-[24ch] text-h3 text-ink text-balance">
              {MISSION.kicker}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
