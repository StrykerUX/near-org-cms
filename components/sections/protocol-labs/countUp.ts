"use client";

import type { RefObject } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";

// El contador de cifras, una sola vez para todo el laboratorio de Protocol.
//
// Nació dentro de `hero-labs/H2Count` y salió de ahí cuando las ocho franjas de
// prueba lo necesitaron: nueve copias del mismo parser de "<$0.002" es
// exactamente el tipo de cosa que diverge en la primera corrección.
//
// ── Las tres decisiones que hacen que no se vea barato ────────────────────
//
// 1. **El formato se conserva entero durante la animación.** Prefijo, sufijo y
//    número de decimales salen del valor final y no cambian: "<$0.002" cuenta
//    como "<$0.000" → "<$0.002", nunca como "0" → "0.002". Un contador que
//    cambia de forma mientras corre se lee como un error.
//
// 2. **El ancho queda reservado antes de empezar.** Se mide la caja con el valor
//    FINAL —que es el que está en el HTML— y se fija como `min-width`. Sin esto,
//    "600ms" empieza en "0ms" y la caja crece de tres a cinco caracteres
//    mientras cuenta, arrastrando a todo lo que tenga al lado. En una frase
//    corrida (P5) eso reflowea el párrafo entero en cada frame.
//
//    La medición espera a `document.fonts.ready`: con la fuente de fallback la
//    caja mide otra cosa y el ancho reservado queda mal para siempre.
//
// 3. **El valor final está en el HTML, no en JavaScript.** El contador lo pisa
//    en el primer frame si va a correr. Sin JS, con `prefers-reduced-motion` o si
//    el bundle falla, la cifra ya está bien — que es la única degradación
//    aceptable para el dato que sostiene la credibilidad de la página.

/** Parte un valor en prefijo, número, sufijo y decimales: `"<$0.002"` → `["<$", 0.002, "", 3]`. */
export const parseStat = (value: string): [string, number, string, number] | null => {
  const m = value.match(/^(\D*)([\d.]+)(.*)$/);
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return [prefix, Number(digits), suffix, decimals];
};

export type CountUpOptions = {
  /** Default `"[data-count]"`. Cada elemento lleva su valor final en ese atributo. */
  targets?: string;
  /**
   * `false` (default) arranca cuando el bloque entra en viewport; `true` arranca
   * al montar.
   *
   * No es una preferencia: una franja que vive a mitad de página y cuenta al
   * montar ya terminó cuando el lector llega, así que el efecto se gasta sin que
   * nadie lo vea. `true` es sólo para lo que está sobre la línea de flotación.
   */
  immediate?: boolean;
  duration?: number;
  /**
   * Escalonado entre cifras. Bajo a propósito: en secuencia estricta la última
   * arranca casi un segundo después de la primera y el bloque se lee como seis
   * animaciones en vez de una.
   */
  stagger?: number;
  start?: string;
  /** Fija el ancho final antes de contar. Ver el punto 2 de arriba. */
  lockWidth?: boolean;
};

export function useCountUp<T extends HTMLElement = HTMLElement>({
  targets = "[data-count]",
  immediate = false,
  duration = 1.4,
  stagger = 0.08,
  start = "top 82%",
  lockWidth = true,
}: CountUpOptions = {}): RefObject<T | null> {
  return useGsapContext<T>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    // `gsap.matchMedia` con `MQ.motion` directo y no `useMotionScope`: esto no
    // cambia de comportamiento a los 1024px, y declarar `isDesktop` como
    // condición haría que cruzar el breakpoint reconstruyera los contadores —o
    // sea, que se volvieran a ejecutar— al rotar un teléfono.
    mm.add(MQ.motion, () => {
      const els = q(targets);
      if (els.length === 0) return;

      // Guarda el texto original de cada elemento para poder restaurarlo: el
      // cleanup corre también cuando el usuario cambia `prefers-reduced-motion`
      // en vivo, y ahí la cifra tiene que volver a su valor final, no quedarse
      // donde el tween la dejó.
      const originals = els.map((el) => el.textContent ?? "");
      let tl: gsap.core.Timeline | null = null;
      let cancelled = false;

      const run = () => {
        if (cancelled) return;

        if (lockWidth) {
          els.forEach((el) => {
            el.style.display = "inline-block";
            el.style.minWidth = `${el.getBoundingClientRect().width}px`;
          });
        }

        tl = gsap.timeline({
          scrollTrigger: immediate
            ? undefined
            : { trigger: scope, start, once: true, markers: DEBUG_MARKERS },
        });

        els.forEach((el, i) => {
          const parsed = parseStat(el.dataset.count ?? el.textContent ?? "");
          if (!parsed) return;
          const [prefix, target, suffix, decimals] = parsed;
          const counter = { n: 0 };
          tl!.to(
            counter,
            {
              n: target,
              duration,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
              },
            },
            i * stagger
          );
        });
      };

      // `fonts.ready` es una promesa y el cleanup puede correr antes de que
      // resuelva —en dev pasa en cada mount por StrictMode—. Sin el flag, `run()`
      // mediría y animaría sobre un DOM ya desmontado.
      if (document.fonts?.ready) document.fonts.ready.then(run).catch(run);
      else run();

      return () => {
        cancelled = true;
        tl?.scrollTrigger?.kill();
        tl?.kill();
        els.forEach((el, i) => {
          el.textContent = originals[i];
          el.style.removeProperty("display");
          el.style.removeProperty("min-width");
        });
      };
    });

    return () => mm.revert();
  }, []);
}
