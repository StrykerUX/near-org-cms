"use client";

import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { useCountUp } from "@/components/sections/protocol-labs/countUp";
import { MURAL_WORD } from "@/components/sections/protocol-labs/transition-labs/transitionContent";
import { PROOF } from "@/components/sections/protocol-labs/protocolContent";

// T11 · Mural — una palabra, del ancho de la página. ~85svh
//
// ── La idea ─────────────────────────────────────────────────────────────────
//
// El hero dice "Proven on mainnet for five years" y esa palabra —**proven**— es
// la que las seis cifras sostienen. Esta transición la aísla y la lleva al ancho
// completo, con las cifras alineadas debajo como su aparato.
//
// No se inventó copy: se extrajo. La palabra ya estaba en el hero; acá se le da
// una pantalla.
//
// El efecto que busca es de pausa. Entre una afirmación y su explicación hay un
// silencio, y a escala mural una sola palabra lo produce mejor que cualquier
// gráfica: el ojo no tiene nada que resolver, sólo que reconocer.
//
// ── Por qué es la más silenciosa de las cuatro grandes ───────────────────
//
// T9 recorre, T10 cambia la temperatura, T12 construye un objeto. Esta no hace
// nada: pone una palabra y seis números. Existe para preguntar si a esta altura
// de la página **hace falta** que la transición haga algo, o si lo que hace falta
// es exactamente lo contrario.
//
// ── Tipografía ─────────────────────────────────────────────────────────────
//
// `--text-mural` mide su cuerpo en `cqw` —contra el ancho del BLOQUE y no del
// viewport— para que la proporción palabra/página sea la misma a 1440 que a 2560.
// Por eso el Container declara `@container`: sin él, `cqw` resuelve contra el
// viewport y en un monitor ancho la palabra se parte en dos renglones.
//
// La entrada es una máscara por línea y no un fade: a esta escala, un texto que
// aparece por opacidad se ve flotar sobre la página, y uno que asoma desde su
// propio renglón se ve impreso.
export default function T11Mural() {
  const countRef = useCountUp<HTMLDListElement>({ start: "top 70%", stagger: 0.07 });

  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({
        defaults: { ease: EASE_OUT },
        scrollTrigger: { trigger: scope, start: "top 78%", once: true },
      });
      tl.from(q("[data-word]"), { yPercent: 108, duration: 1.15 }, 0);
      tl.from(q("[data-rule]"), { scaleX: 0, duration: 0.8 }, 0.35);
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
      className="flex min-h-[85svh] flex-col justify-center border-y border-rule bg-cream text-foreground"
    >
      <Container className="@container flex flex-col gap-12 py-20">
        {/* La caja con `overflow-hidden` es la máscara: la palabra asoma desde su
            propio renglón. Sin ella el `yPercent` la mostraría entrando desde el
            aire, por encima de lo que tenga arriba. */}
        <h2 className="overflow-hidden">
          <span data-word className="block text-mural uppercase">
            {MURAL_WORD}
          </span>
        </h2>

        <span data-rule aria-hidden="true" className="block h-px origin-left bg-ink" />

        <dl
          ref={countRef}
          className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"
        >
          {PROOF.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-1">
              <dd data-count={stat.value} className="text-h3-serif italic tabular-nums">
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
