"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { EASE_OUT, MQ } from "@/components/primitives/motion/motionTokens";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import CtaPill from "@/components/sections/quantum/CtaPill";
import ColumnRule from "@/components/sections/protocol-labs/ColumnRule";
import { HERO, PROOF } from "@/components/sections/protocol-labs/protocolContent";

// H8 · Terminal — prueba DENTRO, con movimiento continuo sobre el titular.
//
// ── La tesis, y por qué es la más arriesgada de las ocho ───────────────────
//
// El único hero oscuro. Y no es un cambio de color: es un cambio de ritmo para
// la página ENTERA. Hoy la página abre en crema, alterna claro y blanco, y usa
// el negro dos veces —el acto y el cierre— justamente porque es escaso. Con el
// hero en negro, el acto deja de ser una irrupción y pasa a ser "más de lo
// mismo", así que si esta variante gana hay que rehacer el ritmo detrás de ella.
//
// Se propone igual porque tiene un argumento propio: sobre negro, la rampa verde
// de la marca es lo que mejor funciona, y esta es una página de infraestructura.
// El resto del sitio ya sabe hablar en oscuro (el acto, el cierre, el footer).
//
// ── El movimiento ──────────────────────────────────────────────────────────
//
// El sheen de `[data-q-sheen]`, la misma rampa que viaja por el titular de
// `/quantum-security` y del hero actual de `/blockchain`. Continuo y lento, sin
// interacción: no reacciona a nada, solo indica que hay corriente. Es el gesto
// más barato de las ocho variantes —una regla de CSS que ya existe— y sobre
// fondo oscuro es donde realmente se ve.
//
// ── La barra de estado ─────────────────────────────────────────────────────
//
// Las seis cifras van al borde inferior, en mono, en una sola línea: una status
// line. Cambia lo que las cifras SIGNIFICAN: en el hero actual son evidencia
// editorial (serif, con nota); acá son lecturas de un sistema encendido. Mismo
// dato, otro registro.
export default function H8Terminal() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.from(q("[data-hero-item]"), { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.1 }, 0);
      tl.from(q("[data-status]"), { autoAlpha: 0, duration: 0.6, stagger: 0.04 }, 0.5);
      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      // `data-nav-dark` es lo que aclara la barra del nav mientras la cruza. Sin
      // él, un hero oscuro deja el logo y los links en negro sobre negro.
      data-nav-dark
      className="relative isolate flex min-h-svh flex-col justify-between bg-ink pt-[var(--site-header-block)] text-cream"
    >
      <ColumnRule tone="dark" />

      <Container className="relative z-10 flex flex-1 flex-col justify-center gap-8 py-20">
        <p data-hero-item className="uppercase text-eyebrow-mono text-cream/50">
          {HERO.eyebrow}
        </p>
        <h1 data-hero-item className="max-w-[16ch] text-display text-balance">
          <span data-q-sheen>{HERO.lead}</span> <Accent display>{HERO.accent}</Accent>
        </h1>
        <p data-hero-item className="max-w-[44ch] text-body-lg text-cream/70 text-pretty">
          {HERO.body}
        </p>
        <div data-hero-item>
          <CtaPill href={HERO.cta.href} tone="solid" external>
            {HERO.cta.label}
          </CtaPill>
        </div>
      </Container>

      {/* La status line. En móvil se envuelve en dos filas antes que encogerse:
          una línea de estado con seis lecturas ilegibles no es una línea de
          estado. */}
      <div className="relative z-10 border-t border-cream/15">
        <Container className="flex flex-wrap items-baseline gap-x-10 gap-y-3 py-5">
          {PROOF.map((stat) => (
            <p key={stat.id} data-status className="flex items-baseline gap-2">
              <span className="text-body-sm-mono text-cta-mint">{stat.value}</span>
              <span className="uppercase text-micro-mono text-cream/45">{stat.label}</span>
            </p>
          ))}
        </Container>
      </div>
    </section>
  );
}
