"use client";

import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { gsap } from "@/components/primitives/motion/gsapClient";
import {
  ECOSYSTEM,
  ECOSYSTEM_NAMES,
} from "@/components/sections/foundation/foundationContent";

// §7 — who actually builds it.
//
// Names in type, moving, rather than a grid of logos: the long reason is on
// `ECOSYSTEM_NAMES` in foundationContent.ts (five real marks and a dozen
// placeholders is not a grid). The marquee is the right form for the sentence
// as well — a grid is a roster, a band with no beginning and no end is a
// population, and the copy says "hundreds".
//
// It runs continuously rather than on scroll, and it is the only thing on this
// page that moves without being asked. A page whose argument is that the
// Foundation recedes needs one place where the ecosystem is visibly running on
// its own.
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

      <NameBand />
    </section>
  );
}

// The band. Same construction as `chain/ProofBand`'s strip — copied rather than
// imported, because that one is a private function of its own section and the
// lab rule in the sections README is explicit: a shared piece gets copied to the
// page that receives it, never reached into.
function NameBand() {
  const trackRef = useMotionScope<HTMLDivElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // The wrapper holds exactly two identical copies of the list, so its width
    // is precisely 2x one set and -50% is exact by construction — no measuring,
    // and it stays exact when the font swaps.
    const tween = gsap.fromTo(
      q("[data-name-marquee]"),
      { xPercent: 0 },
      { xPercent: -50, duration: 56, repeat: -1, ease: "none", force3D: true }
    );

    return () => tween.kill();
  });

  const set = (
    <>
      {ECOSYSTEM_NAMES.map((name) => (
        <span key={name} className="flex items-center gap-10 whitespace-nowrap text-h2 text-ink">
          {name}
          <span className="size-1.5 rounded-full bg-near-green-accent" aria-hidden="true" />
        </span>
      ))}
    </>
  );

  return (
    <div ref={trackRef} className="mt-[10svh] overflow-hidden">
      {/* The two halves are structurally IDENTICAL — same wrapper, same padding.
          One copy loose in the track and the other in a div makes the track 2x a
          set PLUS one gap, and -50% then slips by that gap on every loop. */}
      <div data-name-marquee className="flex w-max">
        <div className="flex gap-10 pr-10">{set}</div>
        {/* The second copy is presentational: the reader has already been told
            the list once, and a screen reader should not hear it twice. */}
        <div className="flex gap-10 pr-10" aria-hidden="true">
          {set}
        </div>
      </div>
    </div>
  );
}
