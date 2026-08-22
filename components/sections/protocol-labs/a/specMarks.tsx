// Las seis figuras de la tabla de especificación de la alternativa A.
//
// ── Por qué no se mueven solas ──────────────────────────────────────────────
//
// Los diagramas del spine de la página viva construyen una timeline cada uno y
// se disparan al abrir la card. Acá las seis filas están abiertas a la vez —esa
// es la tesis de A, nada oculto— y seis timelines corriendo en la misma pantalla
// se anulan entre sí: no hay dónde mirar.
//
// Así que el estado vivo se enciende por FILA y con CSS: en reposo la figura
// está en su estado apagado, y `group-hover/row` / `group-focus-within/row` la
// resuelven. La consecuencia buscada es que el lector controla el ritmo, y la
// colateral es que la tabla entera funciona sin JS.
//
// Todas comparten viewBox y origen, así que el eje isométrico es el mismo en
// las seis y las figuras se leen como partes de un mismo dibujo técnico.

import {
  GreenCube,
  IsoFrame,
  SolidCube,
  WireCube,
  isoAt,
  plane,
  planeGrid,
} from "@/components/sections/protocol-labs/isoKit";

const VB = "0 0 320 180";
const iso = isoAt(160, 92);

// El hairline de la figura. Sobre el blanco de la tabla el trazo es tinta; la
// celda oscura del shard privado lo invierte con `text-*` sobre el grupo.
const HAIR = "stroke-ink/35";
const HAIR_SOFT = "stroke-ink/15";

// Lo que se enciende al recorrer la fila. Una sola cadena, repetida en las seis,
// para que las seis suban al mismo tiempo y con la misma curva.
const LIVE = "opacity-40 transition-opacity duration-700 group-hover/row:opacity-100 group-focus-within/row:opacity-100";

/* ── 01 · Nightshade 3.0 — el consenso se despega de la ejecución ──────────── */

function NightshadeMark() {
  const LIFT = 52;
  return (
    <IsoFrame viewBox={VB}>
      <path d={plane(iso, 52, 0)} className={HAIR} />
      <path d={planeGrid(iso, 52, 0, 3)} className={HAIR_SOFT} />
      <g className={LIVE}>
        <path d={plane(iso, 52, LIFT)} className="stroke-ink/50" />
        <path d={planeGrid(iso, 52, LIFT, 3)} className={HAIR_SOFT} />
        {[
          [-26, -26],
          [26, -26],
          [-26, 26],
          [26, 26],
        ].map(([x, y]) => (
          <GreenCube key={`${x}:${y}`} iso={iso} x={x} y={y} z={LIFT} s={5} />
        ))}
        {/* El testigo de estado: lo único que cruza entre las dos capas. */}
        <path d={`M ${iso(0, 0, LIFT - 4)} L ${iso(0, 0, 3)}`} className="stroke-cta-deep" />
      </g>
    </IsoFrame>
  );
}

/* ── 02 · Dynamic resharding — un shard se parte al llegar a su umbral ─────── */

function ReshardingMark() {
  return (
    <IsoFrame viewBox={VB}>
      <path d={plane(iso, 54, 0)} className={HAIR} />
      <path d={planeGrid(iso, 54, 0, 2)} className={HAIR_SOFT} />
      {/* El cuadrante que se subdividió. Va con su propia grilla más fina —no
          con un color— porque lo que cambió es la GEOMETRÍA de la red, no el
          estado de una pieza. */}
      <g className={LIVE}>
        <path d={planeGrid(iso, 27, 0, 2)} className="stroke-ink/45" />
        <path
          d={`M ${iso(-27, -27, 0)} L ${iso(27, -27, 0)} L ${iso(27, 27, 0)} L ${iso(-27, 27, 0)} Z`}
          className="stroke-cta-deep"
        />
        <GreenCube iso={iso} x={-13.5} y={-13.5} s={5} />
        <GreenCube iso={iso} x={13.5} y={13.5} s={5} />
      </g>
    </IsoFrame>
  );
}

/* ── 03 · Speed. Scale. Access. — la cadencia de bloque ────────────────────── */

