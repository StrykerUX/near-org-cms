"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import CtaPill from "@/components/primitives/CtaPill";
import BloomField from "@/components/sections/quantum-security-heroes/BloomField";
import { HERO_BODY, HERO_CTA } from "@/components/sections/quantum-security-heroes/heroContent";

// Hero · H2 accomodo — ver /prototype/protocol-heroes/h2 (H2Count.tsx). Mismo
// reparto que esa referencia: el bloque de texto nace centrado en el alto de
// la pantalla pero se apoya contra el borde izquierdo, sin centrar el eje
// horizontal. Ahí las seis cifras vivían DENTRO del hero, a sangre en el
// borde inferior; acá no — el proof strip de esta página es su propia
// sección (ProofMarquee) y es idéntico en las tres versiones, así que vive
// afuera del hero en las tres. Ver el README de la carpeta.
//
// Fondo: campo ASCII de islas a mano — ver BloomField.tsx. Reemplaza a las
// "tuberías" (PipesField, borrado 2026-08-23: el equipo pidió rehacer ese
// fondo de cero), que a su vez habían reemplazado al campo de nodos
// original (quitado a pedido, 2026-08-22).
export default function HeroH2() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const heading = q("[data-hero-heading]")[0];
      const rest = q("[data-hero-item]");

      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

      if (heading) {
        SplitText.create(heading, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            // La última línea ("live on mainnet") no tiene descendentes
            // (ninguna de sus letras baja de la línea de base), así que el
            // padding-bottom que allowDescenders agrega ahí no protege nada
            // — solo sumaba espacio de más contra el bloque de abajo. Se
            // aplica a todas las líneas salvo la última.
            allowDescenders(self.lines.slice(0, -1));
            return gsap.from(self.lines, {
              yPercent: 110,
              autoAlpha: 0,
              stagger: 0.12,
              duration: 1,
              ease: EASE_OUT,
            });
          },
        });
      }

      tl.from(rest, { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.35);

      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      <BloomField />

      {/* pointer-events-none acá: Container mide el ANCHO ENTERO de la
          sección (w-full), aunque el contenido quede pegado a la
          izquierda — sin esto, su caja vacía del lado derecho tapa
          BloomField y le roba el hover al canvas por debajo. Solo el CTA
          (lo único clickeable de este bloque) se re-habilita. */}
      <Container className="relative z-10 flex flex-1 flex-col justify-center gap-7 py-20 pointer-events-none">
        <h1 data-hero-heading className="max-w-[16ch] text-display text-pretty">
          Post-quantum security,
          <br />
          <Accent display>live on mainnet</Accent>
        </h1>
        <div className="flex flex-col gap-12">
          <p data-hero-item className="max-w-[52ch] text-body-lg text-ink-soft text-pretty">
            {HERO_BODY}
          </p>
          <div data-hero-item className="pointer-events-auto w-fit">
            <CtaPill href={HERO_CTA.href} tone="filled">
              {HERO_CTA.label}
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
