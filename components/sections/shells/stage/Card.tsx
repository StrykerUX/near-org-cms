import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// La card del armazón «escenario»: una caja de arte sobre una caja de texto.
//
// ── Por qué acá SÍ hay cajas ──────────────────────────────────────────────
//
// La doctrina de este sitio es que agrupar con cajas es peor que agrupar con
// filetes, y está escrita largo en `chain/WhyItMatters.tsx`. Esa doctrina vale
// para una sección de ARGUMENTO: tres columnas de prosa metidas en tres
// rectángulos leen como un formulario.
//
// Acá el contenido es otro. Cada unidad tiene una FIGURA, y una figura necesita
// un fondo propio para no quedar flotando sobre la página — si no, el dibujo y
// el texto comparten superficie y el dibujo pierde su marco de referencia. La
// card no está agrupando texto: está dándole una caja al dibujo y arrastrando su
// pie consigo. Es el mismo criterio con el que `/prototype/protocol-a` resuelve
// «Built for AI scale», y es la variante donde esa gramática es el punto.
//
// De ahí que el arte vaya en una caja MÁS CLARA adentro de la card: dos
// superficies, no una. La de afuera agrupa, la de adentro es el papel del
// dibujo.

export type CardProps = {
  /** El dibujo. Hereda color por `currentColor`. */
  art: ReactNode;
  title: string;
  body: string;
  /** Si la unidad lleva a algún lado. Interno usa `next/link`, externo `<a>`. */
  href?: string;
  linkLabel?: string;
  /** La card que la sección está afirmando: fondo encendido y no neutro. */
  accent?: boolean;
  className?: string;
};

export default function Card({
  art,
  title,
  body,
  href,
  linkLabel,
  accent = false,
  className = "",
}: CardProps) {
  const isExternal = !!href && /^https?:\/\//.test(href);

  const link = href ? (
    <span className="mt-6 inline-flex items-center gap-1.5 text-label text-ink underline-offset-4 group-hover:underline">
      {linkLabel ?? "Learn more"}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </span>
  ) : null;

  const inner = (
    <>
      {/* La caja del arte. `aspect-[4/3]` y no altura fija: la card vive en una
          retícula de tres y el alto tiene que salir del ancho de la celda, o
          las tres se desalinean en cuanto una tiene el título más largo. */}
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.25rem] bg-background p-6 text-ink">
        {art}
      </div>
      <h3 className="mt-7 text-h3-serif italic text-ink text-pretty">{title}</h3>
      <p className="mt-3 max-w-[34ch] text-body text-ink-soft text-pretty">{body}</p>
      {link}
    </>
  );

  const shell = `group flex flex-col rounded-[1.75rem] p-5 transition-colors lg:p-7 ${
    accent ? "bg-cta-lime/40" : "bg-card-tint"
  } ${href ? "hover:bg-stone/60" : ""} ${className}`;

  if (!href) return <div className={shell}>{inner}</div>;

  return isExternal ? (
    <a href={href} className={shell}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={shell}>
      {inner}
    </Link>
  );
}
