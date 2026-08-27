"use client";

import Container from "@/components/primitives/Container";
import { WordReveal } from "@/components/sections/closing-labs/shared";
import Rail from "@/components/sections/closing-labs/reveal/Rail";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";

// Las cuatro voces, una debajo de la otra, encendiéndose al leerlas.
//
// ── Por qué esta sección es la que mejor le queda al barrido ─────────────────
//
// Encender un párrafo palabra por palabra es, literalmente, la velocidad a la
// que alguien lee en voz alta. En una prueba técnica eso es un adorno —el dato
// no se lee, se consulta— pero en una CITA es el gesto mismo: el texto aparece
// al ritmo en que se dijo.
//
// Por eso acá el barrido se come el bloque entero y no solo el cuerpo, y por
// eso las citas van al tamaño de un titular. Es la única de las cuatro
// secciones donde esta dirección no está aplicando un estilo: está haciendo lo
// que la sección quiere decir.
//
// ── El nombre no se enciende ─────────────────────────────────────────────────
//
// Queda fijo en la plica, a la izquierda, ya legible cuando la cita todavía
// está apagada. Es lo que evita el efecto de subtítulo anónimo: se sabe quién
// habla ANTES de que empiece a hablar, que es como funciona una cita atribuida.
//
// ⚠️ Dos de las cuatro citas son reconstrucciones y un cargo dice
// «Company xxx» — ver la cabecera de `testimonialDeckContent.ts`.
const DIM = "rgba(16,16,16,0.16)";
const LIT = "#262626";

export default function RevealVoices() {
  return (
    <section className="bg-cream py-28 text-ink lg:py-40">
      <Container className="flex flex-col gap-24 lg:gap-36">
        {TESTIMONIALS.map((person, i) => (
          <Rail key={person.id} index={i + 1} label={person.role}>
            <figure className="flex flex-col gap-8">
              {/* Las comillas las pone el tratamiento y no el dato — misma
                  regla que en `testimonialDeckContent.ts`. Van FUERA del texto
                  que se parte en palabras: SplitText las tomaría como parte de
                  la primera y la última, y las dos quedarían apagadas medio
                  segundo de más. */}
              <blockquote className="relative">
                <span
                  aria-hidden="true"
                  className="text-h2-serif absolute -left-6 top-0 text-ink/20 lg:-left-8"
                >
                  “
                </span>
                <WordReveal
                  text={person.quote}
                  dim={DIM}
                  lit={LIT}
                  className="text-h2 max-w-[24ch] text-balance"
                  start="top 82%"
                  end="bottom 62%"
                />
              </blockquote>

              <figcaption className="text-h3-serif italic text-ink/80">
                {person.name}
              </figcaption>
            </figure>
          </Rail>
        ))}
      </Container>
    </section>
  );
}
