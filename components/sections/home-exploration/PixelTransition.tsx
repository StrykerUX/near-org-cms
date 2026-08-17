"use client";

import { useMemo } from "react";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import {
  PIXEL_BLEED,
  PIXEL_COLS,
  PIXEL_ROWS,
  cellReveal,
  pixelCells,
  type PixelMode,
  type PixelPattern,
  type PixelPeak,
} from "./pixelGrid";

// Transición de píxeles grandes entre dos secciones: una banda del color de
// arriba, con una retícula de píxeles del color de abajo que se da vuelta a
// medida que la banda cruza el viewport.
//
// Se intercala y ya — no hace falta saber GSAP para usarla:
//
//     <section>…</section>
//     <PixelTransition pattern="sweep" from="var(--cream)" to="var(--ink)" />
//     <section>…</section>
//
// La forma y el reloj viven en `./pixelGrid.ts`, que es puro; acá está el pintado
// y el enganche al scroll.
//
// ── Estado: LABORATORIO ──────────────────────────────────────────────────────
//
// Vive en `sections/home-exploration/` y no en `primitives/` a propósito: es el
// mismo camino que recorrió `StairTransition`, que salió del laboratorio de
// `/prototype/descent` y recién después subió a primitivo. Mientras esté acá, la
// usa UNA página y se puede romper sin auditar el sitio. El día que un patrón
// gane, se promueve a `primitives/PixelTransition.tsx` con solo el patrón que
// ganó — ver el README de esta carpeta.
//
// ── Por qué el transform sale de una CSS var y no de un tween ────────────────
//
// El scroll escribe UN número por píxel (`--t`), y el `transform` que lo lee está
// declarado una sola vez en el estilo inline de la celda. Son 100 `setProperty`
// por frame contra los 200 `quickSetter` que costaría animar `scale` e `y` por
// separado, y el navegador compone el resultado sin que GSAP tenga que tocar dos
// propiedades por nodo. `StairTransition` usa `quickSetter` porque tiene siete
// columnas y una sola propiedad; con 100 celdas y dos, la cuenta se da vuelta.

export type PixelTransitionProps = {
  /** Color del fondo de la banda. Continúa la sección de arriba. */
  from: string;
  /** Color de los píxeles. Anticipa la sección de abajo. */
  to: string;
  /** Qué decide el turno de cada píxel. Ver `pixelCells`. */
  pattern: PixelPattern;
  /**
   * Si la retícula se arma al entrar o se desarma al salir.
   *
   * Para que una sección se lea como una banda que se ABRE Y SE CIERRA, la
   * transición de arriba va en `enter` y la de abajo en `exit`. Y en la de `exit`
   * los colores van al revés: el `from` es el color de la sección que VIENE y los
   * píxeles son el de la que se está dejando, porque lo que se retira es el color
   * viejo. (Misma convención que `StairTransition`, a propósito.)
   */
  mode?: PixelMode;
  /** Dónde queda el escalón más alto. **Solo lo lee `pattern="stair"`.** */
  peak?: PixelPeak;
  className?: string;
};

export default function PixelTransition({
  from,
  to,
  pattern,
  mode = "enter",
  peak = "edges",
  className = "",
}: PixelTransitionProps) {
  const cells = useMemo(() => pixelCells(pattern, peak), [pattern, peak]);

  const rootRef = useGsapContext<HTMLDivElement>(
    (_self, scope) => {
      const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
      const nodes = q("[data-px]");
      const mm = gsap.matchMedia();

      // `MQ.motion` / `MQ.reduce` directo y NO `useMotionScope`: esta transición
      // se comporta igual en móvil que en desktop (los píxeles son una fracción
      // del ancho, así que escalan solos), y declarar `isDesktop` como condición
      // haría que cruzar los 1024px reconstruyera las cinco retículas de la
      // página sin que nadie lo pidiera. Es la regla de la tabla de
      // `components/sections/README.md`.

      // ── El caso reduced-motion, que NO es "no hacer nada" ──────────────────
      // Sin esta rama los píxeles se quedarían en el `--t: 0` del render y la
      // banda entera quedaría del color de arriba. La figura de reposo es la
      // retícula ya formada: se sostiene sola, sin animación que la explique, y
      // es también lo que se ve si el bundle falla.
      mm.add(MQ.reduce, () => {
        for (const node of nodes) node.style.setProperty("--t", "1");
        return () => {
          for (const node of nodes) node.style.removeProperty("--t");
        };
      });

      mm.add(MQ.motion, () => {
        // Emparejado por ÍNDICE con `cells`: `pixelCells` garantiza el orden y el
        // JSX lo respeta, así que no hace falta leer un `data-*` por frame ni
        // buscar la celda de cada nodo.
        const apply = (progress: number) => {
          for (let i = 0; i < nodes.length; i++) {
            nodes[i].style.setProperty("--t", String(cellReveal(progress, cells[i], mode)));
          }
        };

        // ── La invariante del recorrido ───────────────────────────────────────
        //
        // **El bloque tiene que estar ENTERO en pantalla durante todo el gesto.**
        //
        // Los anclajes son los de `StairTransition`, no una elección nueva: ahí
        // están documentados los tres intentos que fallaron y por qué los
        // anclajes intuitivos (`top bottom`, `top top`) hablan del borde que TOCA
        // el viewport, con el resto del bloque del otro lado. Acá el problema es
        // idéntico y la banda mide lo mismo, así que la respuesta también.
        //
        //   ENTRADA  `bottom bottom` → `center 40%`
        //   SALIDA   `top 45%`       → `top top`
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

        // El estado inicial a mano: si la página carga con el bloque ya cruzado,
        // `onUpdate` no dispara hasta el primer movimiento y la retícula quedaría
        // sin formar encima de una sección que ya pasó.
        apply(st.progress);

        return () => {
          for (const node of nodes) node.style.removeProperty("--t");
        };
      });

      return () => mm.revert();
    },
    [pattern, peak, mode]
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`relative w-full overflow-hidden ${className}`}
      // `aspectRatio` y no una altura: es lo que mantiene los píxeles CUADRADOS
      // en cualquier viewport. Ver la nota de `PIXEL_COLS`.
      style={{ backgroundColor: from, aspectRatio: `${PIXEL_COLS} / ${PIXEL_ROWS}` }}
    >
      <div
        className="grid h-full w-full"
        // Template inline y nunca clases Tailwind construidas con un template
        // string: Tailwind v4 no detecta clases generadas en runtime (mismo
        // criterio que `Container.tsx` y `ZigguratDivider.tsx`).
        style={{
          gridTemplateColumns: `repeat(${PIXEL_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${PIXEL_ROWS}, 1fr)`,
        }}
      >
        {cells.map((cell) => (
          <span
            key={`${cell.col}-${cell.row}`}
            data-px
            style={
              {
                // El estado de partida depende del gesto: la entrada arranca
                // vacía y la salida arranca formada. Declararlo acá y no confiar
                // solo en el `apply` del efecto evita un frame con la figura
                // equivocada.
                "--t": mode === "exit" ? "1" : "0",
                "--drift": String(cell.drift),
                backgroundColor: cell.accent ? "var(--near-green-accent)" : to,
                transform: `translateY(calc((1 - var(--t)) * var(--drift) * 100%)) scale(calc(var(--t) * ${PIXEL_BLEED}))`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