function SpeedMark() {
  // Seis posiciones sobre una misma diagonal: los bloques ya cerrados van
  // llenos, los que faltan de alambre. Es el mismo dibujo que un diagrama de
  // tiempo, en la geometría de la página.
  const slots = [-45, -27, -9, 9, 27, 45];
  return (
    <IsoFrame viewBox={VB}>
      <path d={`M ${iso(-56, 0, 0)} L ${iso(56, 0, 0)}`} className={HAIR} />
      {slots.map((x, i) => (
        <g key={x}>
          {i < 3 ? (
            <g className={i === 2 ? LIVE : undefined}>
              <GreenCube iso={iso} x={x} y={0} s={6} />
            </g>
          ) : (
            <WireCube iso={iso} x={x} y={0} s={6} className={HAIR} />
          )}
        </g>
      ))}
      {/* La marca de finalidad: dos bloques después del último lleno. */}
      <g className={LIVE}>
        <path d={`M ${iso(9, 0, 26)} L ${iso(9, 0, 16)}`} className="stroke-cta-deep" />
      </g>
    </IsoFrame>
  );
}

/* ── 04 · Private Shard — diez a la vista, uno cerrado ─────────────────────── */

function PrivateMark() {
  const cols = [-44, -22, 0, 22, 44];
  return (
    <IsoFrame viewBox={VB}>
      <path d={plane(iso, 58, -8)} className="stroke-cream/25" />
      {cols.map((x) =>
        [-16, 16].map((y) => (
          <WireCube key={`${x}:${y}`} iso={iso} x={x} y={y} s={7} className="stroke-cream/40" />
        ))
      )}
      {/* El privado no está apagado: está LLENO y opaco. Un shard vacío diría
          "todavía no existe"; este existe y no se ve por dentro. */}
      <g className={LIVE}>
        <SolidCube iso={iso} x={0} y={46} s={9} className="text-cream" />
        <path
          d={`M ${iso(-30, 46, 0)} L ${iso(30, 46, 0)}`}
          className="stroke-cream/30"
        />
      </g>
    </IsoFrame>
  );
}

/* ── 05 · Quantum security — la cuenta no cambia, la clave sí ──────────────── */

function QuantumMark() {
  return (
    <IsoFrame viewBox={VB}>
      {/* La cuenta: la pieza grande, que no se toca. */}
      <WireCube iso={iso} x={0} y={0} s={22} className="stroke-ink/45" />
      <path d={plane(iso, 46, -22)} className={HAIR_SOFT} />
      {/* Las dos claves, a los lados: la vieja se apaga, la nueva se enciende,
          y la cuenta entre ellas queda igual. */}
      <g className={LIVE}>
        <WireCube iso={iso} x={-46} y={-46} z={6} s={7} className="stroke-ink/25" />
        <GreenCube iso={iso} x={46} y={46} z={6} s={7} />
        <path
          d={`M ${iso(-34, -34, 12)} L ${iso(34, 34, 12)}`}
          className="stroke-cta-deep"
          strokeDasharray="3 4"
        />
      </g>
    </IsoFrame>
  );
}

/* ── 06 · Chain Signatures — una cuenta, muchas cadenas ────────────────────── */

function SignaturesMark() {
  // Seis destinos sobre un anillo isométrico. Seis y no treinta: el dibujo dice
  // "muchas", el número exacto lo dice el texto de al lado.
  const ring = [0, 60, 120, 180, 240, 300].map((deg) => {
    const r = (deg * Math.PI) / 180;
    return [Math.cos(r) * 50, Math.sin(r) * 50] as const;
  });
  return (
    <IsoFrame viewBox={VB}>
      <path d={plane(iso, 56, 0)} className={HAIR_SOFT} />
      {ring.map(([x, y]) => (
        <g key={`${x.toFixed(1)}:${y.toFixed(1)}`}>
          <path d={`M ${iso(0, 0, 6)} L ${iso(x, y, 4)}`} className={HAIR_SOFT} />
          <WireCube iso={iso} x={x} y={y} s={5} className={HAIR} />
        </g>
      ))}
      <g className={LIVE}>
        <GreenCube iso={iso} x={0} y={0} s={9} />
        {ring.map(([x, y]) => (
          <path
            key={`live:${x.toFixed(1)}`}
            d={`M ${iso(0, 0, 6)} L ${iso(x, y, 4)}`}
            className="stroke-cta-deep"
          />
        ))}
      </g>
    </IsoFrame>
  );
}

// Emparejado por el `id` de `CAPABILITIES`, no por posición: reordenar la lista
// de contenido no puede desalinear las figuras.
export const SPEC_MARKS: Record<string, () => React.ReactElement> = {
  nightshade: NightshadeMark,
  resharding: ReshardingMark,
  speed: SpeedMark,
  "private-shard": PrivateMark,
  quantum: QuantumMark,
  "chain-signatures": SignaturesMark,
};
