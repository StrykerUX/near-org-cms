"use client";

import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import GlyphField from "@/components/sections/protocol-labs/opening-labs/GlyphField";
import { ScaleSection } from "@/components/sections/protocol-labs/opening-labs/ScaleSection";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";
import HeroField from "@/components/sections/protocol-labs/opening-labs/HeroField";

// E · Field — la superficie es texto.
//
// ── La tesis del trío ──────────────────────────────────────────────────────
//
// Ni shader ni geometría: una retícula de caracteres monoespaciados, densa, en
// la que están escritas las palabras del protocolo — SHARD, FINALITY, WITNESS,
// SIGNATURE— entre ruido. Una onda lenta las va encendiendo por tramos, así que
// las palabras aparecen y se disuelven sin que nada se mueva de lugar.
//
// Es la respuesta más barata y probablemente la más difícil de imitar: no
// depende de GPU, no depende de un asset, y su textura sale de la misma
// monoespaciada con la que está rotulada toda la página. La homepage ya usa este
// recurso en `AgentEconomy`; acá el campo lleva vocabulario en vez de ruido puro.
//
// ── Por qué el texto está en el canvas y no en el DOM ────────────────────
//
// Son varios miles de celdas repintadas cada frame. En el DOM eso son varios
// miles de nodos con su propio estilo — el navegador puede, pero el costo de
// layout no se paga por un fondo. En canvas es una sola llamada de dibujo por
// celda sobre un buffer a media resolución.
//
// El campo es `aria-hidden` y decorativo: nada de lo que dice es contenido, y
// las palabras que aparecen ya están en la página como texto real.
//
// El campo vive en `GlyphField.tsx`, compartido con la apertura G — que es esta
// misma superficie en claro. Ahí está documentado por qué los dos tonos no
// comparten calibración.

export default function OpeningE() {
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.07 });

  return (
    <>
      <HeroField />

      {/* ── Números ───────────────────────────────────────────────────────── */}
      {/* Las cifras en mono, del mismo cuerpo grande que el campo nunca alcanza:
          es el momento en que el texto del fondo se vuelve texto de verdad. */}
      <section data-nav-dark className="relative isolate overflow-hidden border-t border-cream/20 bg-[#080a09] text-cream">
        <GlyphField className="absolute inset-0 z-0 h-full w-full opacity-45" />
        {/* Velo de LEGIBILIDAD, no de transición.
            
            Es una capa de tinta plana y no un degradé vertical, y esa es una
            regla del laboratorio: **ninguna sección se funde con la siguiente**.
            Un degradé que termina en el color del bloque de abajo disuelve el
            borde entre dos secciones, y lo que se busca acá es lo contrario —
            que la superficie termine donde termina y que el corte se vea.
            
            Plano tiene además una ventaja concreta sobre el degradé: la
            legibilidad del texto es la misma en la primera línea que en la
            última, en vez de depender de a qué altura de la caja cayó. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[rgba(8,10,9,0.8)]"
        />
        <Container className="relative z-20 py-20 lg:py-24">
          <dl ref={numbers} className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-2">
                <dd data-count={stat.value} className="text-h4-mono tabular-nums text-cta-mint">
                  {stat.value}
                </dd>
                <dt className="uppercase text-micro-mono text-cream/50">{stat.label}</dt>
                {stat.note && <dd className="text-micro-mono text-cream/35">{stat.note}</dd>}
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ScaleSection />
    </>
  );
}
