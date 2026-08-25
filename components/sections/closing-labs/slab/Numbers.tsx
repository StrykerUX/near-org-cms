"use client";

import { Counter, RuleLabel } from "@/components/sections/closing-labs/shared";
import Slab from "@/components/sections/closing-labs/slab/Slab";
import {
  LEDGER_NOTES,
  LEDGER_ROWS,
} from "@/components/sections/homepage-tuck/proofLedgerContent";

// Las seis pruebas como la tabla de una ficha técnica.
//
// ── De dónde sale la forma ───────────────────────────────────────────────────
//
// De las cards de caso de spartan: adentro de la card, las cifras van en una
// tablita de dos por dos separada por filetes de 1px, cada celda con su número
// arriba y su rótulo abajo. No hay cajas adentro de la caja — los filetes
// alcanzan, porque la card ya recortó el bloque del resto de la página.
//
// Eso es lo que hace que esta dirección pueda meter las seis pruebas en UNA
// sola pieza sin que se lea como un tablero: adentro de la losa no compiten
// entre sí, son las lecturas de un mismo instrumento.
//
// ── Los filetes van como borde de la celda y se cancelan en los bordes ──────
//
// `border-l` + `border-t` en todas las celdas dibujaría también el marco de
// afuera, y ese marco sería una segunda caja adentro de la losa. La grilla se
// corre un píxel arriba y a la izquierda (`-ml-px -mt-px`) y se recorta
// (`overflow-hidden`): la primera columna y la primera fila dejan sus bordes
// del lado de afuera del recorte, y lo que queda es solo la cruz interior.
//
// El `overflow-hidden` no es opcional. Sin él la grilla se corre igual pero
// nada la recorta, así que los dos bordes de afuera siguen ahí, un píxel
// adentro del padding — el marco que se quería evitar, desalineado.
//
// Es la misma técnica que usa la retícula de `grid/`, con el signo cambiado:
// allá el filete exterior ES la estructura y acá sobra.
export default function SlabNumbers() {
  return (
    <Slab tone="ink">
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-8">
          <RuleLabel className="text-cream/60">Network statistics</RuleLabel>
          <h2 className="text-h2 max-w-[22ch] text-balance">
            Everything below is a property of the network, not a forecast.
          </h2>
        </div>

        <ul className="-ml-px -mt-px grid overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {LEDGER_ROWS.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-4 border-l border-t border-cream/15 p-6 lg:p-8"
            >
              <p className="text-caption-mono uppercase text-cream/45">{row.eyebrow}</p>
              <p className="text-h1 flex items-baseline">
                <Counter row={row} />
                <span>{row.unit}</span>
              </p>
              <p className="text-h4 text-cream/75">{row.gloss}</p>
              <p className="text-caption text-cream/50 text-pretty">{row.body}</p>
            </li>
          ))}
        </ul>

        {/* Las dos sin cifra siguen la misma tabla y ocupan media losa cada
            una. No hay cambio de tono ni de fondo: adentro de la losa, cambiar
            el fondo de dos celdas sería abrir una tercera caja. Lo único que
            las distingue es que donde va la cifra hay una palabra. */}
        <ul className="-ml-px -mt-px grid overflow-hidden sm:grid-cols-2">
          {LEDGER_NOTES.map((note) => (
            <li
              key={note.id}
              className="flex flex-col gap-4 border-l border-t border-cream/15 p-6 lg:p-8"
            >
              <p className="text-caption-mono uppercase text-cream/45">{note.eyebrow}</p>
              <p className="text-h2">{note.gloss}</p>
              <p className="text-caption max-w-[52ch] text-cream/50 text-pretty">
                {note.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Slab>
  );
}
