"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T2 · Aperture — una ventana sobre cifras más grandes que la ventana. ~30svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// Las seis cifras están compuestas a escala de cartel —`--text-poster`, que topa
// en 288px— y la banda mide 30svh. O sea que **no entran**: lo que se ve es una
// franja horizontal de números gigantes, cortados arriba y abajo por el encuadre.
//
// La lectura que produce es distinta a la de cualquier cifra completa: se leen
// igual (los dígitos son reconocibles por su tramo central) pero se leen como algo
// que excede su caja. En una página cuyo argumento es "esto es más grande de lo
// que parece", el encuadre dice la mitad del mensaje.
//
// ── El movimiento ──────────────────────────────────────────────────────────
//
// La fila se desplaza en X ligada al scroll —lento, un 8% del ancho— así que
// entrar y salir de la transición mueve las cifras lateralmente detrás de la
// ventana. Refuerza que la ventana está quieta y el contenido no.
//
// `ease: "none"` con scrub: la curva la pone el dedo del lector.
//
// ── Lo que se arriesga ─────────────────────────────────────────────────────
//
// Legibilidad. Cortar un número por arriba y por abajo funciona con dígitos de
// trazo simple y se complica con `<$0.002` y `600ms`, donde los sufijos en
// minúscula pierden más silueta que las cifras. Las etiquetas van completas
// debajo, dentro del encuadre, justamente para que la banda no dependa de que se
// lea el número recortado.
//
// Si al verlo los valores no se reconocen, la variante no se salva agrandando la
// ventana: agrandarla es dejar de ser esta variante.
export default function T2Aperture() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const row = q("[data-row]")[0];
      if (!row) return;
      const tween = gsap.fromTo(
        row,
        { xPercent: 0 },
        {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      // `overflow-hidden` ES el mecanismo: la ventana recorta a las cifras. Sin
      // él la variante no existe.
      className="relative flex min-h-[30svh] flex-col justify-center overflow-hidden border-y border-rule bg-background text-foreground"
    >
      {/* La fila desborda a propósito y no se centra por contenido: las cifras
          tienen que salirse del encuadre por los dos lados para que la ventana se
          lea como recorte y no como caja. */}
      <div
        data-row
        aria-hidden="true"
        className="pointer-events-none flex w-max items-center gap-16 whitespace-nowrap px-[6vw]"
      >
        {PROOF.map((stat) => (
          <span key={stat.id} className="text-poster text-ink/12">
            {stat.value}
          </span>
        ))}
      </div>

      {/* Las etiquetas, completas y dentro del encuadre. Son las que garantizan
          que la banda comunique aunque el número recortado no se termine de leer
          — y son también la lectura real: la cifra grande es la textura. */}
      <Container className="relative py-6">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
          {PROOF.map((stat) => (
            <div key={stat.id} className="flex items-baseline gap-2">
              <dd className="text-h4 tabular-nums">{stat.value}</dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
