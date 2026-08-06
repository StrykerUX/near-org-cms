"use client";

import Container from "@/components/primitives/Container";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Parallax real (scrub, sin pin) — a diferencia de QuantumRevealHeading esto
// SÍ se mantiene en mobile: es transform-only, no crea pin-spacers ni cambia
// el layout, solo reduce la distancia recorrida.
export default function OutroWordmark() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope);
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion, isDesktop: MQ.desktop }, (mctx) => {
      const { motionOk, isDesktop } = mctx.conditions as {
        motionOk: boolean;
        isDesktop: boolean;
      };
      if (!motionOk) return;

      gsap.to(q("[data-parallax='wordmark']"), {
        yPercent: isDesktop ? -18 : -8,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-background pt-24">
      <Container className="flex flex-col items-center gap-4 text-center">
        <p className="text-h3 text-pretty">Where money actually moves.</p>
      </Container>

      <div className="relative mt-12 overflow-hidden" aria-hidden="true">
        {/* `text-wordmark` es un token del DS, no un tamaño suelto: antes esto
            era un `style={{ fontSize: clamp(...) }}` inline con su weight e
            interlineado a mano, o sea el único texto del homepage que ningún
            cambio del sistema tipográfico podía alcanzar. */}
        <p
          data-parallax="wordmark"
          className="translate-y-1/3 select-none text-center text-wordmark text-foreground"
        >
          near
        </p>
      </div>
    </section>
  );
}
