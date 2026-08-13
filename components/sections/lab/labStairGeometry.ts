// La geometría de la escalera, compartida por los dos approaches nuevos (B y C).
//
// Vive acá y no en `home-v2/` porque el laboratorio es un sandbox — mismo criterio
// que el resto de `sections/lab/`. Lo que se lleve a producción cuando gane un
// approach es el mecanismo, no este archivo.
//
// Lo que sí salió ya de acá son las dos piezas que NO son geometría del descenso:
// `softFloor` y `hermiteRamp` viven en `components/primitives/motion/`, porque son
// matemática de animación que otras escenas del sitio también necesitaban —tres la
// habían reinventado por su cuenta— y no tenían dónde buscarla. Lo que queda en este
// archivo es lo específico: siete columnas, cuatro anillos y una juntura.
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
// (`stairOffsets`) y muevan el problema a otro lado: C retima el crecimiento para
// que la silueta sea proporcional en todo instante, B deja la reja quieta y anima el
// recorte de la imagen.

import { hermiteRamp } from "@/components/primitives/motion/velocityRamp";
import { softFloor } from "@/components/primitives/motion/softFloor";

export const STAIR_COLUMNS = 7;

/**
 * Alto de la franja de escalones, en unidades de `--u`. Es la profundidad de la FIGURA:
 * con `depth` la escalera baja `depth · u` desde el borde superior de la columna
 * exterior hasta el valle central, en tres saltos de `depth · u / 3`.
 *
 * Producción usa 1.5, o sea saltos de `u · 0.5` = 134px a 1877px de ancho. El approach
 * B lo sube porque "escalones más pronunciados" es, literalmente, esto — y no algo que
 * la curva del reveal pueda simular: la curva decide a qué velocidad se llega al salto
 * final, nunca cuánto mide.
 *
 * Lo que crece con `depth`, y hay que tenerlo presente antes de subirlo:
 *
 *   depth   salto final   la escalera muerde…   alto de la sección
 *   1.50      134px         402px del hero        1273px
 *   2.00      179px         536px                 1541px
 *   2.25      201px         603px                 1675px   ← el valor del approach B
 *   2.50      223px         670px (64% del hero)  1809px
 *
 * El vídeo NO tiene que crecer con `depth` (el excedente lo fija `drop`, ver abajo), así
 * que profundizar la figura no cuesta reencuadre.
 */
export const STAIR_SPAN = 1.5;

/**
 * La profundidad del approach B: `u` por escalón, o sea la cascada a 45° — cada salto
 * mide exactamente el ancho de una columna. Es el doble que producción.
 *
 * Vive acá y no en un componente porque `LabBarsStatic` (que dibuja el gris) y
 * `LabHeroCarve` (que recorta la imagen) tienen que usar el MISMO número: si discrepan,
 * el recorte deja de coincidir con el borde del gris y reaparece la franja crema que
 * este approach hace imposible. Con el defecto en un solo sitio, no pueden separarse
 * salvo que alguien les pase valores distintos a mano — y para eso `DescentTalla` le pasa
 * el mismo a los dos.
 *
 * Ya no hay techo duro: el recorte vive en un lienzo aparte de la copy (ver el punto 3
 * del docblock de `LabHeroCarve`), así que una escalera profunda no puede cortar el
 * texto. Lo que sí pasa al subirlo es que el corte del anillo 2 —las columnas que cruza
 * el texto— sube: a `100svh − depth·u/3`, o sea 782px a depth 3.0 contra los 736px donde
 * termina el subtítulo. Pasado ~3.2, el statement del hero queda sobre gris en vez de
 * sobre crema: es un asunto de contraste, no de texto cortado.
 */
export const STAIR_DEPTH = 3;

/**
 * La figura en UNA pieza por columna: cada columna es gris de `u·offset` a
 * `bottom: u·offset`. Con `depth = 1.5` es la unión exacta de las tres piezas de
 * producción, así que el estado final no cambia — y de paso desaparecen las dos costuras
 * de `+1px` que las piezas necesitaban entre sí.
 *
 * La columna central lleva `depth`: su gris empieza justo en la juntura, que es donde hoy
 * empieza el bloque uniforme.
 */
