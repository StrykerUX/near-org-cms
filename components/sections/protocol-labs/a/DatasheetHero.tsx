"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import CtaPill from "@/components/sections/quantum/CtaPill";
import ColumnRule from "@/components/sections/protocol-labs/a/ColumnRule";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// Alternativa A · sección 1 + 2 — el hero y la franja de prueba, FUNDIDOS.
//
// ── La decisión estructural de esta alternativa, en una pantalla ────────────
//
// El doc trae hero y proof strip como dos secciones. Las tres alternativas
// tratan ese par distinto, y acá son una sola cosa: el titular afirma y las seis
// cifras lo prueban en el mismo golpe de vista. Una franja de prueba que llega
// después ya es tarde — el lector que necesitaba el dato para creerte la frase
// ya pasó por encima de ella.
//
// De ahí sale el resto: si las cifras conviven con el titular, el titular no
// puede estar centrado ni ocupar el ancho. La composición es asimétrica —texto a
// la izquierda, tabla a la derecha— que es exactamente la opuesta a la del hero
// de `/blockchain` y la de `/quantum-security`, los dos centrados.
//
// ── Por qué el titular es `text-h1` y no `display` ─────────────────────────
//
// Con la tabla al lado, el titular ya no tiene el ancho de la página: tiene
// ocho columnas de doce. A escala display, "The settlement layer" se pasa de esa
// caja y hay que romperla en tres renglones cortos que se leen como escalones.
// Y el punto de A no es el volumen del titular sino la CONVIVENCIA de la
// afirmación con su evidencia; un titular que grita eso lo rompe. La alternativa
// C sí lleva el titular a tamaño de cartel, porque ahí es el layout entero.
export default function DatasheetHero() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.09 }, 0);
      // Las cifras entran DESPUÉS y desde su propia regla: primero se traza la
      // línea, después baja el dato. Es el mismo gesto que `ProofDatum` en la
      // homepage —la estructura primero, el contenido llegando a algo que ya
      // está— y lo que hace que la tabla se lea como un instrumento y no como
      // seis textos sueltos.
      tl.from(q("[data-hero-rule]"), { scaleX: 0, duration: 0.6, stagger: 0.05 }, 0.35);
      tl.from(q("[data-hero-stat]"), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.05 }, 0.5);
      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      // Despeja el nav en vez de pasarle por debajo: los heroes que se meten
      // bajo la barra buscan una imagen a sangre, y acá arriba no hay imagen —
      // hay una retícula que tiene que empezar en algún lado visible.
      className="relative isolate flex min-h-svh flex-col bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      <ColumnRule />

      <Container className="relative z-10 flex flex-1 flex-col justify-between gap-20 pb-16 pt-14">
        <div className="grid-ds gap-y-8">
          <p
            data-hero-item
            className="col-span-full uppercase text-eyebrow-mono text-gray-intermediate"
          >
            {HERO.eyebrow}
          </p>

          <h1 data-hero-item className="col-span-full text-h1 text-balance lg:col-span-8">
            {HERO.lead}
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
        </div>

        <div className="grid-ds items-end gap-y-12">
          <div data-hero-item className="col-span-full flex flex-col gap-7 lg:col-span-4">
            <p className="max-w-[34ch] text-body-lg text-ink-soft text-pretty">{HERO.body}</p>
            <CtaPill href={HERO.cta.href} tone="filled" external>
              {HERO.cta.label}
            </CtaPill>
          </div>

          {/* La tabla. Dos columnas en móvil y seis en desktop: las seis en
              fila son la lectura buscada —una regla continua bajo toda la
              evidencia— y a 375px esa fila daría cifras de cuatro caracteres
              partidas en dos renglones. */}
          <dl className="col-span-full grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-start-7 lg:col-span-6 lg:grid-cols-6">
            {PROOF.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-2">
                <span
                  data-hero-rule
                  aria-hidden="true"
                  className="block h-px origin-left bg-ink"
                />
                <div data-hero-stat className="flex flex-col gap-1 pt-1">
                  <dd className="text-h3-serif italic">{stat.value}</dd>
                  <dt className="uppercase text-micro-mono text-gray-intermediate">
                    {stat.label}
                  </dt>
                  {stat.note && (
                    <dd className="text-micro-mono text-gray-intermediate">{stat.note}</dd>
                  )}
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
