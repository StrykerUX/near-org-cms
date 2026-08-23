// El objeto del acto: UNA pieza isométrica que atraviesa las seis capacidades
// del protocolo cambiando de estado, en vez de seis dibujos sueltos.
//
// ── Por qué un solo objeto ─────────────────────────────────────────────────
//
// Seis figuras separadas dicen "seis cosas que NEAR tiene". Una que se
// transforma dice "un sistema, visto seis veces" — y eso es lo que el contenido
// afirma: las seis capacidades son propiedades de la MISMA red sharded.
//
// La plancha —la fila de shards— está siempre, y cada beat construye sobre
// ella. Es la constante que hace que las seis se lean como estados del mismo
// objeto y no como diapositivas.
//
// ── Qué se rehízo, y contra qué ────────────────────────────────────────────
//
// La versión anterior tenía capas correctas y mudas: una línea punteada en
// diagonal para la rotación de claves, un anillo de seis cubos para Chain
// Signatures, tres cubos verdes para la velocidad. Eran símbolos de sus
// párrafos, no explicaciones — había que leer el texto primero para saber qué
// se estaba mirando, que es exactamente al revés de para qué sirve un diagrama.
//
// El criterio nuevo, tomado del ensamble del stack de la homepage
// (`homepage-update/stackAssembly.tsx`): **verde es lo activo, el wireframe es
// la estructura que existe y no está encendida**, y el contraste entre los dos
// es lo que cuenta la historia. Ahí donde antes había un símbolo, ahora hay un
// ANTES y un DESPUÉS en el mismo cuadro:
//
//   01 Nightshade   dos planos separados y un vínculo fino entre ellos — el
//                   consenso arriba, la ejecución abajo, desacoplados
//   02 Resharding   un shard lleno hasta su umbral y el corte que lo parte en
//                   cuatro, con los testigos que lo validan
//   03 Speed        la cadencia recorriendo la fila, con la marca del bloque y
//                   la de la finalidad a dos bloques de distancia
//   04 Private      un shard macizo entre diez transparentes, y una sola
//                   ventana por la que se deja mirar
//   05 Quantum      una cuenta que no se mueve y dos claves: la que se apaga y
//                   la que se enciende
//   06 Signatures   k de n partes firmando —no todas, que es lo que significa
//                   "umbral"— y una salida hacia otras cadenas
//
// ── Cómo conmuta ───────────────────────────────────────────────────────────
//
// El estado vive en un `data-beat` del ancestro y cada capa lo lee con
// `group-data-[beat=N]`. TODAS las capas están en el DOM desde el primer paint
// y lo único que cambia es su opacidad.
//
// La alternativa era montar y desmontar el SVG por beat, y se descartó por dos
// razones: cada cambio pagaría un re-render del árbol entero —y a mitad de una
// transición de 700ms eso se ve— y las capas no podrían solaparse, que es justo
// lo que hace que la pieza se lea como una transformación y no como un pase de
// diapositivas.
//
// ── Los dos modos ──────────────────────────────────────────────────────────
//
// `live` es el del panel pegado: las capas se encienden por `data-beat`.
// `beat={n}` es el estático, para el layout en flujo —móvil sin escena, y
// `prefers-reduced-motion`— donde cada bloque de texto lleva su propia figura ya
// resuelta. Un solo archivo dibuja los dos: si el objeto cambia, cambia en los
// dos modos a la vez, que es lo que se rompe cuando hay una copia "para móvil".

import {
  GreenCube,
  IsoFrame,
  SolidCube,
  WireCube,
  isoAt,
  plane,
  planeGrid,
} from "@/components/sections/protocol-labs/isoKit";

const iso = isoAt(210, 200);

/** Las diez posiciones de la plancha. Cinco por dos: la lectura es una fila
    larga, que es la forma que tiene una red sharded en el material de NEAR. */
const SHARDS: Array<[number, number]> = [];
for (const x of [-56, -28, 0, 28, 56]) for (const y of [-16, 16]) SHARDS.push([x, y]);

/** Seis destinos sobre un anillo fuera de la plancha, para Chain Signatures. */
const RING = [0, 60, 120, 180, 240, 300].map((deg) => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r) * 104, Math.sin(r) * 104] as const;
});

