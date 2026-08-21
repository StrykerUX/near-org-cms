"use client";

import {
  ColumnGreen,
  ColumnWire,
  AiRingGreen,
  AiRingWire,
  IntentsGreen,
  IntentsWire,
  NearcomGreen,
  NearcomWire,
} from "@/components/sections/home-ab9/stackArt.generated";

// El ENSAMBLE, sin layout y sin escena: las cuatro capas, sus sombras, el mark
// de NEAR y las reglas de iluminación. Es lo único que las cinco variantes de
// este laboratorio comparten.
//
// ── Por qué esto sí es compartido y las secciones no ────────────────────────
//
// La decisión del lab fue explícita: cinco COPIAS de la sección, editables por
// separado, con el precio asumido de que un ajuste hay que hacerlo cinco veces.
// Eso vale para lo que cada variante decide —el layout, el recorrido, dónde
// vive el texto—, que es justo lo que se está comparando.
//
// El ensamble no es eso. Es geometría medida contra los exports de brand: las
// x salen de las máscaras horneadas (el canal de la columna está en x=275.81 en
// la cáscara exterior, 221.07 en la de AI y 133.44 en la de Intents, mismo
// ancho 103u ⇒ escala 1:1) y las y están estimadas contra los stills. Copiar
// eso cinco veces no da cinco versiones para elegir: da cinco sitios donde el
// mismo número puede estar mal.
//
// ── Qué NO trae, respecto de `home-ab7/NearStackV2` ─────────────────────────
//
// Los cubos partidos. En el original, el hover sobre la columna la parte en sus
// seis cubos y cada uno es un feature del protocolo, con su corredor de hover
// por posición Y y su caja de texto. Es lo que más código arrastra y quedó
// fuera del lab por decisión: si una variante gana, se le vuelve a enchufar.
//
// Lo que sí conserva: el build-up por capa, el hover de capa y de producto de
// AI (lo hovereado verde, el resto de lo visible en wireframe), las sombras que
// la columna proyecta sobre cada anillo, y el mark apoyado en la cara superior.

/* ── Geometría del ensamble (espacio de la capa exterior, 695 de ancho) ──── */

export const STAGE_W = 695;
export const STAGE_H = 650;

// x exactas (máscaras); y estimadas de los stills.
const POS = {
  column: { x: 275.81, y: 0, w: 104 },
  intents: { x: 142.37, y: 206, w: 371 },
  ai: { x: 54.74, y: 127, w: 546 },
  nearcom: { x: 0, y: 40, w: 695 },
} as const;

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

const layerStyle = (k: keyof typeof POS) => ({
  left: pct(POS[k].x, STAGE_W),
  top: pct(POS[k].y, STAGE_H),
  width: pct(POS[k].w, STAGE_W),
});

/* ── El mark de NEAR, acostado sobre la cara superior del cubo de arriba ─── */

// La cara superior del cubo 0 es un rombo: L (izquierda) más la base U = L→T y
// V = L→B. Proyectar el mark con esa base afín ES apoyarlo en el plano de la
// cara, con la perspectiva del iso ya horneada en las aristas.
const FACE_L = { x: 0.305, y: 30.865 };
const FACE_U = { x: 51.28, y: -30.56 };
const FACE_V = { x: 51.28, y: 31.04 };
const MARK_VB = { x: 108, y: 108, size: 351 };
const MARK_SCALE = 0.56;
const MARK_TRANSFORM = (() => {
  const inset = (1 - MARK_SCALE) / 2;
  const a = (FACE_U.x * MARK_SCALE) / MARK_VB.size;
  const b = (FACE_U.y * MARK_SCALE) / MARK_VB.size;
  const c = (FACE_V.x * MARK_SCALE) / MARK_VB.size;
  const d = (FACE_V.y * MARK_SCALE) / MARK_VB.size;
  const e = FACE_L.x + (FACE_U.x + FACE_V.x) * inset - a * MARK_VB.x - c * MARK_VB.y;
  const f = FACE_L.y + (FACE_U.y + FACE_V.y) * inset - b * MARK_VB.x - d * MARK_VB.y;
  return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
})();
const NEAR_MARK_D =
  "m421.61,108c-13,0-25.07,6.74-31.88,17.82l-73.37,108.93c-2.39,3.59-1.42,8.43,2.17,10.82,2.91,1.94,6.76,1.7,9.41-.58l72.22-62.64c1.2-1.08,3.05-.97,4.13.23.49.55.75,1.26.75,1.99v196.12c0,1.62-1.31,2.92-2.93,2.92-.87,0-1.69-.38-2.24-1.05L181.56,121.24c-7.11-8.39-17.55-13.23-28.54-13.24h-7.63c-20.65,0-37.39,16.74-37.39,37.39v276.22c0,20.65,16.74,37.39,37.39,37.39,13,0,25.07-6.74,31.88-17.82l73.37-108.93c2.39-3.59,1.42-8.43-2.17-10.82-2.91-1.94-6.76-1.7-9.41.58l-72.22,62.64c-1.2,1.08-3.05.97-4.13-.23-.49-.55-.75-1.26-.74-1.99v-196.17c0-1.62,1.31-2.92,2.93-2.92.86,0,1.69.38,2.24,1.05l218.28,261.37c7.11,8.39,17.55,13.23,28.54,13.24h7.63c20.65.01,37.4-16.72,37.42-37.37V145.39c0-20.65-16.74-37.39-37.39-37.39Z";

