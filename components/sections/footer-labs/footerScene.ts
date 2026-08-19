"use client";

import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// El disparo compartido por las seis versiones: entrar al bajar, DESHACERSE al
// subir.
//
// ── Por qué ninguna usa ya `once: true` ────────────────────────────────────
//
// Tres de las seis entraban con `once`, con el argumento de que un footer que
// se re-anima cada vez que el lector sube dos líneas y vuelve a bajar es ruido.
// El argumento estaba bien pero la conclusión no: lo que hay que evitar es que
// se REPITA por un gesto mínimo, no que se pueda deshacer. Con `once`, quien
// vuelve hacia arriba se lleva un footer congelado en su estado final —y en las
// versiones que tapan la pantalla, directamente una página tapada que no se
// destapa.
//
// La banda muerta la resuelven el `start` y el `end` del trigger, no `once`.
//
// ── La salida es más rápida que la entrada ─────────────────────────────────
//
// No es la entrada al revés: corre a `EXIT_SPEED`, o sea en un ~60% del tiempo.
// Entrar es el gesto —vale la pena mirarlo— pero salir es una corrección: el
// lector ya decidió volver a lo suyo y lo que quiere es que el footer se quite
// de en medio. Es lo mismo que hace el footer de producción, cuya salida es
// además lineal.
//
// `timeScale` se resetea a 1 en cada `play()`: sin eso, la segunda entrada
// heredaría la velocidad de la salida anterior y el gesto se aceleraría solo
// cada vez que el lector sube y baja.

/** Cuánto más rápido sale que entra. 1.7 ≈ 60% del tiempo de entrada. */
export const EXIT_SPEED = 1.7;

export type SceneOptions = {
  /** Qué elemento mide el disparo. Por defecto, el propio footer. */
  trigger: Element;
  start: string;
  end?: string;
  /** Corre antes de reproducir; `false` cancela la entrada (ver `Ascend`). */
  canPlay?: () => boolean;
  onToggle?: (entering: boolean) => void;
};

/**
 * Ata una timeline pausada a un tramo de scroll y devuelve el ScrollTrigger.
 *
 *   const tl = gsap.timeline({ paused: true });
 *   …
 *   const st = enterExit(tl, { trigger: scope, start: "bottom bottom+=40" });
 *   return () => { st.kill(); tl.kill(); };
 */
export function enterExit(
  tl: gsap.core.Timeline,
  { trigger, start, end = "bottom top", canPlay, onToggle }: SceneOptions
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger,
    start,
    end,
    markers: DEBUG_MARKERS,
    onEnter: () => {
      if (canPlay && !canPlay()) return;
      onToggle?.(true);
      tl.timeScale(1).play();
    },
    onLeaveBack: () => {
      onToggle?.(false);
      tl.timeScale(EXIT_SPEED).reverse();
    },
  });
}

/** Mata timeline y trigger juntos, que es siempre lo que hace el cleanup. */
export function killScene(tl: gsap.core.Timeline, st: ScrollTrigger, targets: Element[]) {
  st.kill();
  tl.kill();
  gsap.set(targets, { clearProps: "all" });
}
