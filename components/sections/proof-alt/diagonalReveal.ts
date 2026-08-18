"use client";

import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";

// La entrada que comparten la 01 y la 02: los seis bloques se revelan como un
// frente en diagonal, y después la sección queda quieta.
//
// Vive fuera de los dos componentes porque es LA MISMA entrada, no una parecida:
// la 02 es la 01 con una capa de fondo, y lo que se está comparando es
// exactamente esa capa. Con dos timelines escritas por separado, cualquier
// ajuste en una haría que la comparación midiera también la diferencia de
// timing que se coló.
//
// ── El orden es la diagonal, no el DOM ──────────────────────────────────────
//
// Los bloques no entran en orden de lectura sino por su posición en pantalla,
// ordenados por `left + top`. Con el orden del DOM, el bloque de arriba a la
// derecha entraría antes que el que tiene a su izquierda y el frente se vería
// roto. Se mide DENTRO del efecto y no se hornea: la composición cambia entre
// breakpoints, y la escena se reconstruye al cruzar los 1024px.
//
// El peso de `top` es mayor que el de `left` a propósito: sin él, en un monitor
// muy ancho la diferencia horizontal domina y el frente se vuelve casi vertical.
const Y_WEIGHT = 1.6;

// Distancia entre dos bloques consecutivos del frente, en segundos.
const STEP = 0.09;

export type DiagonalReveal = {
  /** Mata la timeline y revierte los splits, en ese orden. */
  kill: () => void;
};

export function diagonalReveal(scope: Element, blocks: HTMLElement[]): DiagonalReveal {
  const order = blocks
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { el, rank: r.left + r.top * Y_WEIGHT };
    })
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => entry.el);

  const splits: SplitText[] = [];
  const tl = gsap.timeline({
    defaults: { ease: EASE_OUT },
    scrollTrigger: { trigger: scope, start: "top 72%", once: true, markers: DEBUG_MARKERS },
  });

  order.forEach((block, i) => {
    const at = i * STEP;
    const figure = block.querySelector<HTMLElement>("[data-figure]");
    const rule = block.querySelector<HTMLElement>("[data-rule]");
    const eyebrow = block.querySelector<HTMLElement>("[data-eyebrow]");
    const body = block.querySelector<HTMLElement>("[data-body]");

    if (eyebrow) tl.from(eyebrow, { autoAlpha: 0, y: 12, duration: 0.6 }, at);

    if (figure) {
      // `mask: "lines"` da el gesto correcto para una cifra grande: aparece
      // deslizándose desde debajo de su propia línea de base. Partirla en
      // caracteres daría el efecto máquina de escribir, que a esta escala se lee
      // como un tablero de aeropuerto — y eso ya fue, literalmente, otra versión
      // de la primera ronda.
      const split = SplitText.create(figure, {
        type: "lines",
        mask: "lines",
        // La máscara recorta exactamente el alto de la línea, y a los
        // interlineados cerrados de la escala display eso siega la cola de las g
        // y las y. Sin esto el recorte es PERMANENTE, no solo durante el gesto.
        onSplit: (self) => allowDescenders(self.lines),
      });
      splits.push(split);
      tl.from(split.lines, { yPercent: 108, duration: 0.9, stagger: 0.06 }, at + 0.05);
    }

    // La regla se traza después de que la cifra aterrizó: es lo que la subraya,
    // y subrayar algo que todavía no llegó no significa nada.
    if (rule) tl.from(rule, { scaleX: 0, duration: 0.7 }, at + 0.28);

    if (body) tl.from(body, { autoAlpha: 0, y: 14, duration: 0.7 }, at + 0.34);
  });

  return {
    kill: () => {
      // El orden importa: primero la timeline —que referencia los nodos que
      // generó el split— y recién después el revert de los splits.
      tl.scrollTrigger?.kill();
      tl.kill();
      splits.forEach((s) => s.revert());
    },
  };
}
