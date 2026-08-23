import HeroH3 from "@/components/sections/quantum-security-heroes/HeroH3";
import ProofMarquee from "@/components/sections/quantum-security-copy/ProofMarquee";
import ThreatSequence from "@/components/sections/quantum-security-copy/ThreatSequence";
import MathStatement from "@/components/sections/quantum-security-copy/MathStatement";
import LiveToday from "@/components/sections/quantum-security-copy/LiveToday";
import FieldBreak from "@/components/sections/quantum-security-copy/FieldBreak";
import BeyondAccounts from "@/components/sections/quantum-security-copy/BeyondAccounts";
import Comparison from "@/components/sections/quantum-security-copy/Comparison";
import Roadmap from "@/components/sections/quantum-security-copy/Roadmap";
import InTheNews from "@/components/sections/quantum-security-copy/InTheNews";
import QuantumFaq from "@/components/sections/quantum-security-copy/QuantumFaq";
import ClosingRing from "@/components/sections/quantum-security-copy/ClosingRing";

// /prototype/quantum-security-h3 — ver QuantumSecurityH2View para el
// contrato: todo salvo el hero es idéntico entre las tres versiones.
export default function QuantumSecurityH3View() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroH3 />
      <ProofMarquee />
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
    </main>
  );
}
