"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-v2/heroGeometry";
import { STAIR_OFFSET, u } from "./labStairGeometry";
import { createStatementSweep } from "./labTextSweep";
import LabStatement from "./LabStatement";

// ── Approach B, mitad 1 de 2 · la reja ───────────────────────────────────────
//
// La escalera está COMPLETA y QUIETA desde el primer frame. No hay `scaleY`, no hay
// `clip-path`, no hay timeline: una pieza por columna, de `top: u·offset` a
// `bottom: u·offset`, que es la unión exacta de las tres piezas de producción.
//
// Quien anima es el hero (`LabHeroCarve`), que se apila POR ENCIMA de esta sección y
// va retirando su imagen con un recorte escalonado. O sea: el gris no crece, se
// descubre.
//
// Tres cosas que se caen solas al invertir de quién es el movimiento:
//
//   · Las 21 piezas y sus 21 tweens pasan a 7 divs y cero tweens.
//   · Las dos costuras de `+1px` entre escalón y bloque desaparecen: no hay dos piezas
//     que casar, hay una.
//   · La franja de crema en la juntura se vuelve IMPOSIBLE. El gris de cada columna
//     está siempre en su sitio final, y el borde de la imagen del hero nunca sube por
//     encima de donde ese gris empieza — así que no queda nada que se pueda destapar.
//     Ese bug consumió dos intentos y el HUD entero; acá no existe el estado que lo
//     producía.
//
// Lo único que sigue vivo acá es el barrido del statement, que nunca tuvo que ver con
// la juntura.

export default function LabBarsStatic() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const stage = q("[data-quantum='stage']")[0];
      const line = q("[data-quantum='line']")[0];
      const shine = q("[data-quantum='shine']")[0];
      if (!stage || !line || !shine) return;
      return createStatementSweep(stage, line, shine);
    });

    return () => mm.revert();
  }, []);

  return (
    // El margen negativo no cambia respecto a producción: la sección sigue montando
    // sobre el final del hero y el gris de la columna central sigue empezando justo en
    // `100svh`. Lo que cambia es el orden de apilado — el hero pasa a `z-[3]` y tapa
    // esto hasta que su recorte lo descubre.
    <section
      ref={rootRef}
      style={
        {
          "--u": HERO_UNIT,
          marginTop: "calc(-1 * var(--u) * 1.5 - 2px)",
        } as React.CSSProperties
      }
      className="relative z-[2] text-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex">
          {STAIR_OFFSET.map((offset, i) => (
            <div key={i} data-qbar-col className="relative flex-1">
              <div
                // La columna central lleva el marcador del HUD: su gris empieza
                // exactamente en la juntura, así que su borde superior es la línea
                // contra la que se mide todo lo demás.
                {...(offset === 1.5 ? { "data-qbar-core": "" } : {})}
                className="absolute inset-x-0 bg-bar"
                style={{ top: u(offset), bottom: u(offset) }}
              />
            </div>
          ))}
        </div>
      </div>

      <LabStatement />
    </section>
  );
}
