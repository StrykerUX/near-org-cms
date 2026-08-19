"use client";

import { useCallback, useRef } from "react";
import { gsap } from "@/components/primitives/motion/gsapClient";
import SectionCut, { gate } from "@/components/sections/transition-labs/SectionCut";

// ── F · Slats ────────────────────────────────────────────────────────────────
//
// El corte se hace en LAMAS, pero inclinadas a 30.79° — el ángulo exacto de la
// cara superior del cubo del NEAR Stack. La geometría del corte es la del
// objeto al que lleva.
//
// Ese número no es una decisión de gusto: sale de la base afín del arte
// (`stackAssembly`: el eje U = (51.28, −30.56) ⇒ atan = 30.79°), el mismo que ya
// usa la variante Axis del laboratorio del stack para acostar su rótulo. Con
// 30 redondo se nota como "un poco torcido"; con el ángulo real, las lamas y el
// isométrico son la misma retícula.
//
// ── Las lamas ENTRAN, no se abren ───────────────────────────────────────────
//
// Cada lama crece desde su borde izquierdo (`scaleX` con origen a la izquierda)
// y las doce van escalonadas. Escalonar es lo que lo separa de un wipe: un wipe
// tiene un borde, esto tiene doce, y los doce llegan a destiempo.
//
// ── Por qué el contenedor está sobredimensionado ────────────────────────────
//
// Al rotar un rectángulo, sus esquinas se salen de la caja. Para que las lamas
// cubran la pantalla entera después de rotar hace falta un contenedor mayor que
// la diagonal — de ahí el 260%: `hypot(100,100)` ≈ 142% para una pantalla
// cuadrada, y bastante más en una apaisada. Redondeado hacia arriba porque el
// coste de sobrar es cero y el de faltar es una esquina cream.

const ANGLE = -30.79;
const SLATS = 12;

export default function CutSlats() {
  const slatsRef = useRef<HTMLDivElement>(null);

  const draw = useCallback((p: number) => {
    const host = slatsRef.current;
    if (!host) return;
    const items = host.children;
    for (let i = 0; i < items.length; i++) {
      // 0.55 de solape: las lamas se pisan bastante. Con menos, se leen como
      // doce barras entrando una por una —una lista, no un corte— y el gesto se
      // hace larguísimo.
      gsap.set(items[i], { scaleX: gate(i, items.length, p, 0.55) });
    }
  }, []);

  return (
    <SectionCut travel="160svh" settle={0.85} draw={draw}>
      <div
        aria-hidden="true"
        style={{ transform: `translate(-50%, -50%) rotate(${ANGLE}deg)` }}
        className="absolute left-1/2 top-1/2 flex h-[260%] w-[260%] flex-col"
      >
        <div ref={slatsRef} className="flex h-full w-full flex-col">
          {Array.from({ length: SLATS }, (_, i) => (
            <div key={i} className="h-full w-full origin-left scale-x-0 bg-ink" />
          ))}
        </div>
      </div>
    </SectionCut>
  );
}
