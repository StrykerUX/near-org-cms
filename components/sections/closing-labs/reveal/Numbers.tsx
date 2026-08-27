"use client";

import Container from "@/components/primitives/Container";
import { Counter, WordReveal } from "@/components/sections/closing-labs/shared";
import Rail from "@/components/sections/closing-labs/reveal/Rail";
import {
  LEDGER_NOTES,
  LEDGER_ROWS,
} from "@/components/sections/homepage-tuck/proofLedgerContent";

// Las seis pruebas, leídas.
//
// ── La cifra y el cuerpo se comportan distinto a propósito ───────────────────
//
// La cifra CUENTA —sube de 000 a 100 al llegar— y el cuerpo se ENCIENDE palabra
// por palabra con el scroll. Son dos mecánicas distintas sobre el mismo
// renglón, y no es inconsistencia: dicen dos cosas distintas.
//
// El contador es un hecho que termina de ocurrir: el número llega a su valor y
// se queda. El barrido no termina nunca —está atado a la posición, y va y viene
// si el lector sube— porque el cuerpo no es un hecho, es una lectura en curso.
// Atar la cifra al scrub la volvería un número tembloroso que nunca es
// verdadero; darle una entrada al cuerpo lo volvería un bloque que aparece,
// que es lo que hace cualquier sección.
//
// ── El apagado es 18% y no 30% ───────────────────────────────────────────────
//
// Medido contra las tres referencias que usan el device: el texto apagado tiene
// que estar por debajo del umbral de lectura cómoda o el ojo lo lee igual y el
// barrido no se nota. A 30% sobre crema el párrafo entero se lee de una y el
// encendido pasa a ser un cambio de énfasis; a 18% hay que esperar a que la
// palabra llegue, que es el punto.
const DIM = "rgba(16,16,16,0.18)";
const LIT = "#101010";

export default function RevealNumbers() {
  return (
    <section className="bg-cream py-28 text-ink lg:py-40">
      <Container className="flex flex-col gap-24 lg:gap-32">
        {LEDGER_ROWS.map((row, i) => (
          <Rail key={row.id} index={i + 1} label={row.eyebrow}>
            <div className="flex flex-col gap-8">
              {/* La cifra conserva la composición del artboard —numeral sans,
                  signo alto y chico, glosa en serif itálica— porque es lo único
                  de esta dirección que NO es prosa, y es lo que la sostiene:
                  sin ella cuatro párrafos seguidos se leen como un texto largo,
                  no como cuatro pruebas.

                  El signo y la glosa van como HERMANOS del contador: el tween
                  reescribe `textContent` en cada cuadro. */}
              <p className="flex flex-wrap items-baseline gap-x-4">
                <span className="text-statement">
                  <Counter row={row} />
                  {row.unit}
                </span>
                <span className="text-h2-serif italic text-ink/85">{row.gloss}</span>
              </p>

              <WordReveal
                text={row.body}
                dim={DIM}
                lit={LIT}
                className="text-body-lg max-w-[54ch] text-pretty"
              />
            </div>
          </Rail>
        ))}

        {/* Las dos sin cifra siguen la misma plica y pierden el renglón grande:
            lo que ocupa su lugar es la glosa en serif, al tamaño del titular.
            Es lo que hace visible que estas dos pruebas son de otra clase sin
            tener que decirlo en ningún lado. */}
        {LEDGER_NOTES.map((note, i) => (
          <Rail key={note.id} index={LEDGER_ROWS.length + i + 1} label={note.eyebrow}>
            <div className="flex flex-col gap-8">
              <p className="text-h1-serif italic">{note.gloss}</p>
              <WordReveal
                text={note.body}
                dim={DIM}
                lit={LIT}
                className="text-body-lg max-w-[54ch] text-pretty"
              />
            </div>
          </Rail>
        ))}
      </Container>
    </section>
  );
}
