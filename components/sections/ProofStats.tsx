"use client";

import { ArrowUp } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

const GHOST_WORDS = ["1+ Million", "$20+", "100%", "Quantum", "Confidential"];

export default function ProofStats() {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope);
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };
      const counter = q("[data-counter]")[0] as HTMLElement | undefined;

      if (!motionOk) {
        if (counter) counter.textContent = "100";
        return;
      }

      // Contador 0 -> 100 al entrar en viewport, una sola vez.
      if (counter) {
        const state = { v: 0 };
        gsap.to(state, {
          v: 100,
          duration: 1.6,
          ease: "power2.out",
          snap: { v: 1 },
          onUpdate: () => {
            counter.textContent = String(Math.round(state.v));
          },
          scrollTrigger: { trigger: scope, start: "top 70%", once: true },
        });
      }

      // Marquee vertical de "ghost words" — mismo patrón que CompanyGrid:
      // lista duplicada 2x, -50% es exacto por construcción.
      const marquee = q("[data-marquee]")[0];
      if (marquee) {
        const tween = gsap.fromTo(
          marquee,
          { yPercent: -50 },
          { yPercent: 0, duration: 26, repeat: -1, ease: "none", force3D: true }
        );
        pauseOffscreen(tween, scope);
      }

      // Flotación idle del botón de flecha.
      const arrow = q("[data-arrow]")[0];
      if (arrow) {
        const tween = gsap.to(arrow, {
          y: -6,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        pauseOffscreen(tween, scope);
      }
    });

    return () => mm.revert();
  }, []);

  const words = [...GHOST_WORDS, ...GHOST_WORDS];

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-background text-foreground">
      <Container className="grid grid-cols-1 items-center gap-10 py-24 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Eyebrow>Built on Proof</Eyebrow>
          <p className="flex items-baseline gap-2">
            <span className="font-display italic text-display leading-none">
              <span data-counter>0</span>%
            </span>
            <span className="text-h3 font-medium">uptime</span>
          </p>
          <p className="max-w-sm text-body-sm text-muted-foreground text-pretty">
            Move cross-chain, trade perps, hold RWAs, stay confidential, and
            access all of DeFi from your own wallet.
          </p>
        </div>

        <div className="relative flex h-[420px] items-center justify-end overflow-hidden">
          <div data-marquee className="flex flex-col gap-2 whitespace-nowrap will-change-transform">
            {words.map((word, i) => (
              <span
                key={i}
                className="text-display font-medium leading-none text-foreground/[0.06]"
              >
                {word}
              </span>
            ))}
          </div>
          <span
            data-arrow
            className="absolute left-4 top-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-near-green"
          >
            <ArrowUp className="size-5 text-black" />
          </span>
        </div>
      </Container>
    </section>
  );
}
