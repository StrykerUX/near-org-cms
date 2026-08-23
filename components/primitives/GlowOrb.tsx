// Blob difuminado tipo "glow" de neón — mecánica firma del estilo Midu
// (`bg-ink` + resplandor de acento detrás del headline) y reusado en varios
// híbridos. Puramente decorativo (`aria-hidden`, `pointer-events-none`):
// no ocupa layout, el caller lo posiciona con `className` (ej.
// `absolute -top-24 left-1/2 -translate-x-1/2`) sobre un contenedor
// `relative overflow-hidden`.
//
// Mapas literales — nunca template strings — Tailwind v4 no detecta clases
// generadas dinámicamente (mismo criterio que Button.tsx/Container.tsx).
const COLOR = {
  green: "bg-near-green",
  greenAccent: "bg-near-green-accent",
  greenDark: "bg-near-green-dark",
} as const;

const SIZE = {
  sm: "h-40 w-40 blur-[80px]",
  md: "h-64 w-64 blur-[100px]",
  lg: "h-96 w-96 blur-[120px]",
  xl: "h-[36rem] w-[36rem] blur-[140px]",
} as const;

export type GlowOrbProps = {
  color?: keyof typeof COLOR;
  size?: keyof typeof SIZE;
  className?: string;
};

export default function GlowOrb({ color = "green", size = "md", className = "" }: GlowOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none rounded-full opacity-40 ${COLOR[color]} ${SIZE[size]} ${className}`}
    />
  );
}
