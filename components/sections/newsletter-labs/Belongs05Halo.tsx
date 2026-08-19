"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ShineField from "@/components/primitives/ShineField";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { BELONGS_COPY, Wordmark } from "@/components/sections/newsletter-labs/BelongsParts";

// ── 05 · Halo ────────────────────────────────────────────────────────────────
//
// La composición de HOY —centrada, wordmark arriba, párrafo, campo— con dos
// cambios: otra escala, y un fondo que deja de ser plano. Una luz verde muy
// tenue respira detrás del bloque.
//
// Es la comparación más directa contra la sección actual: si esta no se siente
// mejor, el problema de la banda no era el fondo.
//
// ── La luz respira, y eso tiene un coste que hay que mirar ──────────────────
//
// Es lo único que se mueve en toda la sección, en loop y para siempre. En una
// homepage larga, un elemento que nunca para compite con todo lo que viene
// después — por eso el ciclo es de 9 segundos y la amplitud, mínima (la opacidad
// va de 0.55 a 1 sobre un radial que ya es tenue). Si se ve pulsar, está mal
// calibrado.
//
// `pauseOffscreen` corta el tween cuando la sección no está en pantalla: un loop
// infinito repintando fuera de cuadro es exactamente lo que el toolkit de motion
// del repo existe para evitar.
export default function Belongs05Halo() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    if (!motionOk) return;
    const halo = q("[data-halo]")[0];
    if (!halo) return;

    pauseOffscreen(
      gsap.to(halo, {
        opacity: 1,
        scale: 1.06,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      }),
      scope
    );

    return () => {
      gsap.killTweensOf(halo);
      gsap.set(halo, { clearProps: "opacity,transform" });
    };
  });

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-stone py-24 text-ink lg:py-32">
      {/* El radial se apaga MUY antes del borde de su caja: si terminara dentro,
          se vería el rectángulo. Y la caja desborda la sección por los cuatro
          lados por lo mismo. */}
      <div
        data-halo
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[20svh] opacity-55 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,107,0.20)_0%,rgba(0,168,107,0.07)_24%,rgba(0,168,107,0.02)_38%,rgba(216,214,208,0)_52%)]"
      />

      <Container className="relative flex flex-col items-center gap-8 text-center">
        <h2 className="flex flex-col items-center text-h1 text-pretty">
          <Wordmark height="clamp(2.2rem, 1.6rem + 3vw, 4.2rem)" className="mb-1.5" />
          <Accent>{BELONGS_COPY.claim}</Accent>
        </h2>

        <p className="max-w-[46ch] text-body-lg text-ink/70 text-pretty">{BELONGS_COPY.body}</p>

        <div className="w-full max-w-[32rem]">
          <ShineField
            placeholder={BELONGS_COPY.placeholder}
            label={BELONGS_COPY.label}
            buttonLabel={BELONGS_COPY.button}
          />
        </div>
      </Container>
    </section>
  );
}
