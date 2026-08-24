"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { NEAR_MARK_PATH } from "@/components/sections/quantum-security-copy/NearMark";
import { EXTERNAL_LINKS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H3 · §Closing CTA ──────────────────────────────────────────────────────
// The last screen as the same `--ink` statement card this proposal used for the
// content block. The page raises its voice exactly twice — once for the thesis,
// once for the ask — and both times with the same object. That repetition is
// the point: it is what makes the two read as bookends rather than as two
// unrelated dark boxes.
//
// **Why the orbit comes off.** The current close centres the copy inside a ring
// that assembles on entry and then turns forever at 42 seconds a revolution. It
// is the most finished section on the page, and two things make it wrong here.
//
// It is the page's only centred block — every other section on both proposals
// hangs off the Container's left gutter, so a reader who has tracked one edge
// for nine sections gets it moved on the final ask. And a perpetual, unresolved
// rotation under a call to action competes with the only two things left to
// press.
//
// **What is kept: the rotation, finished.** One open arc bled off the card's
// right edge with a mark parked at its end instead of orbiting it, and the NEAR
// sign at the centre it never left. The page opens on a rotation in progress
// and closes on one that has stopped — which is the difference between "this is
// happening" and "you can do this now".
export default function ClosingCard() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 84%", stagger: 0.1 });

  return (
    <section className="bg-cream py-16 lg:py-24">
      <Container>
        <div
          ref={ref}
          data-nav-dark
          className="relative overflow-hidden rounded-[clamp(20px,2vw,32px)] bg-ink px-8 py-20 text-white lg:px-16 lg:py-28"
        >
          {/* The finished arc. Anchored off the right edge and allowed to bleed,
              so it reads as part of a circle larger than the card. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[10%] top-1/2 aspect-square w-[min(620px,56%)] -translate-y-1/2"
          >
            <svg viewBox="0 0 100 100" className="size-full">
              <circle
                cx="50"
                cy="50"
                r="49"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.35"
                strokeDasharray="196 308"
                strokeDashoffset="-60"
                transform="rotate(-90 50 50)"
                className="text-white/25"
              />
              <circle
                cx="50"
                cy="50"
                r="37"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.35"
                strokeDasharray="1.5 4"
                className="text-white/12"
              />
              <circle cx="50" cy="1" r="2.2" className="fill-near-green-accent" />
              {/* The sign at the centre it never left. `tx = 50 − 9 − 108 × s`
                  places the path's own 108..459 box into an 18-unit square. */}
              <g transform="translate(35.462 35.462) scale(0.0513)">
                <path d={NEAR_MARK_PATH} fill="currentColor" className="text-white/15" />
              </g>
            </svg>
          </div>

          <div className="relative flex max-w-[42rem] flex-col gap-7">
            <h2 data-reveal className="max-w-[18ch] text-pretty text-h1">
              Upgrade to a <Accent display>quantum-safe account</Accent>
            </h2>
            <p data-reveal className="max-w-[50ch] text-pretty text-body-lg text-white/70">
              Post-quantum signing is live on NEAR mainnet. Rotate your keys today, and read how
              NEAR is securing the ecosystem for the quantum era.
            </p>
            <div data-reveal className="mt-2 flex flex-wrap items-center gap-4">
              <CtaPill href={EXTERNAL_LINKS.rotateKeysCli} tone="solid" external>
                Rotate your keys
              </CtaPill>
              <CtaPill href={EXTERNAL_LINKS.announcement} tone="dark" external>
                Read the deep-dive
              </CtaPill>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
