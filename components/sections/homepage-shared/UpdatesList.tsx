"use client";

import { Plus } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// Copia de `components/sections/UpdatesList.tsx` con las microinteracciones de
// esta página. El original lo montan otras views y no se toca.
//
// ── Qué cambia ──────────────────────────────────────────────────────────────
//
// Solo el HOVER de la fila. La estructura, la copy y la grilla son las mismas.
//
// Estas tres filas son los únicos links de texto del recorrido, y hasta acá no
// respondían: el cursor cambiaba y nada más. Un listado que no acusa recibo se
// lee como una tabla, no como una lista de cosas a las que se puede ir.
//
// Lo que responde, y por qué son tres cosas y no una:
//
//   · **La regla se dibuja.** Un `scale-x` desde el borde izquierdo, no un
//     `text-decoration` que aparece de golpe. Es la diferencia entre subrayar y
//     recorrer — y recorrer es lo que hace el ojo cuando lee la fila.
//   · **El signo se convierte en destino.** El `+` gira un cuarto de vuelta y
//     se rellena: pasa de "hay más" a "entrá acá". Es el mismo elemento diciendo
//     dos cosas según el estado, en vez de dos elementos.
//   · **La fecha se apaga un escalón.** Mientras la fila está señalada, lo que
//     importa es el titular. Nada se mueve: solo cede foco.
//
// Los tres duran lo mismo (`duration-300`, el escalón `fast` de la gramática de
// esta página) y arrancan juntos. Escalonarlos sería coreografía, y una fila de
// listado no es un momento: es una respuesta.
//
// Nada de esto usa GSAP. Son cambios de ESTADO —hay hover o no lo hay— y el
// navegador ya los interpola; un tween por fila sería un contexto de animación
// por link a cambio de nada. `motion-reduce` los deja instantáneos, con el
// estado final intacto: quien pidió menos movimiento sigue viendo qué fila está
// señalando.
const UPDATES = [
  {
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    date: "August 02, 2026",
  },
  {
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    date: "July 24, 2026",
  },
  {
    title:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
    date: "June 15, 2026",
  },
];

export type UpdatesListProps = {
  /** El rótulo pequeño de arriba. */
  eyebrow?: string;
  /** El titular de la sección. */
  title?: string;
  /** Cuántas filas se muestran. Nunca más de las que hay. */
  rows?: number;
};

export default function UpdatesList({
  eyebrow = "Media",
  title = "NEAR in the news",
  rows = UPDATES.length,
}: UpdatesListProps = {}) {
  const rootRef = useScrollReveal<HTMLUListElement>();
  const items = UPDATES.slice(0, Math.max(1, Math.min(rows, UPDATES.length)));

  return (
    <section className="bg-cream text-foreground">
      {/* MISMA grilla de 3 columnas (y mismo gap-7) que las cards de
          LatestUpdates arriba: el listado arranca EXACTAMENTE donde arranca
          la segunda card — una sola estructura de columnas guiando la página. */}
      <Container className="grid gap-12 py-24 lg:grid-cols-3 lg:gap-7">
        <div className="flex flex-col gap-3">
          <Eyebrow className="text-foreground">{eyebrow}</Eyebrow>
          <h2 className="text-h2 text-pretty">{title}</h2>
        </div>

        <ul ref={rootRef} className="lg:col-span-2">
          {items.map((update, i) => (
            // El separador va como `border-b` de cada fila y no entre filas:
            // así hay línea también debajo de la última, como en la referencia.
            <li key={i} data-reveal className="border-b border-dotted border-border">
              <a
                href="#"
                className="group grid items-center gap-4 py-8 lg:grid-cols-[1fr_auto_auto] lg:gap-10"
              >
                {/* El titular y su regla. El `inline-block` de la regla no es
                    decorativo: un `scale-x` necesita una caja con ancho propio,
                    y sobre un `<span>` en flujo el transform no tendría contra
                    qué medir. Va como hermano del párrafo y no como
                    `text-decoration` porque el subrayado del navegador no se
                    puede animar de un extremo al otro.

                    `w-fit` para que la regla mida el TEXTO y no la columna: a
                    ancho completo se dibujaría por debajo del hueco que deja la
                    última línea, y el gesto se leería desalineado. */}
                <span className="flex w-fit max-w-[38ch] flex-col gap-1">
                  <p className="text-body text-pretty">{update.title}</p>
                  <span
                    aria-hidden="true"
                    className="h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                </span>

                {/* Ancho fijo para que las tres fechas queden alineadas entre
                    sí — con `auto` cada una mide distinto y el eje se rompe. */}
                <span className="text-body-sm text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/60 lg:w-40 lg:text-center">
                  {update.date}
                </span>

                {/* Negro SIEMPRE, no solo al hover — pedido. Lo que cambia es
                    el relleno y el cuarto de vuelta. */}
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground text-foreground transition-[transform,background-color,color] duration-300 ease-out group-hover:rotate-90 group-hover:bg-foreground group-hover:text-cream motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
                >
                  <Plus className="size-4" strokeWidth={1.5} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
