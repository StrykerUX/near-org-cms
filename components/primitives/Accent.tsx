// Span serif italic para acentuar una parte de un heading sans.
//
// El tamaño, el weight, el tracking y la compensación óptica de x-height
// (Kepler contra Montreal) viven en las utilidades `accent-serif` /
// `accent-display` y sus tokens `--text-serif--*` de globals.css — no acá.
// Antes este componente llevaba `text-[1.18em] tracking-normal` a mano: una
// constante del sistema tipográfico escondida dentro de un componente.
export default function Accent({
  display,
  children,
}: {
  display?: boolean;
  children: string;
}) {
  // `display` usa el optical master de Kepler para tamaños grandes, pensado
  // para acentos dentro de display/h1.
  return <span className={display ? "accent-display" : "accent-serif"}>{children}</span>;
}
