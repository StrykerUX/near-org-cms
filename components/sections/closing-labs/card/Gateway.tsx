"use client";

import Link from "next/link";
import { useState } from "react";

import Container from "@/components/primitives/Container";
import { ArrowDisc, CornerGlyphs, RAMPS } from "@/components/sections/closing-labs/shared";
import {
  GET_INTO_ROWS,
  GET_INTO_TITLE,
} from "@/components/sections/homepage-tuck/getIntoNearContent";

// Las tres puertas como un acordeón horizontal — el device de servicios de
// alura.framer.website.
//
// ── Por qué acá sí y en las otras cuatro direcciones no ──────────────────────
//
// Un acordeón cambia el trato: de tres opciones a la vista pasa a haber una
// abierta y dos cerradas, o sea que la sección ELIGE por el lector y el lector
// corrige. Eso está mal para las pruebas (seis datos que se comparan) y para
// las citas (cuatro voces sin jerarquía), y está bien acá: las tres puertas son
// excluyentes de verdad. Nadie entra por las tres.
//
// ── La barra de abajo mide la puerta abierta, no el progreso ─────────────────
//
// En alura es una barra naranja que avanza con el panel activo, y se lee como
// un progreso — lo cual, en una lista de servicios, promete un final que no
// existe. Acá la barra lleva la RAMPA de la puerta abierta: cambia de color al
// cambiar de panel en vez de crecer, así que dice «esta es la que está abierta»
// y no «vas por la segunda de tres».
//
// Es también el último lugar donde las tres rampas se ven completas a lo ancho,
// que era su tamaño en el artboard.
//
// ── Hover Y click, y por qué el panel es un `<button>` ───────────────────────
//
// El acordeón se abre al pasar por encima —es lo que hace la referencia y es lo
// que un mouse espera— pero un gesto que SOLO existe en hover deja fuera a
// quien navega con teclado y a cualquier pantalla táctil. El `<button>` da las
// tres cosas gratis: foco, `Enter`/`Space`, y un objetivo táctil real.
//
// El link a la puerta va DENTRO del panel abierto y no es el panel entero: si
// el panel fuera el link, abrirlo y entrar serían el mismo gesto y no habría
// forma de mirar la tercera sin navegar a ella.
export default function CardGateway() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-card-tint py-24 text-ink lg:py-32">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <header className="flex flex-col gap-4">
          <p className="text-caption-mono flex items-center gap-3 uppercase text-ink/60">
            <span aria-hidden="true" className="text-green-ink">
              ✦
            </span>
            Start here
          </p>
          <h2 className="text-h1 max-w-[16ch] text-balance">{GET_INTO_TITLE}</h2>
        </header>

        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-4 lg:h-[26rem] lg:flex-row">
            {GET_INTO_ROWS.map((row, i) => {
              const isOpen = i === open;

              return (
                <li
                  key={row.id}
                  onMouseEnter={() => setOpen(i)}
                  // `flex-[N]` con transición sobre `flex-grow`: el panel abierto
                  // se lleva 2.6 de 4.6 y los dos cerrados uno cada uno. Va en
                  // proporciones y no en anchos para que la fila siempre sume
                  // exactamente el ancho disponible, sin importar cuántas
                  // puertas haya.
                  className={`group relative flex min-h-[7rem] flex-col justify-between gap-8 overflow-hidden rounded-[20px] bg-cream p-6 pt-14 transition-[flex-grow] duration-500 ease-out motion-reduce:transition-none ${
                    isOpen ? "lg:flex-[2.6]" : "lg:flex-[1]"
                  }`}
                >
                  <CornerGlyphs className="text-ink/25" />

                  <span
                    aria-hidden="true"
                    className="text-rail pointer-events-none absolute -top-[0.28em] left-4 select-none text-ink/[0.06]"
                  >
                    {String(i + 1).padStart(3, "0")}
                  </span>

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(i)}
                    onFocus={() => setOpen(i)}
                    className="text-h3 relative text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                  >
                    {row.label}
                  </button>

                  {/* El cuerpo y el link no se desmontan al cerrarse el panel:
                      se apagan. Desmontarlos haría que el texto ENTRE cada vez
                      que el mouse pasa por encima —tres entradas por barrido— y
                      además lo sacaría del alcance de un lector de pantalla,
                      que no tiene hover con el cual abrirlo. */}
                  <div
                    // Las clases van LITERALES y no armadas con un template:
                    // Tailwind v4 escanea el fuente y `lg:` + `opacity-0` en
                    // dos pedazos nunca aparece como una clase que pueda
                    // emitir. En móvil el panel siempre está abierto —no hay
                    // acordeón— así que el apagado es solo de `lg` para arriba.
                    className={`relative flex flex-col gap-6 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? "lg:opacity-100" : "lg:opacity-0"
                    }`}
                  >
                    <p className="text-body max-w-[34ch] text-ink/70 text-pretty">
                      {row.body}
                    </p>
                    <Link
                      href={row.href}
                      // El foco ABRE el panel en vez de sacar el link del
                      // recorrido con `tabIndex={-1}`: apagado a `opacity-0`,
                      // un link que igual recibe foco es una trampa —el anillo
                      // aparece sobre nada—, y sacarlo del tab lo volvería
                      // inalcanzable en móvil, donde los tres paneles están
                      // abiertos y el estado dice que dos no.
                      onFocus={() => setOpen(i)}
                      className="text-label flex w-fit items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    >
                      Enter
                      <ArrowDisc className="text-ink" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Las tres rampas van SUPERPUESTAS y lo que cambia es cuál está
              opaca. Un solo elemento al que se le reescribe `backgroundImage`
              saltaría de color sin transición: un gradiente no interpola contra
              otro gradiente —CSS no sabe emparejar quince paradas con quince
              paradas— así que `transition` sobre `background-image` no hace
              absolutamente nada. Con tres capas, lo que se interpola es la
              opacidad, que sí sabe. */}
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
            {GET_INTO_ROWS.map((row, i) => (
              <span
                key={row.id}
                aria-hidden="true"
                style={{ backgroundImage: RAMPS[row.id] }}
                className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                  i === open ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
