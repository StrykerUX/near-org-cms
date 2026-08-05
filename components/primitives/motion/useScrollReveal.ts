"use client";

import { gsap } from "./gsapClient";
import { useGsapContext } from "./useGsapContext";
import { MQ, EASE_OUT, REVEAL, DEBUG_MARKERS } from "./motionTokens";

type BuildArgs = {
  tl: gsap.core.Timeline;
  q: (selector: string) => HTMLElement[];
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

  return useGsapContext<T>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion, isDesktop: MQ.desktop }, (mctx) => {
      const { motionOk, isDesktop } = mctx.conditions as {
        motionOk: boolean;
        isDesktop: boolean;
      };

      if (!motionOk) {
        // reduce: estado final directo, sin trigger. Revertible por matchMedia.
        gsap.set(q(targets), { clearProps: "all", autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT, duration },
        scrollTrigger: {
          trigger: scope,
          start,
          once: true,
          markers: DEBUG_MARKERS,
        },
      });

      if (build) build({ tl, q, isDesktop });
      else tl.from(q(targets), { autoAlpha: 0, y, stagger });
    });

    return () => mm.revert();
  }, []);
}
