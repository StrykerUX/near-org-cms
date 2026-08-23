"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";
import HeroSpectrum from "@/components/sections/protocol-labs/opening-labs/HeroSpectrum";

// C · Spectrum — la columna como unidad de toda la apertura.
//
// ── La tesis del trío ──────────────────────────────────────────────────────
//
// Una sola idea formal atraviesa las tres secciones: **la columna vertical**.
// En el hero son bandas de luz que se interfieren; en los números, seis
// columnas, una por cifra, cada una con su barra; en "Built for AI scale", tres
// columnas anchas. La superficie no se retira como en A y B — se convierte en
// el layout.
//
// Eso resuelve un problema que las otras tienen: acá el campo y la retícula de
// la página son la MISMA cosa, así que no hay que negociar entre un fondo
// bonito y doce columnas que gobiernan todo lo demás.
//
// El hero vive aparte, en `HeroSpectrum.tsx`, desde que `combo-labs/` necesitó
// montarlo con otras secciones 2 y 3. Se importa y no se copia: las dos rutas
// que lo muestran tienen que ser el mismo hero.
//
// ── Las barras de los números NO son comparativas ─────────────────────────
//
// Seis escalas incomparables —tiempo, cantidad, precio— no admiten un gráfico
// honesto: una barra proporcional entre "1.2s" y "1M+" mentiría. Las alturas de
// acá salen del mismo campo del shader, o sea que son ritmo, no medición. Están
// atenuadas y sin eje justamente para que nadie las lea como datos.

export default function OpeningC() {
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.07 });

  return (
    <>
      <HeroSpectrum />

      {/* ── Números como columnas ─────────────────────────────────────────── */}
      <section data-nav-dark className="border-t border-cream/20 bg-[#070b09] text-cream">
        <Container className="py-16 lg:py-20">
          <dl ref={numbers} className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-6">
            {PROOF.map((stat, i) => (
              <div
                key={stat.id}
                className="flex flex-col justify-end gap-4 border-l border-cream/15 px-4 pb-2 first:border-l-0 first:pl-0"
              >
                {/* La barra. Altura de ritmo, no de dato: ver la nota del
                    encabezado. Por eso va al 18% de opacidad y sin ninguna
                    marca de escala. */}
                <span
                  aria-hidden="true"
                  className="block w-full rounded-t-sm bg-cta-mint/20"
                  style={{ height: `${BAR_HEIGHTS[i]}px` }}
                />
                <div className="flex flex-col gap-1">
                  <dd data-count={stat.value} className="text-h3 tabular-nums text-cta-mint">
                    {stat.value}
                  </dd>
                  <dt className="uppercase text-micro-mono text-cream/50">{stat.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Built for AI scale, en tres columnas anchas ───────────────────── */}
      <section className="bg-background text-foreground">
        <Container className="flex flex-col gap-16 py-28 lg:py-36">
          <div className="grid-ds gap-y-8">
            <h2 className="col-span-full text-h2 text-pretty lg:col-span-5">
              {AI_SCALE.title.lead}
              <br />
              <Accent>{AI_SCALE.title.accent}</Accent>
            </h2>
            <p className="col-span-full max-w-[40ch] text-body-lg text-ink-soft text-pretty lg:col-start-7 lg:col-span-5 lg:pt-2">
              {AI_SCALE.body}
            </p>
          </div>

          {/* Tres columnas con filete a la izquierda, del alto completo: es la
              misma banda vertical del hero, en positivo y quieta. */}
          <ul className="grid gap-y-10 md:grid-cols-3">
            {AI_SCALE.points.map((p, i) => (
              <li
                key={p.title}
                className={`flex flex-col gap-3 pl-6 ${
                  i === 0 ? "border-l border-ink" : "border-l border-rule"
                }`}
              >
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h4">{p.title}</h3>
                <p className="max-w-[34ch] text-body text-ink-soft text-pretty">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}

// Alturas en píxeles, escritas a mano. NO salen de la cifra —seis escalas
// incomparables no admiten una proporción honesta— sino de que la fila tenga
// perfil: sin variación es una regla, y con variación aleatoria en cada render
// no sobreviviría a un refresh.
const BAR_HEIGHTS = [56, 92, 40, 72, 30, 64] as const;
