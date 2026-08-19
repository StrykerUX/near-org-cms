"use client";

import { useCallback, useRef } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import SectionCut, { clamp01 } from "@/components/sections/transition-labs/SectionCut";

// ── L · Sidestep ─────────────────────────────────────────────────────────────
//
// La sección siguiente entra POR EL LADO. Toda la página baja; en este corte, y
// solo en este, se mueve en horizontal. Es lo único que hace y es lo único que
// necesita hacer: el eje es la sorpresa.
//
// ── Una vez por página ──────────────────────────────────────────────────────
//
// Repetido en cada frontera deja de significar nada — peor, se vuelve un tic. La
// regla de uso es una sola aparición, en el corte que se quiera marcar como el
// más importante del documento.
//
// ── No secuestra el scroll ──────────────────────────────────────────────────
//
// La tentación era interceptar la rueda y convertirla en desplazamiento
// horizontal de verdad. No: eso rompe el trackpad, el teclado, el scrollbar y
// la barra de progreso del navegador, y en móvil es directamente una trampa.
//
// Acá el scroll sigue siendo vertical y lo que se mueve es una TIRA de dos
// paneles dentro del viewport pegajoso. El lector baja; lo que ve, se va de
// lado. Se consigue el efecto sin tocar el eje de nadie.
//
// ── Lo que se mueve es el VELO ──────────────────────────────────────────────
//
// La mitad izquierda de la tira es un panel del color de la sección que sale y
// la derecha está vacía: al correrse, lo que queda a la vista es la sección
// siguiente, ya montada detrás. En la primera versión el panel de la derecha
// era un negro opaco y la sección llegaba después — el mismo error de cola
// muerta que tenían todas.

export default function CutSidestep() {
  const stripRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback((p: number) => {
    const strip = stripRef.current;
    const out = outRef.current;
    const inner = innerRef.current;
    if (!strip || !out || !inner) return;

    // El velo está puesto desde el primer frame: es del color de la sección de
    // arriba, así que el lector no percibe que apareció.
    gsap.set(out, { opacity: 1 });

    const slide = clamp01(p / 0.96);
    // Cúbica de salida: la tira llega y frena. Lineal, se detiene de golpe en el
    // sitio y se siente un corte de montaje, no un movimiento.
    const eased = 1 - Math.pow(1 - slide, 3);
    gsap.set(strip, { xPercent: -50 * eased });
    // El rótulo va a 1.18× del gesto: llega retrasado y se acomoda al final.
    // Sin ese desfase, panel y rótulo son un solo bloque rígido deslizándose —
    // el aspecto exacto de una diapositiva.
    gsap.set(inner, { xPercent: (1 - eased) * 18 });
  }, []);

  return (
    <SectionCut travel="170svh" draw={draw}>
      {/* La tira mide dos pantallas: la de salida y la de llegada. Moverla el
          50% deja la segunda exactamente encuadrada. */}
      <div ref={stripRef} className="absolute inset-y-0 left-0 flex h-full w-[200%]">
        <div ref={outRef} aria-hidden="true" className="h-full w-1/2 bg-cream" />

        <div className="relative h-full w-1/2 overflow-hidden">
          <div
            ref={innerRef}
            className="absolute inset-0 flex items-center px-[60px] text-cream"
          >
            <p className="text-caption-mono uppercase text-cta-mint">
              the near stack →
            </p>
          </div>
        </div>
      </div>
    </SectionCut>
  );
}
