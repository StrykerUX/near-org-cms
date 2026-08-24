"use client";

import { gsap } from "./gsapClient";
import { useMotionScope, type MotionScope } from "./useMotionScope";
import { EASE_OUT, REVEAL, DEBUG_MARKERS } from "./motionTokens";

type BuildArgs = {
  tl: gsap.core.Timeline;
  q: MotionScope<HTMLElement>["q"];
  isDesktop: boolean;
};

export type ScrollRevealOptions = {
  /** default "[data-reveal]" dentro del scope — el orden en el DOM es el orden del stagger */
  targets?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  /** Escape hatch para secciones con coreografía propia (varios grupos, distinto orden/timing) */
  build?: (args: BuildArgs) => void;
};

/**
 * Capa de alto nivel sobre useGsapContext: fade + slide-up al entrar en
 * viewport, una sola vez, respetando `prefers-reduced-motion` en vivo (vía
 * gsap.matchMedia — no un check de una sola vez al montar).
 *
 * No usa CSS para preesconder los elementos: `.from()` de GSAP tiene
 * `immediateRender: true`, así que aplica el estado inicial en el mismo
 * frame en que se crea el timeline. La alternativa (`[data-reveal]{opacity:0}`
 * en globals.css) es la peor degradación posible: si el JS falla o el bundle
 * no carga, la sección queda invisible para siempre. Con `.from()`, sin JS
 * se ve todo — degrada correcto.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  opts: ScrollRevealOptions = {}
) {
  const {
    targets = "[data-reveal]",
    y = REVEAL.y,
    duration = REVEAL.duration,
    stagger = REVEAL.stagger,
    start = REVEAL.start,
    build,
  } = opts;

  return useMotionScope<T>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk) {
      // reduce: estado final directo, sin trigger. Revertible por matchMedia.
      gsap.set(q(targets), { clearProps: "all", autoAlpha: 1 });
      return;
    }

    // ⚠️ `toggleActions` y NO `once: true`, aunque el efecto visible sea el
    // mismo (entra una vez, nunca se revierte ni se repite).
    //
    // `once: true` no significa «no repetir»: significa **matar el
    // ScrollTrigger** en cuanto termina de cruzar. GSAP lo hace dentro de
    // `update()` (`ScrollTrigger.js:1772`):
    //
    //     once && (clipped === 1 ? self.kill(false, 1) : ...)
    //
    // y `kill()` hace `_triggers.splice(i, 1)`. El problema es DESDE DÓNDE se
    // puede llegar a ese `update()`. Cuando un ScrollTrigger nuevo se refresca,
    // recorre hacia atrás los que ya existen y fuerza el refresco de los que
    // todavía no midieron (`ScrollTrigger.js:1366`):
    //
    //     while (i-- > 0) {
    //       curTrigger = _triggers[i];
    //       curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = self);
    //
    // Si ese refresco forzado cae sobre un trigger `once` cuyo rango ya quedó
    // enteramente por encima del scroll actual, el trigger dispara, se mata, y
    // el array se acorta MIENTRAS el `while` lo está recorriendo: la vuelta
    // siguiente lee `_triggers[i]` fuera de rango y revienta con
    // `Cannot read properties of undefined (reading 'end')`, señalando al
    // `gsap.fromTo` del trigger inocente que estaba naciendo.
    //
    // Se ve al montar la página con el scroll ya abajo —una recarga a media
    // página, un enlace con hash, o un Fast Refresh mientras se edita—, que es
    // justo cuando una sección de más abajo se está inicializando.
    //
    // `toggleActions: "play none none none"` hace exactamente lo mismo de cara
    // al lector —reproduce al entrar y no hace nada en los otros tres cruces—
    // sin destruir el trigger, así que el array nunca se muta desde adentro del
    // recorrido. El costo es un ScrollTrigger vivo por sección, que es ruido
    // frente a un crash.
    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT, duration },
      scrollTrigger: {
        trigger: scope,
        start,
        toggleActions: "play none none none",
        markers: DEBUG_MARKERS,
      },
    });

    if (build) build({ tl, q, isDesktop });
    else tl.from(q(targets), { autoAlpha: 0, y, stagger });
  });
}
