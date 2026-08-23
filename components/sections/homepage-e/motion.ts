"use client";

import { CustomEase, gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// La gramática de movimiento de esta homepage.
//
// ── Por qué existe ──────────────────────────────────────────────────────────
//
// Cada sección venía inventando su propia duración y su propia ease. Sumadas,
// ocho secciones con ocho criterios distintos se leen como ocho sitios: no hay
// nada visiblemente "mal" en ninguna, pero el conjunto no tiene pulso. Un sitio
// se siente de una sola mano cuando los tiempos se REPITEN — es lo mismo que un
// tipo de letra hace con el texto.
//
// Así que acá hay tres duraciones y tres curvas, y nada más. Si una sección
// necesita otra cosa, la respuesta correcta es casi siempre una de estas con
// otro delay.
//
// Lo que este módulo NO toca: las coreografías que ya tienen un motivo escrito
// para desviarse (el `expo.out` de los renglones de `ProofDatum`, la caída en
// dos tramos de los cubos del stack). Esas se documentaron cuando se calibraron
// y siguen valiendo; unificarlas sería obedecer a la tabla en vez de al ojo.

/** Las tres duraciones. Todo lo demás es una de estas con delay. */
export const DUR = {
  /** Cambios de estado: hover, foco, tinte. Tan corto que se siente inmediato. */
  fast: 0.3,
  /** El caballo de batalla: entradas cortas, salidas, desplazamientos. */
  base: 0.6,
  /** Entradas con peso — lo que el lector tiene que ver LLEGAR. */
  slow: 0.9,
} as const;

/** Cuánto se separan dos elementos hermanos al entrar. */
export const STAGGER = 0.09;

/** Dónde entra una sección: su borde superior a cuatro quintos del viewport. */
export const ENTER = "top 80%";

export const EASE = {
  /** Entradas. Sale disparado y frena largo. */
  out: "power3.out",
  /** Cambios de estado con ida y vuelta (hover, toggles). */
  inOut: "power2.inOut",
  /** Ver abajo. */
  curtain: "homepageECurtain",
} as const;

// La curva de las cortinas, declarada una vez.
//
// Es asimétrica a propósito y por eso no puede ser un `power*`: la cortina
// ARRANCA rápido —tiene que despegarse del scroll para que se lea como un gesto
// propio y no como el borde de una sección subiendo— y llega frenando casi
// hasta detenerse, para que el negro no golpee el techo del viewport.
//
// `CustomEase` es la única forma de que la MISMA curva exista en GSAP y en CSS
// (ver el docblock de `gsapClient`). Acá solo se usa desde GSAP, pero se declara
// igual como bezier con nombre para que el día que una transición CSS tenga que
// acompañar a una cortina no haya que aproximarla a ojo.
if (typeof window !== "undefined") {
  CustomEase.create(EASE.curtain, "M0,0 C0.12,0.62 0.2,1 1,1");
}

/**
 * El timeline de entrada de una sección: una sola vez, al llegar.
 *
 * Existe para que `once: true`, el punto de entrada y los defaults no se
 * vuelvan a escribir sección por sección — que es exactamente donde se colaban
 * las divergencias que este módulo viene a cerrar.
 */
export function enterTimeline(
  trigger: Element,
  { start = ENTER, duration = DUR.slow, ease = EASE.out }: EnterOptions = {}
): gsap.core.Timeline {
  return gsap.timeline({
    defaults: { ease, duration },
    scrollTrigger: { trigger, start, once: true, markers: DEBUG_MARKERS },
  });
}

export type EnterOptions = {
  start?: string;
  duration?: number;
  ease?: string;
};
