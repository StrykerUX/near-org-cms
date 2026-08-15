"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import {
  ringAdvance,
  stairHeights,
  stairRings,
  type StairMode,
  type StairPeak,
} from "@/components/primitives/motion/stairCascade";

// Transición de escalera entre dos secciones: una banda del color de arriba, con
// los escalones del color de abajo creciendo dentro de ella a medida que cruza el
// viewport.
//
// Se intercala y ya — no hace falta saber GSAP para usarla:
//
//     <section>…</section>
//     <StairTransition from="var(--stone)" to="var(--cream)" peak="center" />
//     <section>…</section>
//
// La forma y el reloj viven en `motion/stairCascade.ts`, que es puro; acá está el
// pintado y el enganche al scroll.
//
// ── Convive con `ZigguratDivider`, y es a propósito ──────────────────────────
//
// Aquel resuelve lo mismo con un reveal cronometrado (`once: true`) y sigue en
// uso en homepage-v2, que quedó dicho que no se toca. Es duplicación real y está
// declarada: el camino es migrar v2 cuando esto esté probado y ahí borrarlo.

const HEIGHTS = {
  default: "h-32 sm:h-48 lg:h-64",
  tall: "h-48 sm:h-72 lg:h-96",
} as const;

export type StairTransitionProps = {
  /** Color del fondo de la banda. Continúa la sección de arriba. */
  from: string;
  /** Color de los escalones. Anticipa la sección de abajo. */
  to: string;
  /**
   * Cuánta escalera hay en la SILUETA. `0` es una banda plana, `1` el perfil
   * completo. Ver `stairHeights`.
   */
  depth?: number;
  /**
   * Cuánta cascada hay en el GESTO. `0` es un barrido uniforme, `1` la cascada
   * completa. Ver `ringAdvance`.
   */
  lead?: number;
  /**
   * Dónde queda el escalón más alto. Dos transiciones que encierran una misma
   * sección tienen que llevar valores OPUESTOS para leerse como espejo; con el
   * mismo, la banda parece inclinada en vez de simétrica.
   */
  peak?: StairPeak;
  /**
   * Si la escalera se arma al entrar o se desarma al salir.
   *
   * Para que una sección se lea como una banda que se ABRE Y SE CIERRA, la
   * transición de arriba va en `enter` y la de abajo en `exit`. Y en la de
   * `exit` los colores van al revés: el `from` es el color de la sección que
   * VIENE y los escalones son el de la que se está dejando, porque lo que se
   * retira es el color viejo.
   */
  mode?: StairMode;
  /** Desde qué borde crecen los escalones. */
  grow?: "up" | "down";
  /**
   * Cuánto se marcan los escalones. `tall` es 1.5× en los tres breakpoints.
   *
   * Es un juego cerrado y no un número libre: hubo una prop de altura abierta y
   * terminó con dos secciones llevando escaleras de tamaños distintos, con lo que
   * el patrón dejó de leerse como el mismo elemento repetido. Los dos separadores
   * de una sección van siempre con el mismo valor.
   */
  height?: keyof typeof HEIGHTS;
  className?: string;
};

