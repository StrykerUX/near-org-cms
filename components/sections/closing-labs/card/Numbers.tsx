"use client";

import Container from "@/components/primitives/Container";
import { CornerGlyphs, Counter } from "@/components/sections/closing-labs/shared";
import {
  formatLedgerValue,
  LEDGER_NOTES,
  LEDGER_ROWS,
} from "@/components/sections/homepage-tuck/proofLedgerContent";

// Las seis pruebas como fichas, con el numeral fantasma de alura.
//
// ── Qué hace el fantasma que el numeral no hace ──────────────────────────────
//
// Es el MISMO número, más grande, casi transparente, y cortado por el borde
// superior de la ficha. Suena a duplicado y no lo es: el numeral chico es el
// dato —se lee, se compara con el de al lado— y el fantasma es la MARCA de la
// ficha, lo que hace que las cuatro se distingan de un vistazo antes de leer
// ninguna. Es lo que hace un número de dorsal.
//
// Que esté cortado es la mitad del efecto. Un fantasma entero adentro de la
// ficha se lee como un segundo número mal impreso; cortado por el borde se lee
// como algo que estaba ahí antes que la ficha, y la ficha se le apoyó encima.
//
// ── Por qué el fantasma NO cuenta ────────────────────────────────────────────
//
// El contador anima el numeral chico solamente. Los dos subiendo a la vez son
// dos números moviéndose en la misma caja a dos tamaños, que es ruido; y el
// fantasma quieto en el valor final le da al contador contra qué llegar — se ve
// hacia dónde va la cuenta desde el primer cuadro.
//
// Por eso el fantasma usa `formatLedgerValue` directo y no `Counter`.
export default function CardNumbers() {
  return (
    <section className="bg-card-tint py-24 text-ink lg:py-32">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <header className="flex flex-col gap-4">
          <p className="text-caption-mono flex items-center gap-3 uppercase text-ink/60">
            <span aria-hidden="true" className="text-green-ink">
              ✦
            </span>
            Our results
          </p>
          <h2 className="text-h2 max-w-[20ch] text-balance">
            Five years on mainnet, without a single outage.
          </h2>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEDGER_ROWS.map((row) => (
            <li
              key={row.id}
              className="group relative flex min-h-[clamp(16rem,30vh,22rem)] flex-col justify-between gap-10 overflow-hidden rounded-[20px] bg-cream p-6 pt-16 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <CornerGlyphs className="text-ink/25" />

              {/* El fantasma. `-top-[0.28em]` sube la caja de la letra hasta
                  que la mitad superior de los dígitos queda fuera de la ficha:
                  en `em` y no en píxeles para que el corte se mantenga cuando
                  el `clamp` de `--text-rail` cambie de tamaño. */}
              <span
                aria-hidden="true"
                className="text-rail pointer-events-none absolute -top-[0.28em] left-4 select-none text-ink/[0.06]"
              >
                {formatLedgerValue(row)}
              </span>

              <p className="text-caption-mono relative uppercase text-ink/55">
                {row.eyebrow}
              </p>

              <div className="relative flex flex-col gap-3">
                <p className="text-h2 flex items-baseline">
                  <Counter row={row} />
                  <span>{row.unit}</span>
                </p>
                <p className="text-h4 text-ink/80">{row.gloss}</p>
                <p className="text-caption text-ink/55 text-pretty">{row.body}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Las dos sin cifra tampoco tienen fantasma: no hay número que
            agrandar. Lo que ocupa su lugar es la ficha en tinta —invertida
            respecto de las cuatro de arriba— que es la forma de decir «esto es
            de otra clase» sin agregar un rótulo que lo explique. */}
        <ul className="grid gap-4 sm:grid-cols-2">
          {LEDGER_NOTES.map((note) => (
            <li
              key={note.id}
              className="relative flex flex-col gap-4 overflow-hidden rounded-[20px] bg-ink p-6 text-cream"
            >
              <CornerGlyphs className="text-cream/25" />
              <p className="text-caption-mono relative uppercase text-cream/50">
                {note.eyebrow}
              </p>
              <p className="text-h3 relative">{note.gloss}</p>
              <p className="text-caption relative max-w-[52ch] text-cream/60 text-pretty">
                {note.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
