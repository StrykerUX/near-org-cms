"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CodeSample from "@/components/sections/protocol-labs/CodeSample";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { DEVELOPERS } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · sección 10.
//
// Composición centrada, y es la única de la página: viene inmediatamente después
// del acto, que son seis pantallas de texto a la derecha y objeto a la izquierda.
// Después de ese tramo, cualquier bloque que siga alineado a un costado se lee
// como la séptima repetición del mismo compás. Centrarlo es el corte.
//
// El código va al medio y las tres ventajas debajo, no al lado: acá el
// argumento es "mirá lo poco que hay que escribir", y para eso el bloque tiene
// que estar en el eje de lectura, no en una columna auxiliar. La alternativa A
// lo pone al costado porque ahí es una celda más de una ficha técnica.
export default function DevRuntime() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 22, stagger: 0.09 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="py-28 lg:py-36">
        <div ref={ref} className="mx-auto flex max-w-[880px] flex-col items-center gap-10 text-center">
          <h2 data-reveal className="text-h2 text-balance">
            {DEVELOPERS.title.lead} <Accent>{DEVELOPERS.title.accent}</Accent>
          </h2>
          <p data-reveal className="max-w-[40ch] text-body-lg text-ink-soft text-pretty">
            {DEVELOPERS.subhead}
          </p>
          <div data-reveal className="w-full text-left">
            <CodeSample frame="card" chrome />
          </div>
        </div>

        <div className="mx-auto grid max-w-[1100px] gap-8 pt-16 md:grid-cols-3">
          {DEVELOPERS.points.map((p) => (
            <div key={p.title} data-reveal className="flex flex-col gap-2 border-t border-rule pt-5">
              <h3 className="text-h4">{p.title}</h3>
              <p className="text-body text-ink-soft text-pretty">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-14">
          <CtaPill href={DEVELOPERS.cta.href} tone="filled" external>
            {DEVELOPERS.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
