"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enterExit } from "@/components/sections/footer-labs/footerScene";
import MuralBlock from "./MuralBlock";
import { LINES } from "./muralContent";

// 04 · Cascade — cada línea entra desde el borde OPUESTO al que se alinea.
//
// La alternancia del diseño —una palabra a la derecha, la siguiente a la
// izquierda— deja de ser una propiedad estática y pasa a ser el recorrido: la
// que termina a la derecha llega cruzando desde la izquierda, y viceversa.
//
// ── El stagger es corto a propósito ────────────────────────────────────────
//
// 0.09s. Con un valor mayor las líneas no se cruzarían nunca y esto serían
// cuatro entradas seguidas; el cruce en el medio —dos palabras viajando en
// sentidos contrarios a la vez— es lo que hace la figura.
//
// El recorrido va en `xPercent`, relativo al ancho de cada palabra: miden
// distinto, y con píxeles el desfase entre ellas cambiaría con el viewport.

export default function MuralCascade() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q("[data-mural-word]");
    const labels = q("[data-mural-label]");
    if (words.length === 0) return;

    const from = (i: number) => (LINES[i]?.align === "right" ? -70 : 70);

    gsap.set(words, { xPercent: (i: number) => from(i), autoAlpha: 0 });
    gsap.set(labels, { autoAlpha: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(words, {
      xPercent: 0,
      autoAlpha: 1,
      duration: 1,
      // `back.out` con un overshoot chico: la palabra pasa apenas de su sitio y
      // vuelve. A este cuerpo un rebote mayor se lee como un error de frenado.
      ease: "back.out(1.15)",
      stagger: 0.09,
    });
    tl.to(labels, { autoAlpha: 1, duration: 0.5, ease: "none", stagger: 0.09 }, 0.35);

    const st = enterExit(tl, { trigger: scope, start: "top 75%" });

    return () => {
      st.kill();
      tl.kill();
      gsap.set([...words, ...labels], { clearProps: "transform,opacity,visibility" });
    };
  });

  return (
    <div ref={rootRef}>
      <MuralBlock />
    </div>
  );
}
