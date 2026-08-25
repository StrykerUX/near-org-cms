"use client";

import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { TESTIMONIALS } from "@/components/sections/homepage-tuck/testimonialDeckContent";
import {
  VOICE_MARKS,
  VOICE_RAMP,
  VOICES_EYEBROW,
} from "@/components/sections/voices-labs/voicesLabContent";

// 04 · Las firmas — la barra de logos que aprendió a hablar.
//
// ── De dónde sale ───────────────────────────────────────────────────────────
//
// De lo único que la referencia de la cinta trae y ninguna versión anterior
// tenía: **la empresa dentro del cuadro**. Las cinco de `closing-labs/` y la
// sección viva muestran persona y cargo; ninguna muestra la marca que firma.
//
// Esta versión lleva esa idea al extremo opuesto de la cinta: en vez de cards
// que pasan, una banda quieta donde la EMPRESA es el objeto principal —
// compuesta grande, arriba de todo— y la cita es su epígrafe. Es una barra de
// logos de las de siempre, esa que dice «confían en nosotros», salvo que cada
// logo trae abajo lo que esa gente dijo.
//
// ── Por qué la cita se achica ───────────────────────────────────────────────
//
// Es deliberado y es el costo de la versión. En una banda de cuatro columnas,
// una cita al tamaño con el que se lee de verdad ocupa ocho líneas y la banda
// se convierte en cuatro párrafos con un título — que es una grilla de cards
// sin bordes, o sea `card/Voices` peor resuelta.
//
// Al achicarse, la cita cambia de rol: deja de ser algo que se lee de corrido y
// pasa a ser algo que se CONSULTA, como el pie de una foto. Lo que la sección
// afirma a un metro de distancia son las cuatro marcas; lo que dijeron se lee
// si uno se acerca. Si estas citas son el argumento del cierre, ésta es la peor
// de las cuatro versiones. Si son respaldo, es la más eficiente: cuatro pruebas
// en una banda de una pantalla de alto.
//
// ── La rampa cierra la banda ────────────────────────────────────────────────
//
// Un filete de 2px a lo ancho de las cuatro columnas, abajo de todo. No
// distingue una columna de otra —no hay tres puertas acá— así que hace lo único
// que le queda: cerrar el bloque. Es el mismo recurso que el filete de la
// retícula de `grid/`, con color: sin él, la banda no termina en ningún lado y
// se deshilacha contra la sección siguiente.
//
// ⚠️ Ninguna de las cuatro empresas tiene logotipo en el repo — el wordmark
// está compuesto en la serif del sitio, y eso NO es la marca de nadie. Ver la
// cabecera de `voicesLabContent.ts`: TODO(asset).
export default function VoicesMarks() {
  const rootRef = useScrollReveal<HTMLUListElement>();

  return (
    <section className="bg-cream text-ink">
      <div className="mx-auto flex w-full max-w-[1780px] flex-col gap-4 px-[60px] pb-14 pt-24 lg:pt-32">
        <p className="text-caption-mono uppercase text-ink/55">{VOICES_EYEBROW}</p>
        <h2 className="text-h2 max-w-[24ch] text-balance">
          Four teams with no reason to say it, on the record.
        </h2>
      </div>

      {/* A sangre y sobre filetes. La banda no usa `Container` por el mismo
          motivo que la retícula de `closing-labs/grid`: los filetes tienen que
          llegar al borde del viewport o dejan de leerse como estructura y pasan
          a leerse como el marco de una tabla centrada. El aire lo pone el
          padding de cada celda. */}
      <ul
        ref={rootRef}
        // `-ml-px` + `overflow-hidden`: el filete izquierdo de la primera columna
        // queda del lado de afuera del recorte. Sin eso, en dos columnas la
        // segunda fila dibuja una línea contra el borde del viewport — la de
        // su propia primera columna, que arriba no se ve porque la tapa el
        // margen. Misma técnica que la tabla de `closing-labs/slab/Numbers`.
        className="-ml-px grid overflow-hidden border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4"
      >
        {TESTIMONIALS.map((person) => {
          const mark = VOICE_MARKS[person.id];

          return (
            <li
              key={person.id}
              data-reveal
              className="flex min-h-[clamp(18rem,34vh,26rem)] flex-col justify-between gap-10 border-l border-ink/15 p-8 lg:p-10"
            >
              {/* El wordmark cae al nombre de la persona cuando no hay empresa.
                  Igual que en la cinta: un hueco arriba a la izquierda se lee
                  como un logo que no cargó, no como un dato que falta. */}
              <p className="text-h2-serif italic text-balance">
                {mark.company ?? person.name}
              </p>

              <div className="flex flex-col gap-5">
                <blockquote className="text-caption max-w-[34ch] text-ink/70 text-pretty">
                  “{person.quote}”
                </blockquote>

                <figcaption className="flex flex-col gap-1 border-t border-ink/12 pt-4">
                  <span className="text-caption-mono uppercase text-ink">{person.name}</span>
                  <span className="text-micro-mono text-ink/50">{person.role}</span>
                </figcaption>
              </div>
            </li>
          );
        })}
      </ul>

      <span
        aria-hidden="true"
        style={{ backgroundImage: VOICE_RAMP }}
        className="block h-0.5 w-full"
      />
    </section>
  );
}
