import type { ReactNode } from "react";

// El armazón de la dirección `slab`, de spartanai.framer.website.
//
// ── Qué es ───────────────────────────────────────────────────────────────────
//
// Una losa de esquinas muy blandas apoyada sobre el suelo de la página, con un
// margen chico y parejo por los cuatro lados. La página deja de ser un rollo
// continuo y pasa a ser una pila de piezas: se ve el suelo entre una y otra, y
// cada sección tiene bordes propios.
//
// ── Por qué no usa `Container` ───────────────────────────────────────────────
//
// `Container` centra un bloque de 1780px con gutters de 60. Eso es correcto
// para una sección que se apoya en el papel, y es exactamente lo que esta
// dirección NO hace: la losa tiene que llegar casi al borde del viewport —el
// margen es de 12/16px, no de 60— o deja de leerse como una placa y pasa a
// leerse como una card grande centrada, que es otra cosa.
//
// El aire del contenido lo pone el padding INTERNO de la losa. Es más chico que
// el gutter del sitio a propósito: adentro de una placa el texto puede acercarse
// al borde, porque el borde existe.
//
// ── El radio es fijo y grande ────────────────────────────────────────────────
//
// 40px, sin `clamp`. Un radio que escala con el viewport se lee como un error de
// render en las pantallas chicas —la losa parece una píldora— y acá el radio no
// es proporción: es el mismo canto en todos lados, como el de una pieza física.
export type SlabProps = {
  children: ReactNode;
  /** `ink` es la losa oscura; `paper` la clara. La dirección alterna. */
  tone?: "ink" | "paper";
  className?: string;
};

const TONE = {
  ink: "bg-ink-slate text-cream",
  paper: "bg-cream text-ink",
} as const;

export default function Slab({ children, tone = "ink", className = "" }: SlabProps) {
  return (
    <section className="bg-card-tint p-3 lg:p-4">
      <div
        className={`rounded-[40px] px-6 py-16 lg:px-14 lg:py-24 ${TONE[tone]} ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