/* ── Las sombras de la columna sobre cada anillo ──────────────────────────── */

// Los 7 parches venían horneados en los svg verdes (multiply + pattern). Acá
// los horneados se apagan (`data-stack-noshadow` en el stage) y estos son SU
// reemplazo 1:1 — mismas coords, mismos patterns (`url(#…)` resuelve contra los
// defs de las instancias ya montadas).
const COLUMN_SHADOWS = {
  ai: {
    viewBox: "0 0 546 443",
    base: [{ x: 185.14, y: 281.23, w: 175.2, h: 161.28, fill: "ag-pattern0_11_498", op: 0.46 }],
    top: [{ x: 176.98, y: -49.0098, w: 191.52, h: 166.56, fill: "ag-pattern1_11_498", op: 0.46 }],
  },
  intents: {
    viewBox: "0 0 371 248",
    base: [
      { x: 97.36, y: 109.49, w: 108.96, h: 137.76, fill: "ig-pattern0_11_549", op: 0.42 },
      { x: 163.6, y: 109.49, w: 108.96, h: 137.76, fill: "ig-pattern1_11_549", op: 0.42 },
    ],
    top: [{ x: 89.55, y: -44.1899, w: 191.04, h: 161.76, fill: "ig-pattern2_11_549", op: 0.46 }],
  },
  nearcom: {
    viewBox: "0 0 695 604",
    base: [{ x: 239.7, y: 442.146, w: 175.2, h: 161.76, fill: "ng-pattern0_11_436", op: 0.46 }],
    top: [{ x: 231.463, y: -46.0137, w: 191.52, h: 174.72, fill: "ng-pattern1_11_436", op: 0.46 }],
  },
} as const;

function ColumnShadows({
  ring,
  className,
}: {
  ring: keyof typeof COLUMN_SHADOWS;
  className: string;
}) {
  const s = COLUMN_SHADOWS[ring];
  return (
    <svg viewBox={s.viewBox} aria-hidden="true" className={className}>
      {(["base", "top"] as const).map((when) =>
        s[when].map((r) => (
          <g key={`${when}-${r.fill}`} data-shadow-when={when}>
            <g style={{ mixBlendMode: "multiply" }} opacity={r.op}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={`url(#${r.fill})`} />
            </g>
          </g>
        ))
      )}
    </svg>
  );
}

/* ── El recorrido y el hover ──────────────────────────────────────────────── */

export type StackStop =
  | "protocol"
  | "intents"
  | "ai"
  | "ironclaw"
  | "cloud"
  | "market"
  | "nearcom";

// El orden narrativo del build-up = el orden de las paradas. "ai" es la llegada
// al anillo completo (los TRES productos encendidos a la vez); recién después
// el recorrido entra a los tres productos de a uno.
export const STAGE_ORDER: readonly StackStop[] = [
  "protocol",
  "intents",
  "ai",
  "ironclaw",
  "cloud",
  "market",
  "nearcom",
];

export const SEG_KEYS = ["ironclaw", "cloud", "market"] as const;