export default function StairTransition({
  from,
  to,
  depth = 1,
  lead = 1,
  peak = "edges",
  mode = "enter",
  grow = "up",
  height = "default",
  className = "",
}: StairTransitionProps) {
  const heights = stairHeights(depth, peak);
  const rings = stairRings(heights);
  const ringCount = Math.max(...rings) + 1;
  const origin = grow === "up" ? "bottom" : "top";

  const rootRef = useGsapContext<HTMLDivElement>(
    (_self, scope) => {
      const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
      const columns = q("[data-stair-col]");
      const mm = gsap.matchMedia();

      // ── El caso reduced-motion, que NO es "no hacer nada" ──────────────────
      // Sin esta rama los escalones se quedarían en el `scaleY: 0` de la otra, o
      // sea el divisor entero en blanco. La figura de reposo es la escalera ya
      // formada: se sostiene sola, sin animación que la explique, y es también lo
      // que se ve si el bundle falla.
      mm.add(MQ.reduce, () => {
        gsap.set(columns, { transformOrigin: origin, scaleY: 1 });
      });

      mm.add(MQ.motion, () => {
        // El estado de partida depende del gesto: la entrada arranca vacía y la
        // salida arranca formada. Ponerlo acá y no confiar solo en el `apply` de
        // más abajo evita un frame con la figura equivocada.
        gsap.set(columns, { transformOrigin: origin, scaleY: mode === "exit" ? 1 : 0 });

        // `quickSetter` y no un tween por columna: esto escribe en cada update de
        // scroll, y `scaleY` va al compositor —ni layout ni repintado—. Siete
        // escrituras por frame.
        const setScale = columns.map(
          (col) => gsap.quickSetter(col, "scaleY") as (v: number) => void
        );

        // El gesto es una FUNCIÓN DE LA POSICIÓN DE SCROLL, no una timeline con
        // eases. Es la diferencia que decide si el efecto se nota: probado antes
        // como reveal cronometrado, disparaba con el divisor casi fuera de cuadro
        // y se acababa en un segundo, así que para cuando el lector podía mirarlo
        // ya había terminado y la sección se leía completamente quieta.
        const apply = (progress: number) => {
          for (let i = 0; i < columns.length; i++) {
            setScale[i](
              ringAdvance({ progress, ring: rings[i], rings: ringCount, lead, mode })
            );
          }
        };

        // ── La invariante del recorrido ───────────────────────────────────────
        //
        // **El separador tiene que estar ENTERO en pantalla durante todo el gesto.**
        //
        // Suena obvio y es justo lo que fallaron las tres primeras versiones de
        // esto, cada una por una punta distinta. La trampa es que los anclajes
        // intuitivos —`top bottom`, `top top`— hablan del borde del separador que
        // TOCA el borde del viewport, y en ese instante el resto del separador está
        // del otro lado. Con un separador de 384px y un viewport de 1050:
        //
        //   `top bottom`  → ocupa [1050, 1434]: 384px fuera de cuadro por abajo
        //   `top 85%`     → ocupa [ 892, 1276]: 226px todavía fuera
        //   `top top`     → ocupa [   0,  384]: entero adentro, pero a punto de irse
        //
        // Y agrava que los escalones crecen DESDE ABAJO: con el borde inferior
        // fuera de cuadro, el crecimiento ocurre en la parte que no se ve, y lo
        // único que llega a la pantalla es el final del gesto.
        //
        // De ahí los anclajes de ahora, que cumplen la invariante en las dos
        // puntas:
        //
        //   ENTRADA  `bottom bottom` → `center 40%`
        //     arranca en el primer frame en que el separador está COMPLETO en
        //     pantalla, y termina con él en la mitad de arriba.
        //
        //   SALIDA   `top 45%` → `top top`
        //     arranca con el separador completo en la mitad de abajo y termina
        //     justo cuando toca el techo — el retiro se completa entero a la vista
        //     y recién después se va.
        //
        // Los porcentajes son del viewport, así que el recorrido escala solo: a
        // 1050px de alto la entrada dura ~438px de scroll y la salida ~472px.
        const range =
          mode === "exit"
            ? { start: "top 45%", end: "top top" }
            : { start: "bottom bottom", end: "center 40%" };

        const st = ScrollTrigger.create({
          trigger: scope,
          start: range.start,
          end: range.end,
          onUpdate: (self) => apply(self.progress),
        });

        // El estado inicial a mano: si la página carga con el divisor ya cruzado,
        // `onUpdate` no dispara hasta el primer movimiento y la escalera quedaría
        // sin formar encima de una sección que ya pasó.
        apply(st.progress);

        return () => gsap.set(columns, { clearProps: "transform" });
      });

      return () => mm.revert();
    },
    [depth, lead, peak, mode, grow]
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`relative overflow-hidden ${HEIGHTS[height]} ${className}`}
      style={{ backgroundColor: from }}
    >
      <div
        className={`absolute inset-x-0 flex h-full ${grow === "up" ? "items-end" : "items-start"}`}
      >
        {heights.map((h, i) => (
          <div
            key={i}
            data-stair-col
            className="flex-1"
            style={{ height: `${h}%`, backgroundColor: to }}
          />
        ))}
      </div>
    </div>
  );
}
