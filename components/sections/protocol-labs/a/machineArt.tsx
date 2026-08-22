// El objeto de la alternativa B: UNA pieza isométrica que atraviesa las seis
// capacidades del protocolo cambiando de estado, en vez de seis dibujos sueltos.
//
// ── Por qué un solo objeto ─────────────────────────────────────────────────
//
// Seis figuras separadas dicen "seis cosas que NEAR tiene". Una que se
// transforma dice "un sistema, visto seis veces" — y eso es lo que el contenido
// afirma: las seis capacidades son propiedades de la MISMA red sharded. La
// alternativa A dibuja seis figuras a propósito, porque una tabla compara; B
// dibuja una sola, porque una máquina se demuestra.
//
// ── Cómo conmuta ───────────────────────────────────────────────────────────
//
// El estado vive en un `data-beat` del ancestro y cada capa lo lee con
// `group-data-[beat=N]`. O sea: TODAS las capas están en el DOM desde el primer
// paint y lo único que cambia es su opacidad y su transform.
//
// La alternativa era montar y desmontar el SVG por beat. Se descartó por dos
// razones: cada cambio de beat pagaría un re-render del árbol entero (y a mitad
// de una transición de 700ms eso se ve), y las capas no podrían solaparse —que
// es justamente lo que hace que la pieza se lea como una transformación y no
// como un pase de diapositivas.
//
// ── Los dos modos ──────────────────────────────────────────────────────────
//
// `live` es el del panel pegado: las capas se encienden por `data-beat`.
// `beat={n}` es el estático, para el layout en flujo —móvil sin escena, y
// `prefers-reduced-motion`— donde cada bloque de texto lleva su propia figura ya
// resuelta. Un solo archivo dibuja los dos: si el objeto cambia, cambia en los
// dos modos a la vez, que es exactamente lo que se rompe cuando hay una copia
// "para móvil".

import {
  GreenCube,
  IsoFrame,
  SolidCube,
  WireCube,
  isoAt,
  plane,
  planeGrid,
} from "@/components/sections/protocol-labs/isoKit";

const iso = isoAt(210, 196);

/** Las diez posiciones de la plancha. Cinco por dos: la lectura es una fila
    larga, que es la forma que tiene una red sharded en el material de NEAR. */
const SHARDS: Array<[number, number]> = [];
for (const x of [-56, -28, 0, 28, 56]) for (const y of [-16, 16]) SHARDS.push([x, y]);

/** Los seis destinos de Chain Signatures, sobre un anillo fuera de la plancha. */
const RING = [0, 60, 120, 180, 240, 300].map((deg) => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r) * 96, Math.sin(r) * 96] as const;
});

// Una clase por beat, escritas literales: Tailwind v4 no ve las clases armadas
// en tiempo de ejecución, y una cadena construida acá sale del CSS sin avisar.
// El índice del array ES el beat.
const LIVE = [
  "opacity-0 transition-all duration-700 ease-out group-data-[beat=0]/machine:opacity-100",
  "opacity-0 transition-all duration-700 ease-out group-data-[beat=1]/machine:opacity-100",
  "opacity-0 transition-all duration-700 ease-out group-data-[beat=2]/machine:opacity-100",
  "opacity-0 transition-all duration-700 ease-out group-data-[beat=3]/machine:opacity-100",
  "opacity-0 transition-all duration-700 ease-out group-data-[beat=4]/machine:opacity-100",
  "opacity-0 transition-all duration-700 ease-out group-data-[beat=5]/machine:opacity-100",
] as const;

/**
 * En el modo estático la capa de su beat se ve y las otras no existen.
 *
 * Dos valores fuera de rango con significado, y los dos se usan:
 *   · `"all"` — todas encendidas a la vez. El cierre de la página, donde la
 *     pieza ya no está explicando nada y se muestra completa.
 *   · cualquier índice que no exista (el hero pasa `-1`) — solo la plancha. Es
 *     el objeto ANTES de que la página lo interrogue, y no hace falta una capa
 *     extra para dibujarlo: es lo que queda cuando ninguna se enciende.
 */
const layerClass = (layer: number, beat: number | "live" | "all") =>
  beat === "live" ? LIVE[layer] : beat === "all" || layer === beat ? "" : "hidden";

