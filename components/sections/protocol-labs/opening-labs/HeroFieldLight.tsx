"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import GlyphField from "@/components/sections/protocol-labs/opening-labs/GlyphField";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// El hero de G · Field claro, suelto.
//
// Salió de dentro de `OpeningG` cuando `combo-labs/` necesitó montarlo con otras
// secciones 2 y 3. `OpeningG` lo importa desde acá.

export default function HeroFieldLight() {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-cream pt-[var(--site-header-block)] text-foreground">
      <GlyphField tone="light" className="absolute inset-0 z-0 h-full w-full" />

      {/* Velo de LEGIBILIDAD, y en crema: despeja la zona de la copy sin apagar
          el campo en los bordes, que es donde tiene que verse.

          Es radial y no vertical por lo mismo que en E —el texto ocupa una
          elipse, no una franja— y **no llega a ningún borde**: un velo que
          termina fundiéndose con la sección siguiente sería el degradé de
          transición que este laboratorio no usa. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 58% 44% at 42% 50%, var(--cream) 0%, color-mix(in srgb, var(--cream) 72%, transparent) 55%, transparent 82%)",
        }}
      />

      <Container className="relative z-20 grid-ds flex-1 items-center gap-y-10 py-14">
        <div className="col-span-full flex flex-col gap-7 lg:col-span-7">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
        </div>

        <div className="col-span-full flex flex-col gap-7 lg:col-start-9 lg:col-span-4 lg:self-end lg:pb-2">
          <p className="max-w-[36ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
          {/* `filled` y no `solid`: la píldora blanca de las aperturas oscuras
              desaparece sobre crema. */}
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
