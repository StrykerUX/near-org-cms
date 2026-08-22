"use client";

import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import DividerBand from "@/components/sections/protocol-labs/proof-labs/DividerBand";
import { ANCHORS } from "@/components/sections/protocol-labs/proof-labs/proofLabsContent";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// P2 · Benchmark — cada cifra con su traducción.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// "600ms" y "1M+ TPS" no le dicen nada a quien no trabaja en infraestructura, y
// esa es la mitad del público: fondos, partners, prensa, equipos de producto. Un
// número sin referencia informa al que ya sabía y se le escapa al que había que
// convencer.
//
// La regla al escribir las traducciones: **ninguna introduce un dato nuevo**. Son
// reformulaciones o aritmética sobre la misma cifra — "mil transacciones por dos
// dólares" ES "<$0.002". Viven en `proofLabsContent.ts` y no están aprobadas.
//
// ── Qué cambió al volverse divider, y qué se perdió ───────────────────────
//
// Era la variante más cara en alto: seis bloques de tres líneas en una retícula
// de tres columnas. Como juntura no cabe, así que la traducción bajó de
// `text-body-serif` a `text-micro-mono` y las seis pasaron a una fila.
//
// **Y ahí está el problema honesto de esta versión.** La traducción existe para
// LEERSE —es una frase, no una etiqueta— y a cuerpo de nota, en una fila de seis,
// se lee como el pie de la cifra: exactamente el mismo lugar que ya ocupaba
// `note` en el contenido original. O sea que comprimida, la variante corre el
// riesgo de dejar de ser una variante.
//
// Se conserva igual porque la pregunta que hace sigue siendo la más importante
// de las ocho. Si al verla las traducciones no se leen, la conclusión no es
// achicarlas más: es que **esta idea no cabe en un divider** y necesita ser una
// sección propia más abajo en la página.
export default function P2Benchmark() {
  const ref = useCountUp<HTMLDListElement>();

  return (
    <DividerBand>
      <dl
        ref={ref}
        className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-3 lg:grid-cols-6"
      >
        {PROOF.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-1">
            <dd data-count={stat.value} className="text-h4 tabular-nums">
              {stat.value}
            </dd>
            <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            {/* La traducción reemplaza a la nota original y no se suma a ella: dos
                líneas de pie bajo una cifra, en una banda de seis, es lo que
                convierte un divider en un párrafo. */}
            <dd className="max-w-[24ch] text-micro-mono text-ink-soft text-pretty">
              {ANCHORS[stat.id]}
            </dd>
          </div>
        ))}
      </dl>
    </DividerBand>
  );
}
