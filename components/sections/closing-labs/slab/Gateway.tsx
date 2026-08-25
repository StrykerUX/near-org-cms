"use client";

import Link from "next/link";

import { ArrowDisc, RAMPS, RuleLabel } from "@/components/sections/closing-labs/shared";
import Slab from "@/components/sections/closing-labs/slab/Slab";
import {
  GET_INTO_ROWS,
  GET_INTO_TITLE,
} from "@/components/sections/homepage-tuck/getIntoNearContent";

// Las tres puertas adentro de la losa oscura, con la rampa de vuelta en su
// forma original.
//
// ── Es la única de las cinco donde la barra sobrevive tal cual ──────────────
//
// Las otras cuatro direcciones la transforman: filete en `grid`, relleno de la
// letra en `reveal`, barra de estado en `card`, luz en `night`. Acá vuelve a
// ser lo que era en el artboard — una píldora de color en el tercio central del
// renglón — y el motivo es que esta dirección es la única que tiene DÓNDE
// apoyarla.
//
// La losa ya recortó el bloque del resto de la página, así que adentro puede
// haber un objeto de color sin que sea lo único que flota en la pantalla: flota
// dentro de algo. En una dirección sin cajas (`reveal`) eso no era posible, y
// en una que ya es toda cajas (`card`) habría sido una caja más.
//
// ── La fila entera es la píldora ─────────────────────────────────────────────
//
// En el artboard la fila es una caja blanca rectangular con la píldora adentro.
// Acá la fila TIENE el radio de la píldora, así que la barra y el renglón son
// concéntricos. Es lo que hace que la barra se lea como parte del renglón y no
// como un objeto apoyado encima: comparten el mismo canto.
export default function SlabGateway() {
  return (
    <Slab tone="ink">
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-8">
          <RuleLabel className="text-cream/60">Start here</RuleLabel>
          <h2 className="text-h1 max-w-[16ch] text-balance">{GET_INTO_TITLE}</h2>
        </div>

        <ul className="flex flex-col gap-3">
          {GET_INTO_ROWS.map((row) => (
            <li key={row.id}>
              <Link
                href={row.href}
                className="group grid items-center gap-6 rounded-full border border-cream/12 bg-cream/[0.04] px-6 py-5 transition-colors duration-300 hover:bg-cream/[0.09] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream motion-reduce:transition-none lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,22rem)_auto] lg:gap-10 lg:px-8"
              >
                <span className="text-h4">{row.label}</span>

                {/* La barra guarda las proporciones del artboard —28px de alto,
                    canto completo— y lo único que hace al hover es crecer un
                    punto en vertical. No se ilumina ni cambia de color: los
                    quince verdes SON el dato, y tocarlos al pasar por encima
                    convertiría un color en un estado. */}
                <span
                  aria-hidden="true"
                  style={{ backgroundImage: RAMPS[row.id] }}
                  className="h-5 w-full rounded-full transition-transform duration-300 ease-out group-hover:scale-y-125 motion-reduce:transition-none lg:h-7"
                />

                <span className="text-caption text-cream/60 text-pretty">{row.body}</span>

                <ArrowDisc className="text-cream justify-self-start lg:justify-self-end" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Slab>
  );
}
