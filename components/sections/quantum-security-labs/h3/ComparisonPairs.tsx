"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { NEAR_MARK_PATH, NEAR_MARK_VIEW_BOX } from "@/components/sections/quantum-security-copy/NearMark";
import { COMPARISON_ROWS as ROWS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H3 · §Competitive contrast ─────────────────────────────────────────────
// The four pairs stacked VERTICALLY instead of side by side: the alternative
// small and grey on top, NEAR's answer at `text-h3` underneath, four times, no
// rules — `gap` does the separating, the way `chain-ab-propuesta-b` sets its
// stat list.
//
// **The problem with the side-by-side version is specific to this table.** Four
// rows, two columns, and every cell is 15 to 20 words of prose. At that length
// the left cell is two or three lines and the right is two or three, they rarely
// align, and nothing carries the eye across. So the reader loses which claim
// pairs with which answer — the one thing a two-column comparison exists to
// communicate.
//
// Stacked, the pairing is not something the layout has to communicate: it is
// the reading order. Claim, then answer, four times.
//
// **The cost, stated.** You lose the ability to scan all four alternatives as a
// column, which is worth something to a reader who came specifically to compare
// against a chain they already know. H2 keeps that scan and fixes the pairing a
// different way — by making the columns visibly uneven so the eye never treats
// them as a matched grid. Two answers to one problem, which is what these two
// proposals are.
//
// **The green mark is the only ornament and it appears four times.** It is the
// NEAR sign at caption size in front of each answer — the same object as the
// "On NEAR" label in the current build, moved from a column head down onto every
// row, because with the columns gone there is no head to carry it.
export default function ComparisonPairs() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 86%", stagger: 0.11 });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-ink-soft">The difference</Eyebrow>
            <h2 className="text-pretty text-h2">
              How is NEAR different from other
              <br />
              <Accent>quantum-safe chains?</Accent>
            </h2>
          </div>
          <p className="max-w-[52ch] text-pretty text-body-lg text-ink-soft lg:pt-2">
            Most post-quantum protection in production today is narrower than it sounds. On
            NEAR, quantum safety is a default account-level property, live in production, not
            an opt-in tool or a roadmap item.
          </p>
        </div>

        <div ref={ref} className="grid gap-12 md:grid-cols-2 md:gap-x-16 lg:gap-y-16">
          {ROWS.map((row) => (
            <div key={row.us} data-reveal className="flex flex-col gap-4">
              <p className="max-w-[44ch] text-pretty text-body text-gray-intermediate">
                {row.them}
              </p>
              <p className="flex max-w-[44ch] gap-3 text-pretty text-h3">
                <svg
                  aria-hidden="true"
                  viewBox={NEAR_MARK_VIEW_BOX}
                  // `mt` and a relative size so the mark sits on the first
                  // line's cap height rather than on the block's top edge — at
                  // `h3` the difference is visible.
                  className="mt-[0.34em] size-[0.5em] shrink-0 text-near-green-accent"
                >
                  <path d={NEAR_MARK_PATH} fill="currentColor" />
                </svg>
                {row.us}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
