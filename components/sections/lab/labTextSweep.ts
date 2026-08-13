"use client";

import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// El barrido luminoso del statement, extraído para que los dos approaches nuevos lo
// compartan.
//
// Es una copia literal de lo que hace `QuantumBars`, y está acá y no importado de
// `home-v2/` por la regla del sandbox. Pero duplicarlo DOS veces —una por approach—
// sí era de más: el barrido no participa del problema (lo dispara el propio bloque de
// texto, no la juntura) y tenerlo repetido significaba que un ajuste en uno se
// olvidara en el otro justo mientras se los compara lado a lado.

// Desfase entre carácter y carácter, en unidades de la timeline: decide el ancho del
// frente de luz. Lo comparten la capa base y la del brillo — si se separan, el brillo
// deja de caer sobre la letra que enciende.
const CHAR_STEP = 0.03;

/**
 * Enciende el statement carácter por carácter con el scroll. Devuelve el cleanup:
 * `gsap.context` revierte los tweens, pero SplitText es cirugía de DOM y de eso no
 * sabe nada.
 */
export function createStatementSweep(
  stage: HTMLElement,
  line: HTMLElement,
  shineLine: HTMLElement
) {
  // Dos capas de texto idéntico en la MISMA celda de grid: comparten layout por
  // construcción, así que los dos arrays de chars se corresponden 1:1 sin medir nada.
  const base = SplitText.create(line, { type: "chars", smartWrap: true, aria: "auto" });
  const shine = SplitText.create(shineLine, { type: "chars", smartWrap: true });

  gsap.set(base.chars, { opacity: 0.25 });
  gsap.set(shineLine, { opacity: 1 });
  gsap.set(shine.chars, { opacity: 0 });

  const sweep = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top 80%",
      end: "bottom 45%",
      scrub: 0.5,
      markers: DEBUG_MARKERS,
    },
  });

  sweep.to(base.chars, { opacity: 1, duration: 0.16, ease: "none", stagger: { each: CHAR_STEP } }, 0);

  // UN tween con keyframes + stagger, no uno por carácter. `var(--near-teal)` es a
  // propósito: GSAP no resuelve custom properties, así que asigna la cadena y el
  // navegador la resuelve — el resultado es un CORTE a teal, no una interpolación.
  sweep.to(
    shine.chars,
    {
      keyframes: [
        { opacity: 1, duration: 0.12, ease: "none" },
        { color: "var(--near-teal)", opacity: 0.85, duration: 0.2, ease: "none" },
        { opacity: 0.5, duration: 0.22, ease: "none" },
        { opacity: 0, duration: 0.4, ease: "none" },
      ],
      stagger: { each: CHAR_STEP },
    },
    0
  );

  return () => {
    base.revert();
    shine.revert();
    gsap.set(shineLine, { clearProps: "opacity" });
  };
}
