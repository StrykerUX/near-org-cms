import Hero from "@/components/sections/chain-ab-propuesta-b/Hero";
import WhyItMatters from "@/components/sections/chain-ab-propuesta-b/WhyItMatters";
import StickyScrollCapabilities from "@/components/sections/chain-ab-propuesta-b/StickyScrollCapabilities";
import Proof from "@/components/sections/chain-ab-propuesta-b/Proof";
import CompletePicture from "@/components/sections/chain/CompletePicture";
import ForwardTurn from "@/components/sections/chain-abstraction-proposals/ForwardTurn";
import BuildersCta from "@/components/sections/chain/BuildersCta";

// Regla de oro de esta familia: sistema visual estrictamente del homepage real
// (`/prototype/homepage-update`) y composición PROPIA para las cuatro primeras
// secciones. Los datos que sí vienen de la fuente real: la lista completa de 35
// chains (`chain/chainContent.ts`) y la geometría del diagrama radial
// (`chain/chainDiagram.ts`, puro cálculo, sin GSAP).
//
// ── El cierre de la página ──────────────────────────────────────────────
// Las últimas tres secciones se agregaron después, en base a la propuesta C, y
// son las MISMAS en las tres propuestas: lo que se está comparando es la mitad
// de arriba, así que darle a cada una un cierre distinto metería ruido en esa
// comparación.
//
// `ForwardTurn` sale de `chain-abstraction-proposals/`, la carpeta común de la
// familia: es el tratamiento que ganó entre los tres que se probaron. Los dos
// descartados están en `docs/labs-archivados.md`.
//
// `CompletePicture` y `BuildersCta` vienen tal cual de `components/sections/
// chain/`, la página real. Es la excepción y no la regla — la consigna era
// composición propia—, y la contrapartida es que quedan atadas: si alguien
// edita esas dos, las tres propuestas cambian solas.
export default function ChainAbPropuestaBView() {
  return (
    <main className="flex flex-col bg-cream">
      <Hero />
      <WhyItMatters />
      <StickyScrollCapabilities />
      <Proof />
      <CompletePicture />
      <ForwardTurn />
      <BuildersCta />
    </main>
  );
}
