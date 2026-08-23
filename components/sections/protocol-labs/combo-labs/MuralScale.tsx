"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { AI_SCALE, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// COMBO E · Mural — la cifra ES la sección.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// E es un campo de caracteres: miles de celdas monoespaciadas con palabras
// escondidas entre ruido. Su propia nota lo dice — la sección de números es "el
// momento en que el texto del fondo se vuelve texto de verdad". Pero en el trío
// original ese momento se resuelve con seis cifras a cuerpo de nota, que es
// exactamente el tamaño del ruido del que tenían que emerger.
//
// Acá cada cifra ocupa una franja entera a escala de cartel. Seis franjas, una
// abajo de la otra. El campo se resuelve en seis palabras legibles y del tamaño
// que corresponde a lo único que la página tiene para probar.
//
// ── La inversión de jerarquía es el argumento ─────────────────────────────
//
// En las otras cuatro propuestas las cifras son evidencia y "Built for AI scale"
// es la tesis; el título manda. Acá se invierte: las cifras se llevan la escala
// y las tres propiedades bajan a mono, chicas, en tres columnas al pie.
//
// Es una apuesta y conviene decirla como tal: funciona si el lector acepta que
// esta página se sostiene en sus números y no en su discurso. Si al mirarla las
// tres propiedades se sienten abandonadas, la apuesta falló — y es lo primero a
// juzgar en esta variante, no la escala de las cifras.
//
// ── El label va a la derecha y en mono ────────────────────────────────────
//
// Debajo de la cifra sería un pie de foto; al lado y alineado a la base, es una
// anotación al margen. La segunda lectura es la que corresponde: el label no
// explica la cifra, la nombra.
//
// El contraste de registro —sans enorme contra mono diminuta, en la misma línea
// de base— es todo el diseño de esta sección. No hay ninguna otra decisión.
//
// ── Un contador por franja, y escalonado largo ────────────────────────────
//
// `stagger` alto a propósito: a esta escala dos cifras contando a la vez se leen
// como una pantalla descompuesta. De a una, cada una tiene su momento — que es
// lo que la escala está pidiendo.

export default function MuralScale() {
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.16, start: "top 85%" });
  const points = useScrollReveal<HTMLUListElement>({ y: 16, stagger: 0.09 });

  return (
    <>
      {/* ── Las seis, a escala de cartel ───────────────────────────────────── */}
      <section data-nav-dark className="border-t border-cream/20 bg-[#080a09] text-cream">
        <Container className="py-16 lg:py-20">
          <dl ref={numbers} className="flex flex-col">
            {PROOF.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-cream/15 py-7 last:border-b-0"
              >
                {/* `text-poster` y no `text-mural`: son SEIS franjas. A escala
                    mural cada una pediría su propia pantalla y la sección se
                    volvería un scroll de dos minutos para seis datos. */}
                <dd
                  data-count={stat.value}
                  className="text-poster tabular-nums text-cream text-balance"
                >
                  {stat.value}
                </dd>
                <div className="flex flex-col items-start gap-1 sm:items-end">
                  <dt className="uppercase text-micro-mono text-cta-mint">{stat.label}</dt>
                  {stat.note && (
                    <dd className="max-w-[30ch] text-micro-mono text-cream/40 sm:text-right">
                      {stat.note}
                    </dd>
                  )}
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Built for AI scale, subordinada ────────────────────────────────── */}
      {/* Blanco, no crema: después de una sección negra a escala de cartel, el
          crema se lee como una continuación apagada. El blanco corta. */}
      <section className="bg-background text-foreground">
        <Container className="flex flex-col gap-14 py-24 lg:py-28">
          <div className="grid-ds gap-y-6">
            <h2 className="col-span-full text-h3 text-pretty lg:col-span-5">
              {AI_SCALE.title.lead} <Accent>{AI_SCALE.title.accent}</Accent>
            </h2>
            <p className="col-span-full max-w-[46ch] text-body text-ink-soft text-pretty lg:col-start-7 lg:col-span-6">
              {AI_SCALE.body}
            </p>
          </div>

          {/* Las tres, en mono y a cuerpo de nota. La jerarquía invertida se
              sostiene o se cae acá: si esto se lee como un pie de página en vez
              de como tres condiciones técnicas, la variante no funciona. */}
          <ul ref={points} className="grid gap-8 border-t border-ink pt-8 md:grid-cols-3 md:gap-12">
            {AI_SCALE.points.map((p, i) => (
              <li key={p.title} data-reveal className="flex flex-col gap-3">
                <span className="uppercase text-micro-mono text-gray-intermediate">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-body-sm-mono uppercase">{p.title}</h3>
                <p className="max-w-[34ch] text-body-sm text-gray-intermediate text-pretty">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
