import HeroX from "@/components/sections/hero-x/HeroX";
import HandoffPillars from "@/components/sections/foundation/a/HandoffPillars";
import HandoffThesis from "@/components/sections/foundation/a/HandoffThesis";
import HandoffStiftung from "@/components/sections/foundation/a/HandoffStiftung";
import HandoffCouncil from "@/components/sections/foundation/a/HandoffCouncil";
import HandoffScene from "@/components/sections/foundation/a/HandoffScene";
import HandoffEcosystem from "@/components/sections/foundation/a/HandoffEcosystem";
import HandoffClose from "@/components/sections/foundation/a/HandoffClose";

// Variant C — «hand-off». One scene, and seven sections that get out of its way.
//
// The ground plan is the composition: cream from the hero to the Council, three
// screens of ink for `HandoffScene`, and cream again to the end. That is one
// cut in and one cut out, which is what makes a section that lasts three
// viewports read as an event rather than as a long stretch of dark page.
//
// `HandoffScene` sits in the deck's §6 slot and `HandoffEcosystem` follows it
// immediately. That adjacency is load-bearing: the scene distributes the
// Foundation's mass into twelve unlabelled clusters and the next section names
// twelve builders. Putting anything between them spends the rhyme.
export default function FoundationAView() {
  return (
    <main className="flex flex-col bg-cream">
      {/* La apertura común de las nueve páginas del sitio. Reemplaza a
          `foundation/a/HandoffHero`, que sigue en el árbol y ya
          no la monta nadie — se conserva a la espera de que el hero X se
          juzgue con las nueve páginas delante. El porqué del preset de
          esta página está en `hero-x/heroXPresets.ts`. */}
      <HeroX page="foundation" />
      <HandoffPillars />
      <HandoffThesis />
      <HandoffStiftung />
      <HandoffCouncil />
      <HandoffScene />
      <HandoffEcosystem />
      <HandoffClose />
    </main>
  );
}
