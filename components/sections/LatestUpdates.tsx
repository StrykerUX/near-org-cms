"use client";

import { ArrowRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { createBandField, type BandField } from "@/components/primitives/motion/bandField";

// Sin datos reales (fuera de alcance de este draft): copy fijo. Si esta sección
// se conecta al CMS más adelante, migra a PostCard/PostGrid
// (components/sections/types.ts) en vez de duplicar esta lista.
//
// `colors` son los 4 stops del material WebGL, en RGB 0..1. `fallback` es el
// gradiente CSS que se ve si no hay WebGL2 utilizable — el cover ES el contenido
// visual de la card, no un adorno, así que no puede quedar en blanco.
const POSTS = [
  {
    title: "Sharding the world computer",
    byline: "with Alexander Skidanov",
    cta: "Read the full story",
    // cyan · verde neón · amarillo · gris cálido
    colors: [
      [0.498, 0.878, 0.816],
      [0.302, 0.91, 0.561],
      [0.91, 0.91, 0.533],
      [0.659, 0.659, 0.627],
    ],
    fallback:
      "linear-gradient(118deg, #7fe0d0 0%, #4de88f 30%, #e8e888 60%, #a8a8a0 100%)",
  },
  {
    title: "Lorem Ipsum Dolar Enet",
    byline: "with Alexander Skidanov",
    cta: "View the interview",
    // la card del medio va en azules
    colors: [
      [0.498, 0.816, 0.961],
      [0.373, 0.722, 0.961],
      [0.647, 0.863, 0.976],
      [0.804, 0.816, 0.855],
    ],
    fallback:
      "linear-gradient(118deg, #7fd0f5 0%, #5fb8f5 30%, #a5dcf9 60%, #cdd0da 100%)",
  },
  {
    title: "Sharding the world computer",
    byline: "with Alexander Skidanov",
    cta: "Read the full story",
    colors: [
      [0.525, 0.898, 0.71],
      [0.278, 0.902, 0.541],
      [0.859, 0.906, 0.518],
      [0.616, 0.647, 0.616],
    ],
    fallback:
      "linear-gradient(118deg, #86e5b5 0%, #47e68a 30%, #dbe784 60%, #9da59d 100%)",
  },
] as const;

// Desfase en reposo: las bandas casi alineadas. El hover lo abre a 1.
const REST_SPREAD = 0.18;

export default function LatestUpdates() {
  // Dos scopes anidados, cada uno con su ref: el reveal de las cards vive en el
  // grid y el material WebGL en la sección. Un solo elemento no puede llevar
  // dos refs, y separarlos evita reimplementar el reveal a mano.
  const gridRef = useScrollReveal<HTMLDivElement>();

  const sectionRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };

      const cards = q("[data-card]");
      const canvases = q("[data-cover]") as HTMLCanvasElement[];
      const teardown: Array<() => void> = [];

      // Un contexto por card: mantiene el hover independiente sin mapear
      // coordenadas. Son 3, más los 2 que ya tiene la página, muy por debajo
      // del límite de ~16 de Chrome.
      const fields = canvases.map((canvas, i) => {
        const post = POSTS[i];
        if (!post) return null;
        return createBandField(canvas, { colors: post.colors, bands: 10 });
      });

      for (const f of fields) if (f) teardown.push(() => f.destroy());

      const live = fields.filter((f): f is BandField => f !== null);
      if (live.length === 0) return;

      // Estado de reposo, también el estado final con reduced-motion.
      for (const f of live) {
        f.setSpread(REST_SPREAD);
        f.render();
      }

      if (!motionOk) {
        return () => {
          for (const fn of teardown) fn();
        };
      }

      // UN solo loop para las 3 cards: gsap.ticker es el mismo rAF que ya mueve
      // Lenis y ScrollTrigger en esta página. Tres instancias con deriva propia
      // habrían sido tres rAF compitiendo.
      const tick = (time: number) => {
        for (const f of live) {
          f.setTime(time);
          f.render();
        }
      };
      gsap.ticker.add(tick);
      teardown.push(() => gsap.ticker.remove(tick));

      // Gate de viewport: fuera de pantalla los draws se descartan.
      onViewportToggle(scope, (v) => {
        for (const f of live) f.setVisible(v);
      });

      // Hover por card. NADA se mueve ni escala: lo único que cambia es cuánto
      // se desfasan las bandas entre sí.
      cards.forEach((card, i) => {
        const field = fields[i];
        if (!field) return;

        const state = { v: REST_SPREAD };
        const to = (target: number) =>
          gsap.to(state, {
            v: target,
            duration: 0.55,
            ease: "power2.out",
            overwrite: true,
            onUpdate: () => field.setSpread(state.v),
          });

        const onEnter = () => to(1);
        const onLeave = () => to(REST_SPREAD);
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        teardown.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      return () => {
        for (const fn of teardown) fn();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream text-foreground">
      <Container className="flex flex-col gap-20 py-28 md:gap-24 md:py-36">
        <h2 className="text-center text-h1 text-pretty">The latest from NEAR</h2>

        <div className="flex flex-col gap-7">
          <div className="flex items-center justify-between gap-4">
            <span className="text-body-sm">Latest News</span>
            {/* near-green-dark y no near-green: el verde puro (#00ec97) con
                texto blanco queda en ~1.5:1 de contraste. Este es además el
                tono del botón de la referencia. */}
            <a
              href="#"
              className="rounded-full bg-near-green-dark px-6 py-2.5 text-eyebrow uppercase text-white transition-opacity hover:opacity-90"
            >
              All posts
            </a>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {POSTS.map((post, i) => (
              <article
                key={i}
                data-card
                data-reveal
                className="group relative aspect-[7/6] overflow-hidden rounded-[1.75rem] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              >
                {/* El cover llena la card entera; lo que lo convierte en una
                    "L" es el bloque blanco de texto que se le monta encima en
                    la esquina superior izquierda.

                    Sin `group-hover:scale`: la card no se mueve al hover, solo
                    reacciona el material. El gradiente CSS va en el contenedor
                    y el canvas encima — si no hay WebGL2 el canvas queda sin
                    contexto (transparente) y se ve el fallback. */}
                <div
                  className="absolute inset-2.5 overflow-hidden rounded-[1.4rem]"
                  style={{ backgroundImage: post.fallback }}
                >
                  <canvas data-cover aria-hidden="true" className="h-full w-full" />
                </div>

                {/* Los radios están al revés de lo que parece: `tl` sigue la
                    curva de la card, y `br` es la esquina que muerde el cover
                    — sin ese radio el recorte se ve como un rectángulo pegado
                    encima de la imagen. */}
                <div className="absolute left-2.5 top-2.5 flex w-[60%] flex-col gap-1 rounded-tl-[1.4rem] rounded-br-[1.4rem] bg-white p-4 pb-5 pr-7">
                  <h3 className="text-h4 text-pretty">{post.title}</h3>
                  <p className="text-body-sm text-muted-foreground">{post.byline}</p>

                  {/* El CTA es solo visual: el link real es el que cubre la
                      card entera, más abajo. Anidar un <a> acá dentro de ese
                      otro sería HTML inválido (links anidados). */}
                  <span className="mt-10 flex items-center gap-2.5 text-body-sm">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-near-green-dark text-white transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="size-3.5" strokeWidth={2} />
                    </span>
                    {post.cta}
                  </span>
                </div>

                {/* Toda la card es el link. Va como UN solo <a> que la cubre y
                    no como un <a> por elemento: así un lector de pantalla
                    anuncia un destino por card en vez de varios, y el foco de
                    teclado es una sola parada.

                    El `::after` de un "stretched link" no servía acá: se
                    posiciona contra el ancestro posicionado más cercano, que es
                    el bloque de texto (absolute), no la card.

                    El texto va en sr-only y no en aria-label: sobrevive a los
                    traductores automáticos, que ignoran los aria-label. */}
                <a
                  href="#"
                  className="absolute inset-0 z-10 rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-dark"
                >
                  <span className="sr-only">
                    {post.title} — {post.cta}
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
