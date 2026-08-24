import HeroTerrain from "@/components/sections/economics/c/HeroTerrain";
import GrowthCards from "@/components/sections/economics/c/GrowthCards";
import AscentLoop from "@/components/sections/economics/c/AscentLoop";
import EngineCards from "@/components/sections/economics/c/EngineCards";
import CenterClose from "@/components/sections/economics/c/CenterClose";

// /economics, variant C — the stage.
//
// The page is a landscape that lifts. Its unit of composition is the CARD and
// its ground is a contour terrain, first as a shader in the hero and then as a
// drawn figure in the middle — same vocabulary, two materials, and the second
// is the one that argues.
//
// Grounds, in order, and the order is the argument: shader terrain (the
// opening), tint (the four cards, which need a ground darker than white or they
// disappear), cream (the climb, whose figure supplies its own colour), WHITE
// once and only here (the two products — the moment the page names things that
// exist), cream again, and the terrain to close. The last band is the same
// surface as the first: the page returns to where it started, one turn higher,
// which is the gesture its central figure makes at the scale of a document.
//
// No `data-nav-dark`: nothing on this page is dark, so the site header's pill
// stays on its light treatment throughout.

export default function EconomicsCView() {
  return (
    <main className="bg-cream">
      <HeroTerrain />
      <GrowthCards />
      <AscentLoop />
      <EngineCards />
      <CenterClose />
    </main>
  );
}
