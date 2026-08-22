"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import CtaPill from "@/components/sections/quantum/CtaPill";
import { HERO } from "@/components/sections/protocol-labs/protocolContent";

// H3 · Threshold — prueba FUERA, con movimiento ligado al scroll.
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// El hero no argumenta: declara. Una pantalla con la frase, una línea y una
// salida — nada más. La evidencia llega en el primer movimiento del lector, como
// una barra que se pega bajo el nav y lo acompaña un tramo (ver `ProofBand` en
// modo `sticky`).
//
// Es el reparto opuesto al del hero actual: allá afirmación y prueba comparten
// pantalla; acá se separan en el tiempo. Lo que se gana es una primera pantalla
// que respira y una evidencia que está disponible MIENTRAS se lee y no solo al
// principio. Lo que se arriesga es que quien no scrollea nunca ve una cifra.
//
// ── El movimiento ──────────────────────────────────────────────────────────
//
// El hero se despide con el scroll: la copy sube un poco más lento que la página
// y el conjunto se desvanece antes de salir. Sirve para algo — deja al lector
// mirando el hueco donde va a entrar la barra de cifras, así que la barra no
// aparece "encima" sino que ocupa lo que el hero acaba de dejar.
//
// `ease: "none"` con scrub: la curva la pone el dedo del lector, no nosotros.
export default function H3Threshold() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 26, duration: 1, stagger: 0.12 });

      const wrap = q("[data-hero-wrap]")[0];
      const fade = wrap
        ? gsap.fromTo(
            wrap,
            { y: 0, autoAlpha: 1 },
            {
              y: () => 0.12 * scope.getBoundingClientRect().height,
              autoAlpha: 0,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: scope,
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          )
        : null;

      return () => {
        fade?.scrollTrigger?.kill();
        fade?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col bg-cream pt-[var(--site-header-block)] text-foreground"
    >
      <Container
        data-hero-wrap
        className="flex flex-1 flex-col items-center justify-center gap-9 py-20 text-center"
      >
        <p data-hero-item className="uppercase text-eyebrow-mono text-gray-intermediate">
          {HERO.eyebrow}
        </p>
        <h1 data-hero-item className="max-w-[18ch] text-display text-balance">
          {HERO.lead} <Accent display>{HERO.accent}</Accent>
        </h1>
        <p data-hero-item className="max-w-[42ch] text-body-lg text-ink-soft text-pretty">
          {HERO.body}
        </p>
        <div data-hero-item>
          <CtaPill href={HERO.cta.href} tone="filled" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>
    </section>
  );
}
