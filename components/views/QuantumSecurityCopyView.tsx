import QuantumHero from "@/components/sections/quantum-security-copy/QuantumHero";
import ProofMarquee from "@/components/sections/quantum-security-copy/ProofMarquee";
import ThreatSequence from "@/components/sections/quantum-security-copy/ThreatSequence";
import MathStatement from "@/components/sections/quantum-security-copy/MathStatement";
import LiveToday from "@/components/sections/quantum-security-copy/LiveToday";
import FieldBreak from "@/components/sections/quantum-security-copy/FieldBreak";
import BeyondAccounts from "@/components/sections/quantum-security-copy/BeyondAccounts";
import BeyondAccountsCopy from "@/components/sections/quantum-security-copy/BeyondAccountsCopy";
import BeyondAccountsAccordion from "@/components/sections/quantum-security-copy/BeyondAccountsAccordion";
import Comparison from "@/components/sections/quantum-security-copy/Comparison";
import ComparisonCards from "@/components/sections/quantum-security-copy/ComparisonCards";
import ComparisonHighlight from "@/components/sections/quantum-security-copy/ComparisonHighlight";
import ComparisonPatch from "@/components/sections/quantum-security-copy/ComparisonPatch";
import ComparisonRebuttal from "@/components/sections/quantum-security-copy/ComparisonRebuttal";
import Roadmap from "@/components/sections/quantum-security-copy/Roadmap";
import InTheNews from "@/components/sections/quantum-security-copy/InTheNews";
import QuantumFaq from "@/components/sections/quantum-security-copy/QuantumFaq";
import ClosingRing from "@/components/sections/quantum-security-copy/ClosingRing";

// Fork de QuantumSecurityView (components/views/QuantumSecurityView.tsx), para
// iterar sobre /quantum-security sin tocar la página real. Las secciones
// viven en components/sections/quantum-security-copy/ (copia de
// sections/quantum/) — ArrowCircle y CtaPill quedaron sin duplicar, son
// primitivas compartidas con protocol/chain y se siguen importando del
// original.
//
// "The difference" está quintuplicada a propósito, cinco al hilo, mismo
// copy y mismo COMPARISON_ROWS: la idea es comparar layouts en el mismo
// scroll, nunca dos a la vez. Comparison.tsx es la tabla plana original;
// ComparisonCards.tsx la reescribe como pares de cards (X/check, gana el
// color); ComparisonHighlight.tsx la mete en un panel con la columna "On
// NEAR" resaltada, patrón de tabla de precios. Las dos últimas se
// arriesgan más en el diseño: ComparisonPatch.tsx la lee como un diff de
// git en una terminal oscura (el vocabulario CLI que LiveToday ya usa,
// aplicado acá); ComparisonRebuttal.tsx la lee como una transcripción —
// cita en serif itálica, respuesta indentada con conector en L. Ninguna
// reemplaza a la otra — quedan las cinco hasta que el usuario elija una.
export default function QuantumSecurityCopyView() {
  return (
    <main className="flex flex-col bg-cream">
      <QuantumHero />
      <ProofMarquee />
      <ThreatSequence />
      <MathStatement />
      <LiveToday />
      <FieldBreak />
      <BeyondAccounts />
      <BeyondAccountsCopy />
      <BeyondAccountsAccordion />
      <Comparison />
      <ComparisonCards />
      <ComparisonHighlight />
      <ComparisonPatch />
      <ComparisonRebuttal />
      <Roadmap />
      <InTheNews />
      <QuantumFaq />
      <ClosingRing />
    </main>
  );
}
