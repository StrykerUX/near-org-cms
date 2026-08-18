"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { enableScene } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 09 · Bento ───────────────────────────────────────────────────────────────
//
// La misma grilla 3×2 que la 01 y la 07, y la diferencia está en QUÉ se anima:
// acá no se mueve ningún elemento, se mueve la GRILLA. Apuntar una celda
// reparte de nuevo el espacio —su columna y su fila crecen, las demás se
// encogen— y el contenido va donde su celda lo lleve.
//
// Es la versión con la que comparar si el gesto tiene que estar en el contenido
// o puede estar en el continente. Ninguna cifra hace nada; lo único que pasa es
// que hay más sitio, y en ese sitio cabe el cuerpo del texto que en reposo no
// cabía.
//
// Cero recorrido: 100svh, sin sticky.
//
// ── Se anima `grid-template`, y eso tiene un costo que hay que mirar ────────
//
// Animar las pistas de un grid es re-hacer el layout de la sección en cada
// frame, no componer transforms en la GPU. Con seis celdas de texto corto sale
// gratis; con imágenes, incrustaciones o cien celdas, no saldría. La razón de
// hacerlo así igualmente es que la alternativa —transforms sobre las celdas—
// deforma el texto al escalar, y una cifra en serif itálica escalada a 1.7 se
// ve exactamente como lo que es: una imagen estirada.
//
// El tween va sobre UN elemento (el contenedor) y no sobre seis, así que el
// coste está acotado y el reparto no puede quedar inconsistente a mitad de
// animación.

const N = PROOF_STATS.length;
const COLS = 3;

// Reparto en reposo y con foco. Los `fr` suman lo mismo en los dos estados, así
// que la grilla no cambia de tamaño total: solo se reparte distinto.
const REST_COL = 1;
const HOT_COL = 1.9;
const COLD_COL = 0.55;

const REST_ROW = 1;
const HOT_ROW = 1.55;
const COLD_ROW = 0.45;

const tracks = (n: number, hot: number, hotValue: number, coldValue: number, rest: number) =>
  Array.from({ length: n }, (_, i) =>
    hot < 0 ? `${rest}fr` : `${i === hot ? hotValue : coldValue}fr`
  ).join(" ");

export default function BentoMosaic() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const grid = q("[data-grid]")[0];
    const cells = q("[data-cell]");
    const bodies = q("[data-body]");
    if (!grid || cells.length !== N) return;

    // El reparto solo existe en desktop: en una columna no hay nada que
    // repartir, y en móvil el hover ni siquiera es un gesto disponible.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "bento");

    const focus = (index: number) => {
      const col = index < 0 ? -1 : index % COLS;
      const row = index < 0 ? -1 : Math.floor(index / COLS);

      gsap.to(grid, {
        gridTemplateColumns: tracks(COLS, col, HOT_COL, COLD_COL, REST_COL),
        gridTemplateRows: tracks(2, row, HOT_ROW, COLD_ROW, REST_ROW),
        duration: 0.55,
        ease: EASE_OUT,
        overwrite: "auto",
      });

      // El cuerpo de la celda enfocada aparece; los demás se apagan. Se
      // conducen TODOS en cada cambio y no solo el entrante y el saliente: con
      // el puntero cruzando rápido, dos celdas pueden quedar abiertas a la vez.
      bodies.forEach((body, j) => {
        gsap.to(body, {
          autoAlpha: j === index ? 1 : 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    const handlers = cells.map((cell, i) => {
      const enter = () => focus(i);
      cell.addEventListener("pointerenter", enter);
      cell.addEventListener("focusin", enter);
      return { cell, enter };
    });

    // El reposo se restaura al salir de la GRILLA, no de cada celda: por celda,
    // cruzar de una a la vecina pasaría por un reposo de un frame y la grilla
    // temblaría en cada movimiento.
    const onLeave = () => focus(-1);
    // `focusout` sube desde la celda; solo cuenta si el foco se fue de la
    // grilla entera. Nombrado y no inline: un handler anónimo no se puede
    // quitar en el cleanup, y este scope se reconstruye cada vez que cambia
    // `prefers-reduced-motion` o se cruzan los 1024px.
    const onFocusOut = (event: Event) => {
      const next = (event as FocusEvent).relatedTarget as Node | null;
      if (!next || !grid.contains(next)) onLeave();
    };
    grid.addEventListener("pointerleave", onLeave);
    grid.addEventListener("focusout", onFocusOut);

    focus(-1);

    return () => {
      handlers.forEach(({ cell, enter }) => {
        cell.removeEventListener("pointerenter", enter);
        cell.removeEventListener("focusin", enter);
      });
      grid.removeEventListener("pointerleave", onLeave);
      grid.removeEventListener("focusout", onFocusOut);
      gsap.killTweensOf([grid, ...bodies]);
      gsap.set([grid, ...bodies], { clearProps: "all" });
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="group/bento flex min-h-svh flex-col justify-center gap-10 bg-cream py-20 text-ink"
    >
      <Container className="flex items-baseline justify-between gap-8">
        <Eyebrow className="text-gray-intermediate">Built to</Eyebrow>
        <p className="text-caption-mono text-gray-intermediate">
          la celda apuntada se lleva el espacio de las otras
        </p>
      </Container>

      <Container>
        <div
          data-grid
          // El alto fijo es lo que hace que el reparto se VEA: sin él, la fila
          // que crece empuja a la de abajo y la sección entera cambia de
          // tamaño, que es un movimiento distinto (y mucho peor: mueve el
          // scroll de la página).
          className="grid grid-cols-1 gap-px bg-rule group-data-[bento=on]/bento:h-[68svh] lg:grid-cols-3"
        >
          {PROOF_STATS.map((s) => (
            <article
              key={s.id}
              data-cell
              tabIndex={0}
              className="flex min-w-0 flex-col justify-between gap-6 overflow-hidden bg-cream p-8 focus:outline-none focus-visible:bg-background"
            >
              <p className="text-h4 text-gray-intermediate">{s.eyebrow}</p>

              {/* La cifra no se escala nunca: lo que cambia es cuánto sitio
                  tiene. Si además creciera, el gesto sería doble y no se
                  entendería cuál de los dos es la respuesta al puntero. */}
              <p className="text-h2-serif italic text-balance">
                {s.value}
                <span className="text-green-ink">{s.accent}</span>
              </p>

              <p
                data-body
                className="max-w-[42ch] text-body-sm text-gray-intermediate text-pretty group-data-[bento=on]/bento:opacity-0"
              >
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
