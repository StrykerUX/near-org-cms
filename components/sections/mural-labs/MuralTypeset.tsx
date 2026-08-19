"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enterExit } from "@/components/sections/footer-labs/footerScene";
import MuralBlock from "./MuralBlock";
import { LINES } from "./muralContent";

// 05 · Typeset — las palabras llegan condensadas y se abren a su ancho.
//
// Es un guiño deliberado a la divergencia de esta sección: el artboard está
// compuesto en un corte **Semicondensed** que el proyecto no tiene (ver el
// README de la carpeta y el token `--text-mural`). Acá esa diferencia se vuelve
// el gesto — la palabra entra con el ancho del corte que falta y se abre hasta
// el que sí tenemos.
//
// ── El `transformOrigin` es la mitad del efecto ────────────────────────────
//
// Cada palabra se abre desde el borde al que está ALINEADA, no desde su centro.
// Desde el centro se leería como un zoom; desde el borde, como tipografía
// asentándose contra su margen — que es lo que hace un tipógrafo abriendo el
// tracking.
//
// `scaleX` y no `letter-spacing`: el tracking mueve el layout y con `nowrap` la
// palabra empujaría su caja en cada frame. Un escalado es solo transformación,
// no toca el flujo. El precio es que los trazos verticales se afinan durante el
// recorrido — a 0.62 todavía se lee como condensada y no como deformada.

export default function MuralTypeset() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q("[data-mural-word]");
    const labels = q("[data-mural-label]");
    if (words.length === 0) return;

    words.forEach((word, i) => {
      gsap.set(word, {
        scaleX: 0.62,
        autoAlpha: 0,
        transformOrigin: LINES[i]?.align === "right" ? "right center" : "left center",
      });
    });
    gsap.set(labels, { autoAlpha: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(words, {
      scaleX: 1,
      autoAlpha: 1,
      duration: 1.15,
      ease: "power4.out",
      stagger: 0.11,
    });
    tl.to(labels, { autoAlpha: 1, duration: 0.5, ease: "none", stagger: 0.11 }, 0.4);

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
