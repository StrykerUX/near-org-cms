import type { ElementType, ReactNode } from "react";

// Dos escalas de gutter en convivencia (Fase 1 del plan de secciones seguras):
// "site" es la escala original del prototipo, "wide" es la escala que ya
// usaban las páginas de blog antes de esta fase. Mapa literal de clases —
// nunca construir la clase con un template string, Tailwind v4 no detecta
// clases generadas dinámicamente.
const WIDTH = {
  site: "max-w-[1780px] px-[60px]",
  wide: "max-w-[1920px] px-5 sm:px-10 lg:px-20",
} as const;

export default function Container({
  as: Tag = "div",
  width = "site",
  children,
  className = "",
}: {
  as?: ElementType;
  width?: keyof typeof WIDTH;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag className={`mx-auto w-full ${WIDTH[width]} ${className}`}>
      {children}
    </Tag>
  );
}
