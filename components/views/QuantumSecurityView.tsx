import QuantumHero from "@/components/sections/quantum/QuantumHero";
import ProofMarquee from "@/components/sections/quantum/ProofMarquee";
import StatementWipe from "@/components/sections/quantum/StatementWipe";
import ThreatSequence from "@/components/sections/quantum/ThreatSequence";
import MathStatement from "@/components/sections/quantum/MathStatement";
import LiveToday from "@/components/sections/quantum/LiveToday";
import FieldBreak from "@/components/sections/quantum/FieldBreak";
import BeyondAccounts from "@/components/sections/quantum/BeyondAccounts";
import Comparison from "@/components/sections/quantum/Comparison";
import Roadmap from "@/components/sections/quantum/Roadmap";
import InTheNews from "@/components/sections/quantum/InTheNews";
import QuantumFaq from "@/components/sections/quantum/QuantumFaq";
import ClosingRing from "@/components/sections/quantum/ClosingRing";

// The footer is shared with /prototype/homepage-v2
// rather than copied: the reference file's footer variant A is identical to the
// one already in the repo, down to the link groups and the legal row. If it ever
// diverges it gets copied into quantum/ AT THAT MOMENT — see the rule in
// components/sections/home-v2/README.md.
import PrototypeFooter from "@/components/sections/PrototypeFooter";

export default function QuantumSecurityView() {
  return (
    <main className="flex flex-col bg-cream">
      <QuantumHero />
      <ProofMarquee />
      <StatementWipe />
      <ThreatSequence />
      <MathStatement />
      <LiveToday />
      <FieldBreak />
      <BeyondAccounts />
      <Comparison />
      <Roadmap />
      <InTheNews />
      <QuantumFaq />
      <ClosingRing />
      <PrototypeFooter />
    </main>
  );
}
