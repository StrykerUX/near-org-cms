"use client";

import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// Divisor decorativo de "escalera" entre secciones — draft del prototipo
// "homepage" (/prototype/homepage), estimado de la captura compartida.
// Alturas por columna via `style` inline, nunca clases Tailwind dinámicas
// (mismo criterio que Container.tsx). Colores también via `style`: son
// valores runtime arbitrarios (tokens del tema o hex directo), no hay forma
// de expresarlos como clases estáticas sin listar cada combinación posible.
const STEPS = [0, 45, 75, 100, 75, 45, 0]; // % de la altura del contenedor, skyline simétrico

export type ZigguratDividerProps = {
  /** Color del fondo detrás de la escalera (continúa la sección de arriba) */
  from: string;
  /** Color de los escalones (anticipa la sección de abajo) */
  to: string;
  /** Escalones creciendo desde arriba en vez de desde abajo */
  flip?: boolean;
  className?: string;
};

export default function ZigguratDivider({
  from,
  to,
  flip = false,
  className = "",
}: ZigguratDividerProps) {
  const rowRef = useScrollReveal<HTMLDivElement>({
    build: ({ tl, q }) => {
      tl.from(q("[data-reveal]"), {
        scaleY: 0,
        transformOrigin: flip ? "top" : "bottom",
        stagger: 0.05,
        duration: 0.7,
      });
    },
  });

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
        {STEPS.map((h, i) => (
          <div
            key={i}
            data-reveal
            className="flex-1"
            style={{ height: `${h}%`, backgroundColor: to }}
          />
        ))}
      </div>
    </div>
  );
}
