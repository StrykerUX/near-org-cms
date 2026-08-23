import Hero from "@/components/sections/chain-ab-propuesta-c/Hero";
import WhyItMatters from "@/components/sections/chain-ab-propuesta-c/WhyItMatters";
import StickyScrollCapabilities from "@/components/sections/chain-ab-propuesta-c/StickyScrollCapabilities";
import Proof from "@/components/sections/chain-ab-propuesta-c/Proof";
import CompletePicture from "@/components/sections/chain/CompletePicture";
import ForwardTurn from "@/components/sections/chain-abstraction-proposals/ForwardTurn";
import BuildersCta from "@/components/sections/chain/BuildersCta";

// Opción 1 de tres. Las tres son la propuesta C con UNA sola diferencia: su
// propia versión de "Built for what transacts next" (§5b, el giro).
//
// El relevo: díptico de dos actores pares —una persona hoy, un agente después— que bajan a un ÚNICO nodo de cuenta, dibujado una sola vez. Ilustra «the account that simplifies crypto for a person today is the account an agent operates through tomorrow».
//
// ── Por qué importa de `chain-ab-propuesta-c/` y no tiene copia propia ──
// Estas tres rutas existen para comparar UNA variable. Si cada una tuviera su
// copia del hero y del resto, un ajuste posterior a C dejaría de propagarse y
// la comparación pasaría a mezclar diferencias que nadie pidió. El día que una
// opción necesite divergir en otra sección, se copia ESA sección y se corta el
// vínculo ahí, no antes.
//
// `CompletePicture` y `BuildersCta` salen de `chain/` igual que en C — con la
// misma contrapartida ya anotada allá: quedan atadas a la página real.
export default function ChainAbOpcion1View() {
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
