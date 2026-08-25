"use client";

import Container from "@/components/primitives/Container";
import { CornerGlyphs } from "@/components/sections/closing-labs/shared";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";

// Las cuatro voces como fichas, con el fantasma marcando el turno.
//
// ── Acá el fantasma sí es un índice, y por eso es legítimo ───────────────────
//
// En `Numbers` el fantasma repite el dato. Acá no hay dato que repetir, así que
// lleva la posición: `01`, `02`, `03`, `04`. Es la única de las cinco
// direcciones donde estas cuatro citas están numeradas, y funciona porque las
// fichas van en dos filas — sin el número, la de abajo a la izquierda no tiene
// forma de decir si va antes o después de la de arriba a la derecha.
//
// En `grid/Voices` el mismo número aparece como `//01` y significa otra cosa:
// allá es una referencia de archivo en una tabla de cuatro renglones donde el
// orden ya lo da la vertical. Mismo número, dos trabajos distintos.
//
// ── La ficha de la primera cita es más ancha ─────────────────────────────────
//
// Ocupa dos columnas y las otras tres una. No es jerarquía editorial —ninguna
// de las cuatro vale más— sino ritmo: cuatro fichas idénticas en una grilla de
// cuatro es un tablero, y un tablero de citas se lee como una lista de
// referencias. Con una ancha, la grilla tiene un punto de entrada.
//
// La consecuencia es que el ORDEN importa: si mañana se agrega una quinta cita,
// el ancho tiene que seguir cayendo en la primera, no en la que quede primera
// por casualidad. Por eso el ancho sale del índice y no de un campo en la copy.
//
// ⚠️ Dos de las cuatro citas son reconstrucciones y un cargo dice
// «Company xxx» — ver la cabecera de `testimonialDeckContent.ts`.
export default function CardVoices() {
  return (
    <section className="bg-card-tint py-24 text-ink lg:py-32">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <header className="flex flex-col gap-4">
          <p className="text-caption-mono flex items-center gap-3 uppercase text-ink/60">
            <span aria-hidden="true" className="text-green-ink">
              ✦
            </span>
            Testimonials
          </p>
          <h2 className="text-h2 max-w-[22ch] text-balance">
            The people building on NEAR say it better than we do.
          </h2>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((person, i) => (
            <li
              key={person.id}
              className={`group relative flex flex-col justify-between gap-12 overflow-hidden rounded-[20px] bg-cream p-6 pt-14 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                i === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <CornerGlyphs className="text-ink/25" />

              <span
                aria-hidden="true"
                className="text-rail pointer-events-none absolute -top-[0.28em] left-4 select-none text-ink/[0.06]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <blockquote
                className={`relative text-pretty ${i === 0 ? "text-h3 max-w-[26ch]" : "text-body-lg"}`}
              >
                “{person.quote}”
              </blockquote>

              {/* El filete arriba del pie es de la card de dreammotion, y es lo
                  único que se le tomó a esa referencia en esta dirección: sin
                  él, cita y firma son dos párrafos del mismo bloque y la firma
                  se lee como el final de la frase. */}
              <figcaption className="relative flex flex-col gap-1 border-t border-ink/10 pt-4">
                <span className="text-label">{person.name}</span>
                <span className="text-caption-mono text-ink/55">{person.role}</span>
              </figcaption>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
