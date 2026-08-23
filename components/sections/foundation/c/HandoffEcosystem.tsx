"use client";

import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import EcosystemMark from "@/components/sections/foundation/EcosystemMark";
import {
  ECOSYSTEM,
  ECOSYSTEM_MARKS,
} from "@/components/sections/foundation/foundationContent";

// §7 — the twelve places the mass went.
//
// This section is the caption of the one above it, and the rhyme is the reason
// it is set the way it is: the scene sends the Foundation's mass out to twelve
// clusters on its rim and labels none of them, and then the page turns cream
// and the reader meets twelve builders. Nothing points from one to the other, and
// nothing should — a reader who did not count is simply reading a list of
// builders, and a reader who did gets the section for free.
//
// The twelve are a GRID here, and that is the one place this variant spends
// anything after the scene. Four columns of reserved cells, five of them
// already carrying their mark: it is the plainest possible statement of where
// the mass went, and a plain statement is what belongs after three viewports of
// black. Anything with motion in it would read as the scene continuing.
//
// A grid and not the wrapped block of names it replaced, for the reason on
// `ECOSYSTEM_MARKS` in foundationContent.ts — and the rows cost nothing here:
// the section above already refused to rank the twelve clusters, so a reader
// arriving at four tidy columns is not being told an order, only a count.
//
// The cells are not revealed — see `EcosystemMark`. Here it also happens to be
// the right entrance: the section lands after three viewports of black, and a
// grid that is simply THERE when the ground turns cream is flatter, and quieter,
// than twelve cells cascading in.
export default function HandoffEcosystem() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 80%", stagger: 0.04 });

  return (
    <section ref={rootRef} className="bg-cream py-[16svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div data-reveal className="col-span-12">
            <Eyebrow className="text-gray-intermediate">{ECOSYSTEM.eyebrow}</Eyebrow>
          </div>

          <h2 data-reveal className="col-span-12 max-w-[14ch] text-h2 lg:col-span-5 text-balance">
            {ECOSYSTEM.headline}
          </h2>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p data-reveal className="max-w-[52ch] text-body text-ink-soft text-pretty">
              {ECOSYSTEM.body}
            </p>
            <p data-reveal className="mt-6">
              <Link
                href={ECOSYSTEM.href}
                className="text-label-lg text-green-ink underline-offset-4 hover:underline focus-visible:underline"
              >
                {ECOSYSTEM.linkLabel}
              </Link>
            </p>
          </div>
        </div>

        <ul className="mt-[12svh] grid-ds gap-y-10">
          {ECOSYSTEM_MARKS.map((mark) => (
            <li key={mark.id} className="col-span-6 sm:col-span-4 lg:col-span-3">
              <EcosystemMark mark={mark} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
