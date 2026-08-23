import Hero from "@/components/sections/chain-ab-propuesta-c/Hero";
import WhyItMatters from "@/components/sections/chain-ab-propuesta-c/WhyItMatters";
import StickyScrollCapabilities from "@/components/sections/chain-ab-propuesta-c/StickyScrollCapabilities";
import Proof from "@/components/sections/chain-ab-propuesta-c/Proof";
import CompletePicture from "@/components/sections/chain/CompletePicture";
import ForwardTurn from "@/components/sections/chain-abstraction-proposals/ForwardTurn";
import BuildersCta from "@/components/sections/chain/BuildersCta";

// Variante de la propuesta B. Dos diferencias, las dos pedidas:
//
// 1. El strip de ecosystem del `Proof` corre en carrusel infinito en vez de
//    quedarse quieto (ver el comentario en `chain-ab-propuesta-c/Proof.tsx`).
// 2. La página llega hasta el final, con las tres secciones que a B le
//    faltaban.
//
// De esas tres, `ForwardTurn` YA NO sale de la página real: se probaron tres
// tratamientos propios en `/prototype/chain-ab-opcion-1`, `-2` y `-3`, y el
// elegido vive ahora en `chain-abstraction-proposals/`, la carpeta común de
// las tres propuestas. A y B montan el mismo.
//
// `CompletePicture` y `BuildersCta` sí siguen viniendo tal cual de
// `components/sections/chain/`, que es lo que se pidió: verlas exactamente
// como están hoy, sin reinterpretación. Es la excepción y no la regla — la
// consigna de esta familia era composición propia, y traerse las secciones
// reales fue un desvío que ya se corrigió una vez. La contrapartida a tener
// presente: si alguien edita `chain/CompletePicture`, las tres propuestas
// cambian solas. El día que haya que divergir, se copian y se corta el
// vínculo.
//
// El orden es el del copy deck y el mismo de la página real: posición →
// promesa → capacidades → evidencia → convergencia → giro → CTA.
export default function ChainAbPropuestaCView() {
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
