"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import ArtPlaceholder from "@/components/sections/protocol-labs/ArtPlaceholder";
import {
  AI_LAYER,
  NEAR_ONE,
  PARTICIPATE,
} from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · secciones 11, 12 y 13.
//
// Dos bloques arriba —los agentes y el equipo— y la participación como banda de
// cierre. El reparto no es estético: 11 y 12 hablan de quién USA y quién
// CONSTRUYE el protocolo, y 13 de cómo entra el lector. Poner las tres en una
// fila de tres, como hace la alternativa A, las nivela; acá la tercera cambia de
// registro porque cambia de destinatario.
//
// El hueco de imagen es el único de las tres alternativas y está declarado a
// propósito: si esta dirección gana, ese es el lugar donde una render isométrica
// hace más por la página que un bloque de texto más. Ver `ArtPlaceholder`.
export default function Operators() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 22, stagger: 0.1 });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-24 py-28 lg:py-36">
        <div ref={ref} className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <div data-reveal className="flex flex-col gap-5">
            <h2 className="text-h2 text-pretty">
              {AI_LAYER.title.lead}
              <br />
              <Accent>{AI_LAYER.title.accent}</Accent>
            </h2>
            <p className="text-body-sm text-gray-intermediate text-pretty">{AI_LAYER.subhead}</p>
            <p className="max-w-[44ch] text-body-lg text-ink-soft text-pretty">{AI_LAYER.body}</p>
            <a
              href={AI_LAYER.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-q-arrow-host
              className="mt-2 flex w-fit items-center gap-3 text-label"
            >
              <ArrowCircle />
              {AI_LAYER.cta.label}
            </a>
          </div>

          <div data-reveal className="flex flex-col gap-6">
            <ArtPlaceholder
              label="Isometric still — agents on the network"
              note="Fondo negro, wireframe hairline, un solo elemento encendido en los verdes del CTA. Misma dirección que los renders iso-* existentes."
              ratio="16 / 10"
            />
            <div className="flex flex-col gap-3 border-t border-rule pt-6">
              <h3 className="text-h3">{NEAR_ONE.title}</h3>
              <p className="text-body-sm text-gray-intermediate text-pretty">{NEAR_ONE.subhead}</p>
              <p className="max-w-[46ch] text-body text-ink-soft text-pretty">{NEAR_ONE.body}</p>
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
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="text-h2 text-pretty">
            {PARTICIPATE.title.lead} <Accent>{PARTICIPATE.title.accent}</Accent>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {PARTICIPATE.ways.map((w) => (
              <div key={w.title} className="flex flex-col gap-2.5 border-t border-ink pt-6">
                <h3 className="text-h4">{w.title}</h3>
                <p className="max-w-[46ch] text-body text-ink-soft text-pretty">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
