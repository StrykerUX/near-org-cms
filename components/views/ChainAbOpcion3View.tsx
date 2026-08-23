import Hero from "@/components/sections/chain-ab-propuesta-c/Hero";
import WhyItMatters from "@/components/sections/chain-ab-propuesta-c/WhyItMatters";
import StickyScrollCapabilities from "@/components/sections/chain-ab-propuesta-c/StickyScrollCapabilities";
import Proof from "@/components/sections/chain-ab-propuesta-c/Proof";
import CompletePicture from "@/components/sections/chain/CompletePicture";
import ForwardTurn from "@/components/sections/chain-ab-opcion-3/ForwardTurn";
import BuildersCta from "@/components/sections/chain/BuildersCta";

// Opción 3 de tres. Las tres son la propuesta C con UNA sola diferencia: su
// propia versión de "Built for what transacts next" (§5b, el giro).
//
// El mismo sujeto, otro operador: una marca de cuenta que no se mueve nunca y una línea debajo que releva «a person» por «an agent». Ilustra «an identity that persists and authority that travels with it» — la quietud es el argumento.
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
export default function ChainAbOpcion3View() {
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
