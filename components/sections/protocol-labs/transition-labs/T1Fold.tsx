"use client";

import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T1 · Fold — el papel se pliega. ~28svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// La página se comporta como un documento: retícula de doce columnas, mono para
// las etiquetas, serif para los acentos. Esta transición lleva esa metáfora al
// plano físico — el crema del hero **se pliega** en una franja y las cifras viven
// sobre el pliegue. Debajo del doblez empieza el blanco, que es el papel de la
// sección siguiente.
//
// No es un separador con sombra: el pliegue tiene una dirección. La luz entra
// desde arriba, así que la mitad superior se oscurece hacia el doblez y la
// inferior se aclara alejándose de él. Ese gradiente asimétrico es lo que
// convierte dos rectángulos en un papel doblado; simétrico, se ve como una barra
// con degradé.
//
// ── Por qué es la más contenida de las doce ───────────────────────────────
//
// Porque es la que hay que elegir si la respuesta correcta resulta ser "la
// transición no debería llamar la atención". Todo el trabajo lo hace un gradiente
// y una línea; las cifras se leen enteras, en fila, sin nada compitiendo.
//
// ── El doblez es una línea real, no un borde ──────────────────────────────
//
// Va como `<span>` absoluto y no como `border-bottom` porque tiene que ser más
// oscuro que el resto y estar EN el punto donde las dos superficies se tocan, no
// al final de la caja. Con un borde, el gradiente inferior lo empujaría fuera de
// su propio pliegue.
export default function T1Fold() {
  const ref = useCountUp<HTMLDListElement>({ stagger: 0.06 });

  return (
    <section className="relative isolate flex min-h-[28svh] flex-col justify-center overflow-hidden bg-background text-foreground">
      {/* La cara superior del pliegue: el crema del hero, oscureciéndose hacia
          el doblez. Ocupa el 62% y no la mitad — un pliegue centrado se lee
          como una cinta, y lo que se busca es que la hoja siga siendo una hoja
          con un doblez cerca de su borde. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[62%]"
        style={{
          background:
            "linear-gradient(to bottom, var(--cream) 0%, var(--cream) 55%, color-mix(in srgb, var(--cream) 88%, black) 100%)",
        }}
      />
      {/* La cara inferior: el blanco de la sección siguiente, saliendo de la
          sombra del doblez. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--background) 92%, black) 0%, var(--background) 60%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[62%] h-px bg-ink/25"
      />

      <Container className="relative py-10">
        <dl ref={ref} className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {PROOF.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-0.5">
              <dd data-count={stat.value} className="text-h4 tabular-nums">
                {stat.value}
              </dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
