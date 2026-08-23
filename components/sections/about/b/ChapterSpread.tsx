"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArchiveSlot from "@/components/sections/about/ArchiveSlot";
import ChapterFigure from "@/components/sections/about/ChapterFigure";
import { FIGURES, type AboutChapter } from "@/components/sections/about/aboutContent";

// §2 of variant B — one chapter, opened like a chapter of a book.
//
// The spread is three movements. First a near-full screen that carries the year
// at mural scale and the title, and nothing else. Then the era's plate. Then the
// prose, at a narrow measure with a lot of air around it. A reader scrolling
// fast gets a sequence of eight year-cards and eight plates; a reader who stops
// gets the essay.
//
// ── The ground carries the arc, and that is the variant ────────────────────
// Variant A holds one surface for the whole history and lets a rail report
// progress. B does the opposite: it has no rail at all, and the reader knows
// where they are because the page changed colour under them. Cream is the
// research decade, ink is the stretch where the thesis turns into
// infrastructure, slate is that stretch loosening, and white is the arrival.
// The order is argued in AboutBView — this component only knows how to wear a
// tone, not which one it should be wearing.
//
// ── The plate, and why half of them bleed ──────────────────────────────────
// This is the layout that reads as a book, so the archive is a book plate: the
// four landscape and panoramic assets run edge to edge, past the Container,
// full page width, the way a plate is bound into a book at the trim rather than
// set inside the text block.
//
// The other four cannot. A 3/4 portrait at full page width is a screen and a
// half of one photograph, and a 1/1 is not much better — the bleed that makes a
// panorama monumental makes a portrait an obstruction. So those take columns
// instead, and never the same columns twice: right third, left seven, centre
// five, right four. That alternation is doing the work the bleeds cannot,
// because everything else in this variant is centred, and eight centred plates
// under eight centred titles is a stack, not a rhythm.
//
// ── The note is a closing epigraph, not an interleaf ───────────────────────
// The brief for this variant asked for the pull-out to be interleaved in the
// prose. Two of the eight chapters have a note, and the first of those has a
// SINGLE body paragraph — there is nothing to interleave it between. Placing it
// after the prose in both cases keeps the device identical in both chapters,
// which is what makes it read as a device rather than as an accident of length.
// It also happens to be where both notes want to be: each one is the sentence
// the chapter has been earning.
//
// The figure, where a chapter has one, goes BEFORE the note and wider than the
// prose. Before, because the note is the chapter's last word and a drawing
// after it would take that away; wider, because a figure set at the prose
// measure changes nothing about the page and the only reason to draw one here
// is that it does.

const TONE = {
  // The research decade: 2017 through 2021.
  cream: {
    section: "bg-cream text-ink",
    meta: "text-gray-intermediate",
    body: "text-ink-soft",
    rule: "bg-rule",
    label: "text-green-ink",
    dark: false,
  },
  // 2023-2024: the hard cut, where the thesis becomes infrastructure.
  ink: {
    section: "bg-ink text-cream",
    meta: "text-cream/45",
    body: "text-cream/70",
    rule: "bg-white/12",
    label: "text-near-green-accent",
    dark: true,
  },
  // 2025: still dark, one step lighter. The cut relaxing rather than ending.
  slate: {
    section: "bg-ink-slate text-cream",
    meta: "text-cream/45",
    body: "text-cream/70",
    rule: "bg-white/12",
    label: "text-near-green-accent",
    dark: true,
  },
  // 2026. The page's one lift, and it is spent on the chapter where the loop
  // closes.
  white: {
    section: "bg-background text-ink",
    meta: "text-gray-intermediate",
    body: "text-ink-soft",
    rule: "bg-rule",
    label: "text-green-ink",
    dark: false,
  },
} as const;

/**
 * Where the era's plate sits, by chapter index. `"bleed"` means outside the
 * Container, at page width; anything else is a grid placement inside it.
 *
 * Keyed by index and not derived from the asset's proportion on purpose: the
 * proportion decides whether a bleed is POSSIBLE, but which of the four inset
 * plates goes left and which goes right is a decision about the sequence, and
 * a rule cannot see the sequence.
 */
const PLATE = [
  "lg:col-span-5 lg:col-start-8", // 2017 · the paper, 3/4, right third
  "lg:col-span-7 lg:col-start-1", // 2018 · the founders, 4/3, hard left
  "bleed", // 2018-2020 · the whiteboard, 21/9
  "bleed", // 2021 · Rainbow Bridge, 16/9
  "bleed", // 2023 · the slide, 16/9
  "lg:col-span-5 lg:col-start-5", // 2024 · the card, 1/1, off-centre
  "lg:col-span-4 lg:col-start-9", // 2025 · the phones, 3/4, right
  "bleed", // 2026 · now, 5/2
] as const;

export type ChapterSpreadProps = {
  chapter: AboutChapter;
  tone: keyof typeof TONE;
  /** 0-based. Prints the chapter number, and picks the plate's placement. */
  index: number;
  /** How many chapters there are, for the "01 / 08" counter. */
  total: number;
};

