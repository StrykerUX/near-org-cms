import type { ReactNode } from "react";

// El rótulo en versalitas que encabeza una sección.
//
// ── Las dos familias ───────────────────────────────────────────────────────
//
// El mismo rol se escribe en sans o en monoespaciada según la página, y hasta
// acá solo la sans tenía primitivo: la mono se escribía a mano —
// `text-eyebrow-mono uppercase text-<algo>`— en una treintena de sitios.
//
// No son dos roles distintos. Es el mismo con dos voces: la mono suena a
// instrumento y la sans a documento, y qué páginas usan cuál es una decisión de
// dirección de arte, no de estructura. Por eso es una bandera y no un
// componente aparte — el día que una página cambie de voz, cambia una palabra.
//
// El `uppercase` va acá y no en el token porque los dos tokens de eyebrow
// —`--text-eyebrow` y la utility `text-eyebrow-mono`— declaran cuerpo,
// interlineado, tracking y peso, pero la caja alta es una decisión de este rol
// y no de la escala: hay sitios donde el mismo cuerpo se usa en caja baja.
export type EyebrowProps = {
  children: ReactNode;
  /** Monoespaciada en vez de sans. Misma escala, misma caja alta. */
  mono?: boolean;
  className?: string;
};

export default function Eyebrow({
  children,
  mono = false,
  className = "text-muted-foreground",
}: EyebrowProps) {
  // Mapa literal y no un template: Tailwind escanea el fuente, y una clase
  // armada con una condición nunca aparece entera como cadena.
  const scale = mono ? "text-eyebrow-mono" : "text-eyebrow";
  return <p className={`${scale} uppercase ${className}`}>{children}</p>;
}
