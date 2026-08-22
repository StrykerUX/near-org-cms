"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import GlSurface, { hexToRgb } from "@/components/sections/protocol-labs/opening-labs/GlSurface";
import { VORONOI_FRAG } from "@/components/sections/protocol-labs/opening-labs/gl/voronoi";
import { ScaleSection } from "@/components/sections/protocol-labs/opening-labs/OpeningA";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// B · Shards — la superficie dice de qué habla la página.
//
// ── La tesis del trío ──────────────────────────────────────────────────────
//
// Un campo de Voronoi: puntos que derivan y, con ellos, las fronteras de sus
// regiones. Es la única de las seis superficies que **explica** en vez de
// acompañar — un espacio partido en regiones que se redistribuyen es,
// literalmente, el tema de esta página.
//
// El trío lo lleva de lo abstracto a lo concreto en tres pasos: el hero muestra
// el campo entero y sin rótulos; las cifras se meten cada una DENTRO de una
// región dibujada; y "Built for AI scale" ya no tiene campo, porque a esa altura
// el lector ya sabe qué son esas celdas. La superficie enseña un vocabulario y
// después se retira.
//
// ── Por qué las cifras van dentro de celdas dibujadas y no sobre el canvas ─
//
// El shader se mueve: una cifra encima de una frontera que deriva queda a veces
// legible y a veces no, y eso no se puede calibrar. Las celdas de la sección de
// números son SVG estático con la misma geometría de fronteras — el mismo
// dibujo, quieto, con el texto en su interior. La continuidad la da la forma, no
// el mismo elemento.
//
// ── El layout del hero es el actual, centrado ─────────────────────────────
//
// Con una superficie tan cargada, el titular alineado a la izquierda deja la
// mitad derecha peleando sola contra el campo. Centrado, la copy hace de eje y
// el campo se reparte simétrico a los dos lados. Es el único cambio de
// composición de esta alternativa.

const INK = "#080c0a";

const VORONOI_UNIFORMS = {
  u_bg: hexToRgb(INK),
  u_edge: hexToRgb("#3f8f68"),
  u_glow: hexToRgb("#8bf29c"),
  // Diez regiones visibles en el ancho: el número de shards de la red, que es
  // el motivo por el que esta escala y no otra.
  u_scale: 3.2,
  u_drift: 0.08,
  u_edgeWidth: 0.004,
};

export default function OpeningB() {
  const numbers = useCountUp<HTMLDListElement>({ stagger: 0.07 });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        data-nav-dark
        className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden pt-[var(--site-header-block)] text-cream"
      >
        <GlSurface
          fragment={VORONOI_FRAG}
          uniforms={VORONOI_UNIFORMS}
          tag="opening-voronoi"
          fallback={INK}
          // `renderScale` a 0.85 y no 0.6: este shader tiene bordes finos que a
          // baja resolución aliasean y titilan al derivar. Es el único de los
          // cuatro que lo necesita.
          renderScale={0.85}
          className="absolute inset-0 z-0 h-full w-full"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 62% 46% at 50% 50%, rgba(8,12,10,0.92) 0%, rgba(8,12,10,0.6) 55%, rgba(8,12,10,0.1) 85%)",
          }}
        />

        <Container className="relative z-20 flex flex-col items-center gap-8 py-20 text-center">
          <p className="uppercase text-eyebrow-mono text-cream/50">{HERO.eyebrow}</p>
          <h1 className="max-w-[18ch] text-display text-balance">
            {HERO.lead} <Accent display>{HERO.accent}</Accent>
          </h1>
          <p className="max-w-[42ch] text-body-lg text-cream/70 text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="solid" external>
            {HERO.cta.label}
          </CtaPill>
        </Container>
      </section>

      {/* ── Números, cada uno en su región ────────────────────────────────── */}
      <section className="bg-background text-foreground">
        <Container className="py-20 lg:py-24">
          <dl ref={numbers} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PROOF.map((stat, i) => (
              <div key={stat.id} className="relative flex min-h-[9.5rem] flex-col justify-end p-4">
                {/* La celda. Cada una tiene su propia silueta —seis polígonos
                    distintos, no seis rectángulos— porque una región de Voronoi
                    no es una caja: si lo fueran, la continuidad con el hero se
                    perdería y quedarían seis cards. */}
                <CellOutline index={i} />
                <div className="relative flex flex-col gap-1">
                  <dd data-count={stat.value} className="text-h3 tabular-nums">
                    {stat.value}
                  </dd>
                  <dt className="uppercase text-micro-mono text-gray-intermediate">
                    {stat.label}
                  </dt>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ScaleSection tone="cream" />
    </>
  );
}

// Seis siluetas de celda. Los vértices están escritos a mano y no generados:
// un Voronoi real en SVG pediría el mismo cómputo que el shader para un dibujo
// que está QUIETO, y lo único que hace falta es que las seis se lean como
// regiones de un mismo mosaico — bordes no paralelos, ángulos distintos, y
// ninguna con las cuatro esquinas rectas.
const CELLS = [
  "M2,14 L58,2 L98,20 L92,96 L20,98 L2,62 Z",
  "M6,4 L96,10 L98,72 L54,98 L4,88 Z",
  "M2,22 L44,2 L98,14 L94,84 L34,98 L6,74 Z",
  "M8,2 L92,6 L98,58 L66,98 L2,90 Z",
  "M2,10 L70,2 L98,36 L88,92 L18,96 Z",
  "M4,6 L94,2 L98,66 L52,98 L2,80 Z",
] as const;

function CellOutline({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <path
        d={CELLS[index % CELLS.length]}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        // `vectorEffect` acá SÍ: el path se estira con `preserveAspectRatio:
        // none`, así que sin esto el trazo saldría más grueso en un eje que en
        // el otro y las celdas se verían deformadas en vez de recortadas.
        vectorEffect="non-scaling-stroke"
        className="text-ink/25"
      />
    </svg>
  );
}
