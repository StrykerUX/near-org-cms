import TerrainHero from "@/components/sections/about/c/TerrainHero";
import ChapterTerrain from "@/components/sections/about/c/ChapterTerrain";
import ClosingCircle from "@/components/sections/about/c/ClosingCircle";

// About · C — the stage.
//
// The history as ground that formed. The hero is a survey sheet — the coldest
// contour palette of the four pages, paper and ink, because a history is filed
// rather than photographed — and every era after it leaves relief: cards on
// cream, cards on tint, then no cards at all, and finally the whole shape of
// the story drawn as a landform across the width of the page.
//
// ── The order of grounds, which is the argument ───────────────────────────
//
// `cream → tint → white → cream`. It is not an alternation for its own sake:
// the boxes appear when the eras start producing things that can be held in
// one (a paper, a whiteboard, a bridge, a slide), and they STOP at 2025-2026,
// where the page's one white ground carries the two chapters about
// infrastructure that is simply running. Then cream returns for the close, so
// the last ground is the first one.
//
// The three questions arrive on that bare cream at heading scale with nothing
// around them, which is the only thing this variant can do that variant B, all
// borders and readouts, structurally cannot.
export default function AboutCView() {
  return (
    <main className="flex flex-col bg-cream">
      <TerrainHero />
      <ChapterTerrain />
      <ClosingCircle />
    </main>
  );
}
