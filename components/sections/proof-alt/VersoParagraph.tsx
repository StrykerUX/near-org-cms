"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── 10 · Verso ───────────────────────────────────────────────────────────────
//
// Las seis cifras entran como parte de una FRASE, no como una tabla, y el
// recorrido las va sacando de ahí: cada una se apaga en el párrafo y aparece
// archivada en la columna de la derecha. Al final el párrafo está hueco y la
// columna llena.
//
// Es la única que trata las seis pruebas como prosa. La diferencia con todas
// las demás no es de animación: es que acá las cifras tienen SINTAXIS —"ha
// liquidado $24+ mil millones a través de 30+ cadenas"— y en una tabla no. Lo
// que se está evaluando es si esa sintaxis vale el ancho que ocupa.
//
// 150svh de track: la mitad que la 05, tres veces menos que el stepper que esta
// sección viene a reemplazar. Suficiente para seis pasos legibles.
//
// ── El hueco se deja, no se cierra ──────────────────────────────────────────
//
// Cuando una cifra se archiva, en el párrafo queda su sitio vacío en vez de
// cerrarse el texto. Es deliberado: colapsar el espacio re-flowaría el párrafo
// entero en cada paso, y ver seis renglones reacomodarse es un movimiento mucho
// más fuerte que el que se estaba contando. El hueco además dice algo — el dato
// no desapareció, se movió.

const N = PROOF_STATS.length;
const TRAVEL = "150svh";

// Cuánto del recorrido ocupa cada archivado, y cuánto dura el gesto. La suma
// deja aire al final para leer la columna ya completa.
const STEP = 0.13;
const START = 0.06;

export default function VersoParagraph() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    const figures = q("[data-figure]");
    const cards = q("[data-filed]");
    if (figures.length !== N || cards.length !== N) return;

    // En móvil y con reduced-motion no hay recorrido: el párrafo se lee entero
    // y la columna aparece completa debajo. Las dos mitades siguen diciendo lo
    // mismo, solo que a la vez.
    if (!motionOk || !isDesktop) return;

    const off = enableScene(scope, "verso");

    // Estado inicial desde JS y no desde el markup: con `opacity-0` en las
    // clases, un fallo de bundle dejaría la columna invisible para siempre.
    gsap.set(cards, { autoAlpha: 0, y: 18 });

    const tl = trackTimeline(scope, { scrub: 0.35 });

    figures.forEach((figure, i) => {
      const at = START + i * STEP;

      // La cifra se apaga en el párrafo. No se borra: queda en gris muy claro,
      // así el lector ve dónde estaba y el renglón conserva su medida.
      tl.to(figure, { color: "#c9c7c1", duration: STEP * 0.6, ease: "none" }, at);

      // Y aparece en la columna. Entra desde arriba y no desde el párrafo: un
      // vuelo real entre los dos puntos exige medir dos cajas que se mueven con
      // el sticky, y lo que se gana no paga la fragilidad.
      tl.to(
        cards[i],
        { autoAlpha: 1, y: 0, duration: STEP * 0.9, ease: EASE_OUT },
        at + STEP * 0.25
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([...figures, ...cards], { clearProps: "all" });
      off();
    };
  });

  return (
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as React.CSSProperties}
      className="group/verso relative bg-background text-ink data-[verso=on]:h-[calc(var(--travel)+100svh)]"
    >
      <div className="group-data-[verso=on]/verso:sticky group-data-[verso=on]/verso:top-0 group-data-[verso=on]/verso:flex group-data-[verso=on]/verso:h-svh group-data-[verso=on]/verso:items-center">
        <Container className="grid grid-cols-1 gap-16 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-24 lg:py-0">
          <div className="flex flex-col gap-10">
            <Eyebrow className="text-gray-intermediate">Built to</Eyebrow>

            {/* La frase. Las cifras son spans dentro del párrafo y no piezas
                sueltas maquetadas: si estuvieran fuera, el texto que las une
                sería relleno alrededor de una tabla, que es justo lo que esta
                versión existe para no ser.

                `accent-serif` y no `text-h3-serif`: el tramo serif vive DENTRO
                de un renglón sans y tiene que heredar su escala (la utilidad es
                relativa, 1em × la escala óptica de Kepler). Una utilidad de
                heading fijaría su propio font-size y desalinearía el renglón
                que la contiene. */}
            <p className="text-h3 text-balance">
              NEAR has held{" "}
              <span data-figure className="accent-serif text-green-ink">
                100% uptime
              </span>{" "}
              for more than five years, clears{" "}
              <span data-figure className="accent-serif text-green-ink">
                1 Million TPS
              </span>{" "}
              on consumer-grade hardware, has settled{" "}
              <span data-figure className="accent-serif text-green-ink">
                $24+ Billion
              </span>{" "}
              of cross-chain volume across{" "}
              <span data-figure className="accent-serif text-green-ink">
                30+ Blockchains
              </span>
              , signs{" "}
              <span data-figure className="accent-serif text-green-ink">
                Quantum-ready
              </span>{" "}
              from day one, and keeps every trade{" "}
              <span data-figure className="accent-serif text-green-ink">
                Confidential
              </span>
              .
            </p>
          </div>

          {/* La columna de archivo. Sin JS aparece completa: es la lista de las
              seis pruebas con su cuerpo, que es contenido de pleno derecho y no
              el residuo de una animación. */}
          <ul className="flex flex-col gap-6 border-rule lg:border-l lg:pl-8">
            {PROOF_STATS.map((s) => (
              <li key={s.id} data-filed className="flex flex-col gap-1.5">
                <p className="text-caption-mono text-green-ink">{s.eyebrow}</p>
                <p className="text-h4">{s.plain}</p>
                <p className="text-body-sm text-gray-intermediate text-pretty">{s.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