export type StackHover =
  | { kind: "layer"; key: "protocol" | "intents" | "nearcom" }
  | { kind: "seg"; key: (typeof SEG_KEYS)[number] }
  /** Un cubo de la columna partida: índice 0 (arriba) … 5 (abajo). */
  | { kind: "cube"; index: number }
  | null;

export const SEG_NAMES: Record<string, string> = {
  ironclaw: "IronClaw",
  cloud: "NEAR AI Cloud",
  market: "Agent Market",
};

export const LAYER_NAMES: Record<string, string> = {
  protocol: "NEAR Protocol",
  intents: "NEAR Intents",
  nearcom: "near.com",
};

// El z-layering de la columna: el cubo de ARRIBA es la capa más alta del
// ensamble y el de ABAJO la más baja. La columna se pinta DOS veces — los cubos
// 3–5 debajo de los anillos, los 0–2 encima — y las máscaras de los anillos (que
// ya recortan el canal de la columna) hacen que las dos mitades calcen con la
// composición madre.
const HIDE_UPPER_CUBES =
  '[&_[data-stack-cube="0"]]:hidden [&_[data-stack-cube="1"]]:hidden [&_[data-stack-cube="2"]]:hidden';
const HIDE_LOWER_CUBES =
  '[&_[data-stack-cube="3"]]:hidden [&_[data-stack-cube="4"]]:hidden [&_[data-stack-cube="5"]]:hidden';

export type StackAssemblyProps = {
  /** Índice en STAGE_ORDER. -1 = todavía no arrancó el recorrido (solo la columna). */
  stage: number;
  hover: StackHover;
  className?: string;
};

/**
 * Las cuatro capas apiladas, con su iluminación derivada de `stage` y `hover`.
 *
 * El apilado (idéntico al de `NearStackV2`): copias de fondo CONTINUAS de los
 * anillos al fondo de todo, mitad BAJA de la columna encima, anillos
 * enmascarados encima (el frente que envuelve a la columna), y la mitad ALTA
 * por encima de todo — el cubo de arriba es la capa más alta.
 *
 * `overflow-visible` en las copias de fondo: el vértice superior de la cáscara
 * vive en y NEGATIVA del viewBox, y sin máscara el clip por defecto del svg lo
 * cortaba CHATO en vez de terminar en punta.
 */
