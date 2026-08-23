"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// COMBO G · Board — las secciones 2 y 3 son UN tablero.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// Es la única de las cinco que no tiene sección 2 y sección 3: tiene una sola
// superficie dividida en celdas, donde el título, las seis cifras y las tres
// propiedades son piezas del mismo tablero y se leen a la vez.
//
// Va con G —la apertura clara— por un motivo concreto: G abre en crema y su
// riesgo declarado es que el fondo se vea plano. Un tablero de filetes es lo
// contrario de plano sin necesidad de una sola textura: la estructura misma es
// el dibujo.
//
// ── El tablero es asimétrico a propósito ──────────────────────────────────
//
// Cuatro filas sobre las doce columnas, y ninguna se divide igual que la
// anterior: 5+7, después 5+3+4, después 3+4+5, después 3+4+5. Un tablero de
// celdas iguales es una tabla, y una tabla ya la propone el combo Ledger. Acá lo
// que se busca es que el ojo salte y no barra.
//
// La primera cifra es la única que se lleva siete columnas y el cuerpo grande:
// es la que abre y la que fija que esto se lee por celdas, no por filas.
//
// ── Los filetes salen del gap, no de los bordes ───────────────────────────
//
// El contenedor va con `gap-px` sobre un fondo de color de filete, y cada celda
// pinta su propio crema encima. Las líneas que se ven son el fondo asomando por
// las juntas.
//
// Se hace así y no con `border` por dentro porque en una retícula irregular los
// bordes se duplican donde dos celdas se tocan y desaparecen donde una celda
// linda con el borde del tablero: hay que ir celda por celda decidiendo cuáles
// llevan borde, y cualquier cambio de layout lo rompe en silencio.
//
// **La condición que esto impone: las cuatro filas tienen que sumar doce
// columnas exactas.** Si una fila queda corta, el hueco no se ve como espacio
// vacío sino como un bloque del color del filete. Es el precio de la técnica y
// está verificado fila por fila en el mapa de abajo.
//
// ── En móvil no hay tablero ───────────────────────────────────────────────
//
// A 375px doce columnas no existen y un tablero de una columna es una lista.
// Debajo de `lg` las celdas se apilan y los filetes vuelven a ser un borde
// superior por celda — la misma lectura, con la única geometría que cabe.

// Mapa literal de posiciones. Nunca template strings: Tailwind v4 purga las
// clases que se arman en tiempo de ejecución.
//
// Las cuatro filas, verificadas: (5+7) · (5+3+4) · (3+4+5) · (3+4+5).
const STAT_CELL = [
  "lg:col-start-6 lg:col-end-13 lg:row-start-1",
  "lg:col-start-6 lg:col-end-9 lg:row-start-2",
  "lg:col-start-9 lg:col-end-13 lg:row-start-2",
  "lg:col-start-1 lg:col-end-4 lg:row-start-3",
  "lg:col-start-4 lg:col-end-8 lg:row-start-3",
  "lg:col-start-8 lg:col-end-13 lg:row-start-3",
] as const;

const POINT_CELL = [
  "lg:col-start-1 lg:col-end-4 lg:row-start-4",
  "lg:col-start-4 lg:col-end-8 lg:row-start-4",
  "lg:col-start-8 lg:col-end-13 lg:row-start-4",
] as const;

// La celda: crema propio sobre el fondo de filete, y su padding. Se declara una
// vez porque doce celdas repitiendo la misma cadena divergen al primer ajuste.
const CELL = "flex flex-col bg-cream p-6 lg:p-7";

export default function BoardScale() {
  const numbers = useCountUp<HTMLDivElement>({ stagger: 0.06, start: "top 85%" });
  const board = useScrollReveal<HTMLDivElement>({ y: 14, stagger: 0.05 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="py-24 lg:py-28">
        <div
          ref={board}
          className="grid gap-px bg-rule lg:grid-cols-12 lg:grid-rows-[auto_auto_auto_auto]"
        >
          {/* La celda del título, alto de dos filas: es lo que hace que la
              columna izquierda del tablero no sea una fila más. */}
          <div
            data-reveal
            className={`${CELL} justify-between gap-8 lg:col-start-1 lg:col-end-6 lg:row-start-1 lg:row-end-3`}
          >
            <p className="uppercase text-eyebrow-mono text-gray-intermediate">La evidencia</p>
            <div className="flex flex-col gap-5">
              <h2 className="text-h2 text-pretty">
                {AI_SCALE.title.lead}
                <br />
                <Accent>{AI_SCALE.title.accent}</Accent>
              </h2>
              <p className="max-w-[34ch] text-body text-ink-soft text-pretty">{AI_SCALE.body}</p>
            </div>
          </div>

          {/* Las seis cifras. El `ref` del contador va en un wrapper que no
              existe como caja: `display: contents` deja a las celdas hijas
              colocándose contra la retícula del tablero, no contra él. Sin eso
              habría que poner el contador en el tablero entero y buscaría
              también en las celdas de texto. */}
          <div ref={numbers} className="contents">
            {PROOF.map((stat, i) => (
              <div key={stat.id} data-reveal className={`${CELL} justify-end gap-2 ${STAT_CELL[i]}`}>
                <dl className="flex flex-col gap-2">
                  {/* La primera se lleva el cuerpo grande. Es la que abre el
                      tablero y la que dice que esto se lee por celdas. */}
                  <dd
                    data-count={stat.value}
                    className={`tabular-nums text-green-ink ${i === 0 ? "text-h1" : "text-h3"}`}
                  >
                    {stat.value}
                  </dd>
                  <dt className="uppercase text-micro-mono text-gray-intermediate">
                    {stat.label}
                  </dt>
                  {stat.note && (
                    <dd className="text-micro-mono text-gray-intermediate text-pretty">
                      {stat.note}
                    </dd>
                  )}
                </dl>
              </div>
            ))}
          </div>

          {/* Las tres propiedades, en la fila de abajo. Mismo sistema de celdas:
              lo que las distingue de las cifras no es el marco sino el registro
              tipográfico — sans a cuerpo de texto contra número grande. */}
          {AI_SCALE.points.map((p, i) => (
            <div key={p.title} data-reveal className={`${CELL} gap-3 ${POINT_CELL[i]}`}>
              <span className="uppercase text-micro-mono text-gray-intermediate">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h4 text-pretty">{p.title}</h3>
              <p className="max-w-[38ch] text-body-sm text-ink-soft text-pretty">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