export function stairOffsets(depth = STAIR_SPAN): number[] {
  const step = depth / 3;
  return [0, step, step * 2, depth, step * 2, step, 0];
}

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

export const STAIR_RINGS = 4;

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
// la imagen en esa columna va de `juntura + drop·r/3` a `u·offset`, o sea SIEMPRE
// está sobre gris o por debajo de él. La imagen no puede descubrir fondo de
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
export function carveDepths(drop: number, depth = STAIR_SPAN) {
  // `start` sale independiente de `depth`: el anillo r arranca a `drop · r/3` por debajo
  // de la juntura, así que el excedente de vídeo que hace falta es siempre `drop · u`,
  // sea la escalera profunda o no.
  //
  // `end` es el tope de la figura FORMADA: donde se detiene cada columna si no hay
  // cierre. Lo usan el modo `?converge=0` y el estado de reposo en CSS. En el modo
  // normal el tope no es este —es una línea del viewport— y lo calcula `LabHeroCarve`,
  // porque depende del scroll y no de la geometría.
  return Array.from({ length: STAIR_RINGS }, (_, ring) => ({
    start: (drop * ring) / 3,
    end: -(depth * (STAIR_RINGS - 1 - ring)) / 3,
  }));
}

/**
 * Velocidad común y desfase entre arranques, en unidades de `--u` por unidad de progreso.
 *
 * Las dos salen de pedir dos cosas a la vez:
 *
 *   1. que el salto máximo entre escalón y escalón sea `depth/3` — o sea `u` a depth 3,
 *      el ancho de una columna, la cascada a 45°;
 *   2. que el ÚLTIMO anillo llegue a su techo exactamente en `e = 1`, para que el
 *      recorrido no sobre ni falte.
 *
 * En modo converge eso da `v = 2·depth` con `stagger = 1`. En modo escalera el anillo
 * exterior es el que más viaja, así que `v = depth`.
 *
 * `stagger` escala el desfase: es la perilla del tamaño del escalón. Con 0 los cuatro
 * arrancan juntos y no hay escalera; por encima de 1 los saltos son más grandes que
 * `depth/3`, y la velocidad se recalcula para que el último siga llegando en `e = 1`.
 */
export function carveTiming(drop: number, depth: number, stagger: number, converge: boolean) {
  const spread = Math.max(0, stagger) * (depth - drop);
  const speed = converge ? spread + drop + depth : depth;
  return { speed, delta: speed > 0 ? spread / (3 * speed) : 0 };
}

// ── El reloj, compartido por los dos mecanismos ──────────────────────────────
//
// `carveEdges` devuelve UNA cosa: la `y` en pantalla del borde superior del gris de
// cada anillo. Eso es todo lo que define el efecto — la curva, el relevo, el techo y
// el cierre están acá dentro.
//
// Vive en este módulo y no en un componente porque hay DOS formas de pintar esa `y`, y
// tienen que compartir el reloj exacto para que compararlas signifique algo:
//
//   · `/prototype/descent/talla`   — un `clip-path` escalonado sobre el hero: el gris
//     está quieto y la imagen se retira. El hero se apila ENCIMA de las barras.
//   · `/prototype/descent/paneles` — un panel gris por columna con `scaleY` y origen
//     abajo, pintando ENCIMA del hero, como en producción.
//
// Si el reloj estuviera duplicado, cualquier diferencia que se viera entre las dos
// rutas podría ser del mecanismo o de una deriva entre dos copias, y no habría forma
// de saber cuál.

