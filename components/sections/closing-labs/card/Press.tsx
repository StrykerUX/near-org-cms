"use client";

import Container from "@/components/primitives/Container";
import { ArrowDisc, CornerGlyphs } from "@/components/sections/closing-labs/shared";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  PRESS_ITEMS,
  PRESS_TITLE,
} from "@/components/sections/closing-labs/pressContent";

// Las notas de prensa como fichas apiladas — la lista de proyectos de alura.
//
// ── Las filas se vuelven fichas, y eso cuesta el eje de fechas ───────────────
//
// `UpdatesList` alinea las tres fechas en una columna de ancho fijo: se pueden
// leer las tres de arriba abajo sin leer los titulares. Una ficha no tiene
// columnas —tiene un adentro— así que la fecha vuelve a estar donde termine el
// titular de cada una.
//
// Lo que se compra a cambio es que cada nota es un objeto que se puede tomar:
// se levanta al pasar por encima, tiene sus cuatro marcas de registro, tiene
// bordes. Es la diferencia entre un listado y tres recortes sobre la mesa, y en
// una sección que se llama «in the news» los recortes dicen más.
//
// ── Por qué acá no hay fantasma ──────────────────────────────────────────────
//
// Las otras tres fichas de esta dirección lo llevan. Estas no, y no es un
// olvido: el fantasma es el número de la ficha, y estas tres notas no tienen
// número —no son la 1, la 2 y la 3 de nada, son las tres últimas—. Ponerles
// `001 / 002 / 003` sería numerar una lista que se reordena sola la semana que
// viene, que es exactamente el error que el fantasma evita en `Numbers`.
export default function CardPress() {
  const rootRef = useScrollReveal<HTMLUListElement>();

  return (
    <section className="bg-card-tint py-24 text-ink lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <header className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--site-header-block)+2rem)] lg:h-fit">
          <p className="text-caption-mono flex items-center gap-3 uppercase text-ink/60">
            <span aria-hidden="true" className="text-green-ink">
              ✦
            </span>
            Media
          </p>
          <h2 className="text-h2 text-balance">{PRESS_TITLE}</h2>
        </header>

        <ul ref={rootRef} className="flex flex-col gap-4">
          {PRESS_ITEMS.map((item) => (
            <li key={item.id} data-reveal>
              <a
                href="#"
                className="group relative flex flex-col gap-8 overflow-hidden rounded-[20px] bg-cream p-6 pt-10 transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-8 lg:pt-12"
              >
                <CornerGlyphs className="text-ink/25" />

                <p className="text-h4 relative max-w-[40ch] text-pretty">{item.title}</p>

                <div className="relative flex items-center justify-between gap-6">
                  <p className="flex flex-col gap-1">
                    <span className="text-caption-mono uppercase text-ink">{item.outlet}</span>
                    <span className="text-micro-mono text-ink/50">{item.dateLabel}</span>
                  </p>
                  <ArrowDisc className="text-ink" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
