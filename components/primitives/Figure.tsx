import type { ReactNode } from "react";

// El marco común de todo dibujo de estas páginas: filete, la figura, y un pie
// en mono.
//
// Existe por una razón sola, y no es ahorrar líneas: sin él, treinta figuras
// dibujadas por manos distintas en cuatro carpetas distintas se leen como
// treinta decoraciones sueltas. Con él —mismo filete arriba, mismo pie abajo,
// misma numeración— se leen como el aparato gráfico de un mismo documento, que
// es lo que las hace parecer parte del sitio y no pegadas encima.
//
// El pie NO es opcional y esa es la parte importante. Una figura sin pie obliga
// al lector a deducir qué está mirando; y a quien la escribe, obligarlo a
// redactar la frase «qué muestra esto» es el filtro que descarta las figuras que
// no muestran nada. Si el pie sale tautológico («diagrama del ecosistema»), la
// figura sobra.
//
// `index` sí es opcional: numerar tiene sentido cuando las figuras forman una
// serie que el texto referencia, y no cuando hay una sola en la sección.

const TONE = {
  light: { rule: "bg-rule", caption: "text-gray-intermediate", art: "text-ink" },
  dark: { rule: "bg-white/15", caption: "text-white/50", art: "text-cream" },
} as const;

export type FigureProps = {
  /**
   * Qué muestra la figura. Una frase, no una etiqueta.
   *
   * **En inglés.** El pie NO es material de trabajo que después se reemplaza:
   * es contenido permanente de la página, se imprime bajo el dibujo y se queda
   * ahí para siempre. En un sitio en inglés, un pie en español se lee como un
   * error. (Los comentarios del código son otra cosa: se leen en el editor.)
   */
  caption: string;
  /** «Fig. 01» — solo si las figuras de la sección forman una serie. */
  index?: string;
  tone?: keyof typeof TONE;
  /** El dibujo. Hereda el color por `currentColor`. */
  children: ReactNode;
  className?: string;
};

export default function Figure({
  caption,
  index,
  tone = "light",
  children,
  className = "",
}: FigureProps) {
  const t = TONE[tone];

  return (
    <figure className={className}>
      <div className={`h-px w-full ${t.rule}`} aria-hidden="true" />
      {/* El color lo pone el marco y lo hereda el dibujo por `currentColor`, así
          una figura no tiene que saber sobre qué fondo la montaron. */}
      <div className={`mt-6 ${t.art}`}>{children}</div>
      <figcaption
        className={`mt-6 flex items-baseline gap-3 text-caption-mono ${t.caption}`}
      >
        {index ? <span aria-hidden="true">{index}</span> : null}
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
