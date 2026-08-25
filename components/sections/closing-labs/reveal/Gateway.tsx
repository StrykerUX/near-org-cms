"use client";

import Link from "next/link";

import Container from "@/components/primitives/Container";
import { RAMPS } from "@/components/sections/closing-labs/shared";
import Rail from "@/components/sections/closing-labs/reveal/Rail";
import {
  GET_INTO_ROWS,
  GET_INTO_TITLE,
} from "@/components/sections/homepage-tuck/getIntoNearContent";

// Las tres puertas, sin barra y sin caja: la rampa se mete DENTRO de la letra.
//
// ── El único lugar donde la rampa sigue midiendo lo mismo ────────────────────
//
// La barra del artboard mide un tercio del renglón. En una dirección sin cajas
// no hay dónde apoyarla —flotaría sobre el papel como el único objeto de color
// de la página entera— pero tampoco se puede tirar: es lo único que distingue
// una puerta de otra.
//
// La solución es que la rampa deje de ser un objeto y pase a ser el RELLENO del
// nombre de la puerta. «Trade on NEAR» en `text-statement` ocupa más ancho que
// la barra original, así que los quince verdes se leen mejor que antes, y no
// hay ni un píxel de la página que no sea texto.
//
// ── Dos capas y no `background-clip` condicional ─────────────────────────────
//
// `-webkit-background-clip: text` no se puede encender con `:hover` desde una
// clase de Tailwind: el gradiente entra por `style` (son quince paradas
// calculadas, no una clase que Tailwind pueda emitir) y `style` no tiene
// estados. Así que el nombre se pinta DOS VECES —una en tinta, una recortada
// sobre el gradiente— y lo que cambia al hover es la opacidad de la de arriba.
//
// Las dos capas son el mismo texto en la misma caja, así que no hay
// desalineación posible: la de arriba es `absolute inset-0` sobre la de abajo.
// La copia de arriba es `aria-hidden` — un lector de pantalla leería la puerta
// dos veces.
export default function RevealGateway() {
  return (
    <section className="bg-cream py-28 text-ink lg:py-40">
      <Container className="flex flex-col gap-20 lg:gap-28">
        <h2 className="text-h1 max-w-[16ch] text-balance">{GET_INTO_TITLE}</h2>

        <ul className="flex flex-col gap-20 lg:gap-24">
          {GET_INTO_ROWS.map((row, i) => (
            <li key={row.id}>
              <Rail index={i + 1} label="Doorway">
                <Link
                  href={row.href}
                  className="group flex flex-col gap-6 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ink"
                >
                  <span className="relative inline-block w-fit">
                    <span className="text-statement block">{row.label}</span>
                    <span
                      aria-hidden="true"
                      style={{
                        backgroundImage: RAMPS[row.id],
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                      className="text-statement absolute inset-0 block opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none"
                    >
                      {row.label}
                    </span>
                  </span>

                  <span className="text-body-lg max-w-[46ch] text-ink/70 text-pretty">
                    {row.body}
                  </span>

                  {/* La regla que se recorre es la MISMA de `UpdatesList`, y se
                      reusa a propósito: es el acuse de recibo que la línea viva
                      ya tiene para un link de texto sin caja, que es
                      exactamente lo que esta puerta es. */}
                  <span
                    aria-hidden="true"
                    className="h-px w-full max-w-[46ch] origin-left scale-x-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                </Link>
              </Rail>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
