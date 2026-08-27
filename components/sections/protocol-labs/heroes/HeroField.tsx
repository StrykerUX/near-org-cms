"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import GlyphField from "@/components/sections/protocol-labs/GlyphField";
import CtaPill from "@/components/primitives/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// El hero de E · Field, suelto.
//
// El hero de Protocol C — /prototype/protocol-c.
//
// Estuvo embebido dentro del trío de su apertura en el laboratorio, y salió
// cuando hubo que montarlo con otras secciones. Los laboratorios ya no existen:
// hoy es uno de los tres heroes entre los que la página elige, y lo único que
// cambia entre A, B y C.

export const FIELD_INK = "#262626";

export default function HeroField() {
  return (
    <section
      data-nav-dark
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#262626] pt-[var(--site-header-block)] text-cream"
    >
      <GlyphField className="absolute inset-0 z-0 h-full w-full" />
      {/* El campo llega hasta el texto y le pelea contraste. En vez de bajarle
          el alfa entero —que lo apagaría también en los bordes, que es donde
          tiene que verse— se apoya tinta sobre la franja de la copy. Mismo
          criterio que el card de `AgentEconomy` en la homepage. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 58% 44% at 42% 50%, rgba(8,10,9,0.94) 0%, rgba(8,10,9,0.6) 55%, transparent 82%)",
        }}
      />

      <Container className="relative z-20 grid-ds flex-1 items-center gap-y-10 py-14">
        <div className="col-span-full flex flex-col gap-7 lg:col-span-7">
          <p className="uppercase text-eyebrow-mono text-cream/50">{HERO.eyebrow}</p>
          <h1 className="text-h1 text-balance">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
        </div>
        <div className="col-span-full flex flex-col gap-7 lg:col-start-9 lg:col-span-4 lg:self-end lg:pb-2">
          <p className="max-w-[36ch] text-body-lg text-cream/70 text-pretty">{HERO.body}</p>
          <CtaPill href={HERO.cta.href} tone="solid" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
