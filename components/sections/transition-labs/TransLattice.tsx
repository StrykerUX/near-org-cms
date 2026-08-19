"use client";

import LatticeCanvas from "@/components/sections/hero-alt/LatticeCanvas";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";

// ── D · Lattice ──────────────────────────────────────────────────────────────
//
// ~2600 puntos colapsan y DELETREAN «The NEAR Stack» justo cuando el fondo
// termina de irse a negro: el título de la sección siguiente lo escriben las
// partículas antes de que la sección exista.
//
// ── El motor se importa de hero-alt, no se copia ────────────────────────────
//
// `LatticeCanvas` muestrea el propio texto —lo dibuja en un canvas fuera de
// pantalla y lee su alfa—, así que la nube respeta la forma real de los glifos
// sin que nadie la describa. Copiarlo acá para cambiarle dos líneas sería tener
// dos motores que divergen en el primer ajuste.
//
// Lo único que este archivo aporta es el CONTEXTO: el fondo que rueda de cream
// a ink debajo de la nube, y el recorrido que los sincroniza.
//
// ── Por qué el color del punto no se anima ──────────────────────────────────
//
// `dot` es una prop literal que el motor lee al construir la escena; cambiarla
// por frame remontaría el efecto entero. Así que el punto es un verde que
// funciona sobre los DOS fondos, y lo que viaja es el fondo. Es también más
// honesto: la nube es la misma cosa todo el rato, lo que cambia es dónde está.
//
// El verde elegido es el de los CTA y no el verde tinta: sobre el cream se ve
// pálido apenas un instante, y sobre el negro —que es donde la palabra tiene
// que leerse— el tinta se hundía en el fondo.

// ── La transición SOLAPA la sección de arriba ───────────────────────────────
//
// `-mt-[100svh]` y `z-[2]`: el tramo empieza una pantalla ANTES de donde
// terminaría la sección anterior, así que el gesto ocurre encima de ella —
// todavía con las cards en pantalla— y no sobre un rectángulo vacío.
//
// Sin eso, el primer viewport del tramo es una pantalla de cream con nada, el
// gesto arranca recién después, y lo que se lee no es una transición: es una
// pausa y después un efecto. El coste real en scroll es también menor: el
// recorrido menos la pantalla que solapa.

const TRAVEL = "160svh";

export default function TransLattice() {
  const rootRef = useMotionScope<HTMLElement>(({ scope, motionOk }) => {
    const bg = scope.querySelector<HTMLElement>("[data-bg]");
    const veil = scope.querySelector<HTMLElement>("[data-veil]");
    if (!bg || !veil) return;

    if (!motionOk) {
      bg.style.opacity = "1";
      veil.style.opacity = "1";
      return;
    }

    // El fondo negro es una capa con opacidad encima del cream, y no un
    // `backgroundColor` interpolado: opacidad es composición, y un color de
    // fondo animado repinta.
    const set = gsap.quickSetter(bg, "opacity");
    // Dos capas y no una interpolación de color: el cream despeja lo de arriba
    // rápido —la nube de puntos sobre las cards se lee como suciedad— y el
    // negro entra después, con calma.
    const setVeil = gsap.quickSetter(veil, "opacity");
    set(0);
    setVeil(0);

    const t = ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      // El negro cierra en el 55% del recorrido y la nube del motor colapsa
      // cuando el centro de la sección llega al centro del viewport (~el mismo
      // punto). Los puntos terminan de formar la palabra sobre negro pleno, que
      // es el momento que esta transición existe para producir.
      onUpdate: (self) => {
        const p = self.progress;
        setVeil(Math.min(1, p / 0.12));
        set(Math.min(1, p / 0.55));
      },
    });

    return () => t.kill();
  });

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="relative z-[2] -mt-[100svh] h-[var(--travel)] bg-transparent"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-veil aria-hidden="true" className="absolute inset-0 bg-cream opacity-0" />
        <div data-bg aria-hidden="true" className="absolute inset-0 bg-ink opacity-0" />

        {/* El host del motor es este div y no la sección: el ScrollTrigger
            interno va de "top bottom" a "center center" sobre su host, y sobre
            un tramo de 160svh eso mediría el tramo, no la pantalla. */}
        <div className="absolute inset-0 [font-family:var(--font-sans)] [font-weight:500]">
          <LatticeCanvas
            lines={["The NEAR", "Stack"]}
            target="text"
            drive="scroll"
            fontScale={0.17}
            dot="#8bf29c"
          />
        </div>
      </div>
    </section>
  );
}
