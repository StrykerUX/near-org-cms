import HeroX from "@/components/sections/hero-x/HeroX";
import ProofMarquee from "@/components/sections/quantum/ProofMarquee";
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

// El footer NO se compone acá: lo monta `app/(motion)/layout.tsx` para todas
// las páginas de este grupo. Esta view tenía su propio `PrototypeFooter`, y esa
// forma de repartirlo es la que produjo cuatro copias divergentes del mismo
// archivo — ahora hay uno solo, `components/site/SiteFooter.tsx`.
export default function QuantumSecurityView() {
  return (
    <main className="flex flex-col bg-cream">
      {/* La apertura común de las nueve páginas del sitio. Reemplaza a
          `quantum/QuantumHero`, que sigue en el árbol y ya
          no la monta nadie — se conserva a la espera de que el hero X se
          juzgue con las nueve páginas delante. El porqué del preset de
          esta página está en `hero-x/heroXPresets.ts`. */}
      <HeroX page="quantum" />
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