/** Los valores con los que están calibradas las dos rutas. */
export const CARVE = {
  /** Cuánto cuelga el anillo central por debajo de la juntura al arrancar, en `--u`. */
  drop: 0.5,
  /** Profundidad de la escalera en `--u`: el salto entre escalón y escalón es `depth/3`. */
  depth: 3,
  /** Escala el desfase entre arranques, o sea el tamaño del escalón. */
  stagger: 1,
  /**
   * Altura de pantalla, en fracción del viewport, donde se detienen los anillos.
   *
   * En 0 el techo es el BORDE de la ventana, y es lo que hace que los anillos lleguen
   * ESCALONADOS: el lateral choca con el top primero y los de adentro lo alcanzan de a
   * uno. Cualquier valor mayor mete un techo que trepa hasta el borde, y eso arrastra a
   * los cuatro juntos: llegan todos en el mismo scroll y el escalonado del final se
   * pierde. Ver la nota de `carveEdges`.
   */
  line: 0,
  /** Con `line > 0`, en cuánto scroll (en fracción del viewport) el techo trepa hasta 0. */
  close: 0.5,
  /** Control points de la curva: velocidades 3.4 / 0.7 / 1.0 — semirápida, lenta, semilenta. */
  cp: "0.18, 0.62, 0.72, 0.72",
  /** Nombre con el que se registra la CustomEase. */
  easeName: "labCarve",
} as const;

export type CarveInput = {
  /** Progreso del recorrido ya pasado por la curva, en [0,1]. */
  eased: number;
  /** `y` en pantalla de la juntura (el borde inferior del hero). */
  seamY: number;
  /** Píxeles de scroll transcurridos desde el arranque del recorrido. */
  scrolled: number;
  viewportH: number;
  unitPx: number;
  drop: number;
  depth: number;
  stagger: number;
  /** `false` deja cada anillo detenido en su sitio de la figura formada, sin cierre. */
  converge: boolean;
  line: number;
  close: number;
};

/**
 * La `y` en pantalla del borde superior del gris de cada anillo, del exterior al centro.
 *
 * ── Los dos actos, que salen de un solo movimiento ──────────────────────────
 * Los cuatro anillos suben a la MISMA velocidad y arrancan escalonados. Mientras el de
 * afuera sube y los de adentro no arrancaron, el hueco se ABRE: la escalera se forma de
 * afuera hacia adentro. Cuando uno llega al techo se queda ahí y los de adentro lo
 * alcanzan: el hueco se CIERRA. No hay dos fases que sincronizar, es la misma expresión.
 *
 * ── El techo es el BORDE de la ventana, y llegó ahí por descarte ────────────
 * Con `line = 0` el techo es `y = 0`. Cada anillo sube libre hasta chocar con el borde y
 * se queda ahí; el lateral llega primero y los de adentro lo alcanzan de a uno, así que
 * los huecos se cierran uno por vez y a la vista. Medido a 1877×1050, en qué scroll choca
 * cada uno: lateral 213px · 2ª 303px · 3ª 405px · central 510px.
 *
 * Las otras tres formas de poner el techo fallan cada una por su lado, y vale tenerlas
 * anotadas porque las tres parecían razonables:
 *
 *   · Un punto del DOCUMENTO: el anillo que llegaba primero se quedaba quieto en la
 *     página y el scroll lo sacaba por arriba, así que el hueco terminaba de cerrarse
 *     contra el borde. Se leía como "se salió", no como "se encogió".
 *   · Una línea FIJA de pantalla: el cierre se ve, pero el borde de arriba queda
 *     inmóvil. Medido: 0px de movimiento durante ~180px de scroll seguidos, que se lee
 *     como que la animación se trabó.
 *   · Una línea que TREPA hasta el borde: arregla lo inmóvil, pero al arrastrar el techo
 *     hacia 0 arrastra con él a los cuatro anillos, y entonces **llegan todos al top en
 *     el mismo scroll** (medido: los cuatro a los 525px, contra 213/303/405/510 con el
 *     techo en el borde). El escalonado del final se pierde, que era justamente el
 *     efecto.
 *
 * Lo que hace que el borde funcione y la línea no: un anillo estacionado en `y = 0` no
 * deja borde visible —esa columna simplemente se ve gris desde arriba— así que no hay
 * nada que se lea como congelado, y el borde que uno mira es el del anillo siguiente,
 * que sí se está moviendo.
 */
