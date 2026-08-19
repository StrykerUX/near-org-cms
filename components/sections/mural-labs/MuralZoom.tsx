"use client";

import { gsap } from "@/components/primitives/motion/gsapClient";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import MuralBlock from "./MuralBlock";
import { LINES } from "./muralContent";

// 11 · Zoom — la única que se gana su propio tramo de scroll.
//
// La sección se pega al viewport y las palabras arrancan enormes, fuera de
// caja, asentándose a su tamaño con el progreso.
//
// ── `position: sticky`, nunca `pin` ────────────────────────────────────────
//
// Regla de la casa, con el razonamiento largo en `motion/stickyScene.ts`: el
// recorrido se declara en CSS y el ScrollTrigger solo lo LEE. Un `pin` inserta
// un pin-spacer que pelea con Lenis y deja spacers fantasma bajo StrictMode.
//
// El interruptor es el atributo `data-scene`, y lo escribe SOLO `enableScene` —
// nunca el JSX. Declararlo en los dos lados da dos fuentes para un mismo estado
// y el primer re-render de React desarma el layout pegado en silencio.
//
// Sin JS, sin motion o en móvil el atributo no existe: el track mide lo que mide
// su contenido, nada se pega y el bloque se lee en flujo normal.
//
// ── El escalado sale del borde de alineación ───────────────────────────────
//
// Igual que en `05 · Typeset`: desde el centro sería un zoom de cámara; desde
// el borde al que la palabra se alinea, se lee como tipografía encontrando su
// medida. Y `scale` y no `font-size`: el tamaño es un `clamp` en `cqw` y
// animarlo dispararía un reflow por frame sobre cuatro líneas de 170px.

export default function MuralZoom() {
  const rootRef = useMotionScope<HTMLDivElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const track = q("[data-track]")[0];
    const words = q("[data-mural-word]");
    if (!track || words.length === 0) return;

    const off = enableScene(scope, "scene");

    words.forEach((word, i) => {
      gsap.set(word, {
        scale: 2.4,
        transformOrigin: LINES[i]?.align === "right" ? "right center" : "left center",
      });
    });

    const tl = trackTimeline(track, { scrub: 0.5, defaults: { ease: "none" } });
    // Escalonado dentro del propio recorrido: la primera línea asienta al 45%
    // del scroll y la última al 100%, así que el bloque se ordena de arriba
    // abajo en vez de encogerse en masa.
    words.forEach((word, i) => {
      tl.to(word, { scale: 1, duration: 0.55 }, i * 0.15);
    });

    return () => {
      off();
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(words, { clearProps: "transform,transformOrigin" });
    };
  });

  return (
    <div ref={rootRef} className="group">
      {/* El alto del track ES el recorrido de la escena, y solo existe con la
          escena encendida. Apagado, mide su contenido. */}
      <div
        data-track
        className="relative lg:motion-safe:group-data-[scene=on]:h-[220svh]"
      >
        <div className="flex min-h-[100svh] flex-col justify-center overflow-hidden lg:group-data-[scene=on]:sticky lg:group-data-[scene=on]:top-0">
          <MuralBlock />
        </div>
      </div>
    </div>
  );
}
