"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import {
  AI_LAYER,
  NEAR_ONE,
  PARTICIPATE,
} from "@/components/sections/protocol-labs/protocolContent";

// Alternativa A · secciones 11, 12 y 13.
//
// Tres bloques cortos que en el doc van seguidos y que, a ancho completo, serían
// tres losas casi idénticas. Acá van como tres columnas de la misma fila porque
// las tres responden a la misma pregunta —quién está del otro lado del
// protocolo: los agentes, el equipo que lo construye, y vos— y verlas juntas es
// lo que hace visible esa simetría.
//
// La tercera lleva dos sub-entradas, así que su columna es la única con lista
// interna. Se resuelve con la regla hairline que ya usan las otras dos, un
// escalón más suave, en vez de con una card: una card ahí rompería la fila.
export default function Deployment() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 22, stagger: 0.1 });

  return (
    <section className="bg-background text-foreground">
      <Container className="py-28 lg:py-36">
        <div ref={ref} className="grid-ds gap-y-14">
          <article data-reveal className="col-span-full flex flex-col gap-4 lg:col-span-4">
            <span className="uppercase text-micro-mono text-gray-intermediate">11</span>
            <h2 className="text-h3 text-pretty">
              {AI_LAYER.title.lead} <Accent>{AI_LAYER.title.accent}</Accent>
            </h2>
            <p className="text-body-sm text-gray-intermediate text-pretty">{AI_LAYER.subhead}</p>
            <p className="max-w-[40ch] text-body text-ink-soft text-pretty">{AI_LAYER.body}</p>
            <a
              href={AI_LAYER.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-q-arrow-host
              className="mt-1 flex w-fit items-center gap-3 text-label"
            >
              <ArrowCircle />
              {AI_LAYER.cta.label}
            </a>
          </article>

          <article data-reveal className="col-span-full flex flex-col gap-4 lg:col-span-4">
            <span className="uppercase text-micro-mono text-gray-intermediate">12</span>
            <h2 className="text-h3 text-pretty">{NEAR_ONE.title}</h2>
            <p className="text-body-sm text-gray-intermediate text-pretty">{NEAR_ONE.subhead}</p>
            <p className="max-w-[40ch] text-body text-ink-soft text-pretty">{NEAR_ONE.body}</p>
            <a
              href={NEAR_ONE.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-q-arrow-host
              className="mt-1 flex w-fit items-center gap-3 text-label"
            >
              <ArrowCircle />
              {NEAR_ONE.cta.label}
            </a>
          </article>

          <article data-reveal className="col-span-full flex flex-col gap-4 lg:col-span-4">
            <span className="uppercase text-micro-mono text-gray-intermediate">13</span>
            <h2 className="text-h3 text-pretty">
              {PARTICIPATE.title.lead} <Accent>{PARTICIPATE.title.accent}</Accent>
            </h2>
            <div className="flex flex-col">
              {PARTICIPATE.ways.map((w) => (
                <div key={w.title} className="flex flex-col gap-1.5 border-t border-rule py-4">
                  <h3 className="text-h4">{w.title}</h3>
                  <p className="max-w-[40ch] text-body-sm text-ink-soft text-pretty">{w.body}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
