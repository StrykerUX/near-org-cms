"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import MuralBlock from "./MuralBlock";

// 10 · Weave — las líneas se cruzan como una trama.
//
// Las impares viajan hacia un lado y las pares hacia el otro, con recorridos
// que crecen hacia abajo: el bloque se abre y se cierra alrededor de un único
// punto de alineación.
//
// ── Ese punto es el sentido de la variante ─────────────────────────────────
//
// Existe UNA sola posición de scroll —la mitad del recorrido— en la que las
// cuatro caen exactamente donde el artboard las puso. Todo lo demás es tensión.
// Es la pregunta que hace: si el estado correcto del diseño merece ser un
// instante o debería ser el estado de reposo.
//
// El recorrido crece con el índice (12, 18, 24, 30) para que no se lea como
// cuatro líneas moviéndose en bloque: la de abajo viaja el doble que la de
// arriba y eso arma la diagonal.

export default function MuralWeave() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q("[data-mural-word]");
    if (words.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
      },
      defaults: { ease: "none" },
    });

    words.forEach((word, i) => {
      const reach = 12 + i * 6;
      const dir = i % 2 === 0 ? 1 : -1;
      // `xPercent` y no píxeles: las palabras miden distinto y con un valor
      // absoluto el desfase entre ellas cambiaría con el viewport.
      tl.fromTo(word, { xPercent: reach * dir }, { xPercent: -reach * dir, duration: 1 }, 0);
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(words, { clearProps: "transform" });
    };
  });

  return (
    <div ref={rootRef}>
      <MuralBlock />
    </div>
  );
}
