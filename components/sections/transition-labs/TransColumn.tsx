"use client";

import { ColumnGreen } from "@/components/sections/home-ab7/stackArt.generated";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";

// ── E · Column ───────────────────────────────────────────────────────────────
//
// La columna del stack SUBE desde abajo y se trae el negro con ella. El fondo
// oscuro no es un telón aparte: es lo que la pieza va dejando atrás.
//
// Es la única de las cinco en la que el objeto de la sección SIGUIENTE es el
// que hace la transición. Las otras cuatro son un efecto entre dos secciones;
// esta es la sección de abajo asomándose.
//
// ── El desfase entre la pieza y el negro es el efecto entero ────────────────
//
// La punta de la columna va SIEMPRE por delante del borde del negro, así que
// durante todo el viaje hay un trozo de columna verde recortado contra el
// cream. Sin ese desfase —con el negro y la pieza subiendo juntos— no se lee
// "la columna arrastra el fondo": se lee "sube un rectángulo negro que además
// tiene una columna".
//
// El negro cierra ANTES de que la columna termine de subir (`* 1.35`): el
// último tramo del recorrido es la pieza acomodándose sobre negro pleno, que
// es ya el fondo de la sección siguiente.
//
// ── Sin build-in y sin anillos ──────────────────────────────────────────────
//
// Acá la columna es solo el arte: no hay hover, no hay paradas, no hay capas.
// Todo eso empieza en la sección de abajo. Esta pieza es la MISMA imagen
// llegando, y su trabajo termina cuando la sección de verdad la toma.

// ── La transición SOLAPA la sección de arriba ───────────────────────────────
//
// `-mt-[100svh]` y `z-[2]`: el tramo empieza una pantalla ANTES de donde
// terminaría la sección anterior, así que el gesto ocurre encima de ella —
// todavía con las cards en pantalla— y no sobre un rectángulo vacío.
//
// Sin eso, el primer viewport del tramo es una pantalla de cream con nada, el
// gesto arranca recién después, y lo que se lee no es una transición: es una
// pausa y después un efecto. El coste real en scroll es también menor: el
// recorrido menos la pantalla que solapa.

const TRAVEL = "180svh";

export default function TransColumn() {
  const rootRef = useMotionScope<HTMLElement>(({ scope, motionOk }) => {
    const ink = scope.querySelector<HTMLElement>("[data-ink]");
    const col = scope.querySelector<HTMLElement>("[data-col]");
    if (!ink || !col) return;

    if (!motionOk) {
      gsap.set(ink, { scaleY: 1 });
      gsap.set(col, { xPercent: -50, yPercent: 0 });
      return;
    }

    // El centrado horizontal va en xPercent y no en una clase: al escribir
    // `yPercent`, GSAP reescribe el `transform` entero y un `-translate-x-1/2`
    // puesto por Tailwind desaparecería en el primer frame.
    gsap.set(col, { xPercent: -50 });
    const setInk = gsap.quickSetter(ink, "scaleY");
    const setCol = gsap.quickSetter(col, "yPercent");
    setInk(0);
    setCol(115);

    const t = ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        setInk(Math.min(1, p * 1.35));
        // Cúbica de salida: la columna llega y frena. Lineal, aterriza a la
        // misma velocidad con la que salió y se siente un empujón, no un
        // movimiento con peso.
        setCol(115 * (1 - (1 - Math.pow(1 - p, 3))));
      },
    });

    return () => t.kill();
  });

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="relative z-[2] -mt-[100svh] h-[var(--travel)] bg-transparent"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          data-ink
          aria-hidden="true"
          className="absolute inset-0 origin-bottom bg-ink"
        />

        {/* La columna, a sangre por abajo: apoyada en el borde inferior y un
            poco más allá, para que nunca se vea su base flotando. */}
        <div
          data-col
          aria-hidden="true"
          className="absolute -bottom-[6svh] left-1/2 h-[92svh]"
        >
          <ColumnGreen className="h-full w-auto" />
        </div>
      </div>
    </section>
  );
}
