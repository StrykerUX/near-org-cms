import Hero from "@/components/sections/chain-ab-homepage-refined-3/Hero";
import WhyItMatters from "@/components/sections/chain-ab-homepage-refined-3/WhyItMatters";
import StickyScrollCapabilities from "@/components/sections/chain-ab-homepage-refined-3/StickyScrollCapabilities";
import Proof from "@/components/sections/chain-ab-homepage-refined-3/Proof";

// Vuelta a la regla de oro: sistema visual estrictamente del homepage real
// (`/prototype/homepage-update`) — sin referencias externas, y composición
// PROPIA (no una importación directa de las secciones reales de
// `/chain-abstraction`, que fue el desvío de la vuelta anterior). Los datos
// que sí vienen de la fuente real: la lista completa de 35 chains
// (`chain/chainContent.ts`) y la geometría del diagrama radial
// (`chain/chainDiagram.ts`, puro cálculo, sin GSAP).
//
// Por pedido explícito, esta vista SOLO compone las primeras 4 secciones
// (Hero, Why it matters, Capabilities sticky-scroll, Proof); el resto de la
// página (Complete Picture, Forward Turn, Builders CTA) todavía no se
// construye.
export default function ChainAbHomepageRefined3View() {
  return (
    <main className="flex flex-col bg-cream">
      <Hero />
      <WhyItMatters />
      <StickyScrollCapabilities />
      <Proof />
    </main>
  );
}
