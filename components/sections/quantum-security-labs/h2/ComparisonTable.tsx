"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { NEAR_MARK_PATH, NEAR_MARK_VIEW_BOX } from "@/components/sections/quantum-security-copy/NearMark";
import { COMPARISON_ROWS as ROWS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H2 · §Competitive contrast ─────────────────────────────────────────────
// The four pairs as the house's ruled table — the same object as the proof row
// higher up this page and as `chain-ab-propuesta-a`'s stat block: `divide-y`
// between rows, `border-y` around the block, mono small-caps column heads.
//
// **The change from the current version is one thing and it is structural: the
// columns are no longer even.** Four of twelve for the alternatives, seven for
// NEAR. The reader takes the point before reading a word.
//
// An even split is the layout of a fair comparison, and this section is not one
// — the deck's own framing is "most post-quantum protection in production today
// is NARROWER than it sounds". A layout that grants both sides equal standing
// argues against its own copy, and then has to win the point back by making the
// right-hand cell bolder, which is a very quiet way to say a loud thing.
//
// **What keeps it honest.** The alternatives are quoted in full at a legible
// size in `--gray-intermediate`, the token that exists precisely for
// "subordinate without dropping out of legibility". Nothing is struck through,
// crossed out or paraphrased. The rail is narrow; it is not dismissive.
//
// **One `data-reveal` per ROW, never per cell.** A rebuttal that arrives after
// its claim reads as a retort — the pair has to land together. The current
// version staggers the two cells and that is the one thing not to keep.
export default function ComparisonTable() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 86%", stagger: 0.1 });

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

        <div ref={ref} className="flex flex-col">
          {/* Column heads over their own columns, so the ratio is declared
              before the first row instead of discovered in it. */}
          <div className="hidden grid-ds pb-4 lg:grid">
            <span className="col-span-4 uppercase text-caption-mono text-gray-intermediate">
              Alternatives
            </span>
            <span className="col-span-7 col-start-6 flex items-center gap-2.5 uppercase text-caption-mono">
              <svg aria-hidden="true" viewBox={NEAR_MARK_VIEW_BOX} className="size-[1em] shrink-0">
                <path d={NEAR_MARK_PATH} fill="currentColor" />
              </svg>
              On NEAR
            </span>
          </div>

          <div className="flex flex-col divide-y divide-rule border-y border-rule">
            {ROWS.map((row) => (
              <div key={row.us} data-reveal className="grid-ds gap-y-3 py-7">
                <p className="col-span-12 max-w-[42ch] text-pretty text-body-sm text-gray-intermediate lg:col-span-4">
                  {row.them}
                </p>
                {/* `text-h3` and not `text-label-lg`: the size is what carries
                    the asymmetry, and a weight change alone does not. */}
                <p className="col-span-12 max-w-[46ch] text-pretty text-h3 lg:col-span-7 lg:col-start-6">
                  {row.us}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
