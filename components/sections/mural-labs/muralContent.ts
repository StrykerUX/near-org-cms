// La Section #2 del diseño de Caro, portada del Figma
// `NEARORG_CLAUDE_QUANTUM` (nodo `184:476`, dentro del frame `186:26`).
//
// ── Qué es ─────────────────────────────────────────────────────────────────
//
// Cuatro líneas. Cada una es un rótulo chico en sans y una palabra en serif que
// cruza la sección de borde a borde, pintada con un degradado que va del negro
// al verde. Las líneas alternan de qué lado empieza el verde, y esa alternancia
// es lo que hace que el bloque se lea como una sola pieza y no como cuatro
// frases apiladas.
//
// ── Lo que se transcribió literal del Figma y lo que no ────────────────────
//
// Literal: la copy, el orden, la alineación de cada palabra, y los porcentajes
// de las paradas del degradado. Son las cuatro cosas que definen el diseño.
//
// Adaptado: el TAMAÑO pasa a ser el token `--text-mural` de la escala en vez de
// los 153px del artboard (ver su comentario en `globals.css`), y el fondo usa
// `--bar`, que ya existía en el DS con el mismo `#D9D9D9` del diseño. El
// tracking del artboard varía por línea entre -0.04em y -0.05em; el token lleva
// -0.04em para todas, porque el DS prohíbe parchear tracking sobre un token y
// la diferencia entre las dos es de un píxel a 153px.

/** Los dos verdes del degradado, tal cual el Figma. */
export const RAMP = {
  /** El verde claro de los extremos. */
  lime: "#7ed461",
  /** El verde medio del centro de la rampa. */
  green: "#0ca329",
} as const;

// Deliberadamente NO son tokens del DS. Los verdes de la paleta —`--cta-mint`
// (#8bf29c), `--green-ink` (#00a86b)— son más fríos y saturados que estos dos,
// que tiran a oliva; sustituirlos cambiaría el diseño que se está evaluando.
// Y meter dos colores globales al DS por una sección de prototipo lo contamina.
// Si la sección se aprueba, ahí entran a la paleta con nombre propio.

export type MuralLine = {
  /** El rótulo chico en sans. `\n` marca un salto de línea explícito. */
  label: string;
  /** La palabra grande, en serif. Se pinta en mayúsculas por CSS. */
  word: string;
  /** De qué borde arranca la palabra. */
  align: "left" | "right";
  /** Dónde va el rótulo respecto de la palabra. */
  labelSide: "left" | "right";
  /**
   * El degradado, de izquierda a derecha.
   *
   * `from` dice con qué color arranca — y es lo que alterna entre líneas: 1 y 3
   * entran en negro y se abren al verde, 2 y 4 al revés. Los porcentajes son
   * las paradas del Figma; moverlos cambia dónde "prende" el color dentro de la
   * palabra, que es el detalle del que vive el efecto.
   */
  ramp: { from: "ink" | "lime"; stops: [number, number] };
};

export const LINES: MuralLine[] = [
  {
    label: "We create an open",
    word: "infrastructure",
    align: "right",
    labelSide: "left",
    ramp: { from: "ink", stops: [41.886, 69.509] },
  },
  {
    label: "powering",
    word: "the Agent economy",
    align: "right",
    labelSide: "left",
    ramp: { from: "lime", stops: [24.038, 72.596] },
  },
  {
    label: "and\nconfidential\nby design.",
    word: "Quantum-resistant",
    align: "left",
    labelSide: "right",
    ramp: { from: "ink", stops: [41.886, 69.509] },
  },
  {
    label: "Empowers\nyou to trade anything\nanywhere and own",
    word: "your intelligence",
    align: "right",
    labelSide: "left",
    ramp: { from: "lime", stops: [23.547, 58.114] },
  },
];

/**
 * El degradado de una línea como valor de `background-image`.
 *
 * Se construye acá y no en cada variante porque las cuatro pintan el MISMO
 * degradado: lo que cambia entre ellas es cómo lo animan. Si cada una lo
 * escribiera, la comparación mediría también las diferencias de transcripción.
 */
export function rampGradient(line: MuralLine) {
  const [a, b] = line.ramp.stops;
  return line.ramp.from === "ink"
    ? `linear-gradient(90deg, #000 ${a}%, ${RAMP.green} ${b}%, ${RAMP.lime} 100%)`
    : `linear-gradient(90deg, ${RAMP.lime} 0%, ${RAMP.green} ${a}%, #000 ${b}%)`;
}

/**
 * El mismo degradado, extendido al doble de ancho con una mitad negra, para
 * que se pueda BARRER moviendo `background-position` en vez de animar color.
 *
 * Con `background-size: 200%`, la ventana visible es la mitad de la imagen: en
 * un extremo se ve solo el tramo negro —la palabra entera apagada— y en el otro
 * la rampa completa. Lo que viaja es el encuadre, así que el encendido tiene
 * dirección; un tween de color no la tendría.
 *
 * La mitad negra va del lado que la línea necesita: las que arrancan en negro
 * se encienden desde la derecha y las que arrancan en verde desde la izquierda,
 * que es la alternancia del diseño leída como movimiento.
 */
