import HeroH2 from "@/components/sections/quantum-security-heroes/HeroH2";
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

// /prototype/quantum-security-h2 — una de tres comparaciones de hero para
// /quantum-security (ver components/sections/quantum-security-heroes/README.md).
// Todo lo que va DESPUÉS del hero es idéntico en las tres versiones: las
// mismas secciones de quantum-security-copy/, sin modificar. Lo único que
// cambia entre H2/H3/H4 es el hero.
export default function QuantumSecurityH2View() {
  return (
    <main className="flex flex-col bg-cream">
      <HeroH2 />
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
