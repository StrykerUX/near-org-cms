"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import FactGlyph from "@/components/sections/economics/factGlyphs";
import { MATURITY } from "@/components/sections/economics/economicsContent";

// §2 of variant B — the four structural facts as four ROWS.
//
// ── Rows and not columns ───────────────────────────────────────────────────
// Variant A sets these as four columns, which is the right shape for a page
// that wants them taken in at a glance. This variant wants the opposite: a row
// per fact, one under the other, each with an index, a figure, a claim and a
// body in the same four positions. That is a table, and a table is a promise —
// every fact is answering the same four questions, so they can be compared
// down the column instead of read across.
//
// It is still hairlines and not a bordered table. The house rule is in
// `chain/WhyItMatters.tsx`; here it also happens to be what an actual ledger
// looks like.
//
// ── No count-up, on this page least of all ─────────────────────────────────
// Two of these four cannot count: `Onchain` is not a number and `−50%` is a
// cut, so a tally would have to special-case half the table. And a rising
// number is the default ornament of every tokenomics page ever published, which
// is precisely what a layout that presents itself as a book of record cannot
// afford to borrow. The figures arrive by having their rule drawn under them.
//
// ── The glyph is a column of the table, not an illustration beside it ──────
// The drawings come from `../factGlyphs`, shared with the other two variants,
// and here they go INSIDE the figure cell — under the figure and its label, in
// the same column for all four rows. That is the whole reason a table earns its
// keep: four things answering the same question in the same position can be
// compared straight down the column, and the four glyphs compared that way are
// a span, a span cut in half, a threshold and a run. Set off to one side as
// decoration they would be four unrelated marks.
//
// They also happen to be the only kind of drawing this variant can accept. B
// refuses the ring of variant A because a ring is a metaphor; these are
// measures — bars, a cut, a gate, a line across five divisions — which is the
// register a book of record is already written in.
//
// No tween of their own: they sit inside `data-row-body` and arrive with the
// row.

export default function LedgerFacts() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: scope,
        start: "top 76%",
        once: true,
        markers: DEBUG_MARKERS,
      },
    });

    // The rule wipes across and the row comes up behind it. Row by row, in the
    // reading order — a ledger is entered one line at a time.
    tl.from(q("[data-row-rule]"), { scaleX: 0, duration: 0.7, stagger: 0.11 }, 0).from(
      q("[data-row-body]"),
      { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.11 },
      0.14
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });

  return (
    <section ref={rootRef} className="bg-cream pb-[12svh] pt-[6svh]">
      <Container>
        <div className="grid-ds gap-y-8">
          <h2 className="col-span-12 max-w-[20ch] text-h2 text-pretty lg:col-span-5">
            {MATURITY.headline}
          </h2>
          <p className="col-span-12 max-w-[56ch] text-body text-ink-soft text-pretty lg:col-span-6 lg:col-start-7">
            {MATURITY.intro}
          </p>
        </div>

        <div className="mt-20">
          {MATURITY.facts.map((f) => (
            <div key={f.id}>
              <div
                data-row-rule
                className="h-px w-full origin-left bg-rule"
                aria-hidden="true"
              />
              <div data-row-body className="grid-ds gap-y-5 pb-12 pt-7">
                <p className="col-span-2 text-caption-mono text-gray-intermediate lg:col-span-1">
                  {f.index}
                </p>

                <div className="col-span-10 lg:col-span-3">
                  <p className="text-h2">{f.figure}</p>
                  <p className="mt-2 max-w-[22ch] text-caption-mono text-gray-intermediate">
                    {f.figureLabel}
                  </p>
                  <div className="mt-8 text-ink">
                    <FactGlyph id={f.id} />
                  </div>
                </div>

                <h3 className="col-span-12 max-w-[20ch] text-h4 text-pretty lg:col-span-3">
                  {f.title}
                </h3>

                <p className="col-span-12 max-w-[52ch] text-body-sm text-ink-soft text-pretty lg:col-span-5">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
          {/* The account is closed off at the bottom: without this the last row
              is the only one that is not bounded, and the table stops looking
              like a table exactly where it ends. */}
          <div className="h-px w-full bg-rule" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
