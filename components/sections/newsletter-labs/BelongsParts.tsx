import Image from "next/image";

// Las piezas de contenido que las ocho variantes comparten.
//
// No es un layout: son los tres elementos de la sección —el wordmark, el claim
// y el párrafo— con la única decisión que NO varía entre variantes, que es cómo
// se comportan por dentro. La composición (dónde va cada uno, a qué escala, con
// qué fondo) vive entera en cada variante.
//
// ── El wordmark es texto, no un logo suelto ─────────────────────────────────
//
// Es la primera línea del titular y por eso vive dentro del heading: su `alt`
// aporta la palabra que falta para que la frase se lea entera ("NEAR belongs to
// you"). Sacarlo del heading deja un `<h2>` que dice solo "belongs to you.", que
// no significa nada.
//
// La altura va inline y no por una clase de la escala tipográfica: es una
// IMAGEN, no texto, así que ningún rol de la escala le aplica. Cada variante le
// pasa su propio `height` fluido.

export const BELONGS_COPY = {
  claim: "belongs to you.",
  body: "Get the latest product launches, protocol milestones, and ecosystem updates straight to your inbox.",
  placeholder: "email address",
  label: "Email address",
  button: "sign up",
} as const;

export function Wordmark({
  height,
  className = "",
  invert = false,
}: {
  /** Altura fluida, en la forma `clamp(...)`. */
  height: string;
  className?: string;
  /** Para las bandas oscuras o de color: el wordmark en negativo. */
  invert?: boolean;
}) {
  return (
    <Image
      src="/prototype/v2/near-wordmark.svg"
      alt="NEAR"
      width={160}
      height={40}
      priority={false}
      className={`block w-auto ${invert ? "invert" : ""} ${className}`}
      style={{ height }}
    />
  );
}
