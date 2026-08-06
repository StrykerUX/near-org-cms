"use client";

import { useGsapContext } from "@/components/primitives/motion/useGsapContext";
import { pauseOffscreen } from "@/components/primitives/motion/pauseOffscreen";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";

// Divisor decorativo de "escalera" entre secciones — draft del prototipo
// "homepage" (/prototype/homepage), estimado de la captura compartida.
// Alturas por columna via `style` inline, nunca clases Tailwind dinámicas
// (mismo criterio que Container.tsx). Colores también via `style`: son
// valores runtime arbitrarios (tokens del tema o hex directo), no hay forma
// de expresarlos como clases estáticas sin listar cada combinación posible.
//
// 7 escalones anchos (no 13) — contra la captura de referencia. Valle
// invertido: picos en los bordes, dip en el centro.
const STEPS = [100, 70, 40, 0, 40, 70, 100]; // % de la altura del contenedor

export type ZigguratDividerProps = {
  /** Color del fondo detrás de la escalera (continúa la sección de arriba) */
  from: string;
  /** Color de los escalones (anticipa la sección de abajo) */
  to: string;
  /** Escalones creciendo desde arriba en vez de desde abajo */
  flip?: boolean;
  /** Complementa las alturas (valle ↔ pico): el centro pasa a ser el escalón
   *  más alto y los bordes los más bajos. Es lo que hace falta para que dos
   *  dividers que encierran una misma sección se lean como espejo: sin esto
   *  los dos "bajan hacia el centro" y la banda de color parece inclinada en
   *  vez de simétrica. */
  invert?: boolean;
  className?: string;
};

export default function ZigguratDivider({
  from,
  to,
  flip = false,
  invert = false,
  className = "",
}: ZigguratDividerProps) {
  const rowRef = useGsapContext<HTMLDivElement>((_self, scope) => {
    const q = gsap.utils.selector(scope) as (s: string) => HTMLElement[];
    const mm = gsap.matchMedia();

    mm.add({ motionOk: MQ.motion }, (mctx) => {
      const { motionOk } = mctx.conditions as { motionOk: boolean };
      const columns = q("[data-reveal]");

      if (!motionOk) {
        gsap.set(columns, { clearProps: "all" });
        return;
      }

      // 1. Reveal al entrar en viewport, una sola vez — igual que antes.
      gsap.from(columns, {
        scaleY: 0,
        transformOrigin: flip ? "top" : "bottom",
        stagger: 0.05,
        duration: 0.7,
        scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      });

      // 2. Parallax ligado al scroll (opción B): cada columna se desfasa
      // según su distancia al centro — las de los bordes se mueven más que
      // las del medio, dando profundidad real al cruzar el divider. Anima
      // `yPercent`, una propiedad distinta a la de arriba (scaleY) y a la
      // de abajo (y) — GSAP compone las tres sin pelear entre sí.
      const mid = (columns.length - 1) / 2;
      columns.forEach((col, i) => {
        const distance = mid === 0 ? 0 : Math.abs(i - mid) / mid; // 0 centro, 1 bordes
        gsap.to(col, {
          yPercent: (flip ? -1 : 1) * distance * 14,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // 3. Idle muy sutil (un poco de opción A) — la escalera nunca queda
      // del todo quieta, pero el desplazamiento es mínimo (4px) y lento.
      columns.forEach((col, i) => {
        const tween = gsap.to(col, {
          y: "+=4",
          duration: 2.6 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        pauseOffscreen(tween, scope);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`relative h-28 overflow-hidden sm:h-40 ${className}`}
      style={{ backgroundColor: from }}
    >
      <div
        ref={rowRef}
        className={`absolute inset-x-0 flex h-full ${flip ? "items-start" : "items-end"}`}
      >
        {/* Complemento y no `reverse()`: STEPS es palindrómico, así que darlo
            vuelta no cambiaría nada — lo que invierte la silueta es 100-h. */}
        {STEPS.map((h, i) => (
          <div
            key={i}
            data-reveal
            className="flex-1"
            style={{ height: `${invert ? 100 - h : h}%`, backgroundColor: to }}
          />
        ))}
      </div>
    </div>
  );
}
