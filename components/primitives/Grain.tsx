// Textura de grano — ruido sutil sobre superficies planas, mecánica que
// varias de las referencias del laboratorio (sobre todo Midu.design) usan
// para que un `bg-ink` liso no se sienta genérico. SVG `feTurbulence` como
// data URI, tileable, sin pedir ningún asset — puro CSS, mismo criterio que
// los gradientes literales de `ZigguratDivider`/`StackAnchors`.
//
// El caller envuelve en `relative overflow-hidden`; esto es un
// `absolute inset-0` puramente decorativo (`aria-hidden`, `pointer-events-none`).
const NOISE_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

export type GrainProps = {
  opacity?: number;
  className?: string;
};

export default function Grain({ opacity = 0.05, className = "" }: GrainProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 mix-blend-overlay ${className}`}
      style={{ backgroundImage: `url("${NOISE_SVG}")`, opacity }}
    />
  );
}