export default function StackAssembly({ stage, hover, className = "" }: StackAssemblyProps) {
  const showIntents = stage >= 1;
  const showAi = stage >= 2;
  const showNearcom = stage >= 6;

  // `key` solo existe en dos de las tres variantes del hover: el cubo se
  // identifica por índice.
  const hoverTarget = hover && "key" in hover ? hover.key : null;

  // Hover sobre cualquier pieza: solo lo hovereado verde, el resto de lo
  // visible cae a wireframe. Sin hover, lo acumulado va verde.
  //
  // Un cubo hovereado cuenta como columna: la pieza bajo el cursor ES la
  // columna, partida. Bajarla a wireframe ahí sería apagar justo lo que se
  // está señalando.
  const litColumn = hover ? hover.kind === "cube" || hoverTarget === "protocol" : true;
  const litIntents = showIntents && (hover ? hoverTarget === "intents" : true);
  const litNearcom = showNearcom && (hover ? hoverTarget === "nearcom" : true);

  const layerClass = (visible: boolean) =>
    `pointer-events-none absolute transition-opacity duration-500 motion-reduce:transition-none [&_path]:transition-[fill-opacity,stroke-opacity] [&_path]:duration-300 ${
      visible ? "opacity-100 [&_path]:pointer-events-auto" : "opacity-0"
    }`;

  // Las copias de FONDO de los anillos: mismas capas pintadas DEBAJO de todos
  // los cubos y con la máscara del canal apagada (`data-stack-unmask`) — son el
  // anillo CONTINUO que se ve detrás. Sin hit-area nunca: el hover en el canal
  // es de los cubos.
  const backClass = (visible: boolean) =>
    `pointer-events-none absolute transition-opacity duration-500 motion-reduce:transition-none [&_path]:transition-[fill-opacity,stroke-opacity] [&_path]:duration-300 ${
      visible ? "opacity-100" : "opacity-0"
    }`;

  const greenClass = (lit: boolean) =>
    `absolute left-0 top-0 w-full transition-opacity duration-300 motion-reduce:transition-none ${
      lit ? "opacity-100" : "opacity-0"
    }`;

  return (
    <div
      data-stack-noshadow
      className={`relative aspect-[695/650] [&_path]:cursor-pointer ${className}`}
    >
      <div data-stack-unmask className={backClass(showIntents)} style={layerStyle("intents")}>
        <IntentsWire className="w-full overflow-visible" />
        <IntentsGreen className={`${greenClass(litIntents)} overflow-visible`} />
      </div>
      <div data-stack-unmask className={backClass(showAi)} style={layerStyle("ai")}>
        <AiRingWire className="w-full overflow-visible" />
        {/* `data-ai-green` también acá: el efecto de segmentos ilumina TODAS
            las instancias, así el fondo y el frente del anillo coinciden. */}
        <div data-ai-green>
          <AiRingGreen className="absolute left-0 top-0 w-full overflow-visible" />
        </div>
      </div>
      <div data-stack-unmask className={backClass(showNearcom)} style={layerStyle("nearcom")}>
        <NearcomWire className="w-full overflow-visible" />
        <NearcomGreen className={`${greenClass(litNearcom)} overflow-visible`} />
      </div>

      <div
        data-stack-layer="protocol"
        className={`${layerClass(true)} ${HIDE_UPPER_CUBES}`}
        style={layerStyle("column")}
      >
        <ColumnWire className="w-full overflow-visible" />
        <ColumnGreen className={`${greenClass(litColumn)} overflow-visible`} />
      </div>

      {/* Cada sombra va en un wrapper hermano JUSTO DEBAJO de su anillo:
          multiplica sobre la columna y el fondo, y los brazos frontales del
          anillo pintan ENCIMA, limpios. */}
      <div className={backClass(showIntents)} style={layerStyle("intents")}>
        <ColumnShadows ring="intents" className={greenClass(litIntents)} />
      </div>
      <div
        data-stack-layer="intents"
        className={layerClass(showIntents)}
        style={layerStyle("intents")}
      >
        <IntentsWire className="w-full" />
        <IntentsGreen className={greenClass(litIntents)} />
      </div>

      {/* Como su horneada, la sombra de AI no depende del lit por segmento:
          visible siempre que la capa lo sea. */}
      <div className={backClass(showAi)} style={layerStyle("ai")}>
        <ColumnShadows ring="ai" className="absolute left-0 top-0 w-full" />
      </div>
      <div data-stack-layer="ai" className={layerClass(showAi)} style={layerStyle("ai")}>
        <AiRingWire className="w-full" />
        <div data-ai-green>
          <AiRingGreen className="absolute left-0 top-0 w-full" />
        </div>
      </div>

      <div className={backClass(showNearcom)} style={layerStyle("nearcom")}>
        <ColumnShadows ring="nearcom" className={greenClass(litNearcom)} />
      </div>
      <div
        data-stack-layer="nearcom"
        className={layerClass(showNearcom)}
        style={layerStyle("nearcom")}
      >
        <NearcomWire className="w-full" />
        <NearcomGreen className={greenClass(litNearcom)} />
      </div>

      <div
        data-stack-layer="protocol"
        className={`${layerClass(true)} ${HIDE_LOWER_CUBES}`}
        style={layerStyle("column")}
      >
        <ColumnWire className="w-full overflow-visible" />
        <ColumnGreen className={`${greenClass(litColumn)} overflow-visible`} />
        {/* El mark sobre la cara superior. SIEMPRE visible y negro pleno: no
            funde con el verde ni se atenúa cuando la columna cae a wireframe.
            `pointerEvents: none` inline gana al `[&_path]` del stage — el
            hit-area sigue siendo el arte de abajo. */}
        <svg
          viewBox="0 0 104 634"
          aria-hidden="true"
          className="absolute left-0 top-0 w-full overflow-visible"
        >
          <g data-stack-cube="0" data-stack-logo>
            <path
              d={NEAR_MARK_D}
              transform={MARK_TRANSFORM}
              fill="#101010"
              fillOpacity="0.85"
              style={{ pointerEvents: "none" }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
