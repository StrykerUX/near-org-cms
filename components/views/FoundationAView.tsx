import HandoffHero from "@/components/sections/foundation/a/HandoffHero";
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
      <HandoffHero />
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
