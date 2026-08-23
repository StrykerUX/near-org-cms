import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Card translúcida (glassmorphism) — mecánica firma del estilo Phantom
// sobre fondos oscuros, reusada en varios híbridos. Radio fijo
// `rounded-[2.5rem]` (ultra-redondeado, sin excepción — es parte de la
// identidad del estilo, no algo que cada caller deba repetir).
//
// Reenvía el resto de props al div (mismo criterio que `Container`), para
// poder engancharla como target de `useScrollReveal` con `data-reveal`.
export type GlassCardProps = {
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

export default function GlassCard({ className = "", children, ...rest }: GlassCardProps) {
  return (
    <div
      className={`rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl shadow-near-green/10 backdrop-blur-xl ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
