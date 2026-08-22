"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T8 · Grid — la retícula se hace visible una sola vez. ~50svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// Toda la página está gobernada por doce columnas —el hero, el acto, el
// apéndice— y en ninguna se ven. Esta transición las dibuja: doce filetes que
// bajan desde el borde superior, las cifras aterrizando cada una en su columna, y
// las líneas desvaneciéndose hacia abajo, hacia el contenido que van a seguir
// gobernando sin verse.
//
// El sentido es exactamente ese: la juntura es el único lugar donde tiene sentido
// mostrar el andamiaje, porque es el lugar donde el lector pasa de una estructura
// a otra. Después, la retícula vuelve a ser invisible.
//
// Resuelve además un pendiente concreto de la página: `ColumnRule` era la textura
// del hero anterior y con el hero nuevo se quedó sin usar. Acá vuelve, y vuelve
// significando algo en vez de decorando un fondo.
//
// ── Las cifras caen en columnas alternas, no consecutivas ────────────────
//
// Seis cifras en doce columnas: si fueran las seis primeras quedarían todas en la
// mitad izquierda. Van en 1, 3, 5, 7, 9 y 11 — una sí y una no— así que ocupan el
// ancho completo y cada una tiene una columna vacía a su derecha para respirar.
// Ese hueco es lo que deja ver los filetes entre ellas, que es el punto de la
// variante.
//
// ── El movimiento ──────────────────────────────────────────────────────────
//
// Los filetes se trazan de arriba abajo (`scaleY` desde el origen superior) y las
// cifras entran después, ya con la retícula puesta. El orden importa: primero la
// estructura, después el contenido llegando a algo que ya está. Es el mismo
// criterio del eje de `ProofDatum` en la homepage.

// Mapa literal de posiciones: Tailwind v4 no ve las clases construidas en tiempo
// de ejecución.
const COL = [
  "lg:col-start-1",
  "lg:col-start-3",
  "lg:col-start-5",
  "lg:col-start-7",
  "lg:col-start-9",
  "lg:col-start-11",
] as const;

export default function T8Grid() {
  const countRef = useCountUp<HTMLDListElement>({ start: "top 68%", stagger: 0.07 });

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: scope, start: "top 85%", once: true },
      });
      tl.from(q("[data-rule]"), { scaleY: 0, duration: 0.8, stagger: 0.04 }, 0);
      tl.from(q("[data-stat]"), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.07 }, 0.45);
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[50svh] flex-col justify-center overflow-hidden border-t border-rule bg-background text-foreground"
    >
      {/* Los doce filetes. El degradado que los apaga hacia abajo va como máscara
          y no como un gradiente encima: encima taparía también a las cifras, y lo
          que tiene que desvanecerse es la retícula, no el contenido. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 92%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 92%)",
        }}
      >
        <Container className="h-full">
          <div className="grid-ds h-full">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} data-rule className="h-full origin-top border-l border-ink/12" />
            ))}
          </div>
        </Container>
      </div>

      <Container className="relative py-16">
        <dl ref={countRef} className="grid-ds gap-y-10">
          {PROOF.map((stat, i) => (
            <div
              key={stat.id}
              data-stat
              className={`col-span-full flex flex-col gap-1 sm:col-span-6 lg:col-span-2 ${COL[i]}`}
            >
              <dd data-count={stat.value} className="text-h2 tabular-nums">
                {stat.value}
              </dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
              {stat.note && (
                <dd className="text-micro-mono text-gray-intermediate text-pretty">{stat.note}</dd>
              )}
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
