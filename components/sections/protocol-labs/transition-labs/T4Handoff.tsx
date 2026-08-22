"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { HANDOFF } from "@/components/sections/protocol-labs/transition-labs/transitionContent";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T4 · Handoff — la transición hecha con lenguaje. ~25svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// Las otras once hacen el puente con gráfica. Esta lo hace con una frase, y es la
// única que puede: el hero termina afirmando "Proven on mainnet for five years" y
// la sección siguiente abre preguntando qué hace falta para una economía a
// velocidad de máquina. Entre esas dos cosas hay un hueco retórico, y una línea
// de texto lo cierra mejor que cualquier dibujo.
//
// La frase toma la afirmación del hero y la convierte en la pregunta que el
// contenido responde, sin repetir ninguna de las dos. Está en
// `transitionContent.ts` y **no está aprobada**: es una propuesta editorial, no
// una transcripción del doc.
//
// ── Dónde caen las cifras, y por qué ahí ──────────────────────────────────
//
// Debajo de la frase y a cuerpo de nota, en una sola línea. No son el argumento
// de esta variante — el argumento es la frase, y las cifras están para que la
// frase no quede sin respaldo. Es la inversión exacta de las otras once, donde
// las cifras mandan y el texto (si hay) las presenta.
//
// Consecuencia a mirar de frente: **si la frase no funciona, la variante entera
// no funciona**, porque no hay nada más. Es la de mayor riesgo editorial y la de
// menor riesgo técnico de las doce.
export default function T4Handoff() {
  const ref = useCountUp<HTMLDListElement>({ stagger: 0.05 });

  return (
    <section className="flex min-h-[25svh] flex-col justify-center border-y border-rule bg-background text-foreground">
      <Container className="flex flex-col gap-7 py-10">
        <p className="max-w-[46ch] text-h3 text-pretty">
          {HANDOFF.lead} <Accent>{HANDOFF.tail}</Accent>
        </p>

        {/* Una fila, no una retícula: la retícula les daría a las cifras un
            bloque propio y las pondría a competir con la frase. En línea, se leen
            como su pie. */}
        <dl ref={ref} className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
          {PROOF.map((stat) => (
            <div key={stat.id} className="flex items-baseline gap-2">
              <dd data-count={stat.value} className="text-body-sm-mono tabular-nums">
                {stat.value}
              </dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
