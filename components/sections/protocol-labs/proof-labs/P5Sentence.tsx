"use client";

import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import DividerBand from "@/components/sections/protocol-labs/proof-labs/DividerBand";
import { SENTENCE } from "@/components/sections/protocol-labs/proof-labs/proofLabsContent";

// P5 · Sentence — los datos dentro de una oración.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// Una tabla de seis cifras se escanea; una frase se lee. Y lo que se lee se
// recuerda: quien atraviesa esta oración se queda con un argumento completo,
// mientras que quien barre una tabla se queda con la sensación de que había
// números.
//
// Es además la única variante que hace explícita la RELACIÓN entre las cifras.
// En fila, las seis son afirmaciones sueltas; en la frase, el costo queda atado
// al volumen y la finalidad al reparto en shards, que es como funcionan de
// verdad.
//
// ── Qué cambió al volverse divider ────────────────────────────────────────
//
// Estaba a `text-h2` en un bloque de tres renglones: eso es un statement, y un
// statement entre el hero y el contenido compite con el titular en vez de unirlo
// con lo que sigue. Ahora va a `text-body-lg` en una medida ancha, o sea a cuerpo
// de lectura — se lee como el pie del hero, que es exactamente el trabajo de un
// divider.
//
// Las cifras dentro de la frase se quedan en serif itálica y a un cuerpo mayor
// que el texto que las une: es lo que permite las dos lecturas —la oración
// entera, o saltar de número en número— y lo que impide que la variante pierda
// del todo el escaneo que las otras siete protegen.
//
// ── El ancho reservado acá NO es opcional ─────────────────────────────────
//
// Las cifras están DENTRO de un párrafo: si su caja crece mientras cuentan
// —"0ms" tiene tres caracteres y "600ms" cinco— el texto que las rodea se
// re-acomoda en cada frame y la oración tiembla entera. El hook fija el ancho
// final antes de empezar, medido después de `document.fonts.ready`.
export default function P5Sentence() {
  const parts = SENTENCE.split("**");
  const ref = useCountUp<HTMLParagraphElement>({ stagger: 0.14, duration: 1.2 });

  return (
    <DividerBand>
      <p ref={ref} className="max-w-[86ch] text-body-lg text-ink-soft text-pretty">
        {parts.map((part, i) =>
          // Los índices impares son lo que estaba entre `**`: las cifras.
          i % 2 === 1 ? (
            <span
              key={i}
              data-count={part}
              className="serif-inline tabular-nums text-green-ink"
            >
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    </DividerBand>
  );
}
