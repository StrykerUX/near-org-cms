"use client";

import { RuleLabel } from "@/components/sections/closing-labs/shared";
import Slab from "@/components/sections/closing-labs/slab/Slab";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import {
  PRESS_ITEMS,
  PRESS_TITLE,
} from "@/components/sections/closing-labs/pressContent";

// Las notas de prensa adentro de la losa clara.
//
// ── Lo único que se le pidió a esta versión es que se pueda escanear ────────
//
// Es la más cercana a `UpdatesList`, y a propósito: de las cinco direcciones,
// ésta es la que menos tiene para agregarle a un listado de tres titulares. Lo
// que aporta es la columna de la izquierda con medio y fecha en mono alineados
// entre sí, que es lo que permite recorrer las tres notas SIN leer los
// titulares — y con tres titulares que hoy son idénticos, eso no es un detalle.
//
// ── La regla que se recorre, otra vez ───────────────────────────────────────
//
// El mismo `scale-x` desde el borde izquierdo de `UpdatesList`. Se reusa el
// gesto y no se inventa otro porque ya está resuelto y documentado allá: un
// subrayado que se DIBUJA acompaña la lectura, uno que aparece de golpe la
// interrumpe.
export default function SlabPress() {
  const rootRef = useScrollReveal<HTMLUListElement>();

  return (
    <Slab tone="paper">
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-8">
          <RuleLabel className="text-ink/60">Media</RuleLabel>
          <h2 className="text-h1 max-w-[14ch] text-balance">{PRESS_TITLE}</h2>
        </div>

        <ul ref={rootRef} className="flex flex-col">
          {PRESS_ITEMS.map((item) => (
            <li key={item.id} data-reveal className="border-t border-ink/12 last:border-b">
              <a
                href="#"
                className="group grid items-start gap-4 py-8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] lg:gap-12"
              >
                <span className="flex flex-col gap-1">
                  <span className="text-caption-mono uppercase text-ink">{item.outlet}</span>
                  <span className="text-micro-mono text-ink/50">{item.dateLabel}</span>
                </span>

                <span className="flex w-fit max-w-[46ch] flex-col gap-2">
                  <span className="text-h4 text-pretty">{item.title}</span>
                  <span
                    aria-hidden="true"
                    className="h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                </span>

                <span className="text-caption-mono flex items-center gap-2 uppercase text-ink/50 transition-colors duration-300 group-hover:text-ink motion-reduce:transition-none lg:justify-self-end">
                  Read
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Slab>
  );
}
