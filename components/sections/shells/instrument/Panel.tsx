import type { ReactNode } from "react";

// El panel oscuro que hace de escenario. Es la pieza central del armazón
// «instrumento», y de ella sale casi todo el carácter de la variante B.
//
// ── Por qué un panel y no una sección oscura a secas ───────────────────────
//
// Una sección con `bg-ink` es un cambio de fondo: la página sigue siendo la
// misma superficie, pintada de otro color. Un panel tiene BORDE, y un borde
// convierte lo que está adentro en un objeto — algo que se mira, no algo que se
// atraviesa leyendo. Es la diferencia entre una página oscura y una pantalla
// encendida dentro de una página, y es exactamente el gesto que hace que
// `/prototype/protocol-a` se lea como un instrumento.
//
// De ahí las tres cosas que el panel trae y una sección no: el radio grande (un
// objeto tiene esquinas resueltas), el filete de 1px al 8% (el canto del
// objeto, no una decoración) y las etiquetas en las esquinas, que son lo que
// termina de decir «esto es un aparato con una lectura», no una ilustración.
//
// ── La retícula de puntos ──────────────────────────────────────────────────
//
// Opcional y apagada por defecto. Sirve cuando adentro hay una figura que
// necesita una referencia de escala —algo que se mueve sobre un plano— y estorba
// cuando adentro hay tipografía. Se pinta con un `radial-gradient` repetido y no
// con un SVG: son cuatro píxeles por celda, no necesita nodos en el DOM, y así
// escala con el panel sin re-medir.

const TONE = {
  // El negro de sección del sitio. El panel se recorta contra un fondo que no
  // es negro puro, así que su propio negro puede serlo casi.
  ink: "bg-ink",
  // Azul-gris. NO es un alias del anterior: cuando adentro hay cards claras o
  // trazos finos, `--ink` les dispara el contraste y se leen como agujeros —
  // el mismo motivo por el que `/quantum-security` tiene su propio oscuro.
  slate: "bg-ink-slate",
} as const;

export type PanelProps = {
  children: ReactNode;
  /** Esquina superior izquierda, en mono. La identidad del aparato. */
  label?: string;
  /** Esquina superior derecha, en mono. La lectura de estado. */
  meta?: string;
  /** Banda inferior dentro del panel — normalmente un `ActRail` o una fila de `Readout`. */
  footer?: ReactNode;
  tone?: keyof typeof TONE;
  /** Retícula de puntos de referencia. Solo si adentro hay una figura que se mueve. */
  grid?: boolean;
  className?: string;
};

export default function Panel({
  children,
  label,
  meta,
  footer,
  tone = "ink",
  grid = false,
  className = "",
}: PanelProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 text-cream lg:rounded-[2.5rem] ${TONE[tone]} ${className}`}
    >
      {grid ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      ) : null}

      {label || meta ? (
        // `pointer-events-none` en la fila y no en cada etiqueta: la fila cruza
        // el panel entero por arriba, y sin esto se come el hover de cualquier
        // cosa que viva en esa banda.
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-baseline justify-between gap-4 p-5 text-micro-mono uppercase text-white/40 lg:p-7">
          <span>{label}</span>
          <span>{meta}</span>
        </div>
      ) : null}

      <div className="relative">{children}</div>

      {footer ? (
        <div className="relative border-t border-white/10 px-5 py-4 lg:px-7 lg:py-5">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
