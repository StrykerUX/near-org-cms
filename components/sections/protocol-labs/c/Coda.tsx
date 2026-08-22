"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { CLOSING } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa C · sección 15.
//
// La página abrió con la frase a escala de cartel y cierra con la mitad que
// carga el argumento —"agent economy"— cruzando la sección de borde a borde.
// Cada alternativa cierra con lo suyo: A repite las seis cifras, B enciende el
// objeto entero, C repite la palabra.
//
// El bloque va en `--ink` porque es el único momento oscuro de la página además
// de la cuarta entrada, y porque a esta escala la palabra en negativo pesa lo
// que tiene que pesar. `@container` es obligatorio: `--text-mural` mide en
// `cqw`.
export default function Coda() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 26, stagger: 0.1, start: "top 78%" });

  return (
    <section data-nav-dark className="bg-ink text-cream">
      <Container className="@container flex flex-col gap-12 py-28 lg:py-40">
        <div ref={ref} className="flex flex-col gap-10">
          <p data-reveal className="max-w-[24ch] text-h2 text-balance">
            {CLOSING.lead}
          </p>

          {/* ds-exempt: `text-mural` es un rol completo del DS (escala,
              interlineado, tracking y peso); `uppercase` no lo parchea */}
          <h2 data-reveal className="text-mural uppercase text-cta-mint">
            {CLOSING.accent}
          </h2>

          <div className="grid-ds items-end gap-y-8 pt-4">
            <p
              data-reveal
              className="col-span-full max-w-[40ch] text-body-lg text-cream/70 text-pretty lg:col-span-5"
            >
              {CLOSING.body}
            </p>
            <div data-reveal className="col-span-full lg:col-start-10 lg:col-span-3 lg:justify-self-end">
              <CtaPill href={CLOSING.cta.href} tone="solid" external>
                {CLOSING.cta.label}
              </CtaPill>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
