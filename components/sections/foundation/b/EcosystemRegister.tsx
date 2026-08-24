"use client";

import Link from "next/link";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import EcosystemMark from "@/components/sections/foundation/EcosystemMark";
import {
  ECOSYSTEM,
  ECOSYSTEM_MARKS,
  PLATES,
} from "@/components/sections/foundation/foundationContent";

// §7 — the ecosystem, as the annex of the instrument.
//
// The scene above hands the treasury out and the reader arrives here: twelve
// builders, five of them already carrying their mark and seven reserved. It is
// the plainest section of the variant on purpose — after three viewports of a
// panel that moves, the right register is a plate you can count.
//
// A panel and not a bare grid because everything else on this page is inside
// one: a grid of cells floating on the section ground would be the one block
// that stopped being part of the apparatus. `slate` and not `ink` for the same
// reason as the council panel — corner marks on 1px hairlines read as holes
// against #101010.
//
// The cells carry no `data-reveal`. That rule and its reason live in
// `EcosystemMark`, and it is worth keeping in mind here specifically: a
// reserved cell that fades in is not declaring a missing asset for as long as
// it is itself missing.
export default function EcosystemRegister() {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  return (
    <div ref={rootRef}>
      <InstrumentSection
        eyebrow={ECOSYSTEM.eyebrow}
        title={ECOSYSTEM.headline}
        intro={ECOSYSTEM.body}
      >
        <Panel
          tone="slate"
          label={PLATES.ecosystem.label}
          meta={PLATES.ecosystem.meta}
          footer={
            <Link
              href={ECOSYSTEM.href}
              className="text-label-lg text-near-green-accent underline-offset-4 hover:underline focus-visible:underline"
            >
              {ECOSYSTEM.linkLabel}
            </Link>
          }
        >
          <ul className="grid grid-cols-2 gap-x-6 gap-y-8 px-5 pb-12 pt-16 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:px-7 lg:pb-14 lg:pt-20">
            {ECOSYSTEM_MARKS.map((mark) => (
              <li key={mark.id}>
                <EcosystemMark mark={mark} tone="dark" />
              </li>
            ))}
          </ul>
        </Panel>
      </InstrumentSection>
    </div>
  );
}
