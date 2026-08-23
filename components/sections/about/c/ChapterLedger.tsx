"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { CHAPTERS, type AboutChapter } from "@/components/sections/about/aboutContent";

// §3 of variant C — the ledger.
//
// Two columns, held for all eight chapters: year and marker on the left, the
// full prose on the right. The claim the layout makes is testable — read ONLY
// the left column, top to bottom, and you have the whole history in eight
// lines. That is what `marker` exists for in the content module, and this is
// the variant that spends its main column on it.
//
// ── Why not a timeline of dots ─────────────────────────────────────────────
// Same reason as variant A, plus one specific to this layout: a dot column
// would occupy the exact position the markers occupy and say nothing, and this
// page's left edge is the one thing a scanner reads. Ornament is the most
// expensive thing that could go there.
//
// ── The left column is sticky, and that is the two-column claim ────────────
// Without it, a reader four paragraphs into 2024 has the year and the marker
// off screen, and the layout has quietly become one column with a label on top.
// Sticky inside the row keeps the pair in view for exactly as long as its own
// prose lasts and releases at the next chapter — the header of a ledger row,
// behaving like one. It is `position: sticky` in CSS with no ScrollTrigger
// anywhere near it; nothing here is pinned.

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One chapter. A component rather than a `map` in the parent because each row
 * needs its own scroll trigger — the section is many screens tall, and one
 * trigger on it would reveal all eight rows while seven are below the fold.
 */
function LedgerRow({ chapter, index }: { chapter: AboutChapter; index: number }) {
  const ref = useScrollReveal<HTMLElement>({ start: "top 82%" });

  return (
    <article
      ref={ref}
      id={chapter.id}
      className="grid-ds scroll-mt-[var(--site-header-block)] border-t border-rule py-[9svh]"
    >
      <div className="col-span-12 lg:sticky lg:top-[calc(var(--site-header-block)+2.5rem)] lg:col-span-3 lg:self-start">
        <p data-reveal className="text-caption-mono text-gray-intermediate">
          {pad(index + 1)}
        </p>
        <p data-reveal className="mt-3 text-h4-mono text-ink">
          {chapter.yearLabel}
        </p>
        <p data-reveal className="mt-6 max-w-[30ch] text-body-sm-mono text-ink-soft text-pretty">
          {chapter.marker}
        </p>
      </div>

      <div className="col-span-12 mt-10 lg:col-span-8 lg:col-start-5 lg:mt-0">
        <h2 data-reveal className="max-w-[24ch] text-h2 text-ink text-pretty">
          {chapter.title}
        </h2>

        <div className="mt-8 flex flex-col gap-y-6">
          {chapter.body.map((p) => (
            <p
              key={p.slice(0, 32)}
              data-reveal
              className="max-w-[68ch] text-body text-ink-soft text-pretty"
            >
              {p}
            </p>
          ))}
        </div>

        {chapter.note && (
          <aside data-reveal className="mt-10 border-t border-rule pt-6">
            <p className="uppercase text-micro-mono text-green-ink">{chapter.note.label}</p>
            <p className="mt-4 max-w-[62ch] text-body-sm text-ink-soft text-pretty">
              {chapter.note.body}
            </p>
          </aside>
        )}
      </div>
    </article>
  );
}

export default function ChapterLedger() {
  return (
    <section className="bg-cream pb-[10svh] pt-[4svh]">
      <Container>
        {CHAPTERS.map((chapter, i) => (
          <LedgerRow key={chapter.id} chapter={chapter} index={i} />
        ))}
      </Container>
    </section>
  );
}
