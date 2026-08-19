"use client";

import { useRef } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enterExit } from "@/components/sections/footer-labs/footerScene";
import MuralGlScene from "./MuralGlScene";

// 08 · Flare — WebGL. Un frente de calor recorre la palabra.
//
// Delante del frente la palabra todavía no existe; sobre él, el trazo se
// distorsiona y brilla; detrás, queda el degradado limpio. **Esa perturbación
// del propio trazo es lo único que justifica pagar el precio del shader**: sin
// WebGL el borde sería un gradiente suave —cualquier `mask-image` lo da— y no
// una deformación de la letra.
//
// Es la única de las tres GL conducida por una timeline: entra sola al llegar a
// viewport y se deshace al volver hacia arriba, como el resto de su familia.
// Las otras dos (`12 · Ripple`, `14 · Melt`) van atadas al scroll.

export default function MuralFlare() {
  // El objeto que la timeline muta y el shader lee cada frame. Se pasa el REF
  // entero y nunca su `.current`: leerlo en render es lo que `react-hooks/refs`
  // prohíbe, y con razón — cambia sesenta veces por segundo y React no se
  // entera de ninguna.
  const progress = useRef({ value: 0 });

  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const labels = q("[data-mural-label]");
    const prog = progress.current;

    const tl = gsap.timeline({ paused: true });

    // Un solo tween sobre el progreso compartido: las cuatro palabras lo leen y
    // el desfase entre ellas lo pone el propio shader por la posición del
    // frente, así que no hace falta una timeline por palabra.
    tl.fromTo(prog, { value: 0 }, { value: 1, duration: 1.6, ease: "power2.inOut" }, 0);

    gsap.set(labels, { autoAlpha: 0 });
    tl.to(labels, { autoAlpha: 1, duration: 0.5, ease: "none", stagger: 0.12 }, 0.5);

    const st = enterExit(tl, { trigger: scope, start: "top 75%" });

    return () => {
      st.kill();
      tl.kill();
      prog.value = 0;
      gsap.set(labels, { clearProps: "opacity,visibility" });
    };
  });

  return (
    <div ref={rootRef}>
      <MuralGlScene effect="flare" progress={progress} />
    </div>
  );
}
