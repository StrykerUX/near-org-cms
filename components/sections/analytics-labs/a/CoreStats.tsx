import Container from "@/components/primitives/Container";
import Delta from "@/components/sections/analytics-labs/a/Delta";
import { CORE_STATS } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal A · §2 ────────────────────────────────────────────────────────
// All FIVE figures, not three. The brief leaves the door open ("keep top 3 if
// it feels crowded") and A deliberately keeps it shut: in a document register,
// density does not crowd, it orders. Five equal columns separated by rules read
// in a single sweep; the crowding the brief is worried about comes from five
// CARDS, not from five columns of a table.
//
// The other two proposals do promote three, and that divergence is exactly what
// the comparison is meant to measure.
//
// ── Label ABOVE the figure ─────────────────────────────────────────────────
// The reverse of the default (big figure, label underneath). In a table the
// header goes on top, and the reading order is "what am I looking at → how
// much". With the label below, the reader gets "$312.6M" before knowing what of,
// and has to go back. Across five columns that is five round trips.
//
// The house precedent — `chain/ProofBand` — uses the inverse order, and there it
// is right: those are four figures working as impact ("one glance = this is real
// and used at scale"), not as reading. Here the section IS the page's table.
//
// ── No count-up ────────────────────────────────────────────────────────────
// For the reason `ProofBand` already wrote down in this repo: a counter
// withholds the number and makes the reader wait, and on figures presented as
// fact, animating them upward implies live telemetry that is wired to nothing.
// Here it is worse: this page WILL have live data, so a fabricated animation
// would be indistinguishable from the real one the day it arrives.
//
// The figure in serif italic is the house idiom for numbers (`ProofBand`,
// `StatCallout`). `text-h2-serif` and not `h1`: there are five in a row, and at
// h1 the "$312.6M" column breaks onto two lines.

export default function CoreStats() {
  return (
    <section className="bg-cream py-20">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="uppercase text-eyebrow-mono text-gray-intermediate">
            Core figures
          </h2>
          <p className="text-caption-mono text-gray-intermediate">
            Deltas measured against the same snapshot
          </p>
        </div>

        {/* `divide-x` at lg rather than a `border-l` per cell: the rule has to
            fall BETWEEN columns, not before the first one. On mobile the cells
            stack and the separator becomes horizontal. */}
        <dl className="mt-8 grid grid-cols-1 border-y border-rule sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-rule">
          {CORE_STATS.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 border-b border-rule px-0 py-7 last:border-b-0 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:px-6"
            >
              <dt className="flex min-h-[3.2em] flex-col gap-1">
                <span className="uppercase text-micro-mono text-ink-soft">
                  {s.label}
                </span>
                {s.note ? (
                  <span className="text-micro-mono text-gray-intermediate">
                    {s.note}
                  </span>
                ) : null}
              </dt>

              <dd className="flex flex-col gap-3">
                <span className="text-h2-serif italic">{s.value}</span>

                <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  {s.deltas.map((d) => (
                    <Delta key={d.window} delta={d} />
                  ))}
                </span>

                {/* The source sits at the foot of the cell, not in a tooltip: in
                    a document, provenance is part of the datum. It only appears
                    where the brief provides one — inventing sources for the
                    other four would be exactly the kind of ornament this page
                    avoids. */}
                {s.sourceHref ? (
                  <a
                    href={s.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-micro-mono text-gray-intermediate underline underline-offset-4 hover:text-ink"
                  >
                    source
                  </a>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
