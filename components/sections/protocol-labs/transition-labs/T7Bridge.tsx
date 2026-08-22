"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { BRIDGE } from "@/components/sections/protocol-labs/transition-labs/transitionContent";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T7 · Bridge — la pregunta entre la afirmación y la explicación. ~50svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// Hay un momento exacto en esta página en que el lector ya sabe QUÉ afirma NEAR y
// todavía no sabe CÓMO: justo después del hero. Esta transición ocupa ese momento
// con una pregunta a escala de statement, y las seis cifras entran como el
// comienzo de la respuesta.
//
// Es una decisión de storytelling, no de layout: convertir la evidencia en
// respuesta le da al lector una razón para seguir leyendo que la evidencia sola
// no le da. Un dato afirma; un dato que contesta algo obliga a haber leído la
// pregunta.
//
// ── Por qué `--text-statement` y no `h1` ni `display` ─────────────────────
//
// El token existe para esta figura exacta: la frase corta que ocupa el ancho de
// la sección sin ser el titular de la página. Con `h1` competiría con el hero —
// que vive en ese nivel— y con `display` lo superaría, que sería peor: la
// pregunta de una transición no puede ser lo más grande de la página.
//
// ── El riesgo, y hay que decirlo ──────────────────────────────────────────
//
// Una pregunta retórica en una página de infraestructura es un recurso gastado.
// Funciona sólo si la pregunta es la que el lector realmente tiene en ese punto —
// y si no lo es, se lee como relleno de agencia. La copy está en
// `transitionContent.ts`, **no aprobada**, y es lo primero que hay que discutir
// de esta variante: si la pregunta no es la correcta, no hay diseño que la
// sostenga.
export default function T7Bridge() {
  const ref = useCountUp<HTMLDListElement>({ start: "top 70%", stagger: 0.06 });

  return (
    <section className="flex min-h-[50svh] flex-col justify-center border-y border-rule bg-cream text-foreground">
      <Container className="flex flex-col gap-10 py-16">
        <h2 className="max-w-[18ch] text-statement text-balance">
          {BRIDGE.question.replace(/ actually demand\?$/, "")}{" "}
          <Accent display>actually demand?</Accent>
        </h2>

        <div className="flex flex-col gap-6 border-t border-ink pt-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <p className="max-w-[42ch] text-body-lg text-ink-soft text-pretty">{BRIDGE.answer}</p>

          <dl ref={ref} className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex items-baseline gap-2">
                <dd data-count={stat.value} className="text-h4 tabular-nums">
                  {stat.value}
                </dd>
                <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
