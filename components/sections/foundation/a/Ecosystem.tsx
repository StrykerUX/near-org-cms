"use client";

import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import EcosystemMark from "@/components/sections/foundation/EcosystemMark";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { gsap } from "@/components/primitives/motion/gsapClient";
import {
  ECOSYSTEM,
  ECOSYSTEM_MARKS,
} from "@/components/sections/foundation/foundationContent";

// §7 — who actually builds it.
//
// The band was twelve names set in type, on the grounds that a grid of five
// real marks beside seven blanks is not a grid. It carries the marks now: with
// `MediaFrame` a blank is a reserved cell that states what belongs in it, so
// the band can run at the ecosystem's real state — five logos served, seven
// commissioned — which is the thing the deck actually asked for.
//
// The FORM did not change and should not: a grid is a roster, a band with no
// beginning and no end is a population, and the copy says "hundreds". It runs
// continuously rather than on scroll, and it is the only thing on this page
// that moves without being asked. A page whose argument is that the Foundation
// recedes needs one place where the ecosystem is visibly running on its own.
export default function Ecosystem() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div data-reveal className="col-span-12">
            <Eyebrow className="text-gray-intermediate">{ECOSYSTEM.eyebrow}</Eyebrow>
          </div>

          <h2 data-reveal className="col-span-12 max-w-[14ch] text-h2 lg:col-span-5 text-balance">
            {ECOSYSTEM.headline}
          </h2>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:self-end">
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
      </Container>

      <MarkBand />
    </section>
  );
}

// The band. Same construction as `chain/ProofBand`'s strip — copied rather than
// imported, because that one is a private function of its own section and the
// lab rule in the sections README is explicit: a shared piece gets copied to the
// page that receives it, never reached into.
function MarkBand() {
  const trackRef = useMotionScope<HTMLDivElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // The wrapper holds exactly two identical copies of the list, so its width
    // is precisely 2x one set and -50% is exact by construction — no measuring,
    // and it stays exact when the font swaps.
    const tween = gsap.fromTo(
      q("[data-mark-marquee]"),
      { xPercent: 0 },
      { xPercent: -50, duration: 72, repeat: -1, ease: "none", force3D: true }
    );

    return () => tween.kill();
  });

  // A fixed cell width and not a fraction of the viewport: the band is not a
  // grid, so there is no column for a cell to be a fraction OF. At 16rem a
  // reserved cell fits its name and its spec on one line of micro mono, which
  // is the measure this width is actually sized against.
  const set = (
    <>
      {ECOSYSTEM_MARKS.map((mark) => (
        <div key={mark.id} className="w-64 shrink-0">
          <EcosystemMark mark={mark} />
        </div>
      ))}
    </>
  );

  return (
    <div ref={trackRef} className="mt-[10svh] overflow-hidden">
      {/* The two halves are structurally IDENTICAL — same wrapper, same padding.
          One copy loose in the track and the other in a div makes the track 2x a
          set PLUS one gap, and -50% then slips by that gap on every loop. */}
      <div data-mark-marquee className="flex w-max">
        <div className="flex gap-6 pr-6">{set}</div>
        {/* The second copy is presentational: the reader has already been told
            the list once, and a screen reader should not hear it twice. */}
        <div className="flex gap-6 pr-6" aria-hidden="true">
          {set}
        </div>
      </div>
    </div>
  );
}
