"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import CtaPill from "@/components/primitives/CtaPill";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { allowDescenders } from "@/components/primitives/motion/maskedLines";
import { EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { HERO, PROOF_STATS } from "@/components/sections/solutions/solutionsContent";

// §1 — la primera pantalla, con las cifras adentro.
//
// ── La franja de cifras no es una sección ─────────────────────────────────
//
// En A y en B la franja de prueba vive aparte, debajo del hero. Acá va DENTRO,
// al pie de la misma pantalla, y es una decisión de densidad: la propuesta B
// sostiene que un hub es una interfaz, y una interfaz no gasta una pantalla
// entera en un titular. La primera vista entrega la afirmación, el argumento,
// la acción y la evidencia — todo junto, sin pedir scroll.
//
// Lo que se pierde: las cifras a media escala ya no tienen el peso de una franja
// propia. Lo que se gana: el conmutador —que es el gesto de esta propuesta—
// empieza al primer scroll en vez de al segundo.
//
// ── Sin `scrollTrigger` ───────────────────────────────────────────────────
//
// El hero ya está en pantalla al cargar, así que no hay nada que disparar. Un
// trigger que nace con su punto de partida ya pasado no cruza nada y queda
// esperando al `refresh()` del provider — medido en esta familia: el titular se
// quedaba invisible varios segundos después del primer paint. Con la timeline
// suelta, entra en el frame en que se crea.

export default function SwitchHero() {
  const rootRef = useMotionScope<HTMLElement>(({ q, motionOk }) => {
    if (!motionOk) return;

    const split = SplitText.create(q("[data-hero-line]"), {
      type: "lines",
      mask: "lines",
      autoSplit: true,
    });
    allowDescenders(split.lines);

    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

    tl.from(split.lines, { yPercent: 108, autoAlpha: 0, duration: 0.75, stagger: 0.1 }, 0)
      .from(q("[data-hero-item]"), { autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.08 }, 0.3)
      // Las cifras entran al final y por su cuenta: son el pie de la pantalla,
      // no parte del bloque del titular.
      .from(q("[data-hero-stat]"), { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.06 }, 0.6);

    return () => {
      tl.kill();
      split.revert();
    };
  });

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col justify-between bg-cream pb-14 pt-[calc(var(--site-header-block)+9svh)]"
    >
      <Container>
        <div className="grid-ds items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <p data-hero-item className="text-caption-mono uppercase text-gray-intermediate">
              Solutions
            </p>
            <h1 data-hero-line className="mt-8 max-w-[12ch] text-display text-ink text-balance">
              Use cases <Accent display>powered by NEAR</Accent>
            </h1>
          </div>

          {/* El subhead y el CTA a la derecha y al pie del titular, no debajo.
              A escala `display` un párrafo de tres oraciones colgado abajo
              empuja las cifras fuera de la pantalla; al costado, la primera
              vista sigue entrando entera. */}
          <div className="col-span-12 flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
            <p data-hero-item className="max-w-[44ch] text-body text-ink-soft text-pretty">
              {HERO.subhead}
            </p>
            <div data-hero-item>
              <CtaPill href={HERO.cta.href} tone="filled">
                {HERO.cta.label}
              </CtaPill>
            </div>
          </div>
        </div>
      </Container>

      {/* ── las cifras, al pie de la primera pantalla ───────────────────────
          Cinco columnas y no las doce del `grid-ds`: cinco no divide a doce, así
          que repartirlas ahí deja una celda coja.

          Ninguna cuenta hacia arriba, por el mismo motivo que en el resto de la
          familia: `Sub-cent` no puede contar —tallar hasta un umbral de
          MENOS-QUE no significa nada—, así que un contador cubriría cuatro de
          cinco y tendría que dejar la quinta quieta. */}
      <Container>
        <div className="grid grid-cols-2 gap-x-[var(--grid-gutter)] gap-y-8 border-t border-rule pt-8 sm:grid-cols-3 lg:grid-cols-5">
          {PROOF_STATS.map((s) => (
            <div key={s.id} data-hero-stat>
              <p className="text-h3 text-ink">{s.value}</p>
              <p className="mt-2 max-w-[22ch] uppercase text-micro-mono text-gray-intermediate">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
