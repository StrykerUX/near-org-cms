"use client";

import { type RefObject } from "react";
import { gsap } from "./gsapClient";
import { useGsapContext, type GsapContext } from "./useGsapContext";
import { MQ } from "./motionTokens";

export type MotionScope<T extends HTMLElement> = {
  /**
   * Selector scopeado a la sección. Nunca devuelve nodos de otra sección.
   * El genérico es para las escenas SVG: `q<SVGGElement>("[data-tier-group]")`.
   */
  q: <E extends Element = HTMLElement>(selector: string) => E[];
  /** El root de la sección, ya desreferenciado y tipado. */
  scope: T;
  /** `false` cuando el usuario pidió reducir movimiento. */
  motionOk: boolean;
  /** Viewport de 1024px o más. */
  isDesktop: boolean;
  /**
   * El contexto de ESTA corrida — el que `gsap.matchMedia()` crea y revierte
   * cuando las condiciones dejan de aplicar, no el del componente. Es el correcto
   * para dos cosas:
   *
   * - hacer context-safe un handler que crea tweens fuera del setup:
   *   `const onMove = self.add(null, (e) => gsap.to(...))`
   * - registrar una función con nombre y llamarla desde donde sea, con sus tweens
   *   dentro del contexto: `self.add("placeRail", () => {...})` y después
   *   `self.placeRail()`. Es lo que permite pasar la misma función a un listener
   *   de `refreshInit` y limpiarla sola.
   */
  self: GsapContext;
};

/**
 * El arranque de una sección animada, en una línea.
 *
 * Las trece secciones animadas de los prototipos empezaban con el mismo bloque
 * de diez líneas: `gsap.utils.selector(scope)` con su cast, un
 * `gsap.matchMedia()`, un `mm.add` con las dos condiciones de siempre, el cast
 * de `mctx.conditions`, y un `return () => mm.revert()` al final. Diez líneas
 * antes de la primera línea de animación, repetidas trece veces, con el riesgo
 * de que una se olvide el revert o escriba la media query a mano.
 *
 * `setup` corre una vez por cada combinación de condiciones que aplique, y lo
 * que devuelva se ejecuta cuando esa combinación deja de aplicar — no solo al
 * desmontar. Eso es lo que hace que un cambio en vivo de
 * `prefers-reduced-motion` (o cruzar el breakpoint de 1024px) reconstruya la
 * escena en vez de dejarla a medias.
 *
 *   const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
 *     if (!motionOk || !isDesktop) return;   // degradación: flujo normal
 *     const tl = trackTimeline(scope, 0.3);
 *     tl.from(q("[data-panel]"), { autoAlpha: 0 });
 *     return () => gsap.killTweensOf(q("[data-panel]"));
 *   });
 *
 * Las dos condiciones son fijas y eso define para qué sirve el hook: escenas cuyo
 * comportamiento depende **de las dos** — animan en desktop y caen a flujo normal
 * en móvil. Una escena que solo mira `prefers-reduced-motion` NO debe usarlo:
 * declarar `isDesktop` como condición hace que cruzar los 1024px revierta y
 * reconstruya la escena, y para algo como el word field eso son 10 000 mediciones
 * de rect que nadie pidió. Esas usan `gsap.matchMedia()` con `MQ.motion` directo,
 * que son cinco líneas y un contrato distinto.
 */
export function useMotionScope<T extends HTMLElement = HTMLElement>(
  setup: (ctx: MotionScope<T>) => void | (() => void),
  deps: unknown[] = []
): RefObject<T | null> {
  return useGsapContext<T>((_self, scope) => {
    const q = gsap.utils.selector(scope) as <E extends Element = HTMLElement>(
      selector: string
    ) => E[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion, isDesktop: MQ.desktop }, (mctx) => {
      const { motionOk, isDesktop } = mctx.conditions as {
        motionOk: boolean;
        isDesktop: boolean;
      };
      return setup({ q, scope, motionOk, isDesktop, self: mctx });
    });

    return () => mm.revert();
  }, deps);
}
