"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import MuralBlock from "./MuralBlock";

// 13 · Peel — cada línea gira sobre su eje horizontal, como las lamas de una
// persiana.
//
// Las cuatro pasan por su posición frontal en momentos distintos del recorrido,
// así que nunca están todas de frente a la vez salvo en el punto medio.
//
// ── La perspectiva está calibrada, no elegida al azar ──────────────────────
//
// 1600px, y es floja a propósito. Con una perspectiva corta el escorzo es
// violento y la palabra se vuelve ilegible en cuanto pasa los 25°; a 1600 el
// texto sigue leyéndose casi todo el recorrido y el giro se percibe igual. A
// este cuerpo, "espectacular pero ilegible" no es una opción: la sección existe
// para que se lea una frase.
//
// La perspectiva va en el CONTENEDOR y no en cada línea: en la línea se
// aplicaría después de su propia rotación y todas compartirían el mismo punto
// de fuga aparente, que es exactamente lo contrario de una persiana.

export default function MuralPeel() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const lines = q("[data-mural-line]");
    if (lines.length === 0) return;

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

    lines.forEach((line, i) => {
      gsap.set(line, { transformOrigin: "center center" });
      tl.fromTo(
        line,
        { rotateX: 62 },
        { rotateX: -62, duration: 1 },
        // El desfase reparte el momento frontal de cada línea a lo largo del
        // recorrido: sin él las cuatro girarían al unísono y se leería como una
        // sola superficie.
        i * 0.06
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(lines, { clearProps: "transform,transformOrigin" });
    };
  });

  return (
    <div ref={rootRef} style={{ perspective: "1600px" }}>
      <MuralBlock />
    </div>
  );
}
