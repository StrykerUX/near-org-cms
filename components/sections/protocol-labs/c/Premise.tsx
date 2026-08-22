"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa C · secciones 3 y 2.
//
// ── Las cifras como aparato, no como banda ─────────────────────────────────
//
// Esta es la decisión estructural de C sobre la franja de prueba: las seis
// cifras van al MARGEN, en columna, a cuerpo de nota — como el aparato de datos
// de un texto impreso. No compiten con la premisa; la sostienen desde el
// costado, que es exactamente el papel que el doc les da ("proof strip") y que
// una banda a ancho completo contradice.
//
// Las tres alternativas resuelven este mismo párrafo del doc de tres maneras
// distintas y ahí se ve la diferencia entre ellas: A las funde con el titular
// (la evidencia es el argumento), B las reparte por el acto como telemetría (la
// evidencia mide la máquina), C las manda al margen (la evidencia acompaña al
// texto).
//
// ── `text-manifesto` y su condición de uso ────────────────────────────────
//
// El párrafo central usa el rol manifiesto, que mide su cuerpo en `cqw`. Por eso
// el bloque declara `@container`: sin contenedor, `cqw` resuelve contra el
// viewport y el texto sigue creciendo cuando el Container ya topó en su ancho
// máximo. Está documentado en el token; se repite acá porque es el tipo de cosa
// que se rompe en el primer copy-paste.
export default function Premise() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 22, stagger: 0.08 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="py-28 lg:py-40">
        <div ref={ref} className="grid-ds gap-y-16">
          {/* El aparato de datos. En móvil pasa arriba y en dos columnas: al pie
              de un texto que todavía no empezó no significa nada, y en una sola
              columna ocuparía media pantalla antes de la primera frase. */}
          <aside className="col-span-full grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-1 lg:gap-y-7">
            {PROOF.map((stat) => (
              <div key={stat.id} data-reveal className="flex flex-col gap-0.5">
                <span className="text-body-serif italic text-green-ink">{stat.value}</span>
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  {stat.label}
                </span>
                {stat.note && (
                  <span className="text-micro-mono text-gray-intermediate">{stat.note}</span>
                )}
              </div>
            ))}
          </aside>

          <div className="col-span-full @container lg:col-start-4 lg:col-span-8">
            <h2 data-reveal className="text-h2 text-pretty">
              {AI_SCALE.title.lead} <Accent>{AI_SCALE.title.accent}</Accent>
            </h2>
            <p data-reveal className="max-w-[20em] pt-8 text-manifesto text-pretty">
              {AI_SCALE.body}
            </p>

            {/* Las tres propiedades, numeradas al margen del párrafo que
                acaban de leer. Van como lista de notas y no como tres columnas
                con regla: el gesto de "tres columnas" ya lo usan las otras dos
                alternativas, y en un texto corrido una nota numerada es la forma
                natural de detallar lo que la frase anterior enumeró. */}
            <ol className="flex flex-col pt-14">
              {AI_SCALE.points.map((p, i) => (
                <li
                  key={p.title}
                  data-reveal
                  className="flex gap-6 border-t border-rule py-6 lg:gap-10"
                >
                  <span className="uppercase text-micro-mono text-gray-intermediate">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-1 flex-col gap-2 lg:flex-row lg:gap-12">
                    <h3 className="text-h4 lg:w-[16rem] lg:shrink-0">{p.title}</h3>
                    <p className="max-w-[52ch] text-body text-ink-soft text-pretty">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
