"use client";

import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enterExit } from "@/components/sections/footer-labs/footerScene";
import MuralBlock from "./MuralBlock";

// 03 · Split — letra por letra, cada una con el color que le toca.
//
// ── Por qué el degradado sobrevive al split ────────────────────────────────
//
// El degradado vive en el CONTENEDOR de la palabra, no en las letras: con
// `background-clip: text`, cada carácter muestra el tramo de la imagen que le
// cae encima por su posición. SplitText envuelve las letras en `<div>`s que no
// tienen fondo propio, así que el color sigue saliendo del padre y no hay que
// calcular un color por letra.
//
// El efecto es la consecuencia: mientras las letras llegan, la rampa se va
// armando sola. Ninguna letra "trae" su color — lo recibe al aterrizar en su
// sitio.
//
// ── El recorrido es corto a propósito ──────────────────────────────────────
//
// A 153px, un desplazamiento vistoso por carácter marea: son quince letras de
// una cuarta de alto moviéndose a destiempo. `yPercent: 34` alternado y un
// stagger de 0.03 dan lectura de "se escribe" sin que la línea entera tiemble.
// La alternancia de signo —una letra baja, la siguiente sube— es lo que evita
// que se lea como un letrero de aeropuerto.
//
// ── `autoSplit` y la fuente ────────────────────────────────────────────────
//
// Kepler carga por `next/font/local`, así que el primer paint puede medir con
// el fallback. `autoSplit` rehace el corte cuando la fuente entra o cambia el
// ancho; sin él, las cajas de las letras quedan medidas contra una tipografía
// que ya no está.

export default function MuralSplit() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q("[data-mural-word]");
    const labels = q("[data-mural-label]");
    if (words.length === 0) return;

    const tl = gsap.timeline({ paused: true });

    const splits = words.map((word, i) => {
      const split = SplitText.create(word, { type: "chars", autoSplit: true });

      gsap.set(split.chars, { autoAlpha: 0, yPercent: (j: number) => (j % 2 ? 34 : -34) });
      tl.to(
        split.chars,
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.03,
        },
        i * 0.18
      );

      return split;
    });

    gsap.set(labels, { autoAlpha: 0 });
    tl.to(labels, { autoAlpha: 1, duration: 0.5, ease: "none", stagger: 0.18 }, 0.3);

    const st = enterExit(tl, { trigger: scope, start: "top 75%" });

    return () => {
      st.kill();
      tl.kill();
      // `revert()` y no `kill()`: SplitText es cirugía de DOM, no un tween. Sin
      // revertir, un segundo montaje —StrictMode en dev— splittea sobre spans
      // ya splitteados.
      splits.forEach((s) => s.revert());
      gsap.set(labels, { clearProps: "opacity,visibility" });
    };
  });

  return (
    <div ref={rootRef}>
      <MuralBlock />
    </div>
  );
}