export default function MachineArt({
  beat = "live",
  className = "h-full w-full",
}: {
  beat?: number | "live" | "all";
  className?: string;
}) {
  const on = (layer: number) => layerClass(layer, beat);

  return (
    <IsoFrame viewBox="0 0 420 380" className={className}>
      {/* ── La plancha. Siempre presente: es el objeto del que hablan las seis
             capacidades. Se atenúa solo en el beat del shard privado, donde lo
             que importa es lo que está FUERA de ella. ── */}
      <g
        className={
          beat === "live"
            ? "transition-opacity duration-700 group-data-[beat=3]/machine:opacity-25"
            : beat === 3
              ? "opacity-25"
              : ""
        }
      >
        <path d={plane(iso, 78, -14)} className="stroke-cream/20" />
        <path d={planeGrid(iso, 78, -14, 6)} className="stroke-cream/10" />
        {SHARDS.map(([x, y]) => (
          <WireCube key={`${x}:${y}`} iso={iso} x={x} y={y} s={9} className="stroke-cream/45" />
        ))}
      </g>

      {/* ── 01 · Nightshade — el consenso se despega de la ejecución ── */}
      <g className={on(0)}>
        <path d={plane(iso, 78, 92)} className="stroke-cream/60" />
        <path d={planeGrid(iso, 78, 92, 4)} className="stroke-cream/20" />
        {[
          [-52, -52],
          [52, -52],
          [-52, 52],
          [52, 52],
        ].map(([x, y]) => (
          <GreenCube key={`v:${x}:${y}`} iso={iso} x={x} y={y} z={92} s={7} />
        ))}
        <path d={`M ${iso(0, 0, 88)} L ${iso(0, 0, 24)}`} className="stroke-cta-deep" />
        <GreenCube iso={iso} x={0} y={0} z={40} s={5} />
      </g>

      {/* ── 02 · Resharding — un shard se parte en cuatro ── */}
      <g className={on(1)}>
        <path
          d={`M ${iso(-15, -31, 0)} L ${iso(15, -31, 0)} L ${iso(15, -1, 0)} L ${iso(-15, -1, 0)} Z`}
          className="stroke-cta-deep"
        />
        {[
          [-7.5, -23.5],
          [7.5, -23.5],
          [-7.5, -8.5],
          [7.5, -8.5],
        ].map(([x, y]) => (
          <GreenCube key={`r:${x}:${y}`} iso={iso} x={x} y={y} s={4.5} />
        ))}
      </g>

      {/* ── 03 · Speed — la cadencia de bloque recorriendo la fila ── */}
      <g className={on(2)}>
        {[-56, -28, 0].map((x) => (
          <GreenCube key={`s:${x}`} iso={iso} x={x} y={-16} s={9} />
        ))}
        <path d={`M ${iso(-70, -16, 46)} L ${iso(70, -16, 46)}`} className="stroke-cream/25" />
        {[-56, -28, 0, 28, 56].map((x) => (
          <path
            key={`t:${x}`}
            d={`M ${iso(x, -16, 46)} L ${iso(x, -16, 38)}`}
            className="stroke-cream/40"
          />
        ))}
        <path d={`M ${iso(0, -16, 42)} L ${iso(28, -16, 42)}`} className="stroke-cta-deep" />
      </g>

      {/* ── 04 · Private Shard — el que existe y no se ve por dentro ── */}
      <g className={on(3)}>
        <SolidCube iso={iso} x={0} y={0} s={22} className="text-cream" />
        <path d={plane(iso, 40, -22)} className="stroke-cream/25" />
        {/* La ventana de divulgación selectiva: un solo canto encendido. */}
        <path
          d={`M ${iso(-22, 22, 44)} L ${iso(22, 22, 44)}`}
          className="stroke-cta-lime"
        />
      </g>

      {/* ── 05 · Quantum — la cuenta no cambia, la clave rota ── */}
      <g className={on(4)}>
        <WireCube iso={iso} x={-76} y={-76} z={40} s={9} className="stroke-cream/25" />
        <GreenCube iso={iso} x={76} y={76} z={40} s={9} />
        <path
          d={`M ${iso(-62, -62, 52)} L ${iso(62, 62, 52)}`}
          className="stroke-cta-deep"
          strokeDasharray="4 5"
        />
      </g>

      {/* ── 06 · Chain Signatures — una cuenta, muchas cadenas ── */}
      <g className={on(5)}>
        {RING.map(([x, y]) => (
          <g key={`ring:${x.toFixed(1)}:${y.toFixed(1)}`}>
            <path d={`M ${iso(0, 0, 30)} L ${iso(x, y, 6)}`} className="stroke-cta-deep/60" />
            <WireCube iso={iso} x={x} y={y} s={7} className="stroke-cream/45" />
          </g>
        ))}
        <GreenCube iso={iso} x={0} y={0} z={22} s={9} />
      </g>
    </IsoFrame>
  );
}
