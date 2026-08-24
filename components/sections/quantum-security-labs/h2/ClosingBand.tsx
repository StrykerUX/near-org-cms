"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { NEAR_MARK_PATH } from "@/components/sections/quantum-security-copy/NearMark";
import { EXTERNAL_LINKS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H2 · §Closing CTA ──────────────────────────────────────────────────────
// The last screen in the same ruled, left-aligned grammar as the rest of this
// proposal: a hairline above, the ask at `text-h2`, the two links from the deck.
//
// **Why the orbit comes off.** The current close centres the copy inside a ring
// that assembles on entry and then turns forever at 42 seconds a revolution. It
// is the most finished section on the page and it is the wrong close for THIS
// proposal, for two reasons about the close and not about the ring.
//
// First, it is the page's only centred block. Every other section here hangs
// off the Container's left gutter, so the reader has tracked one edge for nine
// sections and the final ask moves it. Centring is for a moment that stands
// apart; a closing CTA wants to feel like the end of the argument that just ran.
//
// Second, a perpetual rotation under a call to action competes with the only
// two things left to press, and it is unresolved by design — which is the wrong
// note for "you can do this now".
//
// **What is kept: the rotation, finished.** One open arc with a mark parked at
// its end rather than orbiting it, bled off the right edge so it reads as part
// of a circle larger than the frame. The page opens on a rotation in progress
// and closes on one that has stopped.
export default function ClosingBand() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 84%", stagger: 0.1 });

  return (
    <section className="relative overflow-hidden bg-background py-20 text-foreground lg:py-28">
      {/* The finished arc, and the mark that stopped. Anchored off the right
          edge and allowed to bleed. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[14%] top-1/2 aspect-square w-[min(640px,58%)] -translate-y-1/2"
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
            className="text-foreground/25"
          />
          <circle
            cx="50"
            cy="50"
            r="37"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeDasharray="1.5 4"
            className="text-foreground/15"
          />
          <circle cx="50" cy="1" r="2.2" className="fill-near-green-accent" />
          <g transform="translate(41.9 41.9) scale(0.0456)">
            <path d={NEAR_MARK_PATH} fill="currentColor" className="text-foreground/12" />
          </g>
        </svg>
      </div>

      <Container className="relative">
        <div ref={ref} className="flex max-w-[46rem] flex-col gap-7 border-t border-rule pt-12">
          <h2 data-reveal className="max-w-[18ch] text-pretty text-h1">
            Upgrade to a <Accent display>quantum-safe account</Accent>
          </h2>
          <p data-reveal className="max-w-[52ch] text-pretty text-body-lg text-ink-soft">
            Post-quantum signing is live on NEAR mainnet. Rotate your keys today, and read how
            NEAR is securing the ecosystem for the quantum era.
          </p>
          <div data-reveal className="mt-2 flex flex-wrap items-center gap-4">
            <CtaPill href={EXTERNAL_LINKS.rotateKeysCli} tone="filled" external>
              Rotate your keys
            </CtaPill>
            <CtaPill href={EXTERNAL_LINKS.announcement} tone="quiet" external>
              Read the deep-dive
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
