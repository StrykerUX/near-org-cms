"use client";

import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  ECOSYSTEM,
  ECOSYSTEM_NAMES,
} from "@/components/sections/foundation/foundationContent";

// §7 — the twelve places the mass went.
//
// This section is the caption of the one above it, and the rhyme is the reason
// it is set the way it is: the scene sends the Foundation's mass out to twelve
// clusters on its rim and labels none of them, and then the page turns cream
// and the reader meets twelve names. Nothing points from one to the other, and
// nothing should — a reader who did not count is simply reading a list of
// builders, and a reader who did gets the section for free.
//
// Names in type rather than a grid of logos, for the reason on
// `ECOSYSTEM_NAMES` in foundationContent.ts. They are set at heading scale and
// laid out in flow rather than in a table: a wrapped block of names has no rows
// and no ranking, which is the closest a list gets to saying "hundreds".
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

        <ul className="mt-[12svh] flex flex-wrap items-baseline gap-x-10 gap-y-6">
          {ECOSYSTEM_NAMES.map((name) => (
            <li key={name} data-reveal className="text-h3 text-ink">
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
