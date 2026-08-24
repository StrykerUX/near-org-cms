import TerrainHero from "@/components/sections/foundation/c/TerrainHero";
import PillarCards from "@/components/sections/foundation/c/PillarCards";
import DevolutionRelief from "@/components/sections/foundation/c/DevolutionRelief";
import StiftungPlates from "@/components/sections/foundation/c/StiftungPlates";
import CouncilTerraces from "@/components/sections/foundation/c/CouncilTerraces";
import OperationsSlope from "@/components/sections/foundation/c/OperationsSlope";
import EcosystemField from "@/components/sections/foundation/c/EcosystemField";
import StageClose from "@/components/sections/foundation/c/StageClose";

// Variant C — «stage». The Foundation as ground that is being handed over.
//
// ── One material, seven readings of it ────────────────────────────────────
// The shell's surface draws a terrain of level curves, and this variant takes
// that literally rather than as atmosphere: the Foundation holds a piece of
// ground and its plan is to let it go. So every drawing on the page is a
// reading of the same terrain — three landforms for the three pillars, a
// summit that draws in for the thesis, two terraces and a circuit for the
// Council, three terraces on a slope for the operations. Nothing here is an
// illustration of the copy; they are all measurements of one country.
//
// ── What colour means ─────────────────────────────────────────────────────
// The CTA ramp is a fill on this page, not a highlight, and it means exactly
// one thing: ground that belongs to somebody else by the end of the drawing.
// That is why the council figure is monochrome and the pillar of
// decentralization is not.
//
// ── The grounds, in order ─────────────────────────────────────────────────
//   hero        SURFACE   the terrain, and a card standing on it
//   pillars     tint      three cards
//   thesis      cream     the full-bleed relief — the one scrubbed drawing
//   Stiftung    WHITE     the record, on the flattest ground; used once
//   Council     tint      the circuit, in a white box
//   operations  cream     one wide slope, three columns under it
//   ecosystem   tint      twelve cells, no container of our own
//   close       cream
//
// No ink anywhere. That is the split between this variant and the instrument:
// B is a lit object in a dark room, C is daylight on open ground, and a black
// section here would read as a piece of the other page.
export default function FoundationCView() {
  return (
    <main className="flex flex-col bg-cream">
      <TerrainHero />
      <PillarCards />
      <DevolutionRelief />
      <StiftungPlates />
      <CouncilTerraces />
      <OperationsSlope />
      <EcosystemField />
      <StageClose />
    </main>
  );
}
