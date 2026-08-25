import HeroX from "@/components/sections/hero-x/HeroX";
import ChapterSpine from "@/components/sections/about/a/ChapterSpine";
import ClosingRefrain from "@/components/sections/about/a/ClosingRefrain";

// Variant A · Spine — /prototype/about-a.
//
// Three sections and one idea: the page is a reading apparatus. A rail of years
// on the left, a column of prose at a reading measure in the middle, notes in
// the margin on the right. The header and footer are NOT here —
// `app/prototype/layout.tsx` mounts both.
//
// The ground barely moves on purpose: cream for the whole history, ink only for
// the close. This variant argues that eight chapters of continuous prose want
// ONE surface and a stable frame, and that the reader's sense of progress
// should come from the rail rather than from the page changing colour under
// them. Variant B is the opposite bet.
export default function AboutAView() {
  return (
    <main className="flex flex-col bg-cream">
      {/* La apertura común de las nueve páginas del sitio. Reemplaza a
          `about/a/AboutHero`, que sigue en el árbol y ya
          no la monta nadie — se conserva a la espera de que el hero X se
          juzgue con las nueve páginas delante. El porqué del preset de
          esta página está en `hero-x/heroXPresets.ts`. */}
      <HeroX page="about" />
      <ChapterSpine />
      <ClosingRefrain />
    </main>
  );
}
