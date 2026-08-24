import ArchiveSlot from "@/components/sections/about/ArchiveSlot";
import type { AboutChapter } from "@/components/sections/about/aboutContent";

// A chapter as one card: its archive frame on top, the chapter under it.
//
// ── Why this is not `shells/stage/Card` ───────────────────────────────────
//
// It is the same object visually — same radius, same padding, same lighter art
// box inside the tinted shell — and it should be: the four C variants have to
// read as a family, and the card is most of what makes them one.
//
// What it cannot borrow is the art box. `stage/Card` fixes its art at 4/3,
// which is right when the art is a drawing the layout can size freely. Here the
// art is a `MediaFrame`, and its proportion is a FACT about the asset declared
// once in `ARCHIVE` — a page of a paper is portrait, a whiteboard is a
// panorama, an announcement card is a square. Forcing eight of those through
// one aspect ratio either crops assets that do not exist yet or letterboxes
// them, and either way it moves a decision out of the content module and into
// a layout, which is exactly what `ARCHIVE.shape` exists to prevent.
//
// So the art box takes the frame at its own proportion, and everything else is
// the shell's. If the other three pages want the same thing, this belongs in
// `shells/stage/` as a second card rather than copied — noted in the README.
//
// ── Why the whole chapter goes inside ─────────────────────────────────────
//
// Not a teaser with a link: this page has nowhere to link to. The card holds
// the chapter's full prose, so the unit of composition really is the chapter
// and the reader never has to hold a card and a paragraph apart. It is also
// what makes the width table below it a rhythm rather than a caption size.

export type ChapterCardProps = {
  chapter: AboutChapter;
  /** The one card a section is asserting. Lit ground rather than neutral. */
  accent?: boolean;
  className?: string;
};

export default function ChapterCard({
  chapter,
  accent = false,
  className = "",
}: ChapterCardProps) {
  return (
    <article
      id={chapter.id}
      className={`flex flex-col rounded-[1.75rem] p-5 scroll-mt-[calc(var(--site-header-block)+2rem)] lg:p-7 ${
        accent ? "bg-cta-lime/40" : "bg-card-tint"
      } ${className}`}
    >
      {/* The art box: lighter than the shell, so the frame has a paper of its
          own rather than floating on the card's ground. */}
      <div className="rounded-[1.25rem] bg-background p-4 lg:p-5">
        <ArchiveSlot id={chapter.id} />
      </div>

      <p className="mt-8 text-caption-mono text-gray-intermediate">{chapter.yearLabel}</p>

      <h2 className="mt-4 max-w-[20ch] text-h2 text-ink text-pretty">{chapter.title}</h2>

      <p className="mt-5 max-w-[38ch] text-body-lg text-ink text-pretty">{chapter.marker}</p>

      <div className="mt-6 flex flex-col gap-y-5">
        {chapter.body.map((p) => (
          <p key={p.slice(0, 32)} className="max-w-[58ch] text-body text-ink-soft text-pretty">
            {p}
          </p>
        ))}
      </div>

      {chapter.note && (
        <div className="mt-9">
          <div className="h-px w-full bg-rule" aria-hidden="true" />
          <p className="mt-5 text-h3-serif italic text-ink">{chapter.note.label}</p>
          <p className="mt-3 max-w-[46ch] text-body-sm text-ink-soft text-pretty">
            {chapter.note.body}
          </p>
        </div>
      )}
    </article>
  );
}
