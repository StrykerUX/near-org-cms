"use client";

import { useRef } from "react";
import { ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import MuralGlScene from "./MuralGlScene";

// 14 · Melt — WebGL. Las palabras se derriten hacia abajo.
//
// Cada columna de píxeles cae una distancia distinta, sembrada con ruido, y se
// recompone al final del recorrido.
//
// ── Por qué se lee como materia y no como desenfoque ───────────────────────
//
// Dos decisiones del shader, las dos deliberadas. El desplazamiento es POR
// COLUMNA y con bordes duros: no hay promedio entre columnas vecinas, así que
// lo que cae es una tira sólida de la letra y no una versión difusa de ella. Y
// el muestreo va hacia arriba en la textura mientras se pinta más abajo, que es
// literalmente estirar el material.
//
// Un `filter: blur()` daría la idea contraria —algo que se desvanece— y encima
// costaría más: sobre cuatro palabras de 170px, un blur real es un repintado de
// toda la caja por frame.
//
// ── El progreso va y vuelve ────────────────────────────────────────────────
//
// El pico de derretido cae en el MEDIO del recorrido, no al final: la sección
// entra formada, se deshace al cruzar el centro del viewport y se recompone al
// salir. Terminar derretida dejaría la frase ilegible justo cuando el lector la
// tiene más cerca.

export default function MuralMelt() {
  const progress = useRef({ value: 0 });

  const rootRef = useMotionScope<HTMLDivElement>(({ scope, motionOk }) => {
    if (!motionOk) return;

    const prog = progress.current;

    const st = ScrollTrigger.create({
      trigger: scope,
      start: "top bottom",
      end: "bottom top",
      markers: DEBUG_MARKERS,
      // Triángulo: 0 en los extremos, 1 en el centro. Es el "va y vuelve" del
      // comentario de arriba, y sale de una línea en vez de dos tweens
      // encadenados que habría que mantener en fase.
      onUpdate: (self) => {
        prog.value = 1 - Math.abs(self.progress * 2 - 1);
      },
    });

    return () => {
      st.kill();
      prog.value = 0;
    };
  });

  return (
    <div ref={rootRef}>
      <MuralGlScene effect="melt" progress={progress} />
    </div>
  );
}
