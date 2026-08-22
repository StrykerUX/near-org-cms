"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { AI_SCALE } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa A · sección 3. El encabezado conceptual de la tabla que viene
// después: tres propiedades numeradas, sin figura.
//
// Sin figura A PROPÓSITO. Es la única sección de esta alternativa que no lleva
// dibujo, y esa ausencia es el hueco de aire antes del bloque más denso de la
// página. Ponerle tres iconos la volvería un tercer sistema gráfico compitiendo
// con la retícula del hero y con las figuras de la tabla.
export default function Properties() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.08 });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-16 py-28 lg:py-36">
        <div className="grid-ds gap-y-8">
          <h2 data-reveal className="col-span-full text-h2 text-pretty lg:col-span-5">
            {AI_SCALE.title.lead}
            <br />
            <Accent>{AI_SCALE.title.accent}</Accent>
          </h2>
          <p className="col-span-full max-w-[40ch] text-body-lg text-ink-soft text-pretty lg:col-start-7 lg:col-span-5 lg:pt-2">
            {AI_SCALE.body}
          </p>
        </div>

        <div ref={ref} className="grid-ds gap-y-12">
          {AI_SCALE.points.map((p, i) => (
            <article
              key={p.title}
              data-reveal
              // Cuatro columnas cada una: las tres llenan las doce sin dejar un
              // resto que haya que centrar a ojo.
              className="col-span-full flex flex-col gap-3 border-t border-ink pt-5 lg:col-span-4"
            >
              <span className="uppercase text-micro-mono text-gray-intermediate">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h4">{p.title}</h3>
              <p className="max-w-[40ch] text-body text-ink-soft text-pretty">{p.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
