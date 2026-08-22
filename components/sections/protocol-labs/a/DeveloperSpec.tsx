"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CodeSample from "@/components/sections/protocol-labs/CodeSample";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { DEVELOPERS } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa A · sección 10.
//
// Las tres ventajas van como filas de una tabla y no como tres columnas: la
// sección anterior ya gastó el gesto de "tres columnas con regla arriba", y
// repetirlo dos secciones seguidas convierte una decisión de layout en un tic.
// Apiladas, además, quedan a la altura del código y las dos columnas terminan
// juntas en vez de dejar un escalón.
export default function DeveloperSpec() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 20, stagger: 0.08 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="py-28 lg:py-36">
        <div ref={ref} className="grid-ds items-start gap-y-12">
          <div data-reveal className="col-span-full flex flex-col gap-4 lg:col-span-5">
            <h2 className="text-h2 text-pretty">
              {DEVELOPERS.title.lead}
              <br />
              <Accent>{DEVELOPERS.title.accent}</Accent>
            </h2>
            <p className="max-w-[36ch] text-body-lg text-ink-soft text-pretty">
              {DEVELOPERS.subhead}
            </p>
          </div>

          <div className="col-span-full flex flex-col lg:col-start-1 lg:col-span-5 lg:row-start-2">
            {DEVELOPERS.points.map((p) => (
              <div
                key={p.title}
                data-reveal
                className="flex flex-col gap-1.5 border-t border-rule py-5"
              >
                <h3 className="text-h4">{p.title}</h3>
                <p className="max-w-[42ch] text-body text-ink-soft text-pretty">{p.body}</p>
              </div>
            ))}
            <div data-reveal className="pt-8">
              <CtaPill href={DEVELOPERS.cta.href} tone="filled" external>
                {DEVELOPERS.cta.label}
              </CtaPill>
            </div>
          </div>

          {/* El editor arranca en la fila 1 y abarca las dos: así su borde
              superior se alinea con la primera línea del titular en vez de
              apoyarse en el fondo de la columna de texto. */}
          <div
            data-reveal
            className="col-span-full lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-2"
          >
            <CodeSample frame="card" chrome />
          </div>
        </div>
      </Container>
    </section>
  );
}
