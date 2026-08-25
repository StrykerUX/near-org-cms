import HeroX from "@/components/sections/hero-x/HeroX";
import Thresholds from "@/components/sections/economics/a/Thresholds";
import LoopScene from "@/components/sections/economics/a/LoopScene";
import RevenueEngines from "@/components/sections/economics/a/RevenueEngines";
import AssetCenter from "@/components/sections/economics/a/AssetCenter";

// Variant A of /economics — "Four-beat loop".
//
// The header and the footer are NOT here: `app/prototype/layout.tsx` mounts
// both for every page in the group.
//
// The order is the copy deck's, and the progression of ground is the argument:
// cream, cream, INK, white, cream. The ink section is `LoopScene`, and it is the
// only one that earns a hard cut — it is where the page stops describing an
// economy and draws one. The white section is the page's single lift and it
// lands right after, because that is where the argument stops being a diagram
// and names two products that exist. Coming back to cream at the end is the
// ring's own gesture at the scale of the page: it finishes where it started.
//
// Moving `LoopScene` — or giving anything else a dark ground — costs the page
// both of those.
export default function EconomicsAView() {
  return (
    <main className="flex flex-col bg-cream">
      {/* La apertura común de las nueve páginas del sitio. Reemplaza a
          `economics/a/Hero`, que sigue en el árbol y ya
          no la monta nadie — se conserva a la espera de que el hero X se
          juzgue con las nueve páginas delante. El porqué del preset de
          esta página está en `hero-x/heroXPresets.ts`. */}
      <HeroX page="economics" />
      <Thresholds />
      <LoopScene />
      <RevenueEngines />
      <AssetCenter />
    </main>
  );
}
