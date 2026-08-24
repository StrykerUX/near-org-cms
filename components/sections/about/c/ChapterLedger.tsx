"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArchiveSlot from "@/components/sections/about/ArchiveSlot";
import ChapterFigure from "@/components/sections/about/ChapterFigure";
import { CHAPTERS, FIGURES, type AboutChapter } from "@/components/sections/about/aboutContent";

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
//
// ── The archive: five in the ledger column, three across the record ────────
// This is the dense variant, so most of the archive is filed rather than
// exhibited: the frame sits under the marker, in the sticky left column, and
// the eight rows read down the page as a contact sheet beside the history.
// That is the right register for a register — but eight of them is a strip, and
// a strip down one edge is wallpaper.
//
// So three of them break the other way and take the full record column, at the
// width of the prose they belong to: the whiteboard, the slide, and the last
// panorama. They are the three chapters where the asset is evidence a reader is
// meant to look AT rather than note the existence of, and they are spaced far
// enough apart (rows 3, 5 and 8) that the break never becomes the pattern.
//
// The two drawn figures always take the record column. A diagram whose whole
// job is to be read faster than the paragraph beside it cannot be filed at a
// quarter width.

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Which column each chapter's archive frame is filed in. See the note above —
 * this is a sequence decision, which is why it is a table and not a rule about
 * the asset's proportion.
 */
const FILED = [
  "left", // 2017 · the paper
  "left", // 2018 · the founders
  "record", // 2018-2020 · the whiteboard
  "left", // 2021 · Rainbow Bridge
  "record", // 2023 · the slide
  "left", // 2024 · the card
  "left", // 2025 · the phones
  "record", // 2026 · now
] as const;

/**
 * One chapter. A component rather than a `map` in the parent because each row
 * needs its own scroll trigger — the section is many screens tall, and one
 * trigger on it would reveal all eight rows while seven are below the fold.
 */
function LedgerRow({ chapter, index }: { chapter: AboutChapter; index: number }) {
  const ref = useScrollReveal<HTMLElement>({ start: "top 82%" });
  const filed = FILED[index];
  const hasFigure = chapter.id in FIGURES;

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

        {filed === "left" && (
          <div data-reveal className="mt-10">
            <ArchiveSlot id={chapter.id} />
          </div>
        )}
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

        {/* Evidence before explanation. The sharding chapter carries both, and
            the order matters there: the photograph of the whiteboard, then the
            drawing that is what the whiteboard was trying to say. */}
        {filed === "record" && (
          <div data-reveal className="mt-14">
            <ArchiveSlot id={chapter.id} />
          </div>
        )}

        {hasFigure && (
          <div data-reveal>
            <ChapterFigure id={chapter.id} className="mt-14" />
          </div>
        )}

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
