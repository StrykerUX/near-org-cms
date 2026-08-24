import HeroBench from "@/components/sections/economics/b/HeroBench";
import FactBench from "@/components/sections/economics/b/FactBench";
import LoopBench from "@/components/sections/economics/b/LoopBench";
import ProjectionPanel from "@/components/sections/economics/b/ProjectionPanel";
import EngineModules from "@/components/sections/economics/b/EngineModules";
import CenterSolid from "@/components/sections/economics/b/CenterSolid";

// /economics, variant B — the instrument.
//
// The page is dark end to end and its unit of composition is the PANEL, not the
// paragraph: every section is an object with an edge, a label in its corner and
// a reading in it. That is the whole difference from variant A, which uses the
// same copy laid out as hairlines on flat ground.
//
// Order is the argument and it is the same in all three variants: the statement,
// the four facts that mean nothing downstream has to be hedged, the loop, the
// beat of the loop that most needs drawing, the two engines that feed it, and
// the asset all of it runs through.
//
// ── `data-nav-dark` sits here and not on the sections ─────────────────────
// The site header flips its pill to the dark treatment over any element
// carrying it, with one ScrollTrigger per element. On a page that is dark from
// the first pixel to the last, that is ONE element — this one — instead of six
// triggers all saying the same thing. It goes on `main` and not on a wrapper
// div because `main` already spans exactly the region that is dark.

export default function EconomicsBView() {
  return (
    <main data-nav-dark className="bg-ink">
      <HeroBench />
      <FactBench />
      <LoopBench />
      <ProjectionPanel />
      <EngineModules />
      <CenterSolid />
    </main>
  );
}
