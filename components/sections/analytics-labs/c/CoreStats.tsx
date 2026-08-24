"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { CORE_STATS } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal C · §2 ────────────────────────────────────────────────────────
// The three weight-bearing figures, one per full-width ROW instead of a row of
// columns. It is C's scale decision carried to its consequence.
//
// **What the row buys.** The label and the figure rest on the two ends of the
// same rule. That distance is what does the work: it forces the eye to travel
// the width of the page for every datum, and that travel is the slow tempo C is
// paying for. In a row of five columns the figures are read together, in one
// sweep — which is exactly what A wants and what C deliberately does not.
//
// **What it costs, said plainly:** they cannot be compared with each other.
// Three figures separated by 200px of height do not form a joint reading. That
// is accepted because they are not comparable anyway — cumulative dollars,
// deposited dollars and transacted dollars do not belong on one scale — and a
// row of columns invites a comparison that means nothing.
//
// **Numbered 01–03.** Not section decoration: in a layout this airy the reader
// loses count of how many figures there are, and the index says there are three
// and this is the second. Same service the pagination of a long article
// performs.
//
// **Price and shards at the foot.** Same as in B and for the same reason — they
// are ambient, not cumulative — but the device here is different: not an
// instrument strip but a section footnote, in small type. Same editorial
// judgement, said in each proposal's own idiom.
//
// The entrance is the house one: the rule wipes across and the figure rises out
// of the space that rule just drew. Same figure as `chain/ProofBand`, which
// documents it; the mask here is a hand-written `overflow-hidden` rather than
// SplitText, for the reason written inside `build`.

const PROMOTED = CORE_STATS.filter((s) =>
  ["fees", "confidential-tvl", "intents-volume"].includes(s.id)
);
const AMBIENT = CORE_STATS.filter((s) => ["shards", "price"].includes(s.id));

const TONE = { up: "text-green-ink", down: "text-destructive", flat: "text-gray-intermediate" } as const;
const GLYPH = { up: "▲", down: "▼", flat: "–" } as const;

export default function CoreStats() {
  const rootRef = useScrollReveal<HTMLElement>({
    start: "top 78%",
    build: ({ tl, q }) => {
      // The mask is an `overflow-hidden` written by hand in the JSX and not
      // `SplitText({ mask: "lines" })`. Not a preference: `build` cannot return
      // a cleanup, so a split created here would never get its `revert()` — a
      // GSAP context reverts tweens, not the <div>s SplitText injects into the
      // DOM. And it is not needed: these are ONE-line figures that never wrap,
      // which is the only case where SplitText adds anything.
      tl.from(q("[data-c-rule]"), { scaleX: 0, duration: 0.9, stagger: 0.16 }, 0)
        .from(
          q("[data-c-figure]"),
          { yPercent: 112, autoAlpha: 0, duration: 1, ease: EASE_OUT, stagger: 0.16 },
          0.22
        )
        .from(
          q("[data-c-meta]"),
          { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.16 },
          0.5
        )
        .from(q("[data-c-foot]"), { autoAlpha: 0, y: 12, duration: 0.6 }, 0.9);
    },
  });

  return (
    <section ref={rootRef} className="bg-cream pb-24">
      <Container>
        {PROMOTED.map((s, i) => (
          <div key={s.id} className="pt-10">
            <div
              data-c-rule
              aria-hidden="true"
              className="h-px w-full origin-left bg-ink"
            />
            <div className="grid-ds items-baseline gap-y-5 pt-7 pb-14">
              <p className="col-span-2 text-caption-mono text-gray-intermediate lg:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </p>

              <div className="col-span-10 flex flex-col gap-2 lg:col-span-5">
                <h3 className="text-pretty text-h3">{s.label}</h3>
                {s.note ? (
                  <p data-c-meta className="text-body-sm text-gray-intermediate">
                    {s.note}
                  </p>
                ) : null}
              </div>

              <div className="col-span-12 flex flex-col items-start gap-3 lg:col-span-6 lg:items-end">
                {/* `pb-[0.2em]` + `-mb-[0.2em]`: the clip box grows downward so
                    the italic's descenders are not sheared off, and the negative
                    margin gives that height back to the layout. Same trick
                    `allowDescenders` applies to SplitText's masks. */}
                <span className="block overflow-hidden pb-[0.2em] -mb-[0.2em]">
                  <span data-c-figure className="block text-h1-serif italic">
                    {s.value}
                  </span>
                </span>
                <p data-c-meta className="flex flex-wrap items-baseline gap-x-5 lg:justify-end">
                  {s.deltas.map((d) => (
                    <span
                      key={d.window}
                      className={`inline-flex items-baseline gap-1.5 text-caption-mono ${TONE[d.direction]}`}
                    >
                      <span className="text-gray-intermediate">{d.window}</span>
                      <span aria-hidden="true">{GLYPH[d.direction]}</span>
                      <span>{d.value}</span>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* ── The ambient footnote ─────────────────────────────────────── */}
        <div
          data-c-foot
          className="flex flex-wrap items-baseline gap-x-12 gap-y-4 border-t border-rule pt-6"
        >
          {AMBIENT.map((s) => (
            <p key={s.id} className="flex items-baseline gap-3">
              <span className="uppercase text-micro-mono text-gray-intermediate">{s.label}</span>
              <span className="text-body-sm-mono text-ink">{s.value}</span>
              {s.sourceHref ? (
                <a
                  href={s.sourceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-micro-mono text-gray-intermediate underline underline-offset-4 hover:text-ink"
                >
                  source
                </a>
              ) : null}
            </p>
          ))}
          <p className="ml-auto text-micro-mono text-gray-intermediate">
            Figures are placeholders
          </p>
        </div>
      </Container>
    </section>
  );
}
