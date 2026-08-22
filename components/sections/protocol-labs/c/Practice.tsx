"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CodeSample from "@/components/sections/protocol-labs/CodeSample";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { DEVELOPERS } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa C · sección 10 — el código como FIGURA.
//
// Con rótulo y pie, como la figura de un texto: es la forma que tiene una
// evidencia dentro de un argumento. Las otras dos alternativas lo tratan como
// producto (A lo mete en una celda de la ficha; B lo centra como demo) y esa
// diferencia es exactamente la que se está comparando.
//
// "Fig. 01" es chrome del documento, no copy de marca — describe qué es el
// bloque, igual que el encabezado de columna de la tabla en A.
export default function Practice() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 22, stagger: 0.09 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="py-28 lg:py-36">
        <div ref={ref} className="grid-ds gap-y-12">
          <div data-reveal className="col-span-full flex flex-col gap-5 lg:col-span-5">
            <h2 className="text-h2 text-pretty">
              {DEVELOPERS.title.lead} <Accent>{DEVELOPERS.title.accent}</Accent>
            </h2>
            <p className="max-w-[34ch] text-body-lg text-ink-soft text-pretty">
              {DEVELOPERS.subhead}
            </p>

            <ul className="flex flex-col pt-4">
              {DEVELOPERS.points.map((p) => (
                <li key={p.title} className="flex flex-col gap-1.5 border-t border-rule py-5">
                  <h3 className="text-h4">{p.title}</h3>
                  <p className="max-w-[42ch] text-body text-ink-soft text-pretty">{p.body}</p>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <CtaPill href={DEVELOPERS.cta.href} tone="filled" external>
                {DEVELOPERS.cta.label}
              </CtaPill>
            </div>
          </div>

          <figure
            data-reveal
            className="col-span-full flex flex-col gap-4 lg:col-start-7 lg:col-span-6"
          >
            <CodeSample frame="figure" />
            <figcaption className="flex gap-4 text-micro-mono text-gray-intermediate">
              <span className="uppercase">Fig. 01</span>
              <span className="max-w-[46ch]">
                A view method on a NEAR smart contract, in TypeScript, with the JS SDK.
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
