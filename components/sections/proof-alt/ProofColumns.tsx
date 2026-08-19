"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── D · Columns ──────────────────────────────────────────────────────────────
//
// Seis columnas del alto de la pantalla. La cifra se escribe en VERTICAL y
// ocupa la columna entera; el cuerpo queda al pie, horizontal.
//
// Es la más gráfica de las tres y la que más se parece a un cartel: seis
// columnas del alto del viewport no se pueden ignorar, y el bloque entero se
// lee como una sola pieza antes de que el ojo lea una sola palabra.
//
// El precio es real y hay que decirlo: **leer una cifra en vertical cuesta un
// instante más**. Lo que se gana a cambio es que las seis se ven de un vistazo
// como estructura. Si estas cifras tienen que LEERSE rápido, la C gana; si
// tienen que IMPRESIONAR, esta.
//
// ── Solo la cifra gira, nunca el cuerpo ─────────────────────────────────────
//
// Un texto de tres líneas en vertical no se lee: se descifra. La cifra son dos
// o tres palabras conocidas y aguanta el giro; el cuerpo se queda horizontal al
// pie, donde el ojo ya sabe buscarlo. Es la misma regla de los carteles suizos
// de los que esto viene.
//
// ── En móvil no hay columnas: la cifra vuelve a acostarse ───────────────────
//
// Seis columnas verticales a 375px son seis tiras de 60px, y una cifra vertical
// ahí es ilegible. En móvil la sección cae a seis bloques apilados con la cifra
// horizontal, separados por reglas. Se pierde el gesto y se conserva el
// contenido, que es el orden correcto de prioridades.
//
// Lo hace CSS solo (`lg:` en el writing-mode y en la rotación), sin JS: un
// cambio de layout que dependiera de JS dejaría el texto girado hasta que el
// bundle cargara.

export default function ProofColumns() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk) return;

    const cols = q("[data-col]");
    const feet = q("[data-foot]");
    if (cols.length === 0) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 72%", once: true, markers: DEBUG_MARKERS },
    });

    if (isDesktop) {
      // Cada columna se descubre de abajo hacia arriba, como una persiana que
      // sube. Va con `clipPath` y no con un `y`: la columna tiene que aparecer
      // EN SU SITIO, no llegar deslizándose — si se moviera, seis columnas
      // entrando a destiempo se leerían como un acordeón.
      tl.from(cols, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.95,
        stagger: 0.11,
      }, 0);

      // Los cuerpos entran DESPUÉS de que todas las columnas terminaron: son la
      // letra chica, y compitiendo con el barrido no se leen igual.
      tl.from(feet, { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.07 }, 0.75);
    } else {
      // En móvil no hay persiana que subir — la sección es una pila. Entrada
      // simple, la misma que usa el resto del sitio para una lista.
      tl.from(cols, { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.08 }, 0);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([...cols, ...feet], { clearProps: "all" });
    };
  });

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col justify-center bg-background py-20 text-ink"
    >
      <Container className="flex min-h-0 flex-col gap-8">
        <Eyebrow className="text-gray-intermediate">Built to</Eyebrow>

        <div className="flex flex-col lg:grid lg:h-[68svh] lg:grid-cols-6 lg:border-t lg:border-ink">
          {PROOF_STATS.map((stat, i) => (
            <article
              key={stat.id}
              data-col
              // El borde derecho en todas menos la última: en móvil son reglas
              // horizontales entre bloques apilados, en desktop las divisiones
              // de las columnas.
              className={`flex min-w-0 flex-col gap-4 border-b border-rule py-6 last:border-b-0 lg:border-b-0 lg:py-5 lg:pl-5 lg:pr-5 ${
                i === PROOF_STATS.length - 1 ? "" : "lg:border-r lg:border-rule"
              }`}
            >
              <p className="text-caption-mono text-green-ink">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-h4 text-gray-intermediate">{stat.eyebrow}</p>

              {/* El contenedor que se come el alto sobrante: la cifra se apoya
                  en el pie de la columna, no flota a media altura. En móvil no
                  crece — no hay alto que repartir. */}
              <div className="lg:flex lg:min-h-0 lg:flex-1 lg:items-end">
                <p className="text-h2-serif italic lg:whitespace-nowrap lg:rotate-180 lg:[writing-mode:vertical-rl]">
                  {stat.value}
                  <span className="text-green-ink">{stat.accent}</span>
                </p>
              </div>

              <p
                data-foot
                className="text-body-sm text-gray-intermediate text-pretty"
              >
                {stat.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
