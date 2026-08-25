"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CtaPill from "@/components/primitives/CtaPill";
import MachineArt from "@/components/sections/protocol-labs/machineArt";
import { CLOSING } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · sección 15.
//
// El objeto vuelve, y por primera y única vez con TODAS sus capas encendidas al
// mismo tiempo (`beat="all"`). Durante el acto se lo vio de a una: la página
// cierra mostrando que las seis eran el mismo sistema, que es literalmente el
// argumento de esta dirección.
//
// Por eso el cierre lleva figura y las otras dos alternativas no: en A el cierre
// repite las cifras (su tesis es la evidencia) y en C repite la palabra (su tesis
// es el argumento). Cada una cierra con lo suyo.
export default function MachineClose() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 24, stagger: 0.1, start: "top 75%" });

  return (
    <section data-nav-dark className="relative isolate overflow-hidden bg-ink text-cream">
      <Container className="relative z-10 py-28 lg:py-36">
        <div ref={ref} className="flex flex-col items-center gap-10 text-center">
          <div data-reveal aria-hidden="true" className="w-full max-w-[560px]">
            <MachineArt beat="all" className="h-[38svh] w-full" />
          </div>

          <h2 data-reveal className="max-w-[20ch] text-h1 text-balance">
            {CLOSING.lead} <Accent display>{CLOSING.accent}</Accent>
          </h2>
          <p data-reveal className="max-w-[36ch] text-body-lg text-cream/70 text-pretty">
            {CLOSING.body}
          </p>
          <div data-reveal>
            <CtaPill href={CLOSING.cta.href} tone="solid" external>
              {CLOSING.cta.label}
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
