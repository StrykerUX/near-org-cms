"use client";

import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enterExit } from "@/components/sections/footer-labs/footerScene";
import MuralBlock from "./MuralBlock";

// 07 · Kern — las letras arrancan apiladas y se separan a su sitio.
//
// Es la contracara de `03 · Split`: aquel reparte los caracteres en VERTICAL,
// éste los colapsa en HORIZONTAL. El resultado se lee como una palabra que se
// desdobla desde su propio centro.
//
// ── Lo que hace el degradado durante el colapso ────────────────────────────
//
// Con las letras juntas, todas caen sobre el mismo tramo de la rampa y el color
// arranca casi plano; al separarse, cada una se lleva el tramo que le toca y la
// rampa aparece. No hay que animar ningún color para conseguirlo — es
// consecuencia de que el degradado viva en el contenedor.
//
// ── El desplazamiento se calcula, no se estima ─────────────────────────────
//
// Cada carácter tiene que viajar la distancia entre su posición real y el
// centro de la palabra, y eso depende de dónde cayó: la primera letra recorre
// media palabra, la del medio no se mueve. Se mide con `offsetLeft` una sola
// vez, antes de animar, porque después de `gsap.set` las posiciones ya no son
// las del layout.

export default function MuralKern() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const words = q<HTMLElement>("[data-mural-word]");
    const labels = q("[data-mural-label]");
    if (words.length === 0) return;

    const tl = gsap.timeline({ paused: true });

    const splits = words.map((word, i) => {
      const split = SplitText.create(word, { type: "chars", autoSplit: true });
      const chars = split.chars as HTMLElement[];

      // El centro de la palabra en coordenadas del propio elemento. Se mide
      // ANTES de tocar nada.
      const center = word.clientWidth / 2;
      const offsets = chars.map((c) => center - (c.offsetLeft + c.offsetWidth / 2));

      gsap.set(chars, {
        x: (j: number) => offsets[j] ?? 0,
        autoAlpha: 0,
        scaleX: 0.8,
      });

      tl.to(
        chars,
        {
          x: 0,
          autoAlpha: 1,
          scaleX: 1,
          duration: 0.85,
          ease: "power4.out",
          // `from: "center"` reparte el retraso desde el medio hacia los
          // extremos, que es la dirección en la que la palabra se abre.
          stagger: { each: 0.018, from: "center" },
        },
        i * 0.16
      );

      return split;
    });

    gsap.set(labels, { autoAlpha: 0 });
    tl.to(labels, { autoAlpha: 1, duration: 0.45, ease: "none", stagger: 0.16 }, 0.35);

    const st = enterExit(tl, { trigger: scope, start: "top 75%" });

    return () => {
      st.kill();
      tl.kill();
      // `revert()` y no `kill()`: SplitText es cirugía de DOM. Sin revertir, un
      // segundo montaje splittea sobre nodos ya splitteados.
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
