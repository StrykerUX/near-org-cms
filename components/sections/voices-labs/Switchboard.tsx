"use client";

import { useState } from "react";

import Container from "@/components/primitives/Container";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";
import {
  VOICE_MARKS,
  VOICE_RAMP,
  VOICES_EYEBROW,
} from "@/components/sections/voices-labs/voicesLabContent";

// 02 · El conmutador — el índice del mazo, pero legible.
//
// ── El problema que viene a resolver ────────────────────────────────────────
//
// La sección viva declara que «el mazo ES el índice»: la card de adelante y la
// cita grande son la misma persona, y las de atrás son testimonios esperando
// turno. La idea es correcta y el mecanismo la contradice a medias — de las
// cards de atrás se ve una esquina y un nombre tapado, así que el índice existe
// pero no se puede LEER. Nadie sabe quiénes son los otros tres hasta que les
// toca, y no hay forma de ir a uno.
//
// Acá el índice es una lista de cuatro nombres, y el lector elige. Es la misma
// idea con el mecanismo dado vuelta: en vez de una escenografía que insinúa que
// hay más, cuatro renglones que dicen quiénes son.
//
// ── Lo que se pierde, dicho de frente ───────────────────────────────────────
//
// El movimiento. El mazo avanza solo y esa es la mitad de su presencia: la
// sección respira sin que nadie la toque. Un conmutador quieto en una página
// que se recorre puede pasar como un bloque estático, y quien no interactúe se
// lleva UNA cita de cuatro.
//
// No se compensa con autoplay a propósito. Un conmutador que además avanza solo
// se pelea con el lector: elegís a Mumtaz, leés medio renglón, y el bloque se
// va a otra persona. Si esta versión gana, la respuesta correcta es una entrada
// que muestre las cuatro y se detenga, no un temporizador.
//
// ── Las cuatro citas viven siempre en el DOM ────────────────────────────────
//
// Apiladas en una grilla de una celda, todas en la misma posición, y lo único
// que cambia es cuál está opaca. Montar y desmontar la activa haría que el
// bloque colapse a cero alto entre una y otra —las citas miden distinto— y la
// página entera pegaría un salto en cada cambio.
//
// Además deja el bloque de un alto fijo: el de la cita más larga. Es aire de
// más debajo de las cortas, y es el precio de que nada se mueva al conmutar.
//
// `aria-hidden` en las tres apagadas y `aria-live` en el contenedor: sin eso un
// lector de pantalla lee las cuatro citas seguidas y el conmutador no le dice
// nada.
//
// ⚠️ Dos de las cuatro citas son reconstrucciones y un cargo dice
// «Company xxx» — ver la cabecera de `testimonialDeckContent.ts`.
export default function VoicesSwitchboard() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-ink py-28 text-cream lg:py-40">
      <Container className="flex flex-col gap-16">
        <p className="text-caption-mono uppercase text-cream/50">{VOICES_EYEBROW}</p>

        <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-24">
          {/* El índice. Es un `<ul>` de botones y no un `<nav>`: no lleva a
              ningún lado, cambia lo que hay al lado — que es exactamente la
              diferencia entre navegación y control. */}
          <ul className="flex flex-col">
            {TESTIMONIALS.map((person, i) => {
              const isOn = i === active;

              return (
                <li key={person.id} className="relative border-t border-cream/12 last:border-b">
                  <button
                    type="button"
                    aria-pressed={isOn}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex w-full flex-col items-start gap-1 py-5 pl-5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cream motion-reduce:transition-none"
                  >
                    <span className={`text-h4 transition-colors duration-300 motion-reduce:transition-none ${isOn ? "text-cream" : "text-cream/45"}`}>
                      {person.name}
                    </span>
                    <span className={`text-caption-mono uppercase transition-colors duration-300 motion-reduce:transition-none ${isOn ? "text-cream/60" : "text-cream/30"}`}>
                      {VOICE_MARKS[person.id].company ?? person.role}
                    </span>
                  </button>

                  {/* La marca de la fila activa. Es la rampa verde puesta de
                      pie: un filete de 3px sobre el borde izquierdo del
                      renglón, que crece de arriba hacia abajo. Es lo único con
                      color del tramo oscuro, igual que en la sección viva —
                      allá es la píldora del cargo, acá es el cursor del
                      índice. */}
                  <span
                    aria-hidden="true"
                    style={{ backgroundImage: VOICE_RAMP }}
                    className={`absolute inset-y-0 left-0 w-[3px] origin-top rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none ${
                      isOn ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* El tablero. `grid` con una sola celda: las cuatro citas ocupan la
              MISMA celda (`col-start-1 row-start-1`), así que el bloque mide lo
              que mide la más larga y no cambia de alto al conmutar. */}
          <div aria-live="polite" className="grid">
            {TESTIMONIALS.map((person, i) => {
              const isOn = i === active;

              return (
                <figure
                  key={person.id}
                  aria-hidden={!isOn}
                  className={`col-start-1 row-start-1 flex flex-col justify-between gap-10 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                    isOn ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <blockquote className="text-h1 max-w-[18ch] text-balance">
                    “{person.quote}”
                  </blockquote>

                  <figcaption className="flex flex-col gap-3">
                    <span className="text-h2-serif italic">{person.name}</span>
                    <span className="text-caption-mono w-fit rounded-full border border-cream/20 px-4 py-1.5 uppercase text-cream/60">
                      {person.role}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
