"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ColumnRule from "@/components/sections/protocol-labs/a/ColumnRule";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { CLOSING, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa A · sección 15.
//
// El cierre repite las seis cifras del hero, y esa repetición es el argumento
// entero de A en un gesto: la página abrió afirmando y probando a la vez, y
// cierra igual. Entre las dos hay una tabla que explica CÓMO se sostiene cada
// una de esas cifras.
//
// Va sobre `--ink` y con la retícula invertida —el único bloque oscuro de la
// página además de la celda del shard privado— porque es lo que le da a la
// alternativa más clara de las tres un final con peso. Sin él, A termina igual
// que empezó y la página se lee plana de punta a punta.
//
// Alineado a la izquierda como todo lo demás. Un cierre centrado sería el único
// eje distinto en toda la página, y ese cambio de eje se lee como si el cierre
// perteneciera a otra plantilla.
export default function ClosingSpec() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 24, stagger: 0.09, start: "top 75%" });

  return (
    <section data-nav-dark className="relative isolate overflow-hidden bg-ink text-cream">
      <ColumnRule tone="dark" />

      <Container className="relative z-10 py-28 lg:py-36">
        <div ref={ref} className="grid-ds gap-y-14">
          <div data-reveal className="col-span-full flex flex-col gap-7 lg:col-span-7">
            <h2 className="text-h1 text-balance">
              {CLOSING.lead} <Accent display>{CLOSING.accent}</Accent>
            </h2>
            <p className="max-w-[34ch] text-body-lg text-cream/70 text-pretty">{CLOSING.body}</p>
            <div className="pt-1">
              <CtaPill href={CLOSING.cta.href} tone="solid" external>
                {CLOSING.cta.label}
              </CtaPill>
            </div>
          </div>

          <dl
            data-reveal
            className="col-span-full grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:col-start-9 lg:col-span-4 lg:grid-cols-2 lg:self-end"
          >
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-1 border-t border-cream/25 pt-3">
                <dd className="text-h4 text-cream">{stat.value}</dd>
                <dt className="uppercase text-micro-mono text-cream/50">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
