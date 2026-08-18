"use client";

import Container from "@/components/primitives/Container";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { createSeededRandom } from "@/components/primitives/motion/seededRandom";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 01 · Ledger ──────────────────────────────────────────────────────────────
//
// La grilla de la referencia tal cual —3×2, reglas punteadas, cifra en serif
// itálica con el final en verde— y CERO recorrido: 100svh, sin sticky, sin
// track. Todo pasa en el segundo en que la sección entra en cuadro y después se
// queda quieta.
//
// Está primera a propósito: es la línea base contra la que se miran las otras
// nueve. Si una versión con canvas y shader no gana nada contra esto, no vale
// lo que cuesta.
//
// ── Las reglas son bordes CSS y no un SVG ───────────────────────────────────
//
// La forma "correcta" parecía un SVG con `stroke-dasharray` animando el
// `stroke-dashoffset`, y no lo es por dos motivos que se descubren al
// escribirlo: en un SVG estirado a la caja (`preserveAspectRatio="none"`) el
// patrón de puntos se deforma con la relación de aspecto, y sobre un dash
// pattern el `dashoffset` no revela la línea — desliza los puntos, que es otro
// efecto.
//
// Un `border-dashed` de CSS no se deforma nunca y se revela escalando el nodo
// desde su extremo. Eso es exactamente el gesto que se quería.
//
// ── Los dígitos aterrizan, los no-dígitos no ────────────────────────────────
//
// Cuatro de las seis cifras tienen dígitos y dos no ("Quantum-ready",
// "Confidential"). En vez de inventarles un número para que las seis se
// comporten igual, las dos se revelan con máscara de línea. La asimetría del
// dato queda a la vista, que es más honesto que disimularla — y además evita el
// contador que no significa nada: "1 Million" contando de 0 a 1.
//
// El giro usa un generador SEMBRADO y no `Math.random()`: si el usuario cruza
// el breakpoint o cambia `prefers-reduced-motion`, `useMotionScope` reconstruye
// la escena, y con azar puro la segunda corrida mostraría otros dígitos en el
// aire — un parpadeo que se lee como bug.

// Cuántos dígitos falsos pasan antes del correcto. Siete es donde el giro se
// lee como giro; con tres parece un glitch y con quince se vuelve una máquina
// tragamonedas.
const SPINS = 7;

// Cuánto tarda un dígito en aterrizar. Los de la izquierda de cada cifra
// aterrizan antes, así que la cifra se "arma" de izquierda a derecha.
const SPIN_TIME = 0.5;
const SPIN_STEP = 0.055;

export default function LedgerGrid() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;

    const rand = createSeededRandom();
    const cells = q("[data-cell]");
    const rules = q("[data-rule]");
    const values = q("[data-value]");

    // Los splits se guardan para revertirlos en orden: primero la timeline (que
    // referencia los nodos generados), después los splits.
    const splits: SplitText[] = [];
    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 75%", once: true, markers: DEBUG_MARKERS },
    });

    // Las reglas primero: la grilla se dibuja y recién después se llena. Al
    // revés el texto aparecería flotando sin estructura.
    tl.from(rules, { scaleX: 0, scaleY: 0, duration: 0.7, stagger: 0.08 }, 0);

    cells.forEach((cell, i) => {
      const at = 0.25 + i * 0.09;
      tl.from(cell.querySelectorAll("[data-fade]"), {
        autoAlpha: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.08,
      }, at);
    });

    values.forEach((value, i) => {
      const at = 0.3 + i * 0.09;
      const split = SplitText.create(value, { type: "chars" });
      splits.push(split);
      const chars = split.chars as HTMLElement[];

      // `[0-9]` y no `\d`: el segundo también acepta dígitos de otros sistemas
      // de escritura, y girar un dígito devanagari a través de arábigos no es
      // un odómetro, es un error de renderizado.
      const digits = chars.filter((c) => /^[0-9]$/.test(c.textContent ?? ""));

      if (digits.length === 0) {
        // Sin dígitos: la cifra entra con una máscara que la descubre de
        // izquierda a derecha. Es el mismo tiempo que tarda un aterrizaje, para
        // que las seis celdas terminen juntas.
        tl.from(value, {
          clipPath: "inset(0 100% 0 0)",
          duration: SPIN_TIME + SPINS * 0.02,
        }, at);
        return;
      }

      digits.forEach((digit, d) => {
        const final = digit.textContent ?? "";
        // El proxy es un contador de PASOS, no un número: lo que se anima es
        // cuántos dígitos falsos ya pasaron. Con `snap` GSAP entrega enteros y
        // el `onUpdate` solo escribe cuando el paso cambió, así que no hay una
        // escritura al DOM por frame.
        const state = { step: 0 };
        let written = -1;
        tl.to(state, {
          step: SPINS,
          duration: SPIN_TIME,
          ease: "power2.out",
          snap: { step: 1 },
          onUpdate: () => {
            const step = Math.round(state.step);
            if (step === written) return;
            written = step;
            digit.textContent = step >= SPINS ? final : String(Math.floor(rand() * 10));
          },
          // El aterrizaje se fuerza también en `onComplete`: si el usuario deja
          // la pestaña justo durante el tween, GSAP puede saltar al final sin
          // pasar por el último `onUpdate` y el dígito quedaría en un valor
          // falso PARA SIEMPRE — la timeline es `once: true`.
          onComplete: () => {
            digit.textContent = final;
          },
        }, at + d * SPIN_STEP);
      });
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      splits.forEach((s) => s.revert());
    };
  });

  return (
    <section ref={rootRef} className="flex min-h-svh items-center bg-cream py-20 text-ink">
      <Container>
        {/* La grilla y las reglas viven en el mismo contenedor relativo: las
            reglas son hermanas absolutas de las celdas, no bordes de las
            celdas. Como borde, cada regla existiría dos veces (el derecho de
            una celda y el izquierdo de la siguiente) y habría que apagar una de
            las dos por posición — tres reglas sueltas se animan y se leen
            mejor. */}
        <div className="relative grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-16">
          {/* Verticales en los tercios, horizontal a la mitad. `origin-*` es lo
              que decide desde qué extremo se dibuja cada una. */}
          <span
            data-rule
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/3 hidden origin-top border-l border-dashed border-rule lg:block"
          />
          <span
            data-rule
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-2/3 hidden origin-bottom border-l border-dashed border-rule lg:block"
          />
          <span
            data-rule
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 hidden origin-left border-t border-dashed border-rule lg:block"
          />

          {PROOF_STATS.map((stat) => (
            <article key={stat.id} data-cell className="flex flex-col gap-5 lg:px-8">
              <h3 data-fade className="text-h4">
                {stat.eyebrow}
              </h3>

              {/* Un solo nodo de texto y no dos spans anidados: el split por
                  caracteres tiene que ver la cifra entera para que el
                  escalonado cruce el corte de color sin saltar. El verde se
                  aplica con un span interior, que el split conserva. */}
              <p data-fade className="text-h1-serif italic">
                <span data-value>
                  {stat.value}
                  <span className="text-green-ink">{stat.accent}</span>
                </span>
              </p>

              <p data-fade className="max-w-[46ch] text-body-sm text-gray-intermediate text-pretty">
                {stat.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
