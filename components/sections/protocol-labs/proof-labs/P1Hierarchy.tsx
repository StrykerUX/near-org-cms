"use client";

import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import DividerBand from "@/components/sections/protocol-labs/proof-labs/DividerBand";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// P1 · Hierarchy — una cifra manda, cinco acompañan.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// Seis datos del mismo tamaño son cero datos: el ojo los recorre, no elige
// ninguno, y a los diez segundos el lector no recuerda uno solo. **La que gana la
// discusión es el uptime** — "1M+ TPS" es una capacidad que toda cadena nueva
// anuncia, y "100% en cinco años" es un historial, que es lo único que no se
// puede anunciar por adelantado.
//
// ── Qué cambió al volverse divider ────────────────────────────────────────
//
// La cifra principal estaba a `text-display` (128px) con las otras cinco en una
// retícula debajo: eso es una sección, y encima le hacía sombra al titular del
// hero, que vive a `text-h1`. Acá baja a `text-h2` —un escalón POR DEBAJO del
// h1— y las cinco pasan a una sola línea a su derecha.
//
// La jerarquía se conserva entera; lo que se fue es la escala absoluta. Es
// exactamente el ajuste que el rol pide: un divider puede tener jerarquía
// interna, no puede tener protagonista.
const LEAD_ID = "uptime";

export default function P1Hierarchy() {
  const ref = useCountUp<HTMLDivElement>({ stagger: 0.1 });
  const lead = PROOF.find((p) => p.id === LEAD_ID);
  const rest = PROOF.filter((p) => p.id !== LEAD_ID);
  if (!lead) return null;

  return (
    <DividerBand>
      <div
        ref={ref}
        className="flex flex-col gap-8 lg:flex-row lg:items-baseline lg:justify-between lg:gap-16"
      >
        <p className="flex items-baseline gap-3">
          <span data-count={lead.value} className="text-h2 tabular-nums">
            {lead.value}
          </span>
          <span className="flex flex-col">
            <span className="uppercase text-caption-mono">{lead.label}</span>
            {lead.note && (
              <span className="text-micro-mono text-gray-intermediate">{lead.note}</span>
            )}
          </span>
        </p>

        {/* Las cinco restantes en una línea. `flex-wrap` y no un grid: a anchos
            intermedios tienen que poder plegarse sin dejar una columna vacía,
            que en una banda de una sola fila se ve como un agujero. */}
        <dl className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
          {rest.map((stat) => (
            <div key={stat.id} className="flex items-baseline gap-2">
              <dd data-count={stat.value} className="text-h4 tabular-nums">
                {stat.value}
              </dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </DividerBand>
  );
}
