"use client";

import { Check, X } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import NearMark from "@/components/sections/quantum-security-copy/NearMark";
import { COMPARISON_ROWS as ROWS } from "@/components/sections/quantum-security-copy/quantumContent";

// Variante B de "The difference" (la A es Comparison.tsx, la tabla de dos
// columnas): mismo copy y mismos COMPARISON_ROWS, pero cada fila se lee como
// un par de cards en vez de una fila de tabla — X muda para la alternativa,
// check en near-green-accent para NEAR. Motivo del rediseño: en la tabla
// plana las dos columnas pesan igual, y acá "NEAR gana" se lee de un
// vistazo por el color, no por leer las dos frases entera. El lenguaje de
// card (rounded-3xl, bg-stone/bg-white) es el mismo que BeyondAccounts.tsx y
// PressCarousel usan en el resto del sitio.

export default function ComparisonCards() {
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-16 py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-ink-soft">The difference</Eyebrow>
            <h2 className="text-h2 text-pretty">
              How is NEAR different from other
              <br />
              <Accent>quantum-safe chains?</Accent>
            </h2>
          </div>
          <p className="text-body-lg text-ink-soft text-pretty lg:pt-10">
            Most post-quantum protection in production today is narrower than it sounds. On
            NEAR, quantum safety is a default account-level property, live in production,
            not an opt-in tool or a roadmap item.
          </p>
        </div>

        <div className="grid gap-4 pb-1 lg:grid-cols-2 lg:gap-6">
          <Eyebrow className="text-gray-intermediate">Alternatives</Eyebrow>
          <p className="flex items-center gap-2.5 text-eyebrow uppercase">
            <NearMark className="size-[17px] shrink-0" />
            On NEAR
          </p>
        </div>

        <div ref={gridRef} className="flex flex-col gap-4">
          {ROWS.map((row) => (
            <div key={row.us} data-reveal className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              <div className="flex items-start gap-4 rounded-3xl bg-stone p-6">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground/50">
                  <X className="size-3.5" strokeWidth={2.5} />
                </span>
                <p className="max-w-[42ch] text-body text-gray-intermediate text-pretty">{row.them}</p>
              </div>

              <div className="flex items-start gap-4 rounded-3xl bg-near-green-accent/12 p-6">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-near-green-accent text-black">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <p className="max-w-[42ch] text-label-lg text-pretty">{row.us}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
