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
// ── El modelo: el corte REVELA lo que viene, no tapa lo que había ───────────
//
// La primera versión pintaba negro encima de la sección de arriba y recién
// DESPUÉS llegaba la de abajo. Eso deja dos tramos muertos: una cabeza sobre el
// final vacío de la anterior, y sobre todo una cola —el gesto terminaba antes
// que el tramo y quedaban ~24svh de pantalla negra sin que pasara nada—. El
// coste declarado era 60svh y el tiempo percibido, más de una pantalla.
//
// Ahora la sección SIGUIENTE ya está montada detrás durante el gesto, y lo que
// hace cada variante es BORRAR el velo del color de la anterior. Cuando cae la
// última celda ya estás en la sección, no en un rectángulo negro esperándola:
// la transición y la llegada son el mismo evento.
//
// ── Los dos solapes ─────────────────────────────────────────────────────────
//
// `-mt-[100svh]` (hacia atrás) — el tramo empieza una pantalla antes de donde
// terminaría la anterior, así que el gesto ocurre encima de ella y no sobre un
// rectángulo vacío.
//
// `lead` (hacia adelante, por `margin-bottom` negativo) — tira de la sección
// siguiente hacia arriba para que esté DETRÁS durante el último tramo del
// gesto. Es lo que hace posible revelar en vez de tapar.
//
// El coste NETO en scroll es `travel − 100svh − lead`. Con los valores por
// defecto, **20svh**: una quinta parte de pantalla.
//
// Se puede llevar a CERO (travel 140), y se probó: el gesto queda en 40svh —
// tres o cuatro golpes de rueda— y no da tiempo a verlo. El recorrido del gesto
// es `travel − 100svh`, así que alargarlo cuesta scroll uno a uno. 20svh netos
// por 60 de gesto es el punto donde la transición se ve y no se siente.
//
// ── Por qué `lead` es corto ─────────────────────────────────────────────────
//
// La sección de abajo arranca su propio recorrido en cuanto entra, así que cada
// svh de solape es scroll que ella gasta estando todavía medio tapada. 40svh
// sobre los 280 del stack es un 14%: menos de una parada.
//
// Lo que hace que un `lead` corto igual funcione es el PISO (abajo): los
// agujeros muestran el color de destino desde el primer frame, y la sección de
// verdad llega a tiempo para el final.
//
// ── El piso ─────────────────────────────────────────────────────────────────
//
// Debajo del velo hay un panel del color de DESTINO. Hace falta porque la
// sección siguiente entra por el borde inferior: durante la primera parte del
// gesto solo ocupa la franja de abajo, y sin piso los agujeros de la mitad
// superior mostrarían la sección de ARRIBA, que es lo que el velo está tapando
// — el efecto se ve roto justo al empezar.
//
// Con el piso, cada agujero muestra desde el primer frame el color al que vas,
// y sobre el final ese color ya es la sección de verdad.
//
// ── Ojo con el z-index de la sección de arriba ──────────────────────────────
//
// El corte se apila en `z-[2]`, pero la sección SIGUIENTE tiene que quedar por
// encima de la anterior en la zona de solape. Si la de arriba trae un `z-[1]`
// propio —como `OwnYourOwn`— gana por índice aunque venga antes en el DOM, y la
// que entra queda escondida detrás. Quien monte un corte tiene que darle a la
// sección de abajo un índice al menos igual.
//
// ── `settle` ────────────────────────────────────────────────────────────────
//
// Con qué fracción del recorrido el dibujo está terminado. Ahora el valor por
// defecto es 1: con el modelo de revelar ya no hace falta cerrar antes de
// tiempo — cerrar antes ERA la cola muerta.
//
// ── El presupuesto ──────────────────────────────────────────────────────────
//
// Un corte decorativo no puede costar lo mismo que uno que dice algo. La regla
// del laboratorio:
//
//   · decorativo (no hay nada que leer) → 0svh netos
//   · con contenido (un rótulo, un dato) → hasta 90svh netos
//
// `CutChapter` es el único que gasta el presupuesto grande, y lo gasta en una
// pausa para que el rótulo se pueda leer.
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
  /** Alto del tramo. El coste NETO es esto menos 100svh menos `lead`. */
  travel?: string;
  /** Cuánto se adelanta la sección siguiente, para revelarla en vez de taparla. */
  lead?: string;
  /** Color de destino, pintado como piso bajo el velo. */
  to?: string;
  /** Con qué fracción del recorrido el dibujo está terminado. */
  settle?: number;
  /** El dibujo de la variante. Se le pasa 0..1 ya normalizado por `settle`. */
  draw: CutDraw;
  children?: React.ReactNode;
};

export default function SectionCut({
  travel = "160svh",
  lead = "40svh",
  to = "var(--ink)",
  settle = 1,
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
      style={
        {
          "--travel": travel,
          marginBottom: `calc(-1 * ${lead})`,
        } as React.CSSProperties
      }
      className="relative z-[2] -mt-[100svh] h-[var(--travel)] bg-transparent"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: to }} />
        {/* El wrapper es POSICIONADO a propósito. El piso es `absolute`, y en el
            orden de pintado de CSS un elemento posicionado va por encima de
            todo el contenido en flujo del mismo contexto: con el velo como caja
            estática, el piso lo tapaba entero y solo se veía el color de
            destino desde el primer frame. Posicionados los dos, manda el orden
            del DOM. */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </section>
  );
}

/* ── Utilidades que varias variantes necesitan ───────────────────────────── */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * El color de la sección que SALE — el del velo que cada variante borra.
 *
 * Constante y no prop porque hoy todos los cortes del laboratorio van del mismo
 * cream al mismo negro. El día que haya un corte entre otros dos colores, esto
 * es lo único que tiene que subir a prop.
 */
export const CUT_FROM = "#f5f4f1";

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
