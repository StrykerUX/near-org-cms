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

// La caja de arte tiene proporción fija por defecto, y eso es correcto mientras
// lo que va adentro sea un DIBUJO: en una retícula de tres, el alto tiene que
// salir del ancho de la celda o las tres se desalinean en cuanto una tiene el
// título más largo.
//
// Deja de ser correcto en cuanto adentro va un asset. La proporción de una foto
// o de una pieza de archivo es un hecho del asset —está declarada donde se
// declara el encargo— y forzarla a 4/3 la recorta. Dos páginas resolvieron esto
// por su cuenta con una card local, que es la señal de que el hueco era del
// armazón y no de ellas.
const RATIO = {
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "21/9": "aspect-[21/9]",
  "5/2": "aspect-[5/2]",
} as const;

export type CardProps = {
  /** El dibujo, o el asset. Un dibujo hereda color por `currentColor`. */
  art: ReactNode;
  title: string;
  body: string;
  /** Si la unidad lleva a algún lado. Interno usa `next/link`, externo `<a>`. */
  href?: string;
  linkLabel?: string;
  /** La card que la sección está afirmando: fondo encendido y no neutro. */
  accent?: boolean;
  /** La proporción de la caja de arte. Con un asset, la que el asset declara. */
  ratio?: keyof typeof RATIO;
  /**
   * Saca el papel: la caja pierde su fondo blanco y su padding, y el contenido
   * llega al radio. Para una FOTO — el papel con margen es lo correcto para un
   * dibujo y lo incorrecto para una imagen, que no necesita que la monten sobre
   * nada.
   */
  flush?: boolean;
  className?: string;
};

export default function Card({
  art,
  title,
  body,
  href,
  linkLabel,
  accent = false,
  ratio = "4/3",
  flush = false,
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
      {/* La caja del arte. Proporción y no altura fija: la card vive en una
          retícula de tres y el alto tiene que salir del ancho de la celda, o
          las tres se desalinean en cuanto una tiene el título más largo. */}
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[1.25rem] text-ink ${RATIO[ratio]} ${
          flush ? "" : "bg-background p-6"
        }`}
      >
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
