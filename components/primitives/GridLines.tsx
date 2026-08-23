// Fondo técnico de líneas — grid tenue tipo blueprint, mecánica del estilo
// Sui (terminal/hardcore-tech): sin esto, `border-gray-800` a secas se leía
// como un dashboard cualquiera, no como la explosión geométrica azulada de
// sui.io. CSS puro (`repeating-linear-gradient`), sin asset — mismo
// criterio que los gradientes literales de `ZigguratDivider`/`GradientMesh`.
//
// El caller envuelve en `relative overflow-hidden`; esto es un
// `absolute inset-0` puramente decorativo (`aria-hidden`, `pointer-events-none`).
export type GridLinesProps = {
  className?: string;
};

export default function GridLines({ className = "" }: GridLinesProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-20 ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, var(--gray-blue) 0, var(--gray-blue) 1px, transparent 1px, transparent 64px), repeating-linear-gradient(90deg, var(--gray-blue) 0, var(--gray-blue) 1px, transparent 1px, transparent 64px)",
      }}
    />
  );
}