export default function ChapterSpread({ chapter, tone, index, total }: ChapterSpreadProps) {
  const t = TONE[tone];
  const frameTone = t.dark ? "dark" : "light";
  const plate = PLATE[index];
  const hasFigure = chapter.id in FIGURES;

  // Two triggers and not one: the spread is roughly three screens tall, so a
  // single trigger on the section would play the prose reveal while the prose
  // is still two screens below the fold.
  const openingRef = useScrollReveal<HTMLDivElement>({ start: "top 85%", stagger: 0.12 });
  const proseRef = useScrollReveal<HTMLDivElement>({ start: "top 80%" });

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id={chapter.id}
      {...(t.dark ? { "data-nav-dark": "" } : {})}
      className={`scroll-mt-[var(--site-header-block)] ${t.section}`}
    >
      {/* ── the opening ─────────────────────────────────────────────────── */}
      <Container>
        <div
          ref={openingRef}
          className="flex min-h-svh flex-col justify-center py-[12svh]"
        >
          <p data-reveal className={`text-caption-mono ${t.meta}`}>
            {pad(index + 1)} / {pad(total)}
          </p>

          {/* `text-mural` resolves against `cqw`, so the block that carries it
              has to declare `@container` — without one the clamp measures
              against the nearest ancestor that happens to be a container and
              the year silently comes out at the floor of the clamp.

              And it only takes over at `lg`. `Container` keeps 60px of padding
              at every width, so on a 375px screen the query container is 255px
              wide, `10.2cqw` lands under the clamp's own floor, and the mural
              renders at 40px — an h2 pretending to be a mural. `text-display`
              is viewport-based and gives 56px there, so the two tokens hand off
              at roughly the size where they agree. Both are scale tokens; this
              is a responsive choice between them, not a local override. */}
          <div data-reveal className="@container mt-6">
            <p className="text-display lg:text-mural">{chapter.year}</p>
          </div>

          {/* The sharding chapter is a RANGE, and the mural can only carry one
              number. Printing the range underneath keeps the drawing honest
              instead of rounding a stance held over three years into a date. */}
          {chapter.yearLabel !== chapter.year && (
            <p data-reveal className={`mt-4 text-caption-mono ${t.meta}`}>
              {chapter.yearLabel}
            </p>
          )}

          <h2 data-reveal className="mt-12 max-w-[18ch] text-h1 text-balance">
            {chapter.title}
          </h2>

          <p data-reveal className={`mt-8 max-w-[44ch] text-body-lg ${t.body} text-pretty`}>
            {chapter.marker}
          </p>
        </div>
      </Container>

      {/* ── the plate, then the prose ───────────────────────────────────── */}
      {/* Both live inside the reveal scope, and the scope is OUTSIDE Container:
          a bleeding plate has to escape the Container's padding, and putting the
          ref on a wrapper rather than on the prose block is what lets the plate
          arrive with the chapter instead of appearing before it. */}
      <div ref={proseRef}>
        {plate === "bleed" ? (
          <div data-reveal>
            <ArchiveSlot id={chapter.id} tone={frameTone} />
          </div>
        ) : (
          <Container>
            <div className="grid-ds">
              <div data-reveal className={`col-span-12 ${plate}`}>
                <ArchiveSlot id={chapter.id} tone={frameTone} />
              </div>
            </div>
          </Container>
        )}

        <Container>
          <div className="pb-[16svh] pt-[12svh]">
            <div className="mx-auto max-w-[62ch]">
              <div data-reveal className={`h-px w-full ${t.rule}`} aria-hidden="true" />

              <div className="mt-12 flex flex-col gap-y-7">
                {chapter.body.map((p) => (
                  <p
                    key={p.slice(0, 32)}
                    data-reveal
                    className={`text-body-lg ${t.body} text-pretty`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Guarded rather than letting `ChapterFigure` return null into an
                empty wrapper: the wrapper carries `data-reveal`, and six empty
                ones would still take their slot in the chapter's stagger. */}
            {hasFigure && (
              <div className="grid-ds">
                <div data-reveal className="col-span-12 lg:col-span-8">
                  <ChapterFigure id={chapter.id} tone={frameTone} className="mt-[14svh]" />
                </div>
              </div>
            )}

            {chapter.note && (
              <aside data-reveal className="mx-auto mt-16 max-w-[62ch]">
                <div className={`h-px w-full ${t.rule}`} aria-hidden="true" />
                <p className={`mt-8 uppercase text-micro-mono ${t.label}`}>Note</p>
                {/* The serif italic carries the note's LABEL and not its body.
                    Both labels are already the sentence the chapter was earning —
                    "Attention Is All You Need", "The loop closes" — so set large
                    they work as an epigraph, while the same treatment on four
                    sentences of explanation would be an italic paragraph, which
                    is a different and worse thing. Kepler stays an accent. */}
                <p className="mt-6 max-w-[20ch] text-h2-serif text-balance">
                  {chapter.note.label}
                </p>
                <p className={`mt-8 text-body-lg ${t.body} text-pretty`}>{chapter.note.body}</p>
              </aside>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}