export function sweepGradient(line: MuralLine) {
  const [a, b] = line.ramp.stops;
  return line.ramp.from === "ink"
    ? `linear-gradient(90deg, #000 0%, #000 50%, #000 ${50 + a / 2}%, ${RAMP.green} ${50 + b / 2}%, ${RAMP.lime} 100%)`
    : `linear-gradient(90deg, ${RAMP.lime} 0%, ${RAMP.green} ${a / 2}%, #000 ${b / 2}%, #000 50%, #000 100%)`;
}

/** De qué extremo parte el barrido de `01 · Ramp`, en `background-position`. */
export function sweepFrom(line: MuralLine) {
  return line.ramp.from === "ink" ? { start: "0% 0%", end: "100% 0%" } : { start: "100% 0%", end: "0% 0%" };
}

// ── Las cuatro variaciones de animación ────────────────────────────────────

export type MuralVariantSpec = {
  id: string;
  index: string;
  title: string;
  /** `trigger` = timeline propia al entrar. `scroll` = el progreso ES el scroll. */
  family: "trigger" | "scroll";
  /** Marca las que rasterizan el texto a una textura WebGL. */
  gl?: true;
  technique: string;
  bet: string;
  watch: string;
};

// Las catorce, agrupadas por CÓMO llevan el tiempo — que es la distinción que
// estructura el lab entero y por la que hay dos rutas.
//
//   `trigger`  el scroll solo decide CUÁNDO empieza; de ahí la timeline corre
//              con sus propias duraciones y curvas, siempre igual, y se deshace
//              al volver hacia arriba.
//   `scroll`   el progreso ES el scroll: reversible sin escribir la reversa e
//              imposible de desincronizar, pero el ritmo lo pone el gesto de
//              cada lector y no el diseño.
//
// Las tres marcadas `gl` rasterizan las palabras a una textura y las pintan con
// un shader. El precio está documentado en `MuralGl.tsx`: ese texto deja de ser
// texto en pantalla, así que el DOM real se conserva debajo para el árbol de
// accesibilidad. Es el mismo trato que `hero-alt` documenta para sus versiones
// 04 y 05.

