"use client";

import Container from "@/components/primitives/Container";
import { SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import LatticeCanvas from "@/components/sections/hero-alt/LatticeCanvas";
import { STATEMENT } from "@/components/sections/hero-alt/heroAltContent";

// ── 05 · Lattice · segunda sección ───────────────────────────────────────────
//
// Los mismos puntos, otro destino: en vez de la silueta del titular, siete
// columnas con la silueta en V invertida — alta en los bordes, baja en el
// centro, para dejar despejado el tramo donde va el statement.
//
// Es el mismo motor con `target="bars"`, y eso es lo que hace que el par se lea
// como una sola idea: las barras no son un dibujo nuevo, son la nube del hero
// después de caer. El lector no tiene que darse cuenta; tiene que sentir que
// nada se reemplazó por el camino.
//
// Los puntos no se compactan hasta ser sólidos a propósito. Una barra de puntos
// con huecos deja ver el crema entre medio, y esa textura es la única cosa que
// las diferencia de las lamas planas de la versión 01 — que son la comparación
// que esta versión tiene que ganar.

// Mismo gris que el hero, por lo mismo: en `--bar` sobre crema los puntos no
// se ven. Ver la nota de contraste en LatticeHero.
const DOT = "#6c7477";

export default function LatticeBars() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const copy = q("[data-la2-copy]")[0];
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "la");
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
      // Entra más tarde que en las otras versiones: los puntos tienen que haber
      // caído lo suficiente como para que se lea que forman columnas. Si el
      // texto llega antes, las dos cosas compiten por la atención en el mismo
      // tramo y no se entiende ninguna.
      0.25
    );

    return () => {
      split.revert();
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      className="relative overflow-x-clip bg-cream text-foreground data-[la=on]:h-[250svh]"
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <LatticeCanvas target="bars" dot={DOT} cols={7} />

        <Container className="relative z-[1]">
          <p
            data-la2-copy
            className="mx-auto max-w-[22ch] text-center text-statement text-pretty"
          >
            {STATEMENT}
          </p>
        </Container>
      </div>
    </section>
  );
}
