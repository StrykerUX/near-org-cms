"use client";

import { useRef, type RefObject } from "react";
import Container from "@/components/primitives/Container";
import MuralGl, { type MuralGlEffect } from "./MuralGl";
import { LINES, rampGradient } from "./muralContent";

// El layout del mural con una envoltura `relative` por palabra, para las
// variantes que le cuelgan un canvas encima.
//
// Es el mismo marcado que `MuralBlock` —mismas clases, mismos `data-*`, mismos
// tokens— con dos diferencias, y las dos son necesarias para el shader:
//
//   · cada palabra vive dentro de un `relative` que le da la caja al canvas;
//   · la palabra lleva `opacity-0`, así que sigue en el DOM y en el árbol de
//     accesibilidad, sigue definiendo la caja con su tipografía real, pero lo
//     que se ve es el canvas.
//
// Se separó de `MuralBlock` en vez de sumarle una prop porque once de las
// catorce variantes no necesitan nada de esto, y una prop que solo tres usan
// convierte al componente compartido en un condicional. Lo que se comparte de
// verdad —el contenido, el degradado, los tokens— sigue viniendo de
// `muralContent`, así que las dos no pueden divergir en lo que importa.

export default function MuralGlScene({
  effect,
  progress,
  velocity,
}: {
  effect: MuralGlEffect;
  progress: RefObject<{ value: number }>;
  velocity?: RefObject<{ value: number }>;
}) {
  const hosts = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];

  return (
    <Container as="section" className="bg-bar py-[7svh]">
      <div className="@container flex flex-col gap-[2.5svh]">
        {LINES.map((line, i) => (
          <div
            key={line.word}
            data-mural-line
            className={`flex items-baseline gap-6 ${
              line.labelSide === "right" ? "flex-row-reverse" : ""
            }`}
          >
            <p
              data-mural-label
              className="text-body-lg shrink-0 whitespace-pre-line text-foreground"
            >
              {line.label}
            </p>

            <span className="relative min-w-0 flex-1">
              <span
                ref={hosts[i]}
                data-mural-word
                style={{ backgroundImage: rampGradient(line) }}
                className={`text-mural font-display block whitespace-nowrap bg-clip-text uppercase text-transparent opacity-0 ${
                  line.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {line.word}
              </span>
              <MuralGl
                line={line}
                effect={effect}
                progress={progress}
                velocity={velocity}
                hostRef={hosts[i]}
              />
            </span>
          </div>
        ))}
      </div>
    </Container>
  );
}
