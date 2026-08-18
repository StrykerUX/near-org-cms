"use client";

import Container from "@/components/primitives/Container";
import { SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import CutoutCanvas from "@/components/sections/hero-alt/CutoutCanvas";
import { STATEMENT } from "@/components/sections/hero-alt/heroAltContent";

// ── 06 · Cutout · segunda sección ────────────────────────────────────────────
//
// El mismo clip, recortado a las siete columnas en vez de a los glifos. Las
// barras no son grises ni son puntos: son el video, y siguen scrubbeándose con
// el scroll dentro de su silueta.
//
// Es la lectura más literal del "las barras nacen del borde del video" que la
// homepage resuelve hoy con geometría —`heroGeometry.HERO_UNIT` encastrando el
// hero con `QuantumBars` al píxel. Acá no hay juntura que encastrar: las barras
// SON el video, así que no hay dos elementos que puedan desalinearse.
//
// El statement va encima, en el DOM, sobre una placa de crema. Mismo criterio
// que `GlassBars`: un párrafo de 190 caracteres no se lee sobre imagen en
// movimiento — y acá menos todavía, porque la imagen cambia con el scroll,
// que es justo cuando alguien está leyendo.

const SRC = "/prototype/v2/hero-descent-v2.mp4";
const POSTER = "/prototype/v2/hero-descent-v2-poster.jpg";
const FPS = 24;

const FILL = "0 #101010, 0.55 #1d3b32, 1 #00b96f";

export default function CutoutBars() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const copy = q("[data-cu2-copy]")[0];
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "cu");
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
      0.1
    );

    return () => {
      split.revert();
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip bg-cream text-foreground data-[cu=on]:h-[240svh]"
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <CutoutCanvas
          target="bars"
          cols={7}
          src={SRC}
          poster={POSTER}
          fps={FPS}
          fill={FILL}
        />

        {/* La placa detrás del texto va con los bordes DESVANECIDOS y no como
            un rectángulo de color plano: las barras son imagen a sangre, y un
            borde recto de crema encima se lee como una caja pegada — se ve el
            corte horizontal cruzando las siete columnas. Con el gradiente, la
            placa aparece sin que se pueda señalar dónde empieza. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] h-[52svh] -translate-y-1/2"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(245,244,241,0) 0%, rgba(245,244,241,0.92) 18%, rgba(245,244,241,0.92) 82%, rgba(245,244,241,0) 100%)",
          }}
        />

        <Container className="relative z-[2]">
          <p
            data-cu2-copy
            className="mx-auto max-w-[22ch] text-center text-statement text-pretty"
          >
            {STATEMENT}
          </p>
        </Container>
      </div>
    </section>
  );
}