export const VARIANTS: MuralVariantSpec[] = [
  {
    id: "ramp",
    index: "01",
    title: "Ramp",
    family: "trigger",
    technique: "background-position, GSAP",
    bet: "Las palabras entran en negro y el verde las barre después, una línea tras otra. No se anima el color sino la POSICIÓN del degradado, que es lo que le da dirección al encendido en vez de un fundido.",
    watch: "Que el barrido respete de qué lado arranca cada línea: 1 y 3 prenden desde la derecha, 2 y 4 desde la izquierda. Es la alternancia del diseño, leída como movimiento.",
  },
  {
    id: "rise",
    index: "02",
    title: "Rise",
    family: "trigger",
    technique: "máscaras por línea, stagger",
    bet: "Cada palabra sube desde debajo de su propia máscara y el rótulo llega detrás. El degradado ya está puesto: lo que entra es la tipografía, no el color.",
    watch: "El desfase entre la palabra y su rótulo. Son dos pesos tipográficos muy distintos y entrar juntos los aplana.",
  },
  {
    id: "split",
    index: "03",
    title: "Split",
    family: "trigger",
    technique: "SplitText por carácter",
    bet: "Letra por letra, cada una desde su propia altura. El degradado vive en el contenedor, así que cada carácter llega con el color que le toca por su posición — el efecto arma la rampa mientras la escribe.",
    watch: "Que no se lea como un letrero de aeropuerto: el stagger es corto y el recorrido chico a propósito, porque a este tamaño un movimiento grande por letra marea.",
  },
  {
    id: "cascade",
    index: "04",
    title: "Cascade",
    family: "trigger",
    technique: "entrada lateral alterna, GSAP",
    bet: "Cada línea entra desde el borde OPUESTO al que se alinea, cruzando la sección hasta su sitio. La alternancia del diseño —una a la derecha, la siguiente a la izquierda— deja de ser una propiedad estática y pasa a ser el recorrido.",
    watch: "El cruce en el medio: dos líneas viajando en sentidos contrarios a la vez es lo que hace la figura. Si el stagger fuera mayor, no se cruzarían nunca y sería cuatro entradas seguidas.",
  },
  {
    id: "typeset",
    index: "05",
    title: "Typeset",
    family: "trigger",
    technique: "scaleX desde el borde de alineación",
    bet: "Las palabras llegan condensadas y se abren hasta su ancho, como si alguien estuviera ajustando el tracking en vivo. Es un guiño deliberado a la divergencia de esta sección: el diseño está compuesto en un corte Semicondensed que el proyecto no tiene.",
    watch: "El `transformOrigin`: cada palabra se abre desde el borde al que está alineada, no desde su centro. Desde el centro se leería como un zoom; desde el borde, como tipografía asentándose.",
  },
  {
    id: "bands",
    index: "06",
    title: "Bands",
    family: "trigger",
    technique: "clip-path por franjas",
    bet: "Cada palabra se revela en cinco franjas horizontales que abren escalonadas. El texto no se mueve ni un píxel: lo único que cambia es cuánto de él se ve.",
    watch: "Que las franjas se lean como una persiana y no como un glitch. El escalonado va de arriba abajo dentro de cada palabra y de izquierda a derecha entre líneas.",
  },
  {
    id: "kern",
    index: "07",
    title: "Kern",
    family: "trigger",
    technique: "SplitText, colapso horizontal",
    bet: "Las letras arrancan apiladas en el centro de su palabra y se separan a su sitio. Es la contracara de 03: aquel reparte en vertical, éste en horizontal, y el resultado se lee como una palabra que se desdobla.",
    watch: "El degradado durante el colapso. Con las letras juntas, todas caen sobre el mismo tramo de la rampa y el color arranca casi plano; al separarse, la rampa aparece.",
  },
  {
    id: "flare",
    index: "08",
    title: "Flare",
    family: "trigger",
    gl: true,
    technique: "WebGL2, textura de texto",
    bet: "Un frente de calor recorre la palabra: delante está apagada, sobre el frente el trazo se distorsiona y brilla, detrás queda el degradado limpio. La distorsión es del shader — no hay filtro CSS que la dé.",
    watch: "El borde del frente. Es lo único que justifica pagar el precio de rasterizar el texto: sin shader, ese borde sería un gradiente suave y no una perturbación del propio trazo.",
  },
  {
    id: "scrub",
    index: "09",
    title: "Scrub",
    family: "scroll",
    technique: "ScrollTrigger con scrub",
    bet: "Las cuatro líneas se desplazan a velocidades distintas y el degradado viaja con ellas: el bloque se desarma y se vuelve a armar según cuánto avanzó el lector.",
    watch: "Cómo se comporta al scrollear rápido y al volver hacia atrás. Es reversible por construcción, pero el ritmo deja de ser del diseño y pasa a ser del gesto.",
  },
  {
    id: "weave",
    index: "10",
    title: "Weave",
    family: "scroll",
    technique: "desplazamiento cruzado, scrub",
    bet: "Las líneas se cruzan como una trama: las impares viajan hacia un lado y las pares hacia el otro, con recorridos crecientes hacia abajo. El bloque se abre y se cierra alrededor de un solo punto de alineación.",
    watch: "Ese punto. Existe una única posición de scroll en la que las cuatro caen donde el artboard las puso; el resto del recorrido es tensión.",
  },
  {
    id: "zoom",
    index: "11",
    title: "Zoom",
    family: "scroll",
    technique: "position: sticky + scrub",
    bet: "La sección se pega al viewport y las palabras arrancan enormes, fuera de caja, asentándose a su tamaño con el progreso. Es la única que se gana su propio tramo de scroll.",
    watch: "Si ceder dos viewports a una sección de texto se siente ganado. Y que el `sticky` es de CSS: nunca `pin`, que es regla de la casa.",
  },
  {
    id: "ripple",
    index: "12",
    title: "Ripple",
    family: "scroll",
    gl: true,
    technique: "WebGL2, amplitud por velocidad",
    bet: "Ondas que recorren el texto, con la amplitud dada por la VELOCIDAD del scroll y no por su posición. Quieto, el bloque es el del artboard; empujando fuerte, se agita.",
    watch: "Que reaccione al gesto y no al recorrido: parar a mitad de camino devuelve el texto a su forma, aunque el scroll no haya vuelto atrás.",
  },
  {
    id: "peel",
    index: "13",
    title: "Peel",
    family: "scroll",
    technique: "rotateX con perspectiva, scrub",
    bet: "Cada línea gira sobre su eje horizontal según el progreso, como las lamas de una persiana. Las cuatro pasan por su posición frontal en momentos distintos.",
    watch: "El escorzo. Con perspectiva corta el efecto es violento y el texto se vuelve ilegible a mitad de giro; el valor está calibrado para que la palabra siga leyéndose casi todo el recorrido.",
  },
  {
    id: "melt",
    index: "14",
    title: "Melt",
    family: "scroll",
    gl: true,
    technique: "WebGL2, desplazamiento por columna",
    bet: "Las palabras se derriten hacia abajo: cada columna de píxeles cae una distancia distinta, sembrada con ruido, y se recompone al llegar al final del recorrido.",
    watch: "Que se lea como materia y no como un desenfoque. La caída es por columna y con bordes duros — un blur daría la idea contraria.",
  },
];

/** Las que corren con timeline propia. */
export const TRIGGER_VARIANTS = VARIANTS.filter((v) => v.family === "trigger");
/** Las que van atadas al scroll. */
export const SCROLL_VARIANTS = VARIANTS.filter((v) => v.family === "scroll");
