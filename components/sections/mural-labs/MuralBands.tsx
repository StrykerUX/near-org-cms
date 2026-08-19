"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enterExit } from "@/components/sections/footer-labs/footerScene";
import MuralBlock from "./MuralBlock";

// 06 · Bands — la palabra se revela en franjas horizontales.
//
// El texto no se mueve un píxel: lo único que cambia es cuánto de él se ve. Es
// la variante más quieta de las catorce, y está para responder si a este cuerpo
// hace falta que algo se desplace.
//
// ── Cómo se hacen las franjas con un solo elemento ─────────────────────────
//
// `clip-path` con cinco rectángulos en un mismo `polygon` no es posible, así
// que cada franja es una COPIA de la palabra recortada a su banda con
// `inset()`. Las cinco se apilan en la misma caja: como el texto es idéntico y
// están superpuestas, el conjunto se lee como una sola palabra.
//
// Se construyen en el efecto y no en el JSX a propósito: sin JS —o con
// `prefers-reduced-motion`— no existen, y queda la palabra original intacta.
// Montarlas en el marcado obligaría a esconderlas por CSS y dejaría cinco
// copias del texto en el árbol de accesibilidad.

const BANDS = 5;

export default function MuralBands() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q<HTMLElement>("[data-mural-word]");
    const labels = q("[data-mural-label]");
    if (words.length === 0) return;

    const tl = gsap.timeline({ paused: true });
    const clones: HTMLElement[] = [];

    words.forEach((word, wi) => {
      const parent = word.parentElement;
      if (!parent) return;

      // El original se apaga pero SIGUE en el flujo: es el que define la caja
      // que las copias ocupan, y el que el lector de pantalla lee.
      gsap.set(word, { autoAlpha: 0 });

      for (let b = 0; b < BANDS; b++) {
        const clone = word.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        clone.removeAttribute("data-mural-word");
        clone.style.position = "absolute";
        clone.style.inset = "0";
        clone.style.visibility = "visible";
        clone.style.opacity = "1";
        parent.appendChild(clone);
        clones.push(clone);

        const top = (b / BANDS) * 100;
        const bottom = 100 - ((b + 1) / BANDS) * 100;
        // La banda arranca cerrada por abajo (`inset` al 100%) y se abre hasta
        // su franja. `ease: none` porque la lectura del escalonado depende de
        // que las cinco tarden exactamente lo mismo.
        gsap.set(clone, { clipPath: `inset(${top}% 0% 100% 0%)` });
        tl.to(
          clone,
          {
            clipPath: `inset(${top}% 0% ${bottom}% 0%)`,
            duration: 0.42,
            ease: "none",
          },
          wi * 0.14 + b * 0.06
        );
      }
    });

    // El wrapper de cada palabra necesita ser el contenedor de posicionamiento
    // de sus copias. Se escribe desde el efecto por lo mismo que las copias.
    const masks = q<HTMLElement>("[data-mural-mask]");
    masks.forEach((m) => (m.style.position = "relative"));

    gsap.set(labels, { autoAlpha: 0 });
    tl.to(labels, { autoAlpha: 1, duration: 0.4, ease: "none", stagger: 0.14 }, 0.3);

    const st = enterExit(tl, { trigger: scope, start: "top 75%" });

    return () => {
      st.kill();
      tl.kill();
      clones.forEach((c) => c.remove());
      masks.forEach((m) => m.style.removeProperty("position"));
      gsap.set([...words, ...labels], { clearProps: "opacity,visibility" });
    };
  });

  return (
    <div ref={rootRef}>
      <MuralBlock />
    </div>
  );
}
