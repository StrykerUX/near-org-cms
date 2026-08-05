"use client";

import type { ReactNode } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ZigguratDivider from "@/components/primitives/ZigguratDivider";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { gsap, SplitText } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

export type HeroBannerProps = {
  // Slot para el nav flotante (NavPill). No es una variante de esta sección
  // — mismo patrón que el slot `nav` de PageHero.tsx.
  nav?: ReactNode;
};

export default function HeroBanner({ nav }: HeroBannerProps) {
  const rootRef = useGsapContext<HTMLElement>((_self, scope) => {
    const q = gsap.utils.selector(scope);
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const heading = q("[data-hero='heading']")[0];
      const rest = q("[data-hero='sub'], [data-hero='row']");
      if (!heading) return;

      gsap.set(rest, { autoAlpha: 0, y: 16 });

      // autoSplit re-splittea cuando la fuente (montreal, display:swap)
      // termina de cargar y el ancho real de las palabras cambia.
      // onSplit corre en el split inicial Y en cada re-split; devolver la
      // animación hace que SplitText la revierta sola en el próximo re-split.
      const split = SplitText.create(heading, {
        type: "words",
        mask: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 110,
            autoAlpha: 0,
            stagger: 0.06,
            duration: 0.9,
            ease: "power3.out",
            onComplete: () => {
              gsap.to(rest, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 });
            },
          });
        },
      });

      return () => split.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="flex flex-col bg-cream text-foreground">
      <Container className="pt-6">{nav}</Container>

      <Container className="flex flex-1 flex-col items-center justify-center gap-8 py-24 text-center">
        <h1 data-hero="heading" className="text-display font-medium text-pretty">
          Own your
          <br />
          <Accent display>world.</Accent>
        </h1>
        <p data-hero="sub" className="max-w-lg text-body-lg text-muted-foreground text-pretty">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and
          access all of DeFi from your own wallet.
        </p>
        <div data-hero="row" className="flex items-center gap-4 text-body-sm">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-near-green" />
            Start Developing
          </span>
          <span className="h-4 w-px bg-border" />
          <a href="#" className="flex items-center gap-1 transition-colors hover:text-foreground/70">
            Learn More
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </Container>

      <ZigguratDivider from="var(--cream)" to="var(--stone)" />
    </section>
  );
}
