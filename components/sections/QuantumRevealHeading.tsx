"use client";

import ZigguratDivider from "@/components/primitives/ZigguratDivider";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ, DEBUG_MARKERS } from "@/components/primitives/motion/motionTokens";

// La sección de mayor riesgo del plan: un heading (coloreado) que se
// desvanece mientras el siguiente (hoy tenue, debajo) gana protagonismo,
// ligado al scroll. Solo pinea en desktop (≥1024px) — pinear en mobile es
// mala práctica conocida (address-bar dinámica de iOS/Android + jank de
// momentum-scroll); ahí degrada a un crossfade `once:true` sin pin. En
// reduced-motion no pinea ni anima: muestra el heading final, directo.
export default function QuantumRevealHeading() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope);
    const mm = gsap.matchMedia();

    mm.add(
      {
        pinned: `${MQ.motion} and ${MQ.desktop}`,
        soft: `${MQ.motion} and ${MQ.mobile}`,
        reduce: MQ.reduce,
      },
      (mctx) => {
        const { pinned, soft } = mctx.conditions as { pinned: boolean; soft: boolean };
        const from = q("[data-quantum='from']");
        const to = q("[data-quantum='to']");

        if (!pinned && !soft) {
          // reduce: estado final estático, sin pin — nunca dejar la sección
          // pineada sin animación (sería scroll muerto).
          gsap.set(from, { autoAlpha: 0 });
          gsap.set(to, { autoAlpha: 1 });
          return;
        }

        if (soft) {
          gsap
            .timeline({
              scrollTrigger: { trigger: scope, start: "top 65%", once: true, markers: DEBUG_MARKERS },
            })
            .to(from, { autoAlpha: 0, duration: 0.55, ease: "power2.in" })
            .to(to, { autoAlpha: 1, duration: 0.85, ease: "power3.out" }, "-=0.3");
          return;
        }

        const stage = q("[data-quantum='stage']")[0];
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: () => "+=" + window.innerHeight * 1.2,
              pin: stage,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: true,
              invalidateOnRefresh: true,
              markers: DEBUG_MARKERS,
            },
          })
          .to(from, { autoAlpha: 0, yPercent: -6, ease: "none" }, 0)
          .to(to, { autoAlpha: 1, yPercent: 0, ease: "none" }, 0.1);
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-stone text-foreground">
      {/* Sin divisor de entrada acá: HeroBanner ya pone el suyo (cream->stone)
          al final — un solo divisor por límite de sección, no uno de cada lado. */}

      {/* svh, no vh: el stage pineado no debe cambiar de alto cuando iOS
          colapsa la address bar durante el scroll. */}
      <div
        data-quantum="stage"
        className="relative flex h-[100svh] items-center justify-center overflow-hidden px-6"
      >
        <h2
          data-quantum="from"
          className="absolute max-w-4xl text-center text-h1 font-medium text-pretty"
        >
          The First{" "}
          <span className="text-gradient-quantum">Quantum-Secure</span> Network.
        </h2>
        <h2
          data-quantum="to"
          className="absolute max-w-4xl text-center text-h1 font-medium text-pretty opacity-0 text-muted-foreground"
        >
          Confidential by Design.
        </h2>
      </div>

      <ZigguratDivider from="var(--stone)" to="var(--background)" />
    </section>
  );
}
