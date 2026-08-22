"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import CtaPill from "@/components/sections/quantum/CtaPill";
import MachineArt from "@/components/sections/protocol-labs/b/machineArt";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa B · sección 1.
//
// El hero presenta el OBJETO, no un campo generativo: la pieza entra girando
// apenas y quieta, en su estado de reposo —la plancha de diez shards, sin
// ninguna capacidad encendida— y el resto de la página la va a ir transformando.
// Que lo primero que se ve sea exactamente lo mismo que se va a ver durante el
// acto es la premisa de esta dirección; un campo abstracto en el hero seguido de
// un objeto concreto abajo son dos promesas distintas.
//
// `beat={-1}` no es un truco: es un índice que no existe, y por lo tanto ninguna
// capa se enciende. Ver la nota en `machineArt`.
//
// La composición es en diagonal —objeto arriba a la derecha, titular abajo a la
// izquierda— y no centrada. Los heroes centrados de `/blockchain` y
// `/quantum-security` ponen el texto en el eje y el fondo detrás; acá los dos
// elementos son figuras y comparten la pantalla sin superponerse.
export default function MachineHero() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      // El objeto primero y desde abajo: se está APOYANDO, que es lo que hace
      // una plancha. Después el texto, que llega a algo que ya está ahí.
      tl.from(q("[data-hero-art]"), { autoAlpha: 0, y: 40, duration: 1.2 }, 0);
      tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.1 }, 0.35);
      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      {/* El objeto vive en su propia caja, sin ser fondo: se le da la mitad
          derecha y el titular no le pasa por encima. Un objeto detrás del texto
          se lee como textura, y este tiene que leerse como una pieza. */}
      <div
        data-hero-art
        aria-hidden="true"
        // En móvil la caja respeta los márgenes de la página; en desktop se va
        // contra el borde derecho, que es lo que hace que el objeto se lea
        // saliendo del encuadre en vez de posado en el centro de una tarjeta.
        className="pointer-events-none absolute inset-x-5 top-[10%] h-[46svh] opacity-90 lg:inset-x-auto lg:right-0 lg:h-[62svh] lg:w-[54%]"
      >
        {/* La pieza está dibujada para fondo oscuro (hairline claro). Sobre
            crema se invierte con una capa de tinta detrás en vez de con un
            segundo juego de colores: mantener un solo dibujo es lo que evita
            que las dos versiones se separen. */}
        <div className="absolute inset-0 rounded-[40px] bg-ink" />
        <div className="relative h-full w-full">
          <MachineArt beat={-1} />
        </div>
      </div>

      {/* El texto se limita a poco menos de la mitad del ancho en desktop: el
          objeto ocupa el 54% derecho y un titular a escala display se le mete
          por debajo si se lo deja crecer con el Container. El `pt` de móvil es
          el hueco que le deja al objeto, que ahí va arriba y no al costado. */}
      <Container className="relative z-10 flex flex-col gap-7 pb-20 pt-[52svh] lg:max-w-[1780px] lg:pb-24 lg:pt-24">
        <div className="flex flex-col gap-7 lg:max-w-[46%]">
          <p data-hero-item className="uppercase text-eyebrow-mono text-gray-intermediate">
            {HERO.eyebrow}
          </p>

          <h1 data-hero-item className="text-display text-balance">
            {HERO.lead} <Accent display>{HERO.accent}</Accent>
          </h1>

          <p data-hero-item className="max-w-[44ch] text-body-lg text-ink-soft text-pretty">
            {HERO.body}
          </p>

          <div data-hero-item>
            <CtaPill href={HERO.cta.href} tone="filled" external>
              {HERO.cta.label}
            </CtaPill>
          </div>
        </div>
      </Container>
    </section>
  );
}
