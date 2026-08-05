"use client";

import { Play } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ZigguratDivider from "@/components/primitives/ZigguratDivider";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Sin asset de video real (fuera de alcance de este draft) — el poster es un
// gradiente CSS con un loop "ken burns" lento en vez de una imagen.
function KenBurnsPoster() {
  const posterRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tween = gsap.to(scope, {
        scale: 1.08,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      pauseOffscreen(tween, scope);
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={posterRef}
      className="absolute inset-0 will-change-transform"
      style={{
        backgroundImage:
          "radial-gradient(circle at 25% 30%, #4a4a4a, transparent 60%), radial-gradient(circle at 75% 70%, #6b6b6b, transparent 55%), #a8a8a8",
      }}
    />
  );
}

export default function VideoStory() {
  // El ref del reveal va en un wrapper NO visual: gsap.utils.selector(scope)
  // busca descendientes de scope, así que `data-reveal` no puede vivir en el
  // mismo nodo que el ref o el selector nunca lo encuentra.
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-background py-10">
      <Container>
        <div ref={rootRef}>
          <div
            data-reveal
            className="relative aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] border border-border sm:aspect-[21/10]"
          >
            <KenBurnsPoster />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <button
              type="button"
              className="group absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 text-body-sm font-medium text-black shadow-lg transition-transform hover:scale-105 sm:left-8 sm:top-8"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:scale-110">
                <Play className="size-3.5" fill="currentColor" />
              </span>
              watch
            </button>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-white sm:p-10">
              <h2 className="text-h2 font-medium text-pretty">
                The worlds you build
                <br />
                <Accent>should be yours to own.</Accent>
              </h2>
              <p className="max-w-md text-body-sm text-white/70 text-pretty">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </Container>

      <ZigguratDivider from="var(--background)" to="#101010" />
    </section>
  );
}
