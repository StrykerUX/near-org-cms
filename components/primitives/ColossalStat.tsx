// Número gigante "sin caja" — mecánica firma del Proof de Ondo (números
// dominando la pantalla sobre fondo liso, sin card/borde/sombra) y reusada
// en Sui (sans, sin itálica) y varios híbridos. Distinto de `StatCallout`
// (que pone value+label en una sola línea inline, pensado para Phantom
// dentro de una GlassCard): acá value y label van apilados.
//
// `text-display` y no `text-poster`: `text-poster` es `clamp(3.2rem, 15.4vw,
// 18rem)` — pensado para UNA palabra ocupando casi todo el viewport (ver
// `--text-kicker-xl`/`--text-poster` en globals.css), no para un valor
// dentro de una celda de grid de 4 columnas. A ese tamaño, "$20B+" no entra
// en ~350px de columna y se corta/desborda. `text-display` tiene el mismo
// espíritu "colosal" pero techa en 8rem en vez de 18rem.
const TONE = {
  ink: "text-ink",
  green: "text-near-green",
  cream: "text-cream",
} as const;

export type ColossalStatProps = {
  value: string;
  label: string;
  tone?: keyof typeof TONE;
};

export default function ColossalStat({ value, label, tone = "ink" }: ColossalStatProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`text-display text-pretty ${TONE[tone]}`}>{value}</span>
      <span className="text-caption-mono uppercase text-gray-intermediate">{label}</span>
    </div>
  );
}
