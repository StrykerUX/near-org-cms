"use client";

import { useRef } from "react";

import Container from "@/components/primitives/Container";
import NightHeader from "@/components/sections/closing-labs/night/NightHeader";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";

// Las cuatro voces en un riel que se arrastra — la fila de testimonios de
// dreammotion.framer.website.
//
// ── Por qué el riel es scroll nativo y no un tween ───────────────────────────
//
// `TestimonialDeck` mueve las cards con GSAP porque el mazo es una escena: hay
// una card adelante, las de atrás están en perspectiva, y la que sale del
// frente se teletransporta al fondo. Eso no existe sin código.
//
// Un riel no es una escena: es una lista que no entra. Con
// `overflow-x-auto` + `scroll-snap` el navegador ya da el arrastre con inercia,
// el snap, el teclado, la rueda horizontal del trackpad y la barra de
// desplazamiento — cinco cosas que habría que reimplementar, peor, para llegar
// al mismo lugar. Los botones solo llaman a `scrollBy`.
//
// El ancho de paso se MIDE del primer hijo en vez de declararse: la card es
// `basis-[85%]` en móvil y `basis-[32%]` en desktop, así que un número fijo
// sería correcto en un breakpoint y falso en el otro.
//
// ── El contador `n/4` va en cada card, no debajo del riel ────────────────────
//
// Es de la referencia y es lo que lo hace útil: un indicador único debajo dice
// en cuál estás, y en un riel donde se ven tres a la vez eso no significa nada.
// Puesto en cada card dice cuántas hay y cuál es cada una, que es la pregunta
// que alguien se hace cuando ve una lista cortada por el borde de la pantalla.
//
// ⚠️ Dos de las cuatro citas son reconstrucciones y un cargo dice
// «Company xxx» — ver la cabecera de `testimonialDeckContent.ts`.
export default function NightVoices() {
  const trackRef = useRef<HTMLUListElement>(null);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;

    // `offsetWidth` de la card + el hueco REAL entre las dos primeras. Leer el
    // valor del `gap-4` a mano lo desincronizaría el día que la clase cambie.
    const second = card.nextElementSibling as HTMLElement | null;
    const gap = second ? second.offsetLeft - (card.offsetLeft + card.offsetWidth) : 0;
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <section className="bg-ink py-28 text-cream lg:py-40">
      <Container className="flex flex-col gap-16">
        <NightHeader
          eyebrow="Testimonials"
          lead="What the people building on NEAR say"
          tail="when we are not in the room."
        />

        <div className="flex flex-col gap-8">
          {/* `-mx` + `px` del mismo valor para que el riel sangre hasta el borde
              del viewport pero la primera card arranque alineada con el resto
              de la página. Sin eso la card cortada de la derecha termina justo
              en el gutter, y el riel se lee como una caja en vez de como una
              fila que sigue. */}
          <ul
            ref={trackRef}
            className="-mx-[60px] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[60px] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TESTIMONIALS.map((person, i) => (
              <li
                key={person.id}
                className="flex min-h-[18rem] shrink-0 basis-[85%] snap-start flex-col justify-between gap-10 rounded-[24px] border border-cream/10 bg-cream/[0.03] p-6 sm:basis-[48%] lg:basis-[32%]"
              >
                <blockquote className="text-body-lg text-cream/85 text-pretty">
                  “{person.quote}”
                </blockquote>

                <figcaption className="flex items-end justify-between gap-4 border-t border-cream/10 pt-4">
                  <span className="flex flex-col gap-1">
                    <span className="text-label">{person.name}</span>
                    <span className="text-caption text-cream/50">{person.role}</span>
                  </span>
                  <span aria-hidden="true" className="text-micro-mono text-cream/35">
                    {i + 1}/{TESTIMONIALS.length}
                  </span>
                </figcaption>
              </li>
            ))}
          </ul>

          <div className="flex justify-center gap-3">
            {/* Los dos botones existen SIEMPRE, también en las puntas del riel.
                Deshabilitarlos obligaría a escuchar el scroll para saber dónde
                está, y el premio sería quitarle al lector un botón que, apretado
                de más, simplemente no hace nada. */}
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous testimonial"
              className="flex size-10 items-center justify-center rounded-full bg-cream text-ink transition-transform duration-300 ease-out hover:-translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream motion-reduce:transition-none"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M13 8H3M7.5 3.5 3 8l4.5 4.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next testimonial"
              className="flex size-10 items-center justify-center rounded-full bg-cream text-ink transition-transform duration-300 ease-out hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream motion-reduce:transition-none"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M3 8h10M8.5 3.5 13 8l-4.5 4.5" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
