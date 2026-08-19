"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enterExit } from "@/components/sections/footer-labs/footerScene";
import MuralBlock from "./MuralBlock";
import { LINES, sweepFrom, sweepGradient } from "./muralContent";

// 01 · Ramp — las palabras entran apagadas y el verde las barre.
//
// Lo que se anima es `background-position`, no color. El degradado se declara
// al doble de ancho con una mitad negra (`sweepGradient`), así que mover el
// encuadre apaga o enciende la palabra entera y el encendido tiene DIRECCIÓN —
// un tween de color daría un fundido, que es plano y no dice de qué lado viene.
//
// La dirección alterna línea por línea siguiendo el diseño: las que arrancan en
// negro prenden desde la derecha, las que arrancan en verde desde la izquierda.
//
// ── El estado de reposo es el del diseño ───────────────────────────────────
//
// `MuralBlock` pinta el degradado normal, a `background-size: 100%`. El barrido
// necesita el extendido, así que esta variante lo sustituye en su setup y lo
// devuelve en el cleanup. Sin JS —o con `prefers-reduced-motion`— nunca se
// sustituye y queda el bloque tal cual el artboard, que es la degradación
// correcta: se pierde el gesto, no el diseño.

export default function MuralRamp() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q("[data-mural-word]");
    const labels = q("[data-mural-label]");
    if (words.length === 0) return;

    const tl = gsap.timeline({ paused: true });

    words.forEach((word, i) => {
      const line = LINES[i];
      if (!line) return;
      const { start, end } = sweepFrom(line);

      gsap.set(word, {
        backgroundImage: sweepGradient(line),
        backgroundSize: "200% 100%",
        backgroundPosition: start,
      });

      // `power2.out` y no lineal: el frente del barrido entra rápido y frena al
      // final, que es lo que hace que la última letra en encenderse se lea como
      // el remate de la línea y no como el corte de un temporizador.
      tl.to(word, { backgroundPosition: end, duration: 1.1, ease: "power2.out" }, i * 0.16);
    });

    // Los rótulos entran con su línea, un poco detrás: son el pie de la palabra,
    // no su encabezado.
    tl.fromTo(
      labels,
      { autoAlpha: 0, x: -12 },
      { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.16 },
      0.12
    );

    const st = enterExit(tl, { trigger: scope, start: "top 75%" });

    return () => {
      st.kill();
      tl.kill();
      gsap.set(words, { clearProps: "backgroundImage,backgroundSize,backgroundPosition" });
      gsap.set(labels, { clearProps: "transform,opacity,visibility" });
    };
  });

  return (
    <div ref={rootRef}>
      <MuralBlock />
    </div>
  );
}
