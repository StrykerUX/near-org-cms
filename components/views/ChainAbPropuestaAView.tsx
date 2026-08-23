import Hero from "@/components/sections/chain-ab-propuesta-a/Hero";
import WhyItMatters from "@/components/sections/chain-ab-propuesta-a/WhyItMatters";
import StickyScrollCapabilities from "@/components/sections/chain-ab-propuesta-a/StickyScrollCapabilities";
import Proof from "@/components/sections/chain-ab-propuesta-a/Proof";
import CompletePicture from "@/components/sections/chain/CompletePicture";
import ForwardTurn from "@/components/sections/chain-abstraction-proposals/ForwardTurn";
import BuildersCta from "@/components/sections/chain/BuildersCta";

// Regla de oro de esta familia: sistema visual estrictamente del homepage real
// (`/prototype/homepage-update`) y composición PROPIA para las cuatro primeras
// secciones. Los datos que sí vienen de la fuente real: la lista completa de 35
// chains (`chain/chainContent.ts`) y la geometría del diagrama radial
// (`chain/chainDiagram.ts`, puro cálculo, sin GSAP).
//
// Esta propuesta se llamaba B hasta que se archivó la A original y las dos
// restantes corrieron de letra (ver `docs/labs-archivados.md`). Vale saberlo al
// leer el historial: `chain-ab-propuesta-a` nombra dos páginas distintas antes
// y después de ese corrimiento.
//
// ── El cierre de la página ──────────────────────────────────────────────
// Las últimas tres secciones son las MISMAS en las dos propuestas: lo que se
// está comparando es la mitad de arriba, así que darle a cada una un cierre
// distinto metería ruido en esa comparación.
//
// `ForwardTurn` sale de `chain-abstraction-proposals/`, la carpeta común de la
// familia: es el tratamiento que ganó entre los tres que se probaron. Los dos
// descartados están en `docs/labs-archivados.md`.
//
// `CompletePicture` y `BuildersCta` vienen tal cual de `components/sections/
// chain/`, la página real. Es la excepción y no la regla — la consigna era
// composición propia—, y la contrapartida es que quedan atadas: si alguien
// edita esas dos, las dos propuestas cambian solas.
export default function ChainAbPropuestaAView() {
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
