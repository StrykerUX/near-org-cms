// Fondo atmosférico — blobs de gradiente difuminados en capas, mismo
// lenguaje visual que el hero de `homepage-update/Hero.tsx` y
// `homepage-update/StackAnchors.tsx` (`radial-gradient` con los tokens del
// DS vía `color-mix`), reusado acá para que las páginas del laboratorio no
// se sientan planas al lado del homepage. Sin esto, un `bg-ink`/`bg-cream`
// liso es lo que hacía que los 4 estilos base desentonaran con el resto del
// sitio (ver feedback del usuario).
//
// El caller envuelve en `relative overflow-hidden`; esto es un
// `absolute inset-0` puramente decorativo (`aria-hidden`, `pointer-events-none`).
const TONE = {
  dark: [
    "radial-gradient(ellipse 60% 50% at 20% 20%, color-mix(in srgb, var(--near-green) 22%, transparent) 0%, transparent 60%)",
    "radial-gradient(ellipse 55% 45% at 85% 75%, color-mix(in srgb, var(--near-green-accent) 16%, transparent) 0%, transparent 60%)",
  ],
  light: [
    "radial-gradient(ellipse 60% 50% at 15% 10%, color-mix(in srgb, var(--near-green) 14%, transparent) 0%, transparent 65%)",
    "radial-gradient(ellipse 55% 45% at 90% 85%, color-mix(in srgb, var(--stone) 70%, transparent) 0%, transparent 65%)",
  ],
} as const;

export type GradientMeshProps = {
  tone?: keyof typeof TONE;
  className?: string;
};

export default function GradientMesh({ tone = "dark", className = "" }: GradientMeshProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ backgroundImage: TONE[tone].join(", ") }}
    />
  );
}
