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

// Alternativa C · secciones 11, 12 y 13.
//
// Tres bloques con la misma estructura de un texto con subtítulos: el título en
// serif a la izquierda, el cuerpo a la derecha, separados por una regla. Es la
// misma retícula que usan las entradas del ensayo un escalón más abajo —sin la
// palabra mural— para que se lean como la continuación del mismo documento y no
// como tres cards que aparecieron al final.
//
// La participación va última y con sus dos formas en línea: es lo único de la
// página dirigido al lector en segunda persona, y termina el texto donde
// corresponde, justo antes de las lecturas.
export default function Actors() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 22, stagger: 0.09 });

  return (
    <section className="bg-background text-foreground">
      <Container className="py-28 lg:py-36">
        <div ref={ref} className="flex flex-col">
          <article data-reveal className="grid-ds gap-y-6 border-t border-ink py-12">
            <div className="col-span-full flex flex-col gap-2 lg:col-span-4">
              <h2 className="text-h3-serif italic">
                {AI_LAYER.title.lead} <Accent>{AI_LAYER.title.accent}</Accent>
              </h2>
              <p className="text-body-sm text-gray-intermediate text-pretty">
                {AI_LAYER.subhead}
              </p>
            </div>
            <div className="col-span-full flex flex-col gap-5 lg:col-start-6 lg:col-span-7">
              <p className="max-w-[60ch] text-body-lg text-ink-soft text-pretty">
                {AI_LAYER.body}
              </p>
              <a
                href={AI_LAYER.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-q-arrow-host
                className="flex w-fit items-center gap-3 text-label"
              >
                <ArrowCircle />
                {AI_LAYER.cta.label}
              </a>
            </div>
          </article>

          <article data-reveal className="grid-ds gap-y-6 border-t border-rule py-12">
            <div className="col-span-full flex flex-col gap-2 lg:col-span-4">
              <h2 className="text-h3-serif italic">{NEAR_ONE.title}</h2>
              <p className="text-body-sm text-gray-intermediate text-pretty">
                {NEAR_ONE.subhead}
              </p>
            </div>
            <div className="col-span-full flex flex-col gap-5 lg:col-start-6 lg:col-span-7">
              <p className="max-w-[60ch] text-body-lg text-ink-soft text-pretty">
                {NEAR_ONE.body}
              </p>
              <a
                href={NEAR_ONE.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-q-arrow-host
                className="flex w-fit items-center gap-3 text-label"
              >
                <ArrowCircle />
                {NEAR_ONE.cta.label}
              </a>
            </div>
          </article>

          <article data-reveal className="grid-ds gap-y-6 border-y border-rule py-12">
            <div className="col-span-full lg:col-span-4">
              <h2 className="text-h3-serif italic">
                {PARTICIPATE.title.lead} <Accent>{PARTICIPATE.title.accent}</Accent>
              </h2>
            </div>
            <div className="col-span-full grid gap-8 lg:col-start-6 lg:col-span-7 lg:grid-cols-2">
              {PARTICIPATE.ways.map((w) => (
                <div key={w.title} className="flex flex-col gap-2">
                  <h3 className="text-h4">{w.title}</h3>
                  <p className="text-body text-ink-soft text-pretty">{w.body}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
