import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Bento grid asimétrico — mecánica firma del estilo Midu (una card ancha +
// dos cuadradas al lado + una barra de ancho completo) y reusada en varios
// híbridos. `BentoGrid` fija el grid de 3 columnas; `BentoCard` (named
// export, mismo criterio que `Grid.tsx`/`GridOverlay`) decide cuánto ocupa
// cada hijo vía `span`.
//
// Mapas literales — nunca template strings (Tailwind v4 no detecta clases
// generadas dinámicamente, ver Button.tsx/Container.tsx).
//
// Ambos reenvían el resto de props al div (mismo criterio que `Container`),
// para poder engancharlos como target de `useScrollReveal` con `data-reveal`.
export type BentoGridProps = {
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

export default function BentoGrid({ className = "", children, ...rest }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 lg:grid-cols-3 lg:auto-rows-[minmax(200px,auto)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

const SPAN = {
  wide: "lg:col-span-2 lg:row-span-2",
  tall: "lg:row-span-2",
  square: "lg:col-span-1 lg:row-span-1",
  full: "lg:col-span-3",
} as const;

const TONE = {
  ink: "border border-white/10 bg-ink-slate text-cream",
  tint: "border border-rule bg-card-tint/50 text-foreground",
} as const;

export type BentoCardProps = {
  span?: keyof typeof SPAN;
  tone?: keyof typeof TONE;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

export function BentoCard({
  span = "square",
  tone = "ink",
  className = "",
  children,
  ...rest
}: BentoCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-[2rem] p-8 ${SPAN[span]} ${TONE[tone]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
