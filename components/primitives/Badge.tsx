import type { ReactNode } from "react";

// Pill tag chico — kickers de capacidades (Phantom, Midu) y etiquetas de
// eyebrow sobre fondos oscuros/glass. `Eyebrow.tsx` ya cubre el rol de texto
// simple sin fondo; esto es el mismo rol pero como chip, para estilos donde
// el eyebrow necesita leerse como objeto flotante y no como línea de texto.
//
// Mapa literal — nunca template string (regla Tailwind v4, ver Button.tsx).
const TONE = {
  light: "bg-white/80 text-ink border border-rule",
  dark: "bg-white/10 text-cream border border-white/15",
  brand: "bg-near-green text-black",
} as const;

export type BadgeProps = {
  children: ReactNode;
  tone?: keyof typeof TONE;
  className?: string;
};

export default function Badge({ children, tone = "dark", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-4 py-1.5 text-caption-mono uppercase ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
