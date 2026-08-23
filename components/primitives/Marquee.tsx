"use client";

import type { ReactNode } from "react";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Ticker infinito — mismo mecanismo que
// `components/sections/quantum/ProofMarquee.tsx` (doble set de items +
// `xPercent: -50`, que cierra el loop sin salto), generalizado a un
// primitivo reusable en vez de acoplarse a una página real. Con
// `prefers-reduced-motion` no corre — el `overflow-x-auto` de respaldo
// deja el segundo set navegable a mano en vez de invisible.
//
// `items` acepta nodos y no solo strings porque el primer consumidor real
// hace correr logos, no nombres. El estilo de cada celda sale por eso de
// `itemClassName`: el default reproduce el tratamiento de texto con el que
// nació (mono, mayúsculas, sin cortar), y un consumidor que mete imágenes
// lo reemplaza por su propio espaciado.
export type MarqueeProps = {
  items: ReactNode[];
  speedSeconds?: number;
  className?: string;
  itemClassName?: string;
};

export default function Marquee({
  items,
  speedSeconds = 30,
  className = "",
  itemClassName = "mr-10 shrink-0 whitespace-nowrap text-caption-mono uppercase",
}: MarqueeProps) {
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
            // La key es el índice a propósito: `items` son nodos, no
            // strings, así que no hay identidad estable de la que tirar —
            // y la lista es fija, nunca se reordena ni se filtra.
            <span
              key={i}
              {...(isClone ? { "aria-hidden": true } : {})}
              className={itemClassName}
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}
