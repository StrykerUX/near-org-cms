"use client";

import Marquee from "@/components/primitives/Marquee";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";
import {
  VOICE_MARKS,
  VOICE_RAMP,
  VOICES_EYEBROW,
} from "@/components/sections/voices-labs/voicesLabContent";

// 01 · La cinta — las cuatro voces pasando de largo.
//
// ── Qué cambia contra el mazo ───────────────────────────────────────────────
//
// El mazo de la sección viva tiene UNA cita adelante y tres esperando turno en
// perspectiva; la columna izquierda es esa card leída en voz alta. Es una
// puesta en escena y su fuerza es que hay una voz por vez.
//
// La cinta hace lo contrario y por eso vale compararlas: no hay voz principal,
// no hay columna, no hay profundidad. Cuatro cards del mismo tamaño cruzando la
// pantalla, y lo que la sección dice ya no es «escuchá a esta persona» sino
// «hay más de las que entran». Es la diferencia entre una entrevista y una
// pared de recortes.
//
// El precio está declarado: se pierde la cita grande, que hoy es el único
// momento tipográfico del final de la página. Lo que se gana es que la empresa
// entra al cuadro — y en un testimonio de negocio, quién firma pesa tanto como
// qué dijo.
//
// ── Por qué la cinta y no un carrusel con flechas ───────────────────────────
//
// Un carrusel le pide al lector que avance. Con cuatro citas de veinte palabras
// eso es pedirle cuatro clics para leer ochenta palabras que caben en una
// pantalla y media. La cinta no pide nada: pasa, y quien quiera leer una la
// lee.
//
// `Marquee` ya resuelve el loop sin salto (doble juego de items + `xPercent:
// -50`), la pausa fuera de pantalla y la degradación con `prefers-reduced-
// motion`, donde el track se vuelve navegable a mano en vez de quedarse quieto
// mostrando siempre las mismas dos cards.
//
// ── El color va en UNA card ─────────────────────────────────────────────────
//
// La referencia tiene una verde, una negra y el resto grises, y ese reparto es
// lo que hace que la cinta se lea como una cinta: si todas fueran del mismo
// tono sería una textura, y si todas tuvieran color sería un semáforo. Dos
// acentos entre cuatro dan un ritmo que se nota al pasar sin obligar a mirar
// ninguna.
//
// Cuál lleva cuál sale de `VOICE_MARKS` y no del índice — el porqué está ahí.
//
// ⚠️ Ninguna de las cuatro empresas tiene logotipo en el repo: el wordmark está
// compuesto en la serif del sitio. Ver la cabecera de `voicesLabContent.ts`.

const SURFACE = {
  plain: "bg-bar text-ink",
  ink: "bg-ink text-cream",
  ramp: "text-ink",
} as const;

const MUTED = {
  plain: "text-ink/55",
  ink: "text-cream/55",
  ramp: "text-ink/60",
} as const;

const GLYPH = {
  plain: "text-ink/25",
  ink: "text-cream/30",
  ramp: "text-ink/30",
} as const;

export default function VoicesRibbon() {
  const cards = TESTIMONIALS.map((person) => {
    const mark = VOICE_MARKS[person.id];
    const { accent } = mark;

    return (
      <article
        key={person.id}
        style={accent === "ramp" ? { backgroundImage: VOICE_RAMP } : undefined}
        className={`flex h-full w-[clamp(19rem,30vw,30rem)] flex-col justify-between gap-10 rounded-[24px] p-7 lg:p-8 ${SURFACE[accent]}`}
      >
        <header className="flex items-start justify-between gap-6">
          {/* El wordmark ocupa el lugar del logotipo. Cuando no hay empresa
              —«Company xxx» en el artboard— cae al nombre de la persona en vez
              de dejar el hueco: una card sin nada arriba a la izquierda se lee
              como un error de carga, no como un dato que falta. */}
          <p className="text-h3-serif italic">{mark.company ?? person.name}</p>
          <span aria-hidden="true" className={`text-h1-serif ${GLYPH[accent]}`}>
            ”
          </span>
        </header>

        <div className="flex flex-col gap-6">
          {/* Sin comillas acá: ya está la grande arriba a la derecha. Dos
              juegos de comillas sobre el mismo texto es puntuar dos veces. */}
          <blockquote className="text-body text-pretty">{person.quote}</blockquote>

          <figcaption className="flex flex-col gap-1">
            <span className="text-label">{person.name}</span>
            <span className={`text-caption ${MUTED[accent]}`}>{person.role}</span>
          </figcaption>
        </div>
      </article>
    );
  });

  return (
    <section className="bg-cream py-24 text-ink lg:py-32">
      <div className="mx-auto mb-14 flex w-full max-w-[1780px] flex-col gap-4 px-[60px]">
        <p className="text-caption-mono uppercase text-ink/55">{VOICES_EYEBROW}</p>
        <h2 className="text-h2 max-w-[22ch] text-balance">
          The people building on NEAR say it better than we do.
        </h2>
      </div>

      {/* A sangre y sin `Container`: una cinta que empieza y termina dentro del
          gutter no es una cinta, es una fila. Lo que la hace leerse como algo
          que sigue más allá del cuadro es justamente que las cards se cortan
          contra el borde del viewport. */}
      <Marquee
        items={cards}
        speedSeconds={70}
        itemClassName="mr-4 flex shrink-0 self-stretch"
      />
    </section>
  );
}
