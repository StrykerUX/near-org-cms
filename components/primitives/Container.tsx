import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// Dos escalas de gutter en convivencia (Fase 1 del plan de secciones seguras):
// "site" es la escala original del prototipo, "wide" es la escala que ya
// usaban las páginas de blog antes de esta fase. Mapa literal de clases —
// nunca construir la clase con un template string, Tailwind v4 no detecta
// clases generadas dinámicamente.
const WIDTH = {
  // El gutter de `site` era 60px FIJOS en todos los anchos, y ese número está
  // dibujado para un monitor. En un teléfono de 390 son 120px de margen sobre
  // 390 —el 31% de la pantalla— y todo el sitio quedaba escribiendo en una
  // columna de 270: titulares partidos en cuatro renglones, cards angostas y
  // párrafos de seis palabras.
  //
  // La rampa es la misma que `wide` ya usaba, con el tope en el valor original:
  // 20px en teléfono, 40 en tablet y los 60 de siempre a partir de `lg`. De
  // `lg` para arriba —o sea en todo el rango para el que se dibujó la
  // composición— no cambia un píxel.
  site: "max-w-[1780px] px-5 sm:px-10 lg:px-[60px]",
  wide: "max-w-[1920px] px-5 sm:px-10 lg:px-20",
} as const;

type ContainerProps = {
  as?: ElementType;
  width?: keyof typeof WIDTH;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className">;

/**
 * El resto de las props se reenvía al elemento. Antes se descartaba en silencio,
 * y eso costó una animación: `ThreatSequence` necesitaba marcar su Container para
 * animarlo, el `data-*` no llegaba al DOM, y el workaround fue un selector
 * estructural (`[data-seq] > div > div:not([aria-hidden])`) que se rompía si
 * alguien reordenaba las capas. Un primitivo que traga props sin avisar es una
 * trampa: el llamador escribe algo razonable y no pasa nada, sin error.
 */
export default function Container({
  as: Tag = "div",
  width = "site",
  children,
  className = "",
  ...rest
}: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full ${WIDTH[width]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
