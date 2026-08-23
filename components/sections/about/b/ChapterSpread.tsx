"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import type { AboutChapter } from "@/components/sections/about/aboutContent";

// §2 of variant B — one chapter, opened like a chapter of a book.
//
// The spread is two movements. First a near-full screen that carries the year
// at mural scale and the title, and nothing else. Then the prose, centred at a
// narrow measure with a lot of air around it. A reader scrolling fast gets a
// sequence of eight year-cards; a reader who stops gets the essay.
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
// ── The note is a closing epigraph, not an interleaf ───────────────────────
// The brief for this variant asked for the pull-out to be interleaved in the
// prose. Two of the eight chapters have a note, and the first of those has a
// SINGLE body paragraph — there is nothing to interleave it between. Placing it
// after the prose in both cases keeps the device identical in both chapters,
// which is what makes it read as a device rather than as an accident of length.
// It also happens to be where both notes want to be: each one is the sentence
// the chapter has been earning.

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

export type ChapterSpreadProps = {
  chapter: AboutChapter;
  tone: keyof typeof TONE;
  /** 0-based. Only used to print the chapter number. */
  index: number;
  /** How many chapters there are, for the "01 / 08" counter. */
  total: number;
};

export default function ChapterSpread({ chapter, tone, index, total }: ChapterSpreadProps) {
  const t = TONE[tone];

  // Two triggers and not one: the spread is roughly two screens tall, so a
  // single trigger on the section would play the prose reveal while the prose
  // is still a screen below the fold.
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

      {/* ── the prose ───────────────────────────────────────────────────── */}
      <Container>
        <div ref={proseRef} className="mx-auto max-w-[62ch] pb-[16svh]">
          <div data-reveal className={`h-px w-full ${t.rule}`} aria-hidden="true" />

          <div className="mt-12 flex flex-col gap-y-7">
            {chapter.body.map((p) => (
              <p key={p.slice(0, 32)} data-reveal className={`text-body-lg ${t.body} text-pretty`}>
                {p}
              </p>
            ))}
          </div>

          {chapter.note && (
            <aside data-reveal className="mt-16">
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
    </section>
  );
}
