"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { COMPARISON_ROWS as ROWS } from "@/components/sections/quantum-security-copy/quantumContent";

// Variante D de "The difference" — la que se anima "el diseño en serio":
// no otra tabla ni otro par de cards, sino el mismo contraste leído como un
// PARCHE de git. El resto de la página ya habla en CLI (LiveToday: "Rotate
// your keys with the NEAR CLI"), así que un diff no es un disfraz — es el
// vocabulario que la página ya usa, aplicado a la sección que compara.
//
// bg-ink-slate (no un hex nuevo): es el mismo tono oscuro que ThreatSequence
// ya usa para su beat "amenaza" — la sección reaparece acá como un segundo
// latido oscuro en un scroll casi todo claro, no como una nota suelta.
// --destructive/near-green-accent son los dos tokens del repo que ya
// significan "quitado"/"agregado" en cualquier otro contexto (errores,
// acento de marca) — reusarlos es lo que hace que el diff LEA como diff sin
// tener que inventar semántica de color nueva.

const DIFF_LINES = ROWS.flatMap((row, i) => [
  { type: "rm" as const, text: row.them, n: i * 2 + 1 },
  { type: "add" as const, text: row.us, n: i * 2 + 2 },
]);

export default function ComparisonPatch() {
  const bodyRef = useScrollReveal<HTMLDivElement>({
    targets: "[data-diff-line]",
    y: 0,
    duration: 0.45,
    stagger: 0.07,
    start: "top 80%",
  });

  return (
    <section className="bg-ink-slate text-white">
      <Container className="flex flex-col gap-16 py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-white/45">The difference</Eyebrow>
            <h2 className="text-h2 text-pretty">
              How is NEAR different from other
              <br />
              <Accent>quantum-safe chains?</Accent>
            </h2>
          </div>
          <p className="text-body-lg text-white/60 text-pretty lg:pt-10">
            Most post-quantum protection in production today is narrower than it sounds. On
            NEAR, quantum safety is a default account-level property, live in production,
            not an opt-in tool or a roadmap item.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-3.5 sm:px-8">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </span>
            <p className="text-caption-mono text-white/40">quantum-readiness.diff</p>
          </div>

          <div ref={bodyRef} className="overflow-x-auto px-5 py-6 sm:px-8">
            <div className="grid min-w-[34rem] grid-cols-[2.25rem_1.5rem_1fr] gap-y-0.5">
              {DIFF_LINES.map((line) => (
                <div
                  key={line.n}
                  data-diff-line
                  className={`col-span-3 grid grid-cols-subgrid items-baseline rounded-md px-2 py-2.5 ${
                    line.type === "rm" ? "bg-destructive/[0.09]" : "bg-near-green-accent/[0.09]"
                  }`}
                >
                  <span className="text-caption-mono tabular-nums text-white/25">{line.n}</span>
                  <span
                    aria-hidden="true"
                    className={`text-body-sm-mono ${line.type === "rm" ? "text-destructive" : "text-near-green-accent"}`}
                  >
                    {line.type === "rm" ? "−" : "+"}
                  </span>
                  <span
                    className={`text-body-sm-mono text-pretty ${
                      line.type === "rm" ? "text-white/45" : "text-white/90"
                    }`}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-1.5 border-t border-white/10 pt-5 text-body-sm-mono text-white/50">
              <p>$ quantum-readiness --status</p>
              <p className="text-near-green-accent">
                ✓ live on mainnet
                <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-[2px] translate-y-[2px] bg-near-green-accent motion-safe:animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
