"use client";

import { useState } from "react";

import Container from "@/components/primitives/Container";
import { ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";
import {
  VOICE_MARKS,
  VOICE_RAMP,
  VOICES_EYEBROW,
} from "@/components/sections/voices-labs/voicesLabContent";

// 03 · La sala — una voz por pantalla, y el scroll pasa de una a la otra.
//
// ── La apuesta ──────────────────────────────────────────────────────────────
//
// Es la versión que le da MÁS lugar a cada cita: una pantalla entera, la frase
// a tamaño de titular, nada más en el cuadro. Contra el mazo, que muestra una
// grande y tres esperando, acá no hay nada esperando — el que scrollea recibe
// las cuatro de a una, en orden, y no puede saltearse ninguna.
//
// Eso es lo que la hace la más arriesgada de las cuatro: gasta cuatro pantallas
// de scroll en ochenta palabras. Vale la pena si estas citas son el argumento
// del final de la página; es carísimo si son un respaldo.
//
// ── `sticky`, nunca `pin` ───────────────────────────────────────────────────
//
// Doctrina del repo, y el motivo está escrito en `StackAnchors`: `pin: true`
// reescribe el layout —envuelve el elemento, le fija alto, mete un spacer— y
// eso pelea con Lenis y con cualquier `clip-path` de una sección vecina.
// `position: sticky` lo hace el navegador y no toca el flujo.
//
// La consecuencia práctica: **ningún ancestro de la escena puede tener
// `overflow` distinto de `visible`**, o el sticky deja de pegarse sin error y
// sin aviso.
//
// ── Cómo degrada, que acá es la parte delicada ──────────────────────────────
//
// Tres estados y los tres tienen que quedar legibles:
//
//   · **Con JS y con movimiento** — el riel de 400svh, la escena pegada, y el
//     ScrollTrigger encendiendo una cita por tramo.
//   · **Sin JS** — el riel y la escena siguen ahí (son CSS), pero no hay quién
//     mueva el índice. Por eso las cuatro citas arrancan OPACAS y el apagado se
//     aplica recién cuando el trigger existe, vía `data-driven` en el
//     contenedor. Sin JS se ven las cuatro superpuestas, que es feo pero
//     legible; con el apagado de arranque se vería una sola y tres pantallas en
//     blanco.
//   · **`prefers-reduced-motion`** — `motion-reduce:` desarma la escena entera
//     en CSS: el riel vuelve a `h-auto`, la escena deja de ser `sticky`, y las
//     citas salen de la celda compartida (`col-start-auto`) para apilarse en
//     flujo normal. No hace falta ningún estado de React para eso.
//
// `data-driven` se pone DESPUÉS de crear el trigger y solo cambia opacidades:
// no toca el alto de nada, así que no invalida las medidas que el
// ScrollTrigger acaba de tomar.
//
// ⚠️ Dos de las cuatro citas son reconstrucciones y un cargo dice
// «Company xxx» — ver la cabecera de `testimonialDeckContent.ts`.
export default function VoicesStage() {
  const [active, setActive] = useState(0);
  const [driven, setDriven] = useState(false);

  const rootRef = useMotionScope<HTMLElement>(({ scope, motionOk }) => {
    if (!motionOk) return;

    const track = scope.querySelector<HTMLElement>("[data-stage-track]");
    if (!track) return;

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // El progreso se parte en N tramos iguales. El `min` es por el borde:
        // en `progress === 1` exacto, `floor` daría N y el índice se saldría
        // del array — pasa cada vez que alguien llega al final del riel.
        const i = Math.min(
          TESTIMONIALS.length - 1,
          Math.floor(self.progress * TESTIMONIALS.length),
        );
        setActive(i);
      },
      markers: DEBUG_MARKERS,
    });

    setDriven(true);

    return () => {
      st.kill();
      setDriven(false);
      setActive(0);
    };
  }, []);

  return (
    <section ref={rootRef} className="bg-ink text-cream">
      <div data-stage-track className="relative h-[400svh] motion-reduce:h-auto">
        <div className="sticky top-0 flex h-svh flex-col justify-center motion-reduce:static motion-reduce:h-auto motion-reduce:py-28">
          <Container className="flex flex-col gap-16">
            <p className="text-caption-mono uppercase text-cream/50">{VOICES_EYEBROW}</p>

            <div
              data-driven={driven ? "" : undefined}
              className="group/stage grid motion-reduce:gap-20"
            >
              {TESTIMONIALS.map((person, i) => {
                const isOn = i === active;

                return (
                  <figure
                    key={person.id}
                    aria-hidden={driven && !isOn}
                    className={`col-start-1 row-start-1 flex flex-col gap-10 transition-opacity duration-500 ease-out motion-reduce:col-start-auto motion-reduce:row-start-auto motion-reduce:transition-none ${
                      isOn
                        ? "group-data-[driven]/stage:opacity-100"
                        : "group-data-[driven]/stage:opacity-0"
                    }`}
                  >
                    <blockquote className="text-statement max-w-[16ch] text-balance">
                      “{person.quote}”
                    </blockquote>

                    <figcaption className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                      <span className="text-h2-serif italic">{person.name}</span>
                      <span className="text-caption-mono uppercase text-cream/55">
                        {VOICE_MARKS[person.id].company
                          ? `${person.role} · ${VOICE_MARKS[person.id].company}`
                          : person.role}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            {/* El riel de posición. Cuatro tramos y no un punto por cita: un
                punto dice «vas por la tercera», un tramo que se llena dice
                además cuánto falta para la próxima — que en una escena movida
                por scroll es la información que el lector necesita para saber
                si le conviene seguir bajando.

                Se esconde con `prefers-reduced-motion`: sin escena pegada las
                cuatro citas están apiladas a la vista, y un indicador de
                posición sobre algo que se ve entero no indica nada. */}
            <ol
              aria-hidden="true"
              className="flex items-center gap-3 motion-reduce:hidden"
            >
              {TESTIMONIALS.map((person, i) => (
                <li key={person.id} className="flex flex-1 items-center gap-3">
                  <span className="h-px flex-1 overflow-hidden bg-cream/20">
                    <span
                      style={i <= active ? { backgroundImage: VOICE_RAMP } : undefined}
                      className={`block h-full origin-left transition-transform duration-500 ease-out ${
                        i <= active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                  <span
                    className={`text-micro-mono transition-colors duration-500 ${
                      i === active ? "text-cream" : "text-cream/35"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ol>
          </Container>
        </div>
      </div>
    </section>
  );
}
