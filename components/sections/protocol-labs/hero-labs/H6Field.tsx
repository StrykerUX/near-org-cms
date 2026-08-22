"use client";

import { useRef } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import CtaPill from "@/components/sections/quantum/CtaPill";
import {
  createShardField,
  type ShardFieldHandle,
} from "@/components/sections/protocol/shardField";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// H6 · Field — prueba DENTRO, con movimiento continuo de fondo.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// La única variante que mantiene la continuidad con lo que YA está publicado: el
// campo de shards que subdivide solo, el mismo de `/blockchain`. Si la página
// nueva tiene que leerse como una evolución de la actual y no como un reemplazo,
// esta es la que lo hace.
//
// Sobre el campo, las cifras no van en banda: van repartidas en dos tríos a los
// costados del titular, colgadas de una regla vertical. La composición queda en
// tres franjas —dato, frase, dato— y el campo pasando por detrás de las tres.
//
// ── Por qué importa `shardField` de la página viva en vez de copiarlo ──────
//
// Son 215 líneas de canvas ya escritas, medidas y con su `destroy`. Copiarlas
// para un laboratorio garantiza que las dos versiones diverjan; importarlas crea
// una dependencia del lab hacia una página real, que es la dirección ACEPTABLE
// de las dos (lo que el README prohíbe es que una página real dependa de un
// lab). Si esta variante gana, el campo se queda donde está y la página nueva lo
// importa igual.
//
// ── Lo que hay que juzgar ──────────────────────────────────────────────────
//
// Si el campo le pelea contraste a las cifras. En `/blockchain` el campo convive
// solo con un titular y un párrafo; acá tiene seis datos chicos encima, que es
// exactamente el tipo de texto que un fondo con textura se come. El velo de
// crema del medio está calibrado para el titular, no para ellos.
export default function H6Field() {
  const fieldRef = useRef<HTMLDivElement>(null);

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      // Se construye en cliente porque la grilla de celdas sale de medir el
      // host. Es decorativo y `aria-hidden`, así que no se pierde nada en el
      // render del servidor.
      let field: ShardFieldHandle | null = null;
      if (fieldRef.current) field = createShardField(fieldRef.current, { motionOk });

      let tl: gsap.core.Timeline | null = null;
      if (motionOk) {
        tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
        tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.1 }, 0);
        tl.from(q("[data-hero-stat]"), { autoAlpha: 0, duration: 0.7, stagger: 0.06 }, 0.45);
      }

      return () => {
        field?.destroy();
        tl?.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const left = PROOF.slice(0, 3);
  const right = PROOF.slice(3);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      <div ref={fieldRef} aria-hidden="true" className="absolute inset-0 z-0" />
      {/* El velo que despeja la banda central para el titular — el mismo recurso
          del hero de `/blockchain`. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,var(--cream)_0%,rgba(245,244,241,0.72)_28%,rgba(245,244,241,0.72)_66%,var(--cream)_100%)]"
      />

      <Container className="relative z-20 grid-ds flex-1 items-center gap-y-12 py-20">
        <dl className="col-span-full flex flex-col gap-6 lg:col-span-2">
          {left.map((stat) => (
            <div
              key={stat.id}
              data-hero-stat
              className="flex flex-col gap-0.5 border-l border-ink/25 pl-4"
            >
              <dd className="text-h4">{stat.value}</dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <div className="col-span-full flex flex-col items-center gap-8 text-center lg:col-start-4 lg:col-span-6">
          <p data-hero-item className="uppercase text-eyebrow-mono text-gray-intermediate">
            {HERO.eyebrow}
          </p>
          <h1 data-hero-item className="text-display text-balance">
            <span data-q-sheen>{HERO.lead}</span>
            <br />
            <Accent display>{HERO.accent}</Accent>
          </h1>
          <p data-hero-item className="max-w-[40ch] text-body-lg text-ink-soft text-pretty">
            {HERO.body}
          </p>
          <div data-hero-item>
            <CtaPill href={HERO.cta.href} tone="filled" external>
              {HERO.cta.label}
            </CtaPill>
          </div>
        </div>

        <dl className="col-span-full flex flex-col gap-6 lg:col-start-11 lg:col-span-2 lg:items-end">
          {right.map((stat) => (
            <div
              key={stat.id}
              data-hero-stat
              className="flex flex-col gap-0.5 border-l border-ink/25 pl-4 lg:border-l-0 lg:border-r lg:pl-0 lg:pr-4 lg:text-right"
            >
              <dd className="text-h4">{stat.value}</dd>
              <dt className="uppercase text-micro-mono text-gray-intermediate">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
