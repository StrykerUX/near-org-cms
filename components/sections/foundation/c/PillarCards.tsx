"use client";

import StageSection from "@/components/sections/shells/stage/Section";
import Card from "@/components/sections/shells/stage/Card";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { PILLARS } from "@/components/sections/foundation/foundationContent";
import {
  EvenField,
  SealedBasin,
  SheddingShelf,
} from "@/components/sections/foundation/c/pillarArt";

// §2 — the three pillars, one card each.
//
// The order is the argument the copy makes — what the Foundation IS, what it
// DOES, what it is FOR — so the index stays on the page, above the card and
// outside it. `Card` has no slot for it and should not grow one: a number
// printed above a box is a list marker, and a number inside it would be part
// of the card's own composition, which is a different claim about what the
// three are.
//
// The lit card is the third. `accent` marks what the section is arguing, and
// what this page argues is the one the other two exist to reach: a
// decentralized ecosystem that does not need the body describing it. Lighting
// all three would be lighting none.
const ART = [<SealedBasin key="basin" />, <SheddingShelf key="shelf" />, <EvenField key="field" />];

export default function PillarCards() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  return (
    <div ref={rootRef}>
      <StageSection tone="tint">
        <ul className="grid-ds gap-y-10">
          {PILLARS.map((pillar, i) => (
            <li key={pillar.id} data-reveal className="col-span-12 md:col-span-6 lg:col-span-4">
              <p className="text-caption-mono text-gray-intermediate">{pillar.index}</p>
              <Card
                className="mt-4"
                art={ART[i]}
                title={pillar.title}
                body={pillar.body}
                accent={i === PILLARS.length - 1}
              />
            </li>
          ))}
        </ul>
      </StageSection>
    </div>
  );
}
