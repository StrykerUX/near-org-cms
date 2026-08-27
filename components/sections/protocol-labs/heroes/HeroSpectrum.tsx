"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import GlSurface, { hexToRgb } from "@/components/primitives/GlSurface";
import { SPECTRUM_FRAG } from "@/components/primitives/gl/spectrum";
import CtaPill from "@/components/primitives/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// El hero de C · Spectrum, suelto.
//
// El hero de Protocol B — /prototype/protocol-b.
//
// Estuvo embebido dentro del trío de su apertura en el laboratorio, y salió
// cuando hubo que montarlo con otras secciones. Los laboratorios ya no existen:
// hoy es uno de los tres heroes entre los que la página elige, y lo único que
// cambia entre A, B y C.
//
// ── El layout es propio de esta superficie ────────────────────────────────
//
// El titular baja al tercio inferior y se alinea a la izquierda, contra el borde
// del contenedor. La mitad superior queda para el espectro. Un titular centrado
// en medio de bandas verticales las corta por la mitad; abajo, las deja correr
// enteras y el texto se apoya sobre ellas como sobre un pie.

const INK = "#00dc8d";

const SPECTRUM_UNIFORMS = {
  u_bg: hexToRgb(INK),
  u_low: hexToRgb("#00dc8d"),
  u_high: hexToRgb("#00dc8d"),
  // Doce: las mismas columnas que gobiernan la página. Es el número que hace
  // que la superficie y la retícula sean lo mismo.
  u_columns: 12,
  u_speed: 0.35,
  u_soft: 0.55,
};

export default function HeroSpectrum() {
  return (
    <section
      data-nav-dark
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-[var(--site-header-block)] text-cream"
    >
      <GlSurface
        fragment={SPECTRUM_FRAG}
        uniforms={SPECTRUM_UNIFORMS}
        tag="opening-spectrum"
        fallback={INK}
        className="absolute inset-0 z-0 h-full w-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          // El pie de tinta que sostiene la copy. Sube desde abajo y deja las
          // bandas enteras en los dos tercios superiores, que es donde tienen
          // que verse correr.
          background:
            "linear-gradient(to bottom, rgba(7,11,9,0.25) 0%, rgba(7,11,9,0.1) 34%, rgba(7,11,9,0.82) 62%, rgba(7,11,9,0.97) 100%)",
        }}
      />

      <Container className="relative z-20 grid-ds items-end gap-y-8 pb-16">
        <div className="col-span-full flex flex-col gap-6 lg:col-span-7">
          <p className="uppercase text-eyebrow-mono text-cream/50">{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
        </div>
        <div className="col-span-full flex flex-col gap-6 lg:col-start-9 lg:col-span-4">
          <p className="max-w-[36ch] text-body-lg text-cream/70 text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="solid" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
