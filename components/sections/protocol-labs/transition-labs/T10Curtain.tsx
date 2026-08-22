"use client";

import { useRef } from "react";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import {
  createShardField,
  type ShardFieldHandle,
} from "@/components/sections/protocol/shardField";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T10 · Curtain — el telón entre dos actos. ~92svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// Una pantalla negra, casi entera, con el campo de shards ocupándola y las seis
// cifras suspendidas dentro. El hero termina en crema, la transición cae a negro,
// y el negro se abre hacia el blanco del contenido por su borde inferior.
//
// Es una transición de teatro: baja el telón, cambia la escena, sube. Y hace algo
// que ninguna de las otras once hace — **le cambia la temperatura a la página**.
// Después de una pantalla oscura, el blanco del contenido se lee como una luz que
// se enciende, no como el fondo que siempre estuvo.
//
// ── El costo, que no se ve en esta pantalla ───────────────────────────────
//
// El acto central y el cierre ya son oscuros, y son escasos a propósito: es lo
// que los hace irrupciones. Un tercer negro —y encima el primero que aparece—
// les baja el rango a los dos. Si esta variante gana, hay que rehacer el ritmo de
// la página entera detrás de ella, no sólo montarla.
//
// Es la decisión más cara de las doce y la que más hay que discutir antes que
// mirar.
//
// ── La apertura hacia abajo va ligada al scroll ───────────────────────────
//
// El gradiente que abre el negro hacia el blanco crece con el recorrido, así que
// el telón se levanta al ritmo del lector y no con un temporizador. `ease: "none"`
// con scrub: la curva la pone el dedo.
export default function T10Curtain() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const countRef = useCountUp<HTMLDListElement>({ start: "top 65%", stagger: 0.08 });

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      let field: ShardFieldHandle | null = null;
      if (fieldRef.current) field = createShardField(fieldRef.current, { motionOk });

      let lift: gsap.core.Tween | null = null;
      let intro: gsap.core.Timeline | null = null;

      if (motionOk) {
        const veil = q("[data-lift]")[0];
        if (veil) {
          lift = gsap.fromTo(
            veil,
            { yPercent: 100 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: scope,
                start: "center center",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
        intro = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: { trigger: scope, start: "top 70%", once: true },
        });
        intro.from(q("[data-eyebrow]"), { autoAlpha: 0, y: 18, duration: 0.8 });
      }

      return () => {
        field?.destroy();
        lift?.scrollTrigger?.kill();
        lift?.kill();
        intro?.scrollTrigger?.kill();
        intro?.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-nav-dark
      className="relative isolate flex min-h-[92svh] flex-col justify-center overflow-hidden bg-ink text-cream"
    >
      <div ref={fieldRef} aria-hidden="true" className="absolute inset-0 z-0 opacity-80" />

      {/* El velo que despeja el centro para el texto, invertido para fondo
          oscuro: mismo recurso que el cierre de la página publicada. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 52% at 50% 50%, rgba(16,16,16,0.9) 0%, rgba(16,16,16,0.5) 55%, transparent 85%)",
        }}
      />

      <Container className="relative z-20 flex flex-col gap-10 py-20">
        <p data-eyebrow className="uppercase text-eyebrow-mono text-cream/45">
          Mainnet, five years in
        </p>

        <dl
          ref={countRef}
          className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:grid-cols-6"
        >
          {PROOF.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-2 border-t border-cream/25 pt-4">
              <dd data-count={stat.value} className="text-h2 tabular-nums text-cream">
                {stat.value}
              </dd>
              <dt className="uppercase text-micro-mono text-cream/50">{stat.label}</dt>
              {stat.note && <dd className="text-micro-mono text-cream/35">{stat.note}</dd>}
            </div>
          ))}
        </dl>
      </Container>

      {/* El telón que sube: un bloque del color de la sección siguiente que entra
          desde abajo con el scroll. Va por encima de todo (z-30) porque tapa,
          incluido el campo. */}
      <div
        data-lift
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[42%] translate-y-full bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_58%)]"
      />
    </section>
  );
}