// Una clase por beat, escritas literales: Tailwind v4 no ve las clases armadas
// en tiempo de ejecución, y una cadena construida acá sale del CSS sin avisar.
// El índice del array ES el beat.
const LIVE = [
  "opacity-0 transition-opacity duration-700 ease-out group-data-[beat=0]/machine:opacity-100",
  "opacity-0 transition-opacity duration-700 ease-out group-data-[beat=1]/machine:opacity-100",
  "opacity-0 transition-opacity duration-700 ease-out group-data-[beat=2]/machine:opacity-100",
  "opacity-0 transition-opacity duration-700 ease-out group-data-[beat=3]/machine:opacity-100",
  "opacity-0 transition-opacity duration-700 ease-out group-data-[beat=4]/machine:opacity-100",
  "opacity-0 transition-opacity duration-700 ease-out group-data-[beat=5]/machine:opacity-100",
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

/** Un rótulo dentro del diagrama. Mono, diminuto y en el color del trazo que
    acompaña: es la diferencia entre una figura que hay que descifrar y una que
    se explica sola. Los seis conceptos tienen vocabulario propio en la página
    —witness, threshold, finality— y repetirlo en el dibujo es lo que ata el
    diagrama a su párrafo. */
function Tag({
  iso: at,
  x,
  y,
  z = 0,
  dx = 0,
  dy = 0,
  children,
  className = "fill-cream/45",
}: {
  iso: typeof iso;
  x: number;
  y: number;
  z?: number;
  dx?: number;
  dy?: number;
  children: string;
  className?: string;
}) {
  const [cx, cy] = at(x, y, z).split(",").map(Number);
  return (
    <text
      x={cx + dx}
      y={cy + dy}
      className={`${className} stroke-none [font-family:var(--font-montreal-mono),ui-monospace,monospace] [font-size:8px] [letter-spacing:0.08em]`}
    >
      {children}
    </text>
  );
}

export default function MachineArt({
  beat = "live",
  className = "h-full w-full",
}: {
  beat?: number | "live" | "all";
  className?: string;
}) {
  const on = (layer: number) => layerClass(layer, beat);

  return (
    <IsoFrame viewBox="0 0 420 400" className={className}>
      {/* ── La plancha. Siempre presente: es el objeto del que hablan las seis
             capacidades. Se atenúa en el beat del shard privado, donde lo que
             importa es la única celda que NO deja mirar. ── */}
      <g
        className={
          beat === "live"
            ? "transition-opacity duration-700 group-data-[beat=3]/machine:opacity-30"
            : beat === 3
              ? "opacity-30"
              : ""
        }
      >
        <path d={plane(iso, 78, -14)} className="stroke-cream/20" />
        <path d={planeGrid(iso, 78, -14, 6)} className="stroke-cream/10" />
        {SHARDS.map(([x, y]) => (
          <WireCube key={`${x}:${y}`} iso={iso} x={x} y={y} s={9} className="stroke-cream/45" />
        ))}
      </g>

      {/* ── 01 · Nightshade — el consenso se despega de la ejecución ──────────
             Dos planos y el hueco entre ellos. Antes era un plano flotando con
             cuatro cubos; ahora la SEPARACIÓN es el dibujo: arriba los
             validadores, abajo la ejecución, y entre los dos un solo vínculo
             fino en vez de la columna maciza que serían si estuvieran
             acoplados. */}
      <g className={on(0)}>
        <path d={plane(iso, 78, 96)} className="stroke-cream/55" />
        <path d={planeGrid(iso, 78, 96, 5)} className="stroke-cream/15" />
        {[
          [-56, -34],
          [-19, -34],
          [19, -34],
          [56, -34],
        ].map(([x, y]) => (
          <GreenCube key={`v:${x}:${y}`} iso={iso} x={x} y={y} z={96} s={6.5} />
        ))}
        {/* El vínculo. Uno solo y punteado: lo que baja del consenso a la
            ejecución es un compromiso, no el estado entero — que es lo que
            "stateless" quiere decir. */}
        <path
          d={`M ${iso(0, 20, 96)} L ${iso(0, 20, 6)}`}
          className="stroke-cta-deep"
          strokeDasharray="3 6"
        />
        <GreenCube iso={iso} x={0} y={20} s={7} />
        <Tag iso={iso} x={-78} y={-34} z={96} dx={-4} dy={-10}>
          CONSENSUS
        </Tag>
        <Tag iso={iso} x={-78} y={16} dx={-4} dy={26}>
          EXECUTION
        </Tag>
      </g>

      {/* ── 02 · Resharding — un shard se parte al llegar a su umbral ─────────
             El dibujo trae el ANTES y el DESPUÉS: la celda llena hasta el tope
             y, encima, las cuatro en que se convierte. Y los testigos que lo
             validan, que es lo que el párrafo dice y el dibujo anterior
             callaba. */}
      <g className={on(1)}>
        {/* El shard que se llenó: macizo, contra los transparentes de al lado. */}
        <SolidCube iso={iso} x={-28} y={-16} s={9} className="text-cta-deep" />
        {/* Su umbral, marcado sobre la propia celda. */}
        <path
          d={`M ${iso(-40, -16, 20)} L ${iso(-16, -16, 20)}`}
          className="stroke-cta-lime"
        />
        <Tag iso={iso} x={-40} y={-16} z={20} dx={-46} dy={2} className="fill-cta-lime/80">
          THRESHOLD
        </Tag>
        {/* Las cuatro en que se parte, elevadas: es el después, no otra celda
            de la fila. */}
        {[
          [-38, -26],
          [-18, -26],
          [-38, -6],
          [-18, -6],
        ].map(([x, y]) => (
          <GreenCube key={`r:${x}:${y}`} iso={iso} x={x} y={y} z={54} s={5} />
        ))}
        <path d={`M ${iso(-28, -16, 50)} L ${iso(-28, -16, 22)}`} className="stroke-cta-deep" />
        {/* Los state witnesses: tres, alrededor, en wireframe. Presentes y no
            protagonistas — validan, no ejecutan. */}
        {[
          [22, -46],
          [52, -20],
          [22, 14],
        ].map(([x, y]) => (
          <g key={`w:${x}:${y}`}>
            <WireCube iso={iso} x={x} y={y} z={54} s={4.5} className="stroke-cream/40" />
            <path
              d={`M ${iso(x, y, 54)} L ${iso(-24, -16, 58)}`}
              className="stroke-cream/20"
              strokeDasharray="2 5"
            />
          </g>
        ))}
        <Tag iso={iso} x={52} y={-20} z={54} dx={12} dy={0}>
          WITNESSES
        </Tag>
      </g>

      {/* ── 03 · Speed — la cadencia, con sus dos tiempos medidos ─────────────
             Antes eran tres cubos encendidos y una regla. Ahora la regla tiene
             MARCAS con significado: un bloque cada paso, la finalidad a dos
             pasos. Los dos números que la página repite, dibujados a escala. */}
      <g className={on(2)}>
        <path d={`M ${iso(-72, -16, 52)} L ${iso(72, -16, 52)}`} className="stroke-cream/25" />
        {[-56, -28, 0, 28, 56].map((x) => (
          <path
            key={`t:${x}`}
            d={`M ${iso(x, -16, 52)} L ${iso(x, -16, 44)}`}
            className="stroke-cream/40"
          />
        ))}
        {/* Un bloque: el tramo entre dos marcas. */}
        <path d={`M ${iso(-56, -16, 48)} L ${iso(-28, -16, 48)}`} className="stroke-cta-lime" />
        <Tag iso={iso} x={-56} y={-16} z={48} dx={-2} dy={-8} className="fill-cta-lime/80">
          600ms
        </Tag>
        {/* La finalidad: dos bloques. Se dibuja debajo para que las dos escalas
            se comparen de un vistazo, que es lo único que un diagrama puede
            hacer mejor que la cifra escrita al lado. */}
        <path d={`M ${iso(-56, -16, 38)} L ${iso(0, -16, 38)}`} className="stroke-cta-deep" />
        <Tag iso={iso} x={0} y={-16} z={38} dx={6} dy={4}>
          1.2s FINAL
        </Tag>
        {/* El frente recorriendo la fila. */}
        {[-56, -28].map((x) => (
          <GreenCube key={`s:${x}`} iso={iso} x={x} y={-16} s={9} />
        ))}
      </g>

      {/* ── 04 · Private Shard — el que existe y no se deja mirar ─────────────
             La plancha se atenúa (arriba) y esta capa deja UNA celda maciza
             entre diez transparentes. El contraste es literal: los otros diez
             muestran su interior, éste no. */}
      <g className={on(3)}>
        <SolidCube iso={iso} x={0} y={16} s={11} className="text-cream" />
        {/* Su tapa, marcada: la ventana de divulgación selectiva. Un solo canto
            encendido, y sale de él una línea corta — lo que se revela cuando se
            elige revelarlo. */}
        <path d={`M ${iso(-11, 27, 22)} L ${iso(11, 27, 22)}`} className="stroke-cta-lime" />
        <path
          d={`M ${iso(11, 27, 22)} L ${iso(46, 44, 34)}`}
          className="stroke-cta-lime/60"
          strokeDasharray="3 4"
        />
        <Tag iso={iso} x={46} y={44} z={34} dx={6} dy={4} className="fill-cta-lime/80">
          SELECTIVE
        </Tag>
        <Tag iso={iso} x={0} y={16} z={26} dx={-14} dy={-12}>
          PRIVATE
        </Tag>
      </g>

      {/* ── 05 · Quantum — la cuenta no cambia, la clave rota ─────────────────
             Antes: dos cubos en esquinas opuestas y una diagonal punteada. No
             se entendía cuál era la cuenta. Ahora la cuenta está en el centro,
             quieta y encendida, y las dos claves cuelgan de ella: la vieja
             apagándose, la nueva encendida. La cuenta es la constante y se ve
             que lo es. */}
      <g className={on(4)}>
        <GreenCube iso={iso} x={0} y={0} z={62} s={9} />
        <Tag iso={iso} x={0} y={0} z={62} dx={-16} dy={-14}>
          ACCOUNT
        </Tag>
        {/* La clave que sale. */}
        <WireCube iso={iso} x={-52} y={-30} z={62} s={6} className="stroke-cream/25" />
        <path
          d={`M ${iso(-44, -26, 62)} L ${iso(-9, -4, 62)}`}
          className="stroke-cream/20"
          strokeDasharray="2 5"
        />
        <Tag iso={iso} x={-52} y={-30} z={62} dx={-28} dy={-8}>
          ED25519
        </Tag>
        {/* La que entra. */}
        <GreenCube iso={iso} x={52} y={30} z={62} s={6} />
        <path d={`M ${iso(9, 4, 62)} L ${iso(44, 26, 62)}`} className="stroke-cta-deep" />
        <Tag iso={iso} x={52} y={30} z={62} dx={12} dy={6} className="fill-cta-lime/80">
          ML-DSA
        </Tag>
      </g>

      {/* ── 06 · Chain Signatures — k de n, y una salida ──────────────────────
             El anillo entero era una constelación: seis nodos, seis líneas,
             todos iguales. Pero "umbral" significa que firman ALGUNOS, no
             todos. Acá tres de los seis están encendidos y conectados, los
             otros tres siguen en wireframe sin línea — y esa asimetría es la
             única forma de dibujar un threshold. */}
      <g className={on(5)}>
        <GreenCube iso={iso} x={0} y={0} z={34} s={9} />
        {RING.map(([x, y], i) => {
          const signing = i % 2 === 0;
          return (
            <g key={`ring:${x.toFixed(1)}:${y.toFixed(1)}`}>
              {signing && (
                <path
                  d={`M ${iso(0, 0, 34)} L ${iso(x, y, 10)}`}
                  className="stroke-cta-deep"
                />
              )}
              {signing ? (
                <GreenCube iso={iso} x={x} y={y} s={5.5} />
              ) : (
                <WireCube iso={iso} x={x} y={y} s={5.5} className="stroke-cream/30" />
              )}
            </g>
          );
        })}
        <Tag iso={iso} x={0} y={0} z={34} dx={-10} dy={-16} className="fill-cta-lime/80">
          3 of 6
        </Tag>
        {/* La salida: la firma va a otra cadena, fuera del anillo. */}
        <path
          d={`M ${iso(0, 0, 40)} L ${iso(0, 0, 96)}`}
          className="stroke-cta-lime"
          strokeDasharray="4 4"
        />
        <WireCube iso={iso} x={0} y={0} z={96} s={7} className="stroke-cta-lime/70" />
        <Tag iso={iso} x={0} y={0} z={112} dx={14} dy={0}>
          30+ CHAINS
        </Tag>
      </g>
    </IsoFrame>
  );
}
