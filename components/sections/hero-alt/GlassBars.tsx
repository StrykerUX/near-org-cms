"use client";

import Container from "@/components/primitives/Container";
import { SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import GlassCanvas from "@/components/sections/hero-alt/GlassCanvas";
import { STATEMENT } from "@/components/sections/hero-alt/heroAltContent";

// ── 04 · Glass · segunda sección ─────────────────────────────────────────────
//
// Siete columnas de vidrio, cada una con su propia altura de superficie: el
// shader muestrea el campo en el centro de cada columna, así que las siete
// refractan distinto y el fondo se ve cortado en franjas desalineadas. Es el
// mismo material del hero, laminado.
//
// ── Acá el statement SÍ es texto del DOM ────────────────────────────────────
//
// Y la diferencia con el hero es deliberada. En el hero, meter el titular en la
// textura compra el efecto entero — el titular ES lo que se refracta. Acá el
// texto es un párrafo de 190 caracteres que hay que LEER, y un párrafo
// rasterizado a través de un vidrio ondulado no se lee: se descifra.
//
// Así que el vidrio se queda con el fondo y el statement va encima, en el DOM,
// entrando por líneas enmascaradas. El par entero enseña las dos mitades del
// trato: cuándo el texto puede entrar al material y cuándo no.
//
// `lines: []` es lo que apaga la textura — el canvas dibuja el vidrio y nada
// más. El campo de altura no cambia; solo deja de haber glifos que doblar.

const COLUMNS = 7;

const PALETTE = ["#F5F4F1", "#d8d6d0", "#101010"] as const;

const FALLBACK =
  "linear-gradient(90deg, #F5F4F1 0%, #d8d6d0 14%, #F5F4F1 29%, #d8d6d0 43%, #F5F4F1 57%, #d8d6d0 71%, #F5F4F1 100%)";

// Vacío y constante fuera del componente: pasado inline como `[]` sería un
// array nuevo en cada render, y es una dependencia del efecto que monta el
// contexto WebGL — lo reconstruiría en cada uno.
const NO_TEXT: readonly string[] = [];

export default function GlassBars() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const copy = q("[data-gl2-copy]")[0];
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "gl");
    const tl = trackTimeline(scope, { scrub: 0.35 });

    const split = SplitText.create(copy, {
      type: "lines",
      mask: "lines",
      onSplit: (self) => {
        allowDescenders(self.lines);
      },
    });

    tl.from(
      split.lines,
      { yPercent: 115, ease: "power2.out", duration: 0.45, stagger: 0.09 },
      0.08
    );

    return () => {
      split.revert();
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip bg-cream text-foreground data-[gl=on]:h-[240svh]"
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <GlassCanvas
          lines={NO_TEXT}
          cols={COLUMNS}
          ior={1.5}
          palette={PALETTE}
          fallback={FALLBACK}
        />

        {/* Placa de crema translúcida detrás del texto. El vidrio de abajo tiene
            zonas muy claras y muy oscuras en la misma columna, así que sin esto
            el statement pierde contraste en tramos y lo recupera en otros —
            ilegible de una forma que además cambia con el scroll. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] h-[44svh] -translate-y-1/2 bg-cream/75 backdrop-blur-[2px]"
        />

        <Container className="relative z-[2]">
          <p
            data-gl2-copy
            className="mx-auto max-w-[22ch] text-center text-statement text-pretty"
          >
            {STATEMENT}
          </p>
        </Container>
      </div>
    </section>
  );
}
