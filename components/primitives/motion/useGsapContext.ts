"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "./gsapClient";

type Setup<T extends Element> = (self: gsap.Context, scope: T) => void | (() => void);

/**
 * Capa de bajo nivel: agrupa todo lo que `setup` cree (tweens, timelines,
 * ScrollTrigger, SplitText, gsap.matchMedia) en un `gsap.context()` scopeado
 * al elemento devuelto, y lo revierte completo al desmontar.
 *
 * Por qué `ctx.revert()` y no `tween.kill()`: next.config.ts tiene
 * `reactStrictMode: true`, así que en dev cada efecto monta → limpia →
 * monta. `kill()` para un tween suelto (como el marquee de CompanyGrid)
 * alcanza porque el propio tween se re-setea solo. Acá no alcanza en varios
 * casos: un reveal matado a mitad deja `opacity` inline pegada para
 * siempre (revert() restaura el DOM al estado previo a GSAP, kill() no
 * toca estilos); un ScrollTrigger con pin:true deja un pin-spacer fantasma
 * en el documento si no se revierte (la página crece el doble en dev);
 * SplitText no es un tween, es cirugía de DOM — sin revert() un segundo
 * mount lo vuelve a splittear sobre spans ya splitteados.
 */
export function useGsapContext<T extends Element = HTMLDivElement>(
  setup: Setup<T>,
  deps: unknown[] = []
): RefObject<T | null> {
  const scopeRef = useRef<T>(null);
  const setupRef = useRef(setup);

  // Actualiza la ref DESPUÉS del render (nunca durante) — declarado antes
  // del efecto de abajo, así que corre primero en cada commit. La closure
  // inline de `setup` cambia de identidad en cada render; el efecto de abajo
  // no debe re-correr por eso, solo por `deps`.
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context((self) => setupRef.current(self, scope), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
