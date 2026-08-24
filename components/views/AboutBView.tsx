import CoverHero from "@/components/sections/about/b/CoverHero";
import ChapterSpread from "@/components/sections/about/b/ChapterSpread";
import ClosingCoda from "@/components/sections/about/b/ClosingCoda";
import { CHAPTERS } from "@/components/sections/about/aboutContent";

// Variant B · Chapters — /prototype/about-b.
//
// The composition is a cover, eight spreads and a coda. Header and footer come
// from `app/prototype/layout.tsx`.
//
// ── The tone order IS the argument, and it lives here ──────────────────────
// `ChapterSpread` knows how to wear a tone; it does not know which one. The
// sequence is a claim about the shape of the history and belongs with the
// composition:
//
//   cream · cream · cream · cream — the research decade. Four chapters on one
//     ground, because 2017 through 2021 is one continuous stretch: two people
//     trying to solve a problem that keeps turning into a different problem.
//     Changing the ground inside it would announce breaks the story does not
//     have.
//   ink · ink — 2023 and 2024. The hard cut, and the only place the page uses
//     one. This is where the thesis stops being an argument and becomes
//     shipped infrastructure, and it is the one transition a reader should
//     feel in their eyes before they read a word of it.
//   slate — 2025. Still dark; the cut loosening rather than ending. Chain
//     abstraction is operating, not being proven.
//   white — 2026. The page's single lift, spent on the chapter where the loop
//     closes: the models arrive, and the network built while waiting for them
//     turns out to be the one they need.
//
// Then the coda drops back to ink, which makes white → ink the sharpest edge on
// the page and puts it directly before the three questions. If the tones are
// ever rebalanced, that last edge is the one to protect: it is the only thing
// separating the refrain from being one more section.
const TONES = [
  "cream",
  "cream",
  "cream",
  "cream",
  "ink",
  "ink",
  "slate",
  "white",
] as const;

export default function AboutBView() {
  return (
    <main className="flex flex-col bg-cream">
      <CoverHero />
      {CHAPTERS.map((chapter, i) => (
        <ChapterSpread
          key={chapter.id}
          chapter={chapter}
          tone={TONES[i]}
          index={i}
          total={CHAPTERS.length}
        />
      ))}
      <ClosingCoda />
    </main>
  );
}
