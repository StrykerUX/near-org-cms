"use client";

import Link from "next/link";
import StageSection from "@/components/sections/shells/stage/Section";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import EcosystemMark from "@/components/sections/foundation/EcosystemMark";
import {
  ECOSYSTEM,
  ECOSYSTEM_MARKS,
} from "@/components/sections/foundation/foundationContent";

// §7 — the builders, as twelve cells.
//
// The grid is the same twelve entries the other two variants show, laid out
// four across on tinted ground: five carrying their mark and seven reserved,
// which is the real state of the asset library and a more useful thing to put
// on the page than twelve names in a typeface.
//
// No card and no box around them. Everything above this section is a drawing
// of ground that the Foundation holds; these twelve are the people it does not
// hold, and giving them a container of the page's own would be the one place
// the layout contradicted its argument.
//
// The cells are not revealed — the rule and its reason are in `EcosystemMark`.
export default function EcosystemField() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  return (
    <div ref={rootRef}>
      <StageSection
        tone="tint"
        eyebrow={ECOSYSTEM.eyebrow}
        title={ECOSYSTEM.headline}
        intro={ECOSYSTEM.body}
      >
        <ul className="grid-ds gap-y-10">
          {ECOSYSTEM_MARKS.map((mark) => (
            <li key={mark.id} className="col-span-6 sm:col-span-4 lg:col-span-3">
              <EcosystemMark mark={mark} />
            </li>
          ))}
        </ul>

        <p data-reveal className="mt-14">
          <Link
            href={ECOSYSTEM.href}
            className="text-label-lg text-green-ink underline-offset-4 hover:underline focus-visible:underline"
          >
            {ECOSYSTEM.linkLabel}
          </Link>
        </p>
      </StageSection>
    </div>
  );
}
