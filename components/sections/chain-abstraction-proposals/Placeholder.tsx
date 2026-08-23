import type { ComponentPropsWithoutRef } from "react";

// Mapa literal (nunca template string — Tailwind v4 no detecta clases
// construidas dinámicamente y las purga) de las 4 texturas que necesita el
// laboratorio de 9 prototipos. `dashed` es el original (A/B, sin cambios de
// comportamiento para no romper esas dos páginas).
const TONE = {
  dashed: "rounded-2xl border border-dashed border-rule bg-white/40 text-gray-intermediate",
  glow: "rounded-[2rem] border border-white/10 bg-ink-slate/60 text-gray-intermediate",
  terminal: "rounded-none border border-gray-800 bg-black text-near-green",
  glass: "rounded-[2.5rem] border border-white/15 bg-white/10 backdrop-blur-xl text-cream/70",
} as const;

export type PlaceholderProps = {
  label: string;
  tone?: keyof typeof TONE;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

// Placeholder genérico para imágenes/gráficos complejos que el copy pide pero
// que no tienen arte final todavía (pedido explícito: "usa placeholders").
// Compartido entre las propuestas A/B y el laboratorio de 9 prototipos
// (`@/components/sections/*` está en el allowlist del contrato de
// secciones) para no repetir el mismo bloque N veces con el riesgo de que
// se desalinee entre versiones.
//
// `tone` (default "dashed", el original) cambia solo color/borde/radio —
// sigue siendo 1 prop de variante, dentro del límite de 4 del contrato.
//
// Reenvía el resto de props al div (mismo criterio que `Container`): es lo
// que deja escribir `<Placeholder data-reveal .../>` para que el reveal de
// scroll lo enganche como un target más, sin que el componente tenga que
// saber nada de motion.
export default function Placeholder({
  label,
  tone = "dashed",
  className = "",
  ...rest
}: PlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center p-6 text-center text-caption-mono ${TONE[tone]} ${className}`}
      {...rest}
    >
      {label}
    </div>
  );
}
