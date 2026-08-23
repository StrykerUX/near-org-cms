// El lápiz compartido de las tres alternativas: la proyección isométrica y las
// dos piezas con las que está dibujado todo el mundo gráfico de NEAR — el cubo
// de alambre y el cubo verde de tres caras.
//
// ── Por qué existe y por qué no es una copia de `protocol/spineDiagrams` ────
//
// Ese archivo tiene los mismos helpers, pero enterrados: son constantes locales
// de un módulo `"use client"` de 520 líneas que además construye seis
// timelines. Importarlo desde acá arrastraría GSAP a componentes que solo
// quieren dibujar un cubo quieto, y copiarlo tres veces —una por alternativa—
// garantizaría que los tres ejes isométricos se desalineen en la primera
// corrección.
//
// Acá queda solo la geometría, sin animación y sin `"use client"`: un server
// component puede dibujar con esto. Quien necesite mover algo le pone hooks
// `data-*` a sus propios paths y arma la timeline en su archivo.
//
// Si una de las tres alternativas gana, este archivo se copia con ella —igual
// que cualquier otra pieza de laboratorio— o se promueve a `primitives/` si
// para entonces lo usan también las páginas reales.

/** El eje del sitio: 30°, que es el de `stackArt` y el de los diagramas del spine. */
const COS30 = 0.866;

/**
 * Mundo (x, y, z) → punto SVG.
 *
 * `cx`/`cy` son el origen dentro del viewBox y viajan como argumento en vez de
 * ser constantes del módulo: los diagramas de estas tres páginas no comparten
 * encuadre (A los dibuja anchos y bajos, B casi cuadrados), y con un origen fijo
 * cada uno tendría que compensarlo con un `translate` que hace ilegible cualquier
 * coordenada del archivo.
 */
export const isoAt =
  (cx: number, cy: number) =>
  (x: number, y: number, z = 0) =>
    `${(cx + (x - y) * COS30).toFixed(1)},${(cy + (x + y) * 0.5 - z).toFixed(1)}`;

export type Iso = ReturnType<typeof isoAt>;

/** Un plano cuadrado centrado en el origen, a la altura z. */
export const plane = (iso: Iso, half: number, z = 0) =>
  `M ${iso(-half, -half, z)} L ${iso(half, -half, z)} L ${iso(half, half, z)} L ${iso(-half, half, z)} Z`;

/** Las líneas interiores de ese plano, como un solo path. */
export const planeGrid = (iso: Iso, half: number, z: number, n: number) => {
  const step = (half * 2) / n;
  let d = "";
  for (let i = 1; i < n; i++) {
    const t = -half + step * i;
    d += ` M ${iso(t, -half, z)} L ${iso(t, half, z)}`;
    d += ` M ${iso(-half, t, z)} L ${iso(half, t, z)}`;
  }
  return d.trim();
};

/**
 * Las tres caras visibles de un cubo de arista 2s apoyado en z.
 *
 * Todo lo que tiene forma de cubo en estas páginas sale de acá, así que el
 * orden de las caras —top, left, right— es también el orden de la rampa de
 * color de la marca (lime, mint, deep).
 */
export const cubeFaces = (iso: Iso, x: number, y: number, z: number, s: number) => ({
  top: `M ${iso(x - s, y - s, z + 2 * s)} L ${iso(x + s, y - s, z + 2 * s)} L ${iso(x + s, y + s, z + 2 * s)} L ${iso(x - s, y + s, z + 2 * s)} Z`,
  left: `M ${iso(x - s, y + s, z + 2 * s)} L ${iso(x + s, y + s, z + 2 * s)} L ${iso(x + s, y + s, z)} L ${iso(x - s, y + s, z)} Z`,
  right: `M ${iso(x + s, y + s, z + 2 * s)} L ${iso(x + s, y - s, z + 2 * s)} L ${iso(x + s, y - s, z)} L ${iso(x + s, y + s, z)} Z`,
});

type CubeGeometry = {
  iso: Iso;
  x?: number;
  y?: number;
  z?: number;
  s: number;
  className?: string;
};

// Los cubos llenos son un <g> y el de alambre es un <path>, así que el resto de
// props no puede tipar contra el mismo elemento: un `ref` de <g> pasado a un
// <path> compila hasta que alguien lo usa. Dos tipos y no uno genérico —los
// consumidores solo pasan `data-*`, y un genérico acá se paga en cada llamada.
type CubeProps = CubeGeometry &
  Omit<React.SVGProps<SVGGElement>, "x" | "y" | "z" | "s" | "className">;
type WireProps = CubeGeometry &
  Omit<React.SVGProps<SVGPathElement>, "x" | "y" | "z" | "s" | "className">;

/**
 * Cubo lleno con la rampa de la marca: lima arriba, menta a la izquierda,
 * verde profundo a la derecha. Es "esto está vivo / esto es lo activo".
 */
export function GreenCube({ iso, x = 0, y = 0, z = 0, s, className = "", ...rest }: CubeProps) {
  const f = cubeFaces(iso, x, y, z, s);
  return (
    <g className={className} {...rest}>
      <path d={f.top} className="fill-cta-lime stroke-none" />
      <path d={f.left} className="fill-cta-mint stroke-none" />
      <path d={f.right} className="fill-cta-deep stroke-none" />
    </g>
  );
}

/**
 * Cubo de alambre: estructura, capacidad, lo que todavía no está encendido.
 *
 * `className` define el trazo del contorno y por eso llega como prop con
 * default en vez de estar fijo: sobre crema el hairline tiene que ser oscuro y
 * sobre ink, claro, y el mismo cubo se dibuja en las dos.
 */
export function WireCube({
  iso,
  x = 0,
  y = 0,
  z = 0,
  s,
  className = "stroke-cream/40",
  ...rest
}: WireProps) {
  const f = cubeFaces(iso, x, y, z, s);
  return <path d={`${f.top} ${f.left} ${f.right}`} fill="none" className={className} {...rest} />;
}

/**
 * Cubo lleno de un solo tono. El estado que a las dos piezas de arriba les
 * falta: presente y sólido, pero apagado — el shard privado, que existe y no se
 * ve por dentro.
 */
export function SolidCube({ iso, x = 0, y = 0, z = 0, s, className = "", ...rest }: CubeProps) {
  const f = cubeFaces(iso, x, y, z, s);
  return (
    <g className={className} {...rest}>
      <path d={f.top} className="fill-current opacity-100" />
      <path d={f.left} className="fill-current opacity-70" />
      <path d={f.right} className="fill-current opacity-45" />
    </g>
  );
}

/**
 * Marco compartido. `strokeWidth={1}` va acá y no en cada path porque el grosor
 * del hairline es una propiedad del dibujo entero: si un diagrama lo sube, se
 * nota al lado del de al lado.
 *
 * `vectorEffect="non-scaling-stroke"` NO se pone: el SVG escala con su caja y
 * un hairline que no escala se engorda ópticamente en los tamaños chicos, que
 * es justo donde estos diagramas viven en móvil.
 */
export function IsoFrame({
  viewBox = "0 0 320 200",
  className = "h-full w-full",
  children,
  ...rest
}: {
  viewBox?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.SVGProps<SVGSVGElement>, "viewBox" | "className" | "children">) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}
