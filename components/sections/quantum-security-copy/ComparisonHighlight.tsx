"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import NearMark from "@/components/sections/quantum-security-copy/NearMark";
import { COMPARISON_ROWS as ROWS } from "@/components/sections/quantum-security-copy/quantumContent";

// Variante C de "The difference" (A: Comparison.tsx, tabla plana. B:
// ComparisonCards.tsx, pares de cards). Acá las dos columnas viven adentro
// de UN panel enmarcado (border + rounded-3xl, como el marco de
// RoadmapHeader's CTA o las cards de BeyondAccounts), con la columna "On
// NEAR" en un panel propio con tinte near-green-accent — el patrón de
// "columna ganadora resaltada" de una tabla de precios, aplicado acá porque
// el contraste es justo el punto de la sección.

export default function ComparisonHighlight() {
  const panelRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-background text-foreground">
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

        <div ref={panelRef} className="overflow-hidden rounded-3xl border border-foreground/12">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col p-8 lg:p-12">
              <Eyebrow className="mb-6 text-gray-intermediate">Alternatives</Eyebrow>
              {ROWS.map((row, i) => (
                <div
                  key={row.them}
                  data-reveal
                  className={`border-t border-dashed border-foreground/15 py-6 ${
                    i === 0 ? "border-t-0 pt-0" : ""
                  }`}
                >
                  <p className="max-w-[40ch] text-body text-gray-intermediate text-pretty">{row.them}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col bg-near-green-accent/10 p-8 lg:border-l lg:border-foreground/12 lg:p-12">
              <p className="mb-6 flex items-center gap-2.5 text-eyebrow uppercase">
                <NearMark className="size-[17px] shrink-0" />
                On NEAR
              </p>
              {ROWS.map((row, i) => (
                <div
                  key={row.us}
                  data-reveal
                  className={`border-t border-dashed border-near-green-accent/25 py-6 ${
                    i === 0 ? "border-t-0 pt-0" : ""
                  }`}
                >
                  <p className="max-w-[40ch] text-label-lg text-pretty">{row.us}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
