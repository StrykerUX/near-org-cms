"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Ticker infinito de nombres — mismo mecanismo que
// `components/sections/quantum/ProofMarquee.tsx` (doble set de items +
// `xPercent: -50`, que cierra el loop sin salto), generalizado a un
// primitivo reusable en vez de acoplarse a una página real. Con
// `prefers-reduced-motion` no corre — el `overflow-x-auto` de respaldo
// deja el segundo set navegable a mano en vez de invisible.
export type MarqueeProps = {
  items: string[];
  speedSeconds?: number;
  className?: string;
};

export default function Marquee({ items, speedSeconds = 30, className = "" }: MarqueeProps) {
  const rootRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const track = q("[data-marquee]")[0];
      if (!track) return;

      const tween = gsap.fromTo(
        track,
        { xPercent: 0 },
        { xPercent: -50, duration: speedSeconds, ease: "none", repeat: -1, force3D: true }
      );
      pauseOffscreen(tween, scope);
    });

    return () => mm.revert();
  }, [speedSeconds]);

  const loop = [...items, ...items];

  return (
    <div ref={rootRef} className={`overflow-hidden motion-reduce:overflow-x-auto ${className}`}>
      <div data-marquee className="flex w-max items-center">
        {loop.map((item, i) => {
          const isClone = i >= items.length;
          return (
            <span
              key={`${item}:${i}`}
              {...(isClone ? { "aria-hidden": true } : {})}
              className="mr-10 shrink-0 whitespace-nowrap text-caption-mono uppercase"
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}
