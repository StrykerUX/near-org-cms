"use client";

import Link from "next/link";

import { ArrowDisc, Hatch, RAMPS } from "@/components/sections/closing-labs/shared";
import RuleGrid, {
  Band,
  RULE,
} from "@/components/sections/closing-labs/grid/RuleGrid";
import {
  GET_INTO_ROWS,
  GET_INTO_TITLE,
} from "@/components/sections/homepage-tuck/getIntoNearContent";

// Las tres puertas, apoyadas en la retícula.
//
// ── La rampa deja de ser barra y pasa a ser filete ───────────────────────────
//
// En `GetIntoNear` la rampa ocupa el tercio central del renglón: es una píldora
// de 28px de alto y es el único gesto de la fila. Acá no puede estar: en una
// retícula donde TODO se apoya en líneas de 1px, un objeto de color de 28px de
// alto es lo único que flota, y una sola cosa que flota rompe la regla que la
// dirección entera sostiene.
//
// Así que la rampa se aplana contra la línea que ya existe. El filete inferior
// de cada fila —que en el resto de la retícula es gris— acá lleva los quince
// verdes de su puerta, y se dibuja de izquierda a derecha al pasar por encima.
// El color sigue siendo el mismo dato (tres verdes, tres puertas); lo que
// cambia es que ya no compite con la estructura: la USA.
//
// El `scale-x` va desde el borde izquierdo porque es la dirección en que se lee
// la fila. Desde el centro se leería como una barra de progreso, que es
// exactamente lo que la rampa no es.
export default function GridGateway() {
  return (
    <RuleGrid tone="light">
      <Band tone="light">
        <div className={`hidden border-l lg:block ${RULE.light}`} />
        <div className={`flex flex-col gap-6 border-l p-8 sm:col-span-2 lg:p-12 ${RULE.light}`}>
          <p className="text-eyebrow-mono flex items-center gap-3 uppercase text-ink/60">
            <Hatch />
            Start here
          </p>
          <h2 className="text-h1 text-balance">{GET_INTO_TITLE}</h2>
        </div>
        <div className={`hidden border-l lg:block ${RULE.light}`} />
      </Band>

      <ul className="border-b border-ink/15">
        {GET_INTO_ROWS.map((row, i) => (
          <li key={row.id} className="relative">
            <Link
              href={row.href}
              className={`group grid items-center gap-y-6 border-t p-8 transition-colors duration-300 hover:bg-ink/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:p-12 ${RULE.light}`}
            >
              <span className="flex items-baseline gap-4">
                <span className="text-micro-mono text-ink/40">
                  //{String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-h3">{row.label}</span>
              </span>

              <span className="text-caption-mono text-ink/60 text-pretty sm:col-span-2">
                {row.body}
              </span>

              <ArrowDisc className="justify-self-start text-ink lg:justify-self-end" />

              {/* La rampa. `absolute` sobre el borde INFERIOR de la fila —el
                  mismo píxel donde la próxima fila dibuja su `border-t`— así
                  que al encenderse no aparece una línea nueva: se pinta la que
                  ya estaba. */}
              <span
                aria-hidden="true"
                style={{ backgroundImage: RAMPS[row.id] }}
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>
    </RuleGrid>
  );
}
