"use client";

import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import MuralBlock from "./MuralBlock";
import { LINES, sweepGradient } from "./muralContent";

// 04 · Scrub — la única atada al scroll.
//
// Las cuatro líneas se desplazan lateralmente a velocidades distintas mientras
// la sección cruza el viewport, y el degradado viaja con ellas. El bloque llega
// desarmado, se alinea al pasar por el centro y se vuelve a desarmar al salir:
// el estado "correcto" —el del artboard— existe en un solo punto del recorrido.
//
// ── Qué compara contra las otras tres ──────────────────────────────────────
//
// Es la contraparte de las tres con timeline propia. Acá el progreso ES el
// scroll: reversible sin escribir la reversa, imposible de desincronizar, y
// nunca le saca el control al lector. El precio es que el ritmo deja de ser del
// diseño y pasa a ser del gesto de cada uno — rápido pasa en un borrón, lento
// se congela a mitad. Esa es exactamente la pregunta que el lab hace.
//
// ── Por qué el desplazamiento va en `xPercent` ─────────────────────────────
//
// Es relativo al ancho de cada palabra, no un valor fijo: "infrastructure" y
// "the Agent economy" miden distinto, y con píxeles el desfase entre ellas
// cambiaría con el viewport. En porcentaje, la relación se mantiene.
//
// El signo alterna por línea. Todas hacia el mismo lado se leería como una sola
// masa moviéndose; alternando, el bloque se abre y se cierra.

/** Cuánto se desplaza cada línea, en % de su propio ancho. */
const DRIFT = [6, -8, 5, -7];

export default function MuralScrub() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q("[data-mural-word]");
    if (words.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
        invalidateOnRefresh: true,
        markers: DEBUG_MARKERS,
      },
      defaults: { ease: "none" },
    });

    words.forEach((word, i) => {
      const line = LINES[i];
      const drift = DRIFT[i % DRIFT.length];
      if (!line) return;

      gsap.set(word, {
        backgroundImage: sweepGradient(line),
        backgroundSize: "200% 100%",
      });

      // Dos tweens sobre el mismo target y el mismo tramo: la posición del
      // degradado cruza de un extremo al otro mientras la línea deriva. Van
      // juntos y no encadenados porque el estado alineado tiene que caer en el
      // MEDIO del recorrido, no al final.
      tl.fromTo(word, { xPercent: drift }, { xPercent: -drift, duration: 1 }, 0);
      tl.fromTo(
        word,
        { backgroundPosition: "0% 0%" },
        { backgroundPosition: "100% 0%", duration: 1 },
        0
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(words, {
        clearProps: "transform,backgroundImage,backgroundSize,backgroundPosition",
      });
      ScrollTrigger.refresh();
    };
  });

  return (
    <div ref={rootRef}>
      <MuralBlock />
    </div>
  );
}
