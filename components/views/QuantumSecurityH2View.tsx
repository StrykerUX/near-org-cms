import HeroH2 from "@/components/sections/quantum-security-heroes/HeroH2";
import ProofRow from "@/components/sections/quantum-security-labs/h2/ProofRow";
import ThreatAnswer from "@/components/sections/quantum-security-labs/h2/ThreatAnswer";
import OnlyNearLine from "@/components/sections/quantum-security-labs/h2/OnlyNearLine";
import LiveToday from "@/components/sections/quantum-security-labs/h2/LiveToday";
import RotationAhead from "@/components/sections/quantum-security-labs/h2/RotationAhead";
import BeyondSteps from "@/components/sections/quantum-security-labs/h2/BeyondSteps";
import ComparisonTable from "@/components/sections/quantum-security-labs/h2/ComparisonTable";
import Roadmap from "@/components/sections/quantum-security-copy/Roadmap";
import InTheNews from "@/components/sections/quantum-security-copy/InTheNews";
import FaqTable from "@/components/sections/quantum-security-labs/h2/FaqTable";
import ClosingBand from "@/components/sections/quantum-security-labs/h2/ClosingBand";

// /prototype/quantum-security-h2 — proposal **H2 · Ruled**.
//
// `HeroH2`, `Roadmap` and `InTheNews` are settled and untouched. Everything
// between them is this proposal's own.
//
// **Where the design comes from.** Not from anywhere new: the vocabulary is
// `/prototype/chain-ab-propuesta-a`'s. Compact ruled blocks (`divide-y
// divide-rule border-y border-rule`), the three-column staircase from
// `WhyItMatters` (`lg:mt-0 / lg:mt-14 / lg:mt-28`), mono small-caps labels in
// `--gray-intermediate`, `Eyebrow` over `text-h2` with an `<Accent>` second
// line, and `py-20 lg:py-28` section rhythm. H3 takes the same content in
// `propuesta-b`'s temperament instead.
//
// **The one idea this proposal repeats:** a hairline is a boundary that carries
// meaning. It divides the problem from the answer, steps the three live-today
// points into a sequence, and sets the comparison's column ratio. Nothing here
// is a card, and that is the version.
//
// ── Ground rhythm ──────────────────────────────────────────────────────────
// The house palette on these reference pages is cream with the occasional white
// section and one solid `--ink` moment (`AgentEconomy`'s black card,
// `InTheNews`'s dark press card). This follows that and nothing more:
//
//   hero · proof · threat+answer · content block   cream
//   live today                                     white   (matches Roadmap)
//   one rotation ahead                             ink     (the one dark band)
//   beyond accounts · comparison                   cream
//   Roadmap · InTheNews                            white   (as they are)
//   FAQ                                            cream
//   closing                                        white
//
// `RotationAhead` carries `data-nav-dark` so the fixed header inverts over it —
// the same contract every dark section on the site honours.
export default function QuantumSecurityH2View() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroH2 />
      <ProofRow />
      <ThreatAnswer />
      <OnlyNearLine />
      <LiveToday />
      <RotationAhead />
      <BeyondSteps />
      <ComparisonTable />
      <Roadmap />
      <InTheNews />
      <FaqTable />
      <ClosingBand />
    </main>
  );
}
