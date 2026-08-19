"use client";

import { useRef } from "react";
import { ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";

// La pieza que TODAS las transiciones comparten. Cada variante solo aporta el
// dibujo; el corte —dónde empieza, cuánto dura, cómo degrada— vive acá.
//
// Es lo que faltaba en la primera tanda: cinco secciones que repetían el mismo
// andamiaje con cinco copias del mismo `-mt`, el mismo sticky y el mismo
// ScrollTrigger. Cambiar la transición de un corte tiene que ser cambiar un
// componente, no reescribir una sección.
//
// ── El solape ───────────────────────────────────────────────────────────────
//
// `-mt-[100svh]` y `z-[2]`: el tramo empieza una pantalla ANTES de donde
// terminaría la sección anterior, así que el gesto ocurre encima de ella y no
// sobre un rectángulo vacío. Sin eso, el primer viewport del tramo es una
// pantalla vacía y lo que se lee no es una transición: es una pausa y después
// un efecto.
//
// El coste real en scroll es entonces `travel` MENOS una pantalla.
//
// ── `settle` ────────────────────────────────────────────────────────────────
//
// Con qué fracción del recorrido el dibujo tiene que estar terminado. Nunca 1:
// el último tramo queda ya en el estado final para que el lector llegue a la
// sección siguiente con el corte hecho, y no viéndolo cerrar en el último
// píxel.
//
// ── El repintado va colgado del SCROLL, no de un ticker ─────────────────────
//
// `draw(p)` se llama solo cuando el progreso cambia. Ninguna de estas
// transiciones tiene vida propia —no hay nada que respire mientras el lector
// está quieto—, así que un ticker sería repintar lo mismo 60 veces por segundo.
// Las variantes con canvas se dibujan enteras dentro de `draw`.
//
// El sticky es de CSS y el ScrollTrigger solo LEE (ver
// `components/sections/README.md`): nunca `pin: true`.

export type CutDraw = (p: number) => void;

export type SectionCutProps = {
  /** Alto del tramo. El coste NETO es esto menos una pantalla. */
  travel?: string;
  /** Con qué fracción del recorrido el dibujo está terminado. */
  settle?: number;
  /** El dibujo de la variante. Se le pasa 0..1 ya normalizado por `settle`. */
  draw: CutDraw;
  children?: React.ReactNode;
};

export default function SectionCut({
  travel = "160svh",
  settle = 0.85,
  draw,
  children,
}: SectionCutProps) {
  // El dibujo entra por ref para que la escena no se remonte cuando el
  // componente de arriba re-renderiza y crea una función nueva.
  const drawRef = useRef(draw);
  drawRef.current = draw;

  const rootRef = useMotionScope<HTMLElement>(
    ({ scope, motionOk }) => {
      // Sin motion (o en móvil) el corte se entrega HECHO. Es la degradación
      // correcta: lo que el gesto tenía para decir es el estado final, y ese se
      // puede entregar sin mover un píxel.
      if (!motionOk) {
        drawRef.current(1);
        return;
      }

      drawRef.current(0);

      const t = ScrollTrigger.create({
        trigger: scope,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => drawRef.current(Math.min(1, self.progress / settle)),
      });

      return () => t.kill();
    },
    [settle]
  );

  return (
    <section
      ref={rootRef}
      style={{ "--travel": travel } as React.CSSProperties}
      className="relative z-[2] -mt-[100svh] h-[var(--travel)] bg-transparent"
    >
      <div className="sticky top-0 h-svh overflow-hidden">{children}</div>
    </section>
  );
}

/* ── Utilidades que varias variantes necesitan ───────────────────────────── */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * La ventana del elemento `i` dentro del progreso global.
 *
 * `overlap` alto = todos avanzan casi juntos; bajo = uno termina antes de que
 * empiece el siguiente. Deliberadamente NO es un `stagger` de GSAP: un stagger
 * corre con su propio reloj y acá el reloj es el scroll.
 */
export const gate = (i: number, n: number, p: number, overlap: number) => {
  const span = 1 - overlap;
  const start = n > 1 ? (i / (n - 1)) * span : 0;
  return clamp01((p - start) / overlap);
};

/** Ruido determinista: mismo scroll, mismo dibujo. Sin `Math.random`. */
export const noise = (x: number, y: number) => {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * Ajusta el canvas al tamaño de su caja, con el DPR capado. Devuelve el ancho y
 * el alto en píxeles de CSS, que es en lo que dibujan las variantes.
 */
export const fitCanvas = (canvas: HTMLCanvasElement, dpr: number) => {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const bw = Math.max(1, Math.round(w * dpr));
  const bh = Math.max(1, Math.round(h * dpr));
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  return { w, h };
};
