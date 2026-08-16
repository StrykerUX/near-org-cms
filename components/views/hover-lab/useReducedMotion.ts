"use client";

import { useSyncExternalStore } from "react";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Una MediaQueryList es exactamente lo que `useSyncExternalStore` espera: un
// estado que vive FUERA de React, con una suscripción propia. Escrito con
// `useState` + `useEffect` funciona igual pero pide un render extra sólo para
// enterarse del valor inicial, y el linter lo marca con razón.

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(MQ.reduce);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(MQ.reduce).matches;

// En el servidor no hay preferencia que consultar. Se devuelve `false` (o sea,
// "sí hay movimiento") para que el HTML del servidor y el primer render del
// cliente coincidan; el cliente corrige en el mismo commit, mucho antes de que
// nadie pueda pasar el puntero por encima.
const getServerSnapshot = () => false;

/**
 * `prefers-reduced-motion: reduce`, en vivo.
 *
 * Existe sólo para las variantes de JS puro del hover lab: las de CSS lo
 * resuelven con una media query y las de GSAP con `gsap.matchMedia()`, que ya
 * revierte y reconstruye solo cuando la preferencia cambia. Un rAF a mano no
 * tiene ninguna de las dos cosas, así que necesita preguntar.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
