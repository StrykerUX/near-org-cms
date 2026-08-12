// La geometría de la escalera, compartida por los dos approaches nuevos (B y C).
//
// Vive acá y no en `home-v2/` porque el laboratorio es un sandbox — mismo criterio
// que el resto de `sections/lab/`. Lo que se lleve a producción cuando gane un
// approach es el mecanismo, no este archivo.
//
// ── El hallazgo que motiva este módulo ───────────────────────────────────────
// `QuantumBars` dibuja cada columna con TRES piezas: el escalón de arriba
// (`top: u·offset`, alto `u·height`), el bloque uniforme (`u·1.5` a `bottom u·1.5`)
// y el escalón espejado de abajo. Como `offset + height = 1.5` siempre, la unión de
// las tres es EXACTAMENTE un solo bloque de `top: u·offset` a `bottom: u·offset`.
//
// O sea: las tres piezas no son la figura, son una DESCOMPOSICIÓN para poder
// animarlas por separado. Y esa descomposición es la que causaba la banda gris:
// el bloque uniforme abarca las siete columnas, así que por debajo de la juntura
// la silueta es un rectángulo de ancho completo — y el scroll revela justamente esa
// zona primero. Ninguna curva, relevo ni stagger puede cambiar QUÉ FORMA ocupa esa
// área; solo cuándo aparece.
//
// De ahí que los dos approaches nuevos empiecen por fusionar las tres piezas en una
// (`STAIR_OFFSET`) y muevan el problema a otro lado: C retima el crecimiento para
// que la silueta sea proporcional en todo instante, B deja la reja quieta y anima el
// recorte de la imagen.

export const STAIR_COLUMNS = 7;

/** Alto de la franja de escalones, en unidades de `--u`. */
export const STAIR_SPAN = 1.5;

/**
 * La figura en UNA pieza por columna: cada columna es gris de `u·offset` a
 * `bottom: u·offset`. Es la unión exacta de las tres piezas de producción, así que
 * el estado final no cambia — y de paso desaparecen las dos costuras de `+1px` que
 * las piezas necesitaban entre sí.
 *
 * La columna central lleva 1.5: su gris empieza justo en la juntura, que es donde
 * hoy empieza el bloque uniforme.
 */
export const STAIR_OFFSET = [0, 0.5, 1, 1.5, 1, 0.5, 0] as const;

/**
 * La figura en TRES piezas, tal cual producción. La usa el approach C, que no toca
 * la estructura: solo el reloj.
 */
export const STAIR_CAPS: ({ offset: number; height: number } | null)[] = [
  { offset: 0, height: 1.5 },
  { offset: 0.5, height: 1 },
  { offset: 1, height: 0.5 },
  null,
  { offset: 1, height: 0.5 },
  { offset: 0.5, height: 1 },
  { offset: 0, height: 1.5 },
];

/** Offset de cada ANILLO: 0 = el par exterior, 3 = la columna central. */
export const RING_OFFSET = [0, 0.5, 1, 1.5] as const;

/** Anillo al que pertenece la columna `i`. Las 7 columnas son 4 anillos espejados. */
export const ringOf = (i: number) => Math.min(i, STAIR_COLUMNS - 1 - i);

/** `--u` en múltiplos, para escribir en estilos inline. */
export const u = (n: number) => `calc(var(--u) * ${n})`;

// ── El perfil de tallado (approach B) ────────────────────────────────────────
//
// B no anima el gris: la reja está completa y quieta desde el primer frame, y lo
// que se mueve es el borde inferior de la imagen del hero, recortada con un
// `clip-path` escalonado.
//
// Cada anillo tiene su propia profundidad, y ahí está la clave: el borde de la
// imagen NUNCA es una línea recta.
//
//   · Al inicio la imagen cuelga por DEBAJO de la juntura, más en el centro que en
//     los extremos: el borde es una escalera invertida (más honda al centro).
//   · Al final el borde es la escalera definitiva (más honda en los extremos), que
//     es exactamente donde empieza el gris de cada columna.
//
// Entre las dos el borde pasa por plano UNA sola vez, en un único frame, en vez de
// quedarse plano durante los primeros ~120px de scroll. Por eso no hay banda.
//
// El otro efecto de que el centro cuelgue: la zona de ancho completo (el "zócalo")
// no puede aparecer hasta que el recorte del centro suba hasta la juntura, así que
// el zócalo llega tarde y chico mientras la escalera ya está definida.
//
// ── La invariante que hace imposible la franja crema ─────────────────────────
// El gris de la columna `i` empieza en `u·offset` y no se mueve nunca. El borde de
// la imagen en esa columna va de `juntura + drop·(offset/1.5)` a `u·offset`, o sea
// SIEMPRE está sobre gris o por debajo de él. La imagen no puede descubrir fondo de
// página en ningún punto del recorrido — a diferencia de los approaches que movían
// el hero, donde eso había que verificarlo frame a frame.