export function carveEdges(input: CarveInput): number[] {
  const { eased, seamY, scrolled, viewportH, unitPx, drop, depth, stagger, converge, line, close } =
    input;
  const depths = carveDepths(drop, depth);
  const { speed, delta } = carveTiming(drop, depth, stagger, converge);

  // Sin tope: cada anillo arranca por debajo de la juntura y sube a velocidad común
  // desde su turno.
  const free = depths.map(({ start }, ring) => {
    const moved = Math.max(0, eased - ring * delta) * speed;
    return seamY + (start - moved) * unitPx;
  });

  if (!converge) {
    // Sin cierre, cada anillo se detiene en su sitio de la figura formada.
    return free.map((y, ring) => Math.max(seamY + depths[ring].end * unitPx, y));
  }

  const creep = close > 0 ? line / close : 0;
  const ceiling = Math.max(0, line * viewportH - creep * scrolled);
  return free.map((y) => Math.max(ceiling, y));
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
 * Van al estado de la ESCALERA FORMADA, nunca al del modo converge. Si el JS no corre
 * —bundle caído, `prefers-reduced-motion`, sin JS— lo que tiene que quedar es una
 * composición que se sostenga sola, y esa es la figura completa con la imagen cortada
 * donde le corresponde. El estado final del modo converge es "la imagen entera
 * tallada", que sin animación que lo explique es un hero roto.
 *
 * El bloque de motion escribe el estado inicial en su primer frame, que corre en
 * `useLayoutEffect`, o sea antes del primer paint.
 */
export function carveRestVars(drop: number, depth = STAIR_SPAN): Record<string, string> {
  const vars: Record<string, string> = {};
  carveDepths(drop, depth).forEach(({ end }, ring) => {
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
  for (let ring = 0; ring < STAIR_RINGS; ring++) el.style.removeProperty(CARVE_VAR(ring));
}

// ── El reloj de la CASCADA ───────────────────────────────────────────────────
//
// Un segundo reloj, alternativo a `carveEdges`, para el approach de paneles. Devuelve lo
// mismo (la `y` en pantalla del borde superior de cada anillo) y se consume igual, así que
// las dos rutas pueden alternarse con una perilla.
//
// ── Qué le falta a `carveEdges`, y por qué no se arregla con una curva ───────
//
// `carveEdges` mueve los cuatro anillos a la MISMA velocidad y los escalona solo por el
// arranque. La escalera se abre porque unos empezaron antes, no porque vayan a distinta
// velocidad. Y el final es un `Math.max(ceiling, y)`: cada anillo llega al borde a ~2.5×
// la velocidad del scroll y se detiene EN UN FRAME. Eso es un choque, no un aterrizaje, y
// no hay curva global que lo suavice — la curva reparte el recorrido en el tiempo, pero el
// frenazo lo produce el clamp, que es discontinuo en velocidad por definición.
//
// ── Los tres actos que este reloj sí produce ─────────────────────────────────
//
//  1. CASCADA POR VELOCIDAD. Cada anillo entra a una velocidad distinta, graduada de
//     afuera hacia adentro (`fast` → `slow`, en múltiplos de la velocidad del scroll).
//     Los laterales se despegan de la juntura al triple del scroll y el central a poco
//     más que el scroll: la escalera se abre porque los de afuera VAN más rápido, no solo
//     porque salieron antes.
//
//  2. ALCANCE. La curva de cada anillo es una Hermite cúbica con las dos pendientes
//     prescritas: entra a `v_r` y llega a `settle`. Para los anillos interiores esa
//     combinación —entrada lenta, salida lenta, mismo recorrido en menos progreso— tiene
//     que pasar por un PICO de velocidad a mitad de camino. No se programa: sale de la
//     familia de curvas. Medido con los defaults, el central llega a 3.4× el scroll justo
//     cuando el lateral ya bajó a 1.6×.
//
//  3. ATERRIZAJE SUAVE. El clamp duro se reemplaza por `softFloor`, que amortigua los
//     últimos `soft · u` píxeles. La velocidad EN PANTALLA del borde cae de forma continua
//     hasta cero en vez de cortarse: medido, el anillo exterior pasa de 1.5× a 0 a lo
//     largo de ~104px de scroll.
//
// ── Lo que se derivó en vez de calibrarse ────────────────────────────────────
// Las velocidades por anillo son un pedido; el RECORRIDO de cada uno (`budget`) sale de
// las medidas del viewport para que el borde toque el fondo del amortiguador exactamente
// en su `land`. Por eso la cobertura total al final del scroll está garantizada en
// cualquier pantalla y con cualquier `?ease=`, y no hay ningún número calibrado a ojo que
// pueda quedar corto en un viewport raro. Ver la demostración en `cascadeEdges`.

/** Los valores con los que está calibrada la cascada. */
export const CASCADE = {
  /** Radio del amortiguador de llegada, en `--u`. Con 0 el final es el choque duro de hoy. */
  soft: 0.25,
  /** Desfase entre arranques, en progreso. Es la perilla de "cuánta escalera". */
  spread: 0.11,
  /** Progreso en el que aterriza el anillo CENTRAL, que es el último. */
  land: 0.92,
  /** Cuánto se adelanta el aterrizaje de cada anillo hacia afuera. 0 = los cuatro juntos. */
  lag: 0.02,
  /** Velocidad de entrada del anillo EXTERIOR, en múltiplos de la velocidad del scroll. */
  fast: 2.9,
  /** Ídem del anillo CENTRAL. Que sea menor que `fast` es, literalmente, la cascada. */
  slow: 1.35,
  /** Velocidad de llegada, común a los cuatro. Más bajo = más ease-out al final. */
  settle: 0.25,
} as const;

export type CascadeInput = {
  /** Progreso pasado por `?ease=`, en [0,1]. Es el reloj de los ANILLOS. */
  eased: number;
  /** `y` en pantalla de la juntura, viva. Es el reloj de la JUNTURA: `seamDoc − scroll`. */
  seamY: number;
  /** `y` en pantalla de la juntura en el arranque del recorrido. Medida, constante. */
  seamY0: number;
  /** Largo del recorrido del ScrollTrigger, en px. */
  span: number;
  viewportH: number;
  unitPx: number;
  drop: number;
  /** Altura de pantalla, en fracción del viewport, donde aterrizan. 0 = el borde. */
  line: number;
  soft: number;
  spread: number;
  land: number;
  lag: number;
  fast: number;
  slow: number;
  settle: number;
};

/**
 * La `y` en pantalla del borde superior del gris de cada anillo, del exterior al centro.
 * Mismo contrato de salida que `carveEdges`, para que el consumidor solo cambie una línea.
 *
 * ── La cuenta, anillo por anillo ────────────────────────────────────────────
 *
 *   s_r    = spread · r                       arranque escalonado, de afuera hacia adentro
 *   L_r    = land − lag · (3 − r)             aterrizaje escalonado hacia atrás
 *   win_r  = L_r − s_r                        la ventana del anillo: el exterior tiene más
 *   D_r    = seamY0 − span·L_r + start_r·u + k − F        ← el presupuesto, ver abajo
 *   m0_r   = span · (v_r − 1) · win_r / D_r   ← la pendiente que da la velocidad pedida
 *   g_r(t) = m0·t + (3−2m0−settle)·t² + (m0+settle−2)·t³
 *   y_r    = F + softFloor(seamY + start_r·u − D_r·g_r(t_r) − F, k)
 *
 * ── Por qué `D_r` es una derivación y no un número ──────────────────────────
 * Se pide que el borde LIBRE del anillo toque el fondo del amortiguador (`F − k`) justo
 * en `eased = L_r`. Como la juntura viaja con el scroll —`seamY(p) = seamY0 − span·p`—, ese
 * pedido se despeja en una línea y da el `D_r` de arriba. Todo lo demás se apoya en eso.
 *
 * ── Por qué `m0_r` está en múltiplos de la velocidad del SCROLL ─────────────
 * Un panel pegado a la juntura ya sube a 1× el scroll sin moverse un píxel por su cuenta:
 * lo arrastra la página. Así que la velocidad que uno VE es `span + D_r·g_r'/win_r`, y
 * pedirla en múltiplos del scroll (`v_r`) es la única forma de que `fast`/`slow`
 * signifiquen lo mismo en cualquier viewport. Despejando `g_r'(0) = m0_r` sale la fórmula.
 *
 * ── Las tres garantías, demostradas y no calibradas ─────────────────────────
 *
 *  · COBERTURA TOTAL. En `eased = 1` todos los `t_r` valen 1, así que
 *    `free_r = seamY0 − span + start_r·u − D_r = (F − k) − span·(1 − L_r) ≤ F − k`,
 *    o sea `y_r = F` exacto. Vale en cualquier viewport y con cualquier `?ease=` monótona
 *    con `e(1) = 1`, así que el estado final es idéntico al de `carveEdges` y el traspaso
 *    a la sección siguiente no cambia.
 *
 *  · MONOTONÍA (y por lo tanto scroll en reversa exacto). `free_r` decrece en `p` porque
 *    `g_r' > 0`, y `softFloor` es creciente en su argumento. Además es función PURA del
 *    progreso: no hay estado entre frames que un `refresh()` o un resize puedan ensuciar.
 *
 *  · `g_r' > 0` SIEMPRE. `g_r'` es una parábola con extremos `m0 > 0` y `settle > 0`; solo
 *    puede hacerse negativa si abre hacia arriba y su vértice cae dentro de (0,1), y eso
 *    exige `m0 > 3 − 2·settle`. El clamp de `m0` lo prohíbe, así que la propiedad queda
 *    probada de una línea en vez de depender de que nadie mueva mal una perilla.
 */
export function cascadeEdges(input: CascadeInput): number[] {
  const {
    eased,
    seamY,
    seamY0,
    span,
    viewportH,
    unitPx,
    drop,
    line,
    soft,
    spread,
    land,
    lag,
    fast,
    slow,
    settle,
  } = input;

  const k = Math.max(0, soft) * unitPx;
  const floorY = line * viewportH;
  const last = STAIR_RINGS - 1;

  const edges: number[] = new Array(STAIR_RINGS);
  for (let ring = 0; ring < STAIR_RINGS; ring++) {
    const startAt = spread * ring;
    const landAt = land - lag * (last - ring);
    const win = Math.max(1e-3, landAt - startAt);
    // Cuánto cuelga este anillo por debajo de la juntura al arrancar. Mismo número que
    // `carveDepths().start`: el excedente de vídeo que hace falta no cambia.
    const startPx = ((drop * ring) / 3) * unitPx;

    // El presupuesto de ascenso propio, o sea lo que este anillo sube POR ENCIMA de lo
    // que ya lo arrastra el scroll.
    const budget = Math.max(1, seamY0 - span * landAt + startPx + k - floorY);
    const v = fast + ((slow - fast) * ring) / last;
    // De "entrar a `v` veces la velocidad del scroll" a la pendiente que pide
    // `hermiteRamp`. La conversión vive acá y no en el helper porque depende del
    // recorrido concreto de este anillo; ver la nota de `velocityRamp.ts`. El clamp
    // que garantiza la monotonía lo aplica el helper.
    const g = hermiteRamp((span * (v - 1) * win) / budget, settle);

    const t = (eased - startAt) / win;
    edges[ring] = floorY + softFloor(seamY + startPx - budget * g(t) - floorY, k);
  }
  return edges;
}
