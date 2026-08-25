"use client";

import { Hatch } from "@/components/sections/closing-labs/shared";
import RuleGrid, {
  Band,
  RULE,
} from "@/components/sections/closing-labs/grid/RuleGrid";
import {
  PRESS_EYEBROW,
  PRESS_ITEMS,
  PRESS_TITLE,
} from "@/components/sections/closing-labs/pressContent";

// Las notas de prensa como asiento de archivo.
//
// ── El medio entra a la fila ─────────────────────────────────────────────────
//
// `UpdatesList` tiene tres columnas: titular, fecha, signo. Nunca dice QUIÉN lo
// publicó, y en una sección que se llama «NEAR in the news» esa es la mitad del
// dato: una nota sin medio es una frase sin fuente.
//
// La retícula de cuatro columnas lo pedía sola —había una columna de más— así
// que acá la primera lleva medio y fecha en mono, apilados, como el pie de una
// ficha. La fecha pierde tamaño respecto de `UpdatesList` a cambio de dejar de
// estar sola.
//
// ── El signo no gira ─────────────────────────────────────────────────────────
//
// En `UpdatesList` el `+` gira un cuarto de vuelta y se rellena al hover, y ahí
// está bien: es el único acuse de recibo de la fila. Acá la fila entera ya se
// tiñe, así que un segundo gesto encima sería subrayar dos veces. El signo se
// queda quieto y solo invierte el relleno.
export default function GridPress() {
  return (
    <RuleGrid tone="light">
      <Band tone="light">
        <div className={`hidden border-l lg:block ${RULE.light}`} />
        <div className={`flex flex-col gap-6 border-l p-8 sm:col-span-2 lg:p-12 ${RULE.light}`}>
          <p className="text-eyebrow-mono flex items-center gap-3 uppercase text-ink/60">
            <Hatch />
            {PRESS_EYEBROW}
          </p>
          <h2 className="text-h1 text-balance">{PRESS_TITLE}</h2>
        </div>
        <div className={`hidden border-l lg:block ${RULE.light}`} />
      </Band>

      <ul className="border-b border-ink/15">
        {PRESS_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href="#"
              className={`group grid items-start gap-y-5 border-t p-8 transition-colors duration-300 hover:bg-ink/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:p-12 ${RULE.light}`}
            >
              <span className="flex flex-col gap-1">
                <span className="text-caption-mono uppercase text-ink">{item.outlet}</span>
                <span className="text-micro-mono text-ink/50">{item.dateLabel}</span>
              </span>

              <span className="text-body text-pretty sm:col-span-2">{item.title}</span>

              <span
                aria-hidden="true"
                className="text-h4-mono flex size-9 shrink-0 items-center justify-center rounded-full border border-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-cream motion-reduce:transition-none lg:justify-self-end"
              >
                +
              </span>
            </a>
          </li>
        ))}
      </ul>
    </RuleGrid>
  );
}