/** Nombre de las custom properties que llevan la profundidad de cada anillo. */
const CARVE_VAR = (ring: number) => `--carve-${ring}`;

/**
 * Profundidad inicial y final de cada anillo, en unidades de `--u`, medidas desde
 * la juntura: positivo = por debajo (la imagen cuelga), negativo = por encima (la
 * imagen se retrajo y dejó ver el gris).
 *
 * `drop` es cuánto cuelga la columna CENTRAL al inicio. Es la perilla del approach:
 * más alto retrasa el zócalo pero también retrasa el primer gris visible; más bajo
 * muestra escalera antes y zócalo antes.
 */
export function carveDepths(drop: number) {
  return RING_OFFSET.map((offset) => ({
    start: drop * (offset / STAIR_SPAN),
    end: -(STAIR_SPAN - offset),
  }));
}

/** Borde izquierdo de la columna `j`, en % del ancho. `j = 7` da el borde derecho. */
const columnEdge = (j: number) => `${((j * 100) / STAIR_COLUMNS).toFixed(4)}%`;

/**
 * El `clip-path` del hero: un polígono de 16 vértices cuyo borde inferior es el
 * perfil escalonado. Las profundidades entran por custom property, así que el
 * string se escribe UNA vez y por frame solo se reescriben 4 números —sin rearmar
 * el polígono ni concatenar strings en el hot path.
 */
export function carvePolygon(): string {
  const y = (ring: number) => `calc(100% + var(${CARVE_VAR(ring)}))`;
  const points = ["0 0", "100% 0"];
  // De derecha a izquierda: por cada columna su borde derecho y su izquierdo a la
  // misma altura. Los tramos verticales entre columna y columna salen implícitos —
  // son los cantos de los escalones.
  for (let j = STAIR_COLUMNS - 1; j >= 0; j--) {
    const ring = ringOf(j);
    points.push(`${columnEdge(j + 1)} ${y(ring)}`, `${columnEdge(j)} ${y(ring)}`);
  }
  return `polygon(${points.join(", ")})`;
}

/**
 * Los valores CSS iniciales de las custom properties, en `calc(var(--u) * n)`.
 *
 * Van al estado FINAL a propósito: si el JS no corre —bundle caído,
 * `prefers-reduced-motion`, sin JS— la composición que queda es la de reposo, con la
 * escalera completa y la imagen cortada donde le corresponde. El bloque de motion
 * escribe el estado inicial en su primer frame, que es `useLayoutEffect`, o sea antes
 * del primer paint.
 */
export function carveRestVars(drop: number): Record<string, string> {
  const vars: Record<string, string> = {};
  carveDepths(drop).forEach(({ end }, ring) => {
    vars[CARVE_VAR(ring)] = u(end);
  });
  return vars;
}

/** Escribe la profundidad de un anillo, en px, sobre el elemento del hero. */
export function writeCarve(el: HTMLElement, ring: number, px: number) {
  // `setProperty` directo y no `gsap.quickSetter`: son 4 escrituras por frame de una
  // custom property, que el navegador resuelve en el style recalc que ya va a hacer.
  // quickSetter no aporta nada acá (no hay unidades que parsear ni valor previo que
  // leer) y sí agregaría una dependencia sobre cómo trata GSAP las custom properties.
  el.style.setProperty(CARVE_VAR(ring), `${px}px`);
}

/** Devuelve las custom properties al valor CSS de reposo. */
export function clearCarve(el: HTMLElement) {
  RING_OFFSET.forEach((_, ring) => el.style.removeProperty(CARVE_VAR(ring)));
}
