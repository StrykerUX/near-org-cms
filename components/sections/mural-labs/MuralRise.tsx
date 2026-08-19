"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enterExit } from "@/components/sections/footer-labs/footerScene";
import MuralBlock from "./MuralBlock";

// 02 · Rise — la tipografía entra; el color ya estaba.
//
// Cada palabra sube desde debajo de su propia máscara. El degradado no se toca:
// llega puesto, así que lo que el lector ve aparecer es la letra, no el color.
// Es la contracara exacta de `01 · Ramp`, y por eso las dos valen la pena — la
// misma sección puede contarse por su tipografía o por su paleta.
//
// ── Por qué el recorte no va en el mismo elemento que el degradado ─────────
//
// `background-clip: text` y `overflow: hidden` no pueden convivir en un nodo:
// el clip de texto ya usa el fondo del elemento, y recortar ahí apaga el
// degradado en algunos motores. Por eso `MuralBlock` envuelve cada palabra en
// `[data-mural-mask]`, que es lo único que recorta.
//
// ── El desfase entre palabra y rótulo ──────────────────────────────────────
//
// Son dos pesos tipográficos muy distintos —un mural de 153px y un cuerpo de
// 28px— y entrando juntos se aplanan: el chico desaparece al lado del grande.
// Con 0.22s de retraso el rótulo llega cuando la palabra ya asentó, y se lee
// como su pie.

export default function MuralRise() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q("[data-mural-word]");
    const labels = q("[data-mural-label]");
    if (words.length === 0) return;

    // `set` explícito y no `from`: la timeline nace pausada, y el
    // `immediateRender` de `from` dejaría las palabras escondidas desde el
    // primer paint aunque nadie hubiera scrolleado todavía.
    gsap.set(words, { yPercent: 112 });
    gsap.set(labels, { autoAlpha: 0, y: 14 });

    const tl = gsap.timeline({ paused: true });

    tl.to(words, {
      yPercent: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
    });
    tl.to(
      labels,
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.12 },
      0.22
    );

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
