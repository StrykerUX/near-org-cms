import type { ReactNode } from "react";

// La cabecera de la dirección `night`, calcada de dreammotion.framer.website.
//
// Son dos piezas y las dos hacen falta:
//
// **La píldora con el punto.** Un rótulo en versalitas sobre negro se pierde:
// no tiene contra qué recortarse. La píldora le da un borde y el punto le da un
// ancla —el ojo lo encuentra antes de leer— y por eso va centrada arriba de
// todo, donde en las otras cuatro direcciones va una etiqueta al ras del
// margen. El punto es verde de marca y es lo único de color del tramo oscuro.
//
// **El titular en serif a dos tonos.** La primera mitad en crema y la segunda
// apagada. No es un degradado ni un efecto: son dos `<span>`, y el corte lo
// elige quien escribe el titular. Lo que hace es que la frase tenga un acento
// —hay una parte que se afirma y una que se murmura— sin cambiar de tamaño ni
// de peso, que es todo lo que se puede hacer cuando la paleta es un solo color.
export default function NightHeader({
  eyebrow,
  lead,
  tail,
  children,
}: {
  eyebrow: string;
  /** El tramo que se afirma, en crema plena. */
  lead: string;
  /** El tramo que se apaga. Va como hermano y no como opacidad del padre. */
  tail: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col items-center gap-6 text-center">
      <p className="text-caption-mono inline-flex items-center gap-2 rounded-full border border-cream/10 bg-cream/[0.04] px-3 py-1 uppercase text-cream/60">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-near-green" />
        {eyebrow}
      </p>

      <h2 className="text-h1-serif max-w-[20ch] text-balance">
        <span>{lead} </span>
        <span className="text-cream/35">{tail}</span>
      </h2>

      {children}
    </header>
  );
}
