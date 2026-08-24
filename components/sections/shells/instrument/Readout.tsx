import type { ReactNode } from "react";

// Una lectura: la cifra y qué mide.
//
// Es la unidad de dato del armazón «instrumento», y su forma sale de una que ya
// funciona en este sitio — el `1M+ TPS` de las páginas de protocol: cifra en
// Kepler itálica, etiqueta en mono debajo. Se copia el gesto, no el archivo,
// porque acá la cifra puede ir sobre un panel o suelta sobre la página.
//
// ── Por qué la cifra va en serif itálica y la etiqueta en mono ─────────────
//
// Las dos cosas son texto y ninguna es una oración, así que si compartieran
// familia habría que separarlas por tamaño — y eso obliga a una cifra enorme
// para que la etiqueta no compita. Con dos familias, la jerarquía la hace el
// contraste de forma: la cifra puede bajar de cuerpo y seguir siendo lo primero
// que se lee. En un panel con seis lecturas, esa economía es la diferencia
// entre una fila legible y un tablero apretado.
//
// ── `accent` no es «pintar de verde» ───────────────────────────────────────
//
// Marca la lectura que la sección está afirmando. En una fila de seis, cinco
// son contexto y una es el argumento; si se pintan todas, ninguna lo es. Por eso
// el default es sin acento: encenderla es una decisión, apagarla no.

export type ReadoutProps = {
  value: string;
  label: string;
  /** Segunda línea de la etiqueta: la precisión que la primera no puede cargar. */
  note?: string;
  /** Enciende la cifra en verde. Una por bloque, o ninguna. */
  accent?: boolean;
  /** Para una lectura que encabeza en vez de acompañar. */
  size?: "sm" | "lg";
  children?: ReactNode;
};

const SIZE = {
  sm: "text-h3-serif italic",
  lg: "text-h1-serif italic",
} as const;

export default function Readout({
  value,
  label,
  note,
  accent = false,
  size = "sm",
  children,
}: ReadoutProps) {
  return (
    <div>
      <p className={`${SIZE[size]} ${accent ? "text-near-green-accent" : "text-cream"}`}>
        {value}
      </p>
      <p className="mt-2 text-micro-mono uppercase text-white/45">{label}</p>
      {note ? <p className="mt-1 text-micro-mono text-white/30">{note}</p> : null}
      {children}
    </div>
  );
}
