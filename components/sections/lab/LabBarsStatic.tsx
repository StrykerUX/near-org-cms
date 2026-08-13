"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { HERO_UNIT } from "@/components/sections/home-v2/heroGeometry";
import { STAIR_SPAN, stairOffsets, u } from "./labStairGeometry";
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
  // ── Arriba el gris NO tiene escalones ─────────────────────────────────────
  // Las siete columnas son grises desde el TOP de la sección, que además sube hasta el
  // TOP DEL HERO (el `marginTop` de abajo). La escalera de arriba vive enteramente en el
  // recorte del hero, que es quien la dibuja.
  //
  // No cambia nada de lo que se ve, y es fácil de comprobar: toda esa franja está dentro
  // de la caja del hero, que se apila en `z-[3]` y la tapa entera. Lo único visible ahí es
  // lo que el recorte descubre.
  //
  // Y es lo que habilita el cierre. El recorte tiene que poder subir hasta el borde de
  // ARRIBA DEL VIEWPORT para que las cuatro columnas converjan; con un top escalonado por
  // columna —o incluso con la sección arrancando a `-u·depth`— el recorte se pasaba del
  // gris en algún punto del recorrido y dejaba ver el crema de la página. Con el gris
  // cubriendo el hero entero eso es imposible a cualquier profundidad.
  //
  // La de ABAJO sigue siendo la de producción (`u·1.5`) y sigue siendo gris de verdad: es
  // la transición hacia OwnYourOwn, está por debajo del hero y nadie la recorta.
  const bottomOffsets = stairOffsets(STAIR_SPAN);

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
    // `-100svh`: la sección arranca exactamente en el top del hero, así que el gris cubre
    // toda la zona que el recorte puede llegar a descubrir. El alto TOTAL crece, pero lo
    // que se ve no: los `100svh` extra quedan detrás del hero, y el aire visible entre la
    // juntura y el statement sigue siendo `u·0.5` (ver `above` más abajo).
    //
    // Ya no hay ningún número que este componente tenga que compartir con `LabHeroCarve`:
    // la profundidad de la escalera es solo asunto del recorte.
    //
    // Lo que cambia respecto a producción es el orden de apilado — el hero pasa a `z-[3]`
    // y tapa esto hasta que su recorte lo descubre.
    <section
      ref={rootRef}
      style={
        {
          "--u": HERO_UNIT,
          marginTop: "calc(-100svh - 2px)",
        } as React.CSSProperties
      }
      className="relative z-[2] text-foreground"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 flex">
          {bottomOffsets.map((_, i) => (
            <div key={i} data-qbar-col className="relative flex-1">
              <div
                // La columna central lleva el marcador que el HUD busca. Su `gap` ya no
                // dice nada útil —el gris arranca arriba de todo, no en la juntura— pero
                // el panel necesita encontrar el elemento para no abortar la lectura.
                {...(i === 3 ? { "data-qbar-core": "" } : {})}
                className="absolute inset-x-0 bg-bar"
                style={{ top: 0, bottom: u(bottomOffsets[i]) }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* La juntura está a `100svh` del top de la sección; el texto entra `u·0.5`
          más abajo, igual que en producción. */}
      <LabStatement above="calc(100svh + var(--u) * 0.5)" />
    </section>
  );
}
