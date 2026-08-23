"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { CTA_RAMP } from "@/components/primitives/motion/motionColors";
import { FORWARD_BODY, FORWARD_CODA } from "@/components/sections/chain/chainContent";

// §5b, opción 3 — "el mismo sujeto, otro operador".
//
// La frase que ilustra es la del segundo párrafo:
//
//   "…it needs an identity that persists and authority that travels with
//    it."
//
// Y la ilustra por omisión. Hay una sola marca —anillo con punto— y esa
// marca NO SE MUEVE NUNCA. Lo único que cambia es la línea de abajo, que
// alterna entre "operated by a person" y "operated by an agent". Cambia
// quién opera; la cuenta no. La quietud es el argumento.
//
// Es la más contenida de las tres y la más cercana en espíritu al original
// de la página real, que también dejaba de dibujar objetos — pero llega al
// revés: aquel soltaba marcas hacia arriba hasta quedarse vacío, este
// planta una sola y se niega a animarla.
//
// ── Fondo ───────────────────────────────────────────────────────────────
// Crema y sin gradiente, como las otras dos opciones. Sin blanco, sin
// bloom y sin la costura crema→blanco que solo existía para tapar el
// cambio de fondo. Acá la separación de las secciones vecinas la dan el
// aire (`py-[22svh]`), el salto a `text-statement` y la medida angosta y
// centrada del cuerpo — que es lo contrario de la lectura a ancho de
// columna del resto de la página.

const OPERATORS = ["a person", "an agent"] as const;

// Cuánto se queda cada operador antes de ceder. Largo a propósito: es una
// sección de respiro, y un texto que rota rápido pide atención en vez de
// soltarla.
const HOLD = 3.2;
const FADE = 0.7;

export default function ForwardTurn() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const heading = q("[data-turn-heading]");
      const mark = q("[data-turn-mark]");
      const body = q("[data-turn-body]");
      const operators = q("[data-turn-operator]");

      if (!motionOk) {
        // Sin animación los dos operadores conviven apilados. Un texto que
        // se reemplaza solo y no se puede pausar es exactamente lo que
        // `prefers-reduced-motion` pide evitar, así que acá no rota: se
        // muestran los dos y se lee la idea igual.
        gsap.set([heading, mark, body, operators], { clearProps: "all" });
        return;
      }

      // La entrada: auto-pautada y `once: true`, nunca `scrub` — la regla
      // que el original documenta para esta sección.
      const intro = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: scope, start: "top 70%", once: true },
      });

      intro
        .from(heading, { autoAlpha: 0, y: 24, duration: 0.8 }, 0)
        // La marca aparece por opacidad y NADA más. Sin escala, sin
        // desplazamiento: es el objeto que la sección promete que no se
        // mueve, y hacerlo entrar con un gesto lo desmentiría en su
        // primer segundo de vida.
        .from(mark, { autoAlpha: 0, duration: 1.1 }, 0.5)
        .from(body, { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.14 }, 0.9);

      // El relevo de operadores. Es lo único en loop de las tres opciones.
      gsap.set(operators, { autoAlpha: 0 });
      gsap.set(operators[0], { autoAlpha: 1 });

      const cycle = gsap.timeline({ repeat: -1, paused: true });
      operators.forEach((el, i) => {
        const next = operators[(i + 1) % operators.length];
        cycle
          .to(el, { autoAlpha: 0, duration: FADE, ease: EASE_OUT }, `+=${HOLD}`)
          .to(next, { autoAlpha: 1, duration: FADE, ease: EASE_OUT }, "<");
      });

      // Se detiene fuera del viewport — mismo helper que usa `Marquee`.
      // Sin esto sigue corriendo (y repintando) mientras el lector está
      // seis secciones más abajo.
      pauseOffscreen(cycle, scope);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-cream py-[22svh]">
      <Container>
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <h2 data-turn-heading className="max-w-[16ch] text-statement text-pretty">
            Built for what
            <br />
            <Accent display>transacts next</Accent>
          </h2>

          {/* La marca. Anillo y punto, nada más: es la misma figura a la
              que el hero colapsa sus treinta y cinco tickers, así que la
              página ya la tiene leída como "la cuenta". */}
          <svg
            data-turn-mark
            viewBox="0 0 64 64"
            className="mt-20 h-16 w-16"
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r="23"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.32"
              strokeWidth="1.5"
              className="text-ink"
            />
            <circle cx="32" cy="32" r="6" fill={CTA_RAMP[0]} />
          </svg>

          {/* El relevo. Los dos labels ocupan la MISMA celda de grilla y se
              superponen, así que el bloque tiene el alto de uno solo y la
              marca de arriba no se corre ni un pixel cuando cambian. Con
              `prefers-reduced-motion` la superposición sigue, pero los dos
              quedan visibles: se leen como una lista de dos. */}
          <div className="mt-8 grid motion-reduce:gap-1">
            {OPERATORS.map((who) => (
              <p
                key={who}
                data-turn-operator
                className="col-start-1 row-start-1 text-caption-mono uppercase text-gray-intermediate motion-reduce:col-start-auto motion-reduce:row-start-auto"
              >
                operated by — {who}
              </p>
            ))}
          </div>

          <div className="mt-20 flex flex-col gap-9">
            {FORWARD_BODY.map((p, i) => (
              <p
                key={p.slice(0, 24)}
                data-turn-body
                // El del medio es el argumento; los otros dos son su
                // entrada y su aterrizaje. Se lleva el cuerpo grande y la
                // tinta plena, los otros retroceden.
                className={
                  i === 1 ? "text-body-lg text-ink text-pretty" : "text-body text-ink-soft text-pretty"
                }
              >
                {p}
              </p>
            ))}

            {/* La coda: serif, sola, con aire de los dos lados. */}
            <p data-turn-body className="mt-10 text-h2-serif text-ink text-pretty">
              {FORWARD_CODA}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
