"use client";

import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import DividerBand from "@/components/sections/protocol-labs/proof-labs/DividerBand";
import { GROUPS } from "@/components/sections/protocol-labs/proof-labs/proofLabsContent";
import { PROOF_BY_ID } from "@/components/sections/protocol-labs/protocolContent";

// P3 · Grouped — tres ideas en vez de seis números.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// Las seis cifras no son seis cosas del mismo tipo, y ponerlas en fila lo
// disimula: tres miden tiempo, dos miden tamaño, una mide precio. En fila el
// lector tendría que hacer esa clasificación solo, y no la hace — pasa de largo.
//
// Cada par es una cifra y su corroboración desde otro ángulo: 600ms de bloque
// sólo importa si la finalidad también es baja; 1M+ TPS sólo se sostiene si hay
// shards que lo repartan. El rótulo nombra la afirmación y las dos cifras la
// prueban desde dos lados.
//
// ── Por qué es la que mejor encaja en el rol ──────────────────────────────
//
// Tres bloques separados por filetes verticales es, literalmente, la forma de una
// barra divisoria. No hubo que comprimir nada: las dos cifras de cada grupo caben
// en una línea con su rótulo encima, así que la variante entra en el alto del
// divider sin renunciar a su idea.
//
// Es la única de las ocho de la que se puede decir eso, y conviene tenerlo en
// cuenta al compararlas: puede estar ganando por adecuación al formato y no por
// ser la mejor lectura de los datos.
export default function P3Grouped() {
  const ref = useCountUp<HTMLDivElement>({ stagger: 0.09 });

  return (
    <DividerBand>
      <div ref={ref} className="grid gap-y-8 sm:grid-cols-3 sm:gap-x-10">
        {GROUPS.map((group, i) => (
          <div
            key={group.label}
            // El filete entre grupos, no alrededor: el primero no lo lleva. Un
            // borde completo por grupo daría tres cajas, que es un layout de
            // cards dentro de una banda.
            className={`flex flex-col gap-3 ${i > 0 ? "sm:border-l sm:border-rule sm:pl-10" : ""}`}
          >
            <h3 className="uppercase text-micro-mono text-gray-intermediate">{group.label}</h3>
            <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              {group.ids.map((id) => {
                const stat = PROOF_BY_ID[id];
                if (!stat) return null;
                return (
                  <div key={id} className="flex items-baseline gap-2">
                    <dd data-count={stat.value} className="text-h3 tabular-nums">
                      {stat.value}
                    </dd>
                    <dt className="uppercase text-micro-mono text-gray-intermediate">
                      {stat.label}
                    </dt>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    </DividerBand>
  );
}
