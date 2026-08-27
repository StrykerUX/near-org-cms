"use client";

import Container from "@/components/primitives/Container";
import { WordReveal } from "@/components/sections/closing-labs/shared";
import Rail from "@/components/sections/closing-labs/reveal/Rail";
import {
  PRESS_ITEMS,
  PRESS_TITLE,
} from "@/components/sections/closing-labs/pressContent";

// Las notas de prensa como recortes.
//
// ── La plica lleva el medio, y por eso acá no hay número ─────────────────────
//
// Es la excepción a la plica numerada del resto de la dirección, y tiene un
// motivo: tres notas de prensa NO son una serie —son las tres últimas, y la
// semana que viene son otras—, así que numerarlas prometería un orden que se
// rompe solo al publicar la cuarta.
//
// Lo que sí es verdadero de cada una es quién la publicó y cuándo. Eso ocupa el
// lugar del número, con la misma tipografía y en la misma columna, y la
// dirección sigue leyéndose igual: lo que cambió es que el rótulo dice algo.
//
// El `index` que `Rail` pide igual se pasa —es obligatorio— pero el rótulo lo
// come el medio. Ver la nota de abajo.
const DIM = "rgba(16,16,16,0.18)";
const LIT = "#101010";

export default function RevealPress() {
  return (
    <section className="bg-cream py-28 text-ink lg:py-40">
      <Container className="flex flex-col gap-20 lg:gap-28">
        <h2 className="text-h1 max-w-[14ch] text-balance">{PRESS_TITLE}</h2>

        <ul className="flex flex-col gap-20 lg:gap-24">
          {PRESS_ITEMS.map((item, i) => (
            <li key={item.id}>
              {/* `index` es el orden de publicación, no una posición en una
                  serie: se muestra igual porque la plica lo pide, pero lo que
                  el lector va a leer al lado es el medio. */}
              <Rail index={i + 1} label={item.outlet}>
                <a
                  href="#"
                  className="group flex flex-col gap-6 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ink"
                >
                  <WordReveal
                    text={item.title}
                    dim={DIM}
                    lit={LIT}
                    className="text-h2 max-w-[22ch] text-balance"
                    start="top 82%"
                    end="bottom 62%"
                  />

                  <span className="flex items-center gap-4">
                    <span className="text-caption-mono text-ink/50">{item.dateLabel}</span>
                    <span
                      aria-hidden="true"
                      className="h-px w-10 origin-left bg-ink/30 transition-transform duration-500 ease-out group-hover:scale-x-[2.4] motion-reduce:transition-none"
                    />
                    <span className="text-caption-mono uppercase text-ink/50 transition-colors duration-300 group-hover:text-ink motion-reduce:transition-none">
                      Read
                    </span>
                  </span>
                </a>
              </Rail>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
