"use client";

import { Counter, Hatch } from "@/components/sections/closing-labs/shared";
import RuleGrid, {
  Band,
  RULE,
  Tick,
} from "@/components/sections/closing-labs/grid/RuleGrid";
import {
  LEDGER_NOTES,
  LEDGER_ROWS,
} from "@/components/sections/homepage-tuck/proofLedgerContent";

// Las seis pruebas como lecturas de un panel.
//
// ── Qué cambia contra `ProofLedger` ──────────────────────────────────────────
//
// El ledger le da UNA PANTALLA a cada prueba: la cifra mide un tercio del
// bloque y el cuerpo cuelga a la derecha. Es una lectura por vez, y el que
// scrollea las recibe de a una como si fueran seis afirmaciones.
//
// Acá caben las cuatro juntas en una banda, y eso las convierte en otra cosa:
// dejan de ser seis afirmaciones y pasan a ser un TABLERO. La comparación entre
// «100%» y «1.0» existe porque están al lado; en el ledger no existía porque
// nunca se veían a la vez.
//
// El precio está declarado: ninguna cifra impresiona sola. Es exactamente el
// intercambio que la referencia hace —armory pone `6ms / 5x / 47%` en una fila
// y ninguna de las tres es un momento— y lo que esta variante viene a poner a
// prueba.
//
// ── El numeral baja a `text-h1` ──────────────────────────────────────────────
//
// Y no es un ajuste de tamaño: es lo que hace posible el tablero. `--text-ledger`
// mide 17cqw porque está pensado para un renglón entero; en una celda de un
// cuarto de pantalla, cuatro numerales a esa escala no dejan lugar al cuerpo y
// la banda se vuelve cuatro cifras sin explicación. `text-h1` es el tamaño más
// grande que todavía deja respirar a la glosa y al cuerpo dentro de la celda.
export default function GridNumbers() {
  return (
    <RuleGrid tone="dark">
      {/* La cabecera arranca en la SEGUNDA columna. Es de armory y no es una
          excentricidad: deja la primera columna vacía, y esa columna vacía es
          lo que anuncia que hay una retícula antes de que llegue el primer
          dato. Centrada, la cabecera no diría nada de la estructura. */}
      <Band tone="dark">
        <div className={`hidden border-l lg:block ${RULE.dark}`} />
        <div className={`flex flex-col gap-6 border-l p-8 sm:col-span-2 lg:p-12 ${RULE.dark}`}>
          <p className="text-eyebrow-mono flex items-center gap-3 uppercase text-cream/60">
            <Hatch />
            Statistics
          </p>
          <h2 className="text-h2 text-balance">
            Quantifiable impact, measured on mainnet.
          </h2>
          <p className="text-caption-mono max-w-[46ch] text-cream/60">
            Every figure below is a live network property, not a projection.
          </p>
        </div>
        <div className={`hidden border-l lg:block ${RULE.dark}`} />
      </Band>

      <Band tone="dark">
        {LEDGER_ROWS.map((row) => (
          <article
            key={row.id}
            className={`relative flex min-h-[clamp(15rem,26vh,20rem)] flex-col justify-between gap-10 border-l p-8 ${RULE.dark}`}
          >
            <Tick className="absolute right-4 top-4 text-cream/30" />

            <p className="text-eyebrow-mono uppercase text-cream/50">{row.eyebrow}</p>

            <div className="flex flex-col gap-4">
              {/* El signo va como HERMANO del contador, nunca dentro: el tween
                  reescribe `textContent` en cada cuadro y se llevaría puesto
                  cualquier hijo. Misma restricción que en `ProofLedger`. */}
              <p className="text-h1 flex items-baseline">
                <Counter row={row} />
                <span>{row.unit}</span>
              </p>
              <p className="text-h4-mono text-cream/80">{row.gloss}</p>
              <p className="text-caption-mono text-cream/55 text-pretty">{row.body}</p>
            </div>
          </article>
        ))}
      </Band>

      {/* Las dos pruebas sin cifra ocupan media banda cada una. No es que
          «sobren dos»: son otro dato —una propiedad, no una medida— y media
          banda es la forma de decirlo sin inventarles un número. */}
      <Band tone="dark" className="border-b">
        {LEDGER_NOTES.map((note) => (
          <article
            key={note.id}
            className={`relative flex flex-col gap-6 border-l p-8 sm:col-span-1 lg:col-span-2 lg:p-12 ${RULE.dark}`}
          >
            <Tick className="absolute right-4 top-4 text-cream/30" />
            <p className="text-eyebrow-mono uppercase text-cream/50">{note.eyebrow}</p>
            <p className="text-h3">{note.gloss}</p>
            <p className="text-caption-mono max-w-[52ch] text-cream/55 text-pretty">
              {note.body}
            </p>
          </article>
        ))}
      </Band>
    </RuleGrid>
  );
}
