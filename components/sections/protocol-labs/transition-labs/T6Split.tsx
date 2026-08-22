"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T6 · Split — las cifras cosen el corte. ~50svh
//
// ── La idea, y es la más literal de las doce ──────────────────────────────
//
// La transición ES el corte entre dos superficies: arriba el crema del hero,
// abajo el blanco del contenido. Y las cifras están **partidas por esa línea**,
// con las dos mitades desalineadas — la de abajo corrida hacia un lado.
//
// A medida que se scrollea, las mitades se alinean. Al terminar la transición, el
// número está entero y las dos superficies quedan cosidas por él. La evidencia no
// acompaña al cambio de fondo: lo repara.
//
// ── Cómo está hecho ────────────────────────────────────────────────────────
//
// Dos copias del mismo texto, superpuestas, cada una recortada a su mitad con
// `clip-path` — la de arriba `inset(0 0 50% 0)`, la de abajo `inset(50% 0 0 0)`.
// Se dibuja el número completo dos veces y se muestra media vez cada una, así que
// las mitades son exactamente complementarias sin medir una sola altura.
//
// La copia superior lleva el color del texto sobre crema y la inferior el de
// sobre blanco. Hoy son el mismo negro, pero se declaran por separado a
// propósito: el día que una de las dos superficies cambie de tono, el número
// tiene que poder cambiar con ella sin rehacer el mecanismo.
//
// El desfase inicial va en `em` y no en píxeles: escala con el cuerpo del número,
// así que el corrimiento se ve igual de pronunciado en un teléfono que en un
// monitor.
//
// ── Lo que se arriesga ─────────────────────────────────────────────────────
//
// Que durante buena parte del recorrido las cifras sean **ilegibles**, que es
// justamente el estado que la variante muestra más tiempo. Se mitiga con dos
// cosas: el desfase es chico (0.18em, no medio carácter) y las etiquetas van
// enteras, sin partir, debajo de cada número.
//
// Si al verlo el efecto se lee como un error de renderizado en vez de como una
// decisión, no hay ajuste que lo salve: es el riesgo de la idea.
export default function T6Split() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const lower = q("[data-lower]");
      if (lower.length === 0) return;

      // Alternando el signo, las mitades inferiores no se corren todas para el
      // mismo lado: la fila se lee como una costura y no como un bloque
      // desplazado.
      const tween = gsap.fromTo(
        lower,
        { xPercent: (i) => (i % 2 === 0 ? 18 : -18) },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top bottom",
            end: "center center",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(lower, { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[50svh] flex-col justify-center overflow-hidden text-foreground"
    >
      {/* Las dos superficies. La línea entre ellas no lleva borde: el contraste
          entre crema y blanco ya la dibuja, y un filete encima haría que el
          número partido se leyera como tachado. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-cream" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-background" />

      <Container className="relative py-14">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {PROOF.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-2">
              {/* El contenedor reserva el alto del número una sola vez; las dos
                  mitades van absolutas encima. Con las dos en flujo, el bloque
                  mediría el doble. */}
              <dd className="relative">
                <span aria-hidden="true" className="invisible block text-h2 tabular-nums">
                  {stat.value}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block text-h2 tabular-nums text-foreground"
                  style={{ clipPath: "inset(0 0 50% 0)" }}
                >
                  {stat.value}
                </span>
                <span
                  data-lower
                  className="absolute inset-0 block text-h2 tabular-nums text-ink"
                  style={{ clipPath: "inset(50% 0 0 0)" }}
                >
                  {stat.value}
                </span>
              </dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
