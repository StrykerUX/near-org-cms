"use client";

import Container from "@/components/primitives/Container";
import ColumnRule from "@/components/sections/solutions-a/ColumnRule";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";
import { PROOF_STATS } from "@/components/sections/solutions/solutionsContent";

// §2 — no afirmar nada, mostrarlo todo.
//
// ── La fila es uniforme a propósito ────────────────────────────────────────
//
// Cinco cifras, una fila, un tamaño. El argumento completo está en
// `chain/ProofBand`, de donde sale esta sección, y vale igual acá: el trabajo de
// la franja es «una mirada = esto es real y se usa a escala», y cinco cifras
// iguales entregan el reclamo entero en un barrido del ojo, donde una versión
// escalonada obliga al lector a armarlo en tres movimientos. La uniformidad ES
// el argumento — son cinco hechos del mismo rango, no una historia con remate.
//
// La consecuencia es que el stagger también tiene que ser parejo: una pausa
// sobre la última, en una fila de iguales, se lee como tartamudeo y no como
// énfasis.
//
// ── Por qué ninguna cuenta hacia arriba ────────────────────────────────────
//
// Se consideró y se descartó por un motivo concreto y no de gusto:
// **`Sub-cent` no puede contar.** Tallar hasta un umbral de MENOS-QUE no
// significa nada, así que un contador cubre cuatro de las cinco y tiene que
// dejar la quinta quieta — cuatro números actuando mientras uno se queda es peor
// que cinco quietos, y rompe justo la uniformidad sobre la que la fila está
// construida. (`protocol-labs/countUp` existe y esta sección deliberadamente no
// lo usa.)
//
// Lo que hacen en cambio es llegar en el vocabulario de la página: el filete
// barre, y la cifra sube desde el espacio que ese filete acaba de dejar. Es el
// mismo mecanismo de máscara por renglón que usan el hero y el índice, así que
// los números pasan a ser parte del lenguaje de trazo en vez de un widget
// soltado adentro.

export default function ProofRow() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    // `mask: "lines"` envuelve cada renglón en un contenedor con overflow, así
    // que la cifra viene DE ATRÁS del espacio que el filete acaba de dibujar en
    // vez de flotar desde ninguna parte.
    //
    // Sin `autoSplit`: son cifras cortas de un solo renglón que nunca hacen
    // wrap, así que no hay nada que un re-split arregle, y saltearlo mantiene
    // estables los renglones que la timeline referencia por índice.
    const split = SplitText.create(q("[data-stat-value]"), { type: "lines", mask: "lines" });
    allowDescenders(split.lines);

    // ── El trigger cuelga de la FILA, no de la sección ────────────────────
    //
    // Es la diferencia entre ver la animación y llegar tarde. La sección lleva
    // `py-[14svh]`, o sea ~135px de aire antes de la primera cifra: con
    // `trigger: scope` el punto de disparo es el borde superior de ese aire, así
    // que a velocidad de scroll normal la fila entera se anima mientras todavía
    // está por debajo del fold y el lector se encuentra con una fila ya
    // terminada. Medido en las tres propuestas: era el motivo de que varias
    // secciones parecieran «no animar».
    //
    // Anclado a la fila y a `top 88%`, el primer filete empieza a barrer
    // exactamente cuando asoma.
    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: {
        trigger: q("[data-stat-block]")[0],
        start: "top 88%",
        toggleActions: "play none none none",
        markers: DEBUG_MARKERS,
      },
    });


    // Tiempos apretados a propósito: estaban en 0.8–0.95s con stagger de 0.12,
    // o sea ~1.5s de punta a punta. A velocidad de scroll normal el lector
    // atraviesa la sección antes de que termine, así que ve el FINAL de la
    // animación y no la animación — que es lo que se siente como «tarda» o como
    // «no pasó nada». Con el trigger ya anclado al contenido, esto es lo que
    // faltaba para que el gesto entre en la ventana en que la sección está en
    // cuadro.
    tl.from(q("[data-stat-rule]"), { scaleX: 0, duration: 0.55, stagger: 0.07 }, 0)
      // La cifra sigue a su propio filete por un quinto de segundo, así que la
      // fila se lee como cinco filetes dibujando y cinco números subiendo detrás
      // — no como dos oleadas separadas.
      .from(split.lines, { yPercent: 112, autoAlpha: 0, duration: 0.7, stagger: 0.07 }, 0.14)
      .from(q("[data-stat-label]"), { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.07 }, 0.36);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      split.revert();
    };
  });

  return (
    <section ref={rootRef} className="relative bg-cream pb-24 pt-16">
      {/* La retícula no muere con el hero. Es la textura de la propuesta A —su
          respuesta a «cuánta superficie necesita esta página»— y cortándola en
          el primer scroll el hero quedaba como una pieza con fondo propio en vez
          de como la primera pantalla de un sistema. Sigue hasta que arranca la
          escena pegada, que es donde la página cambia de modo de lectura. */}
      <ColumnRule />

      <Container className="relative">
        {/* Cinco columnas en desktop y no las doce del `grid-ds`: cinco no
            divide a doce, así que repartirlas ahí deja una celda coja. Es una
            fila de cinco iguales y su retícula propia lo dice mejor. */}
        <div
          data-stat-block
          className="grid grid-cols-2 gap-x-[var(--grid-gutter)] gap-y-12 sm:grid-cols-3 lg:grid-cols-5"
        >
          {PROOF_STATS.map((s) => (
            <div key={s.id}>
              <div data-stat-rule className="h-px w-full origin-left bg-rule" aria-hidden="true" />
              {/* `text-h2-serif` y no `text-h1-serif`: son CINCO columnas y no
                  cuatro, y `Sub-cent` a la escala mayor desborda su celda a
                  1024px. La fila entera baja un escalón junta — una de cinco a
                  otro tamaño es justo lo que este layout existe para evitar. */}
              <p data-stat-value className="mt-6 text-h2-serif italic">
                {s.value}
              </p>
              <p
                data-stat-label
                className="mt-3 max-w-[22ch] text-body-sm text-gray-intermediate text-pretty"
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
