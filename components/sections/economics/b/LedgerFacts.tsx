"use client";

import Container from "@/components/primitives/Container";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
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
