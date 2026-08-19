"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import MuralGlScene from "./MuralGlScene";

// 12 · Ripple — WebGL. La amplitud sale de la VELOCIDAD, no de la posición.
//
// Es la diferencia que la variante existe para mostrar. Las otras cinco de esta
// familia mapean el progreso del scroll a un estado: en cualquier punto del
// recorrido, el bloque se ve siempre igual. Ésta reacciona al GESTO — quieto es
// el bloque del artboard, y solo se agita mientras el lector empuja. Parar a
// mitad de camino devuelve el texto a su forma aunque el scroll no haya vuelto
// atrás.
//
// ── De dónde sale la velocidad ─────────────────────────────────────────────
//
// `self.getVelocity()` de ScrollTrigger, en px/s. Se normaliza contra 2500 —un
// scroll enérgico de rueda— y se suaviza con un tween en vez de escribirse
// directo: el valor crudo es ruidoso frame a frame y el shader lo traduciría en
// un temblor. El `overwrite` mantiene un solo tween vivo sobre el valor.
//
// La caída a cero va aparte y es más lenta que la subida: el agua no se calma
// en el mismo tiempo que se agita.

export default function MuralRipple() {
  const progress = useRef({ value: 0 });
  const velocity = useRef({ value: 0 });

  const rootRef = useMotionScope<HTMLDivElement>(({ scope, motionOk }) => {
    if (!motionOk) return;

    const vel = velocity.current;
    const prog = progress.current;

    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top bottom",
      end: "bottom top",
      markers: DEBUG_MARKERS,
      onUpdate: (self) => {
        prog.value = self.progress;
        const raw = Math.min(1, Math.abs(self.getVelocity()) / 2500);
        gsap.to(vel, {
          value: raw,
          duration: 0.18,
          ease: "power2.out",
          overwrite: true,
        });
      },
    });

    // El decaimiento corre solo, independiente del scroll: sin él, soltar la
    // rueda dejaría la última velocidad congelada en el uniform.
    const decay = gsap.to(vel, {
      value: 0,
      duration: 0.9,
      ease: "power2.out",
      repeat: -1,
      repeatRefresh: true,
      paused: false,
    });

    return () => {
      st.kill();
      decay.kill();
      gsap.killTweensOf(vel);
      vel.value = 0;
      prog.value = 0;
    };
  });

  return (
    <div ref={rootRef}>
      <MuralGlScene effect="ripple" progress={progress} velocity={velocity} />
    </div>
  );
}
