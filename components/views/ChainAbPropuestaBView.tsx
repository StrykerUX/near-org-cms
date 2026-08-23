import Hero from "@/components/sections/chain-ab-propuesta-b/Hero";
import WhyItMatters from "@/components/sections/chain-ab-propuesta-b/WhyItMatters";
import StickyScrollCapabilities from "@/components/sections/chain-ab-propuesta-b/StickyScrollCapabilities";
import Proof from "@/components/sections/chain-ab-propuesta-b/Proof";
import CompletePicture from "@/components/sections/chain/CompletePicture";
import ForwardTurn from "@/components/sections/chain-abstraction-proposals/ForwardTurn";
import BuildersCta from "@/components/sections/chain/BuildersCta";

// La otra propuesta viva. Se llamaba C hasta que se archivó la A original y las
// dos restantes corrieron de letra (ver `docs/labs-archivados.md`).
//
// Dos cosas la separan de la A:
//
// 1. El `Proof`: titular con `<Accent>`, contadores en lista sin reglas y
//    gráfica al lado, en dos columnas. La A usa fila compacta y gráfica a ancho
//    completo. Ese cuerpo venía de la propuesta que se archivó; acá sobrevive.
// 2. El strip de ecosystem corre en carrusel — aunque eso ya no distingue: la
//    A lo montó también, y por eso `ECOSYSTEM_LOGOS` está duplicado en las dos
//    (decisión explícita, con su advertencia en ambos archivos).
//
// El cierre es idéntico al de la A, a propósito: lo que se compara es la mitad
// de arriba. `ForwardTurn` sale de la carpeta común de la familia;
// `CompletePicture` y `BuildersCta` vienen tal cual de la página real, con la
// contrapartida de que quedan atadas a ella.
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
