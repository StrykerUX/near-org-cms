import DescentHero from "@/components/sections/economics/c/DescentHero";
import FactRow from "@/components/sections/economics/c/FactRow";
import DescentPanels from "@/components/sections/economics/c/DescentPanels";
import SplitProducts from "@/components/sections/economics/c/SplitProducts";
import DescentClose from "@/components/sections/economics/c/DescentClose";

// Variant C of /economics — "Descent".
//
// The header and the footer are NOT here: `app/prototype/layout.tsx` mounts
// both for every page in the group.
//
// Five entries, but `DescentPanels` expands into seven sections — the loop's
// opening, its four full-height panels, and the return. It stays one import
// because the alternation of ground across those panels and the return's
// landing back on cream are one decision, and splitting them across the view
// would let someone reorder half of it.
//
// `FactRow` sits second and is the shortest section on the page, deliberately.
// C spends four screens on a metaphor before it offers anything checkable, and
// a page that asks for that much trust has to give proof first. Moving it below
// the panels — which reads as tidier — is the one change that breaks the
// variant.
export default function EconomicsCView() {
  return (
    <main className="flex flex-col bg-cream">
      <DescentHero />
      <FactRow />
      <DescentPanels />
      <SplitProducts />
      <DescentClose />
    </main>
  );
}
