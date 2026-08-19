"use client";

import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";

// ── A · Wipe ─────────────────────────────────────────────────────────────────
//
// El negro sube y tapa. Un telón que entra desde abajo mientras lo de arriba se
// queda quieto — el gesto del takeover del footer, traído al corte entre dos
// secciones.
//
// Es la más barata de las cinco y la única que no depende de nada: sin canvas,
// sin medir texto, sin WebGL. Si una máquina lenta o un navegador viejo tienen
// que quedarse con una, es esta.
//
// ── `scaleY` y no `height` ──────────────────────────────────────────────────
//
// El footer anima la ALTURA porque adentro del wipe vive contenido que no se
// puede deformar. Acá el telón está vacío, así que va por transform: `height`
// es layout —recalcula en cada frame del gesto— y `scaleY` es composición.
//
// ── El sticky es de CSS ─────────────────────────────────────────────────────
//
// El ScrollTrigger solo LEE el progreso; nunca `pin: true` (ver
// `components/sections/README.md`).

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

export default function TransWipe() {
  const rootRef = useMotionScope<HTMLElement>(({ scope, motionOk }) => {
    const wipe = scope.querySelector<HTMLElement>("[data-wipe]");
    if (!wipe) return;

    // Sin motion, el telón está puesto y ya: el corte existe igual, lo que no
    // hay es el viaje.
    if (!motionOk) {
      gsap.set(wipe, { scaleY: 1 });
      return;
    }

    const set = gsap.quickSetter(wipe, "scaleY");
    set(0);

    const t = ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      // Cierra ANTES de que la sección termine (0.82 y no 1): el último tramo
      // del recorrido queda ya en negro pleno, así el lector llega al stack con
      // el telón puesto y no viéndolo cerrar en el último pixel.
      onUpdate: (self) => set(Math.min(1, self.progress / 0.82)),
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
        <div
          data-wipe
          aria-hidden="true"
          className="absolute inset-0 origin-bottom bg-ink"
        />
      </div>
    </section>
  );
}
