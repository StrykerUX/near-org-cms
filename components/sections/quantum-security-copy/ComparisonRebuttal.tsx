"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import NearMark from "@/components/sections/quantum-security-copy/NearMark";
import { COMPARISON_ROWS as ROWS } from "@/components/sections/quantum-security-copy/quantumContent";

// Variante E de "The difference" — donde D lee como un diff de terminal,
// esta lee como una transcripción: se CITA la afirmación ajena (serif
// itálica, `text-body-serif` — el mismo rol que el resto del sitio usa para
// "el gloss itálico que acompaña un hecho", acá invertido: la cita es lo
// dudoso, no el hecho) y se refuta debajo, indentada, en la voz sana del
// sitio. El conector en L es la única pieza gráfica nueva — nace de la idea
// de "esto responde a aquello", no de decoración.
//
// Columna angosta a propósito (max-w-2xl) y no el grid a dos columnas de las
// otras cuatro variantes: acá el punto es la SECUENCIA de lectura —
// afirmación, pausa, respuesta— y una columna ancha la rompería en dos
// mitades que se leen en paralelo en vez de una detrás de otra.

function Elbow() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="40"
      viewBox="0 0 28 40"
      fill="none"
      className="shrink-0 text-foreground/25"
    >
      <path d="M2 0v20a8 8 0 0 0 8 8h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function ComparisonRebuttal() {
  const listRef = useScrollReveal<HTMLDivElement>();

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

        <div ref={listRef} className="mx-auto flex w-full max-w-2xl flex-col">
          {ROWS.map((row, i) => (
            <div
              key={row.us}
              data-reveal
              className={`flex flex-col border-foreground/12 pb-8 pt-8 ${
                i === 0 ? "pt-0" : "border-t border-dashed"
              }`}
            >
              <p className="text-caption-mono uppercase text-foreground/40">Elsewhere</p>
              <p className="mt-2 max-w-[46ch] text-body-serif italic text-foreground/60 text-pretty">
                &ldquo;{row.them}&rdquo;
              </p>

              <div className="flex gap-1 pl-1 pt-1">
                <Elbow />
                <div className="flex flex-1 flex-col pt-2">
                  <p className="flex items-center gap-2 text-caption-mono uppercase text-foreground">
                    <NearMark className="size-3 shrink-0 text-near-green-accent" />
                    On NEAR
                  </p>
                  <p className="mt-2 max-w-[46ch] text-label-lg text-pretty">{row.us}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
