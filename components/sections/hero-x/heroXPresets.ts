import { hexToRgb } from "@/components/primitives/gl/color";
import type { HeroXPage } from "@/components/sections/hero-x/heroXContent";

// Los nueve presets de la superficie, uno por página.
//
// ══ La regla ═══════════════════════════════════════════════════════════════
//
// **La paleta no cambia. Las capas no cambian.** Las nueve páginas comparten
// exactamente los cinco colores y exactamente nueve carriles.
//
// Lo que cambia es dónde apunta el campo, con cuánta fuerza y qué dibuja:
//
//   · **DIRECCIÓN** — el punto de fuga al que apuntan las estrías, y el ángulo
//     por el que entra la sombra.
//   · **INTENSIDAD** — cuánto separa claros de oscuros, cuánto pesa el degradé
//     sobre el campo y dónde arranca el piso.
//   · **MOTIVO** — la frecuencia del campo, cuánto se doblan las estrías, el
//     estirado, el detalle fino, el ancho de la juntura y la velocidad.
//
// ── Por qué así y no al revés ──────────────────────────────────────────────
//
// Porque el color y el conteo de capas son lo que hace que una superficie se
// RECONOZCA, y el resto es lo que hace que se distinga. Con nueve paletas, cada
// página tenía un shader propio y la familia se perdía: se leían como nueve
// piezas parecidas en vez de como la misma pieza en nueve estados. Con una
// paleta y una cuenta de carriles, lo que varía es el gesto y no la identidad.
//
// La consecuencia práctica es que estos presets se pueden empujar mucho más
// lejos de lo que se podrían empujar nueve paletas: mover `u_curl` de 0.55 a
// 2.1 cambia el dibujo entero sin que nadie dude de que es el mismo material.
//
// ── El único límite duro: dónde cae la luz ─────────────────────────────────
//
// `u_gradAngle` es lo más tentador de randomizar y es lo que menos margen
// tiene. El titular está abajo a la izquierda en las nueve páginas y va en
// tinta, así que necesita el papel más limpio del cuadro justo ahí. Los nueve
// valores se mueven entre 0.44 y 0.94 radianes (25°–54°), que es el arco en el
// que la sombra cierra arriba a la derecha.
//
// Fuera de ese arco el hero no se rompe: se vuelve ilegible, que es peor porque
// no avisa. Si alguna vez hay que abrirlo, la salida es mover el titular, no el
// ángulo.
//
// `u_focus` sí se mueve a gusto —de −0.34 a 1.9— porque orienta las ESTRÍAS y
// no la luz. Es el parámetro con más rendimiento visual por unidad de riesgo.

/**
 * Los cinco tonos, iguales en las nueve.
 *
 * Ni el primero es blanco ni el último negro, y esos dos topes son buena parte
 * de por qué la referencia se lee como una película velada y no como un degradé
 * sintético.
 */
const PALETTE = ["#00dc8d", "#00dc8d", "#00dc8d", "#00dc8d", "#00dc8d"] as const;

/**
 * Nueve carriles, iguales en las nueve páginas.
 *
 * El número no es libre aunque no varíe: con menos se leen como tres franjas
 * decorativas, y con más el ancho de cada capa baja del de sus propias estrías
 * —con lo que la estructura desaparece y vuelve a ser un solo campo—.
 */
const LAYERS = 9.0;

/** Lo que las nueve comparten además de la paleta y las capas. */
const BASE = {
  u_gradSpread: 1.1,
  u_detailFall: 1.35,
  u_seamLift: 0.2,
  u_grain: 0.032,
  // Un nivel de 8 bits medido sobre el ÍNDICE de la rampa, no sobre el color: el
  // índice recorre 0..1 en cuatro tramos y cada tramo cubre la distancia entre
  // dos paradas, así que un nivel son ~0.006 y no 1/256.
  u_dither: 0.007,
  u_layers: LAYERS,
  u_c0: hexToRgb(PALETTE[0]),
  u_c1: hexToRgb(PALETTE[1]),
  u_c2: hexToRgb(PALETTE[2]),
  u_c3: hexToRgb(PALETTE[3]),
  u_c4: hexToRgb(PALETTE[4]),
};

/** Los doce grados de libertad, repartidos en las tres familias de la regla. */
type HeroXVariation = {
  // ── dirección ──
  /** El punto de fuga al que apuntan las estrías. Vive fuera del canvas. */
  focus: [number, number];
  /** Por dónde entra la sombra, EN RADIANES. Entre 0.44 y 0.94 — ver la nota. */
  gradAngle: number;

  // ── intensidad ──
  /** Cuánto separa claros de oscuros. */
  contrast: number;
  /** El piso: por encima de 0 el negro nunca llega. */
  lift: number;
  /** Cuánto abolla el campo al degradé maestro. */
  gradMix: number;
  /** Cómo se reparte la rampa. >1 comprime las sombras contra su esquina. */
  gradGamma: number;

  // ── motivo ──
  /** Frecuencia base del campo. Alto = más denso. */
  scale: number;
  /** Cuánto se doblan las estrías respecto del radial puro. */
  curl: number;
  /** El tamaño de esa curvatura. Bajo = ondas cortas. */
  curlScale: number;
  /** Longitud del estirado. Alto = las estrías se funden. */
  blur: number;
  /** La segunda capa de alta frecuencia. */
  detail: number;
  /** Ancho de la juntura entre carriles. */
  seam: number;
  /** La deriva temporal. Es todo el movimiento que tiene la pantalla. */
  drift: number;
};

const VARIATION: Record<HeroXPage, HeroXVariation> = {
  // El original de `/prototype/protocol-a`, intacto. Es la referencia contra la
  // que se calibraron las otras ocho, y por eso no se toca ni un valor: si
  // alguna se va de rango, se compara contra ésta.
  protocol: {
    focus: [1.24, 0.62], gradAngle: 0.62,
    contrast: 1.3, lift: 0.0, gradMix: 0.36, gradGamma: 1.55,
    scale: 3.1, curl: 1.25, curlScale: 1.05, blur: 2.6, detail: 0.68,
    seam: 0.16, drift: 0.035,
  },

  // Chain abstraction: el `curl` más alto del set con ondas cortas, así que las
  // estrías se doblan mucho y ninguna cruza recta. El estirado también es el
  // máximo: los carriles se distinguen menos entre sí. Es el argumento de la
  // página dicho en el fondo — las cadenas siguen ahí y ya no se ven.
  chain: {
    focus: [1.45, 0.28], gradAngle: 0.70,
    contrast: 1.15, lift: 0.02, gradMix: 0.30, gradGamma: 1.70,
    scale: 2.6, curl: 1.9, curlScale: 0.8, blur: 3.3, detail: 0.5,
    seam: 0.1, drift: 0.028,
  },

  // Quantum: el `curl` más bajo y el `curlScale` más alto — o sea estrías casi
  // rectas, que es lo más cerca de una rejilla que el shader llega a dibujar.
  // Contraste y detalle en el techo, estirado en el piso: se ve una por una.
  // Y la deriva casi detenida.
  quantum: {
    focus: [0.86, 1.42], gradAngle: 0.44,
    contrast: 1.55, lift: 0.0, gradMix: 0.44, gradGamma: 1.35,
    scale: 3.9, curl: 0.55, curlScale: 1.5, blur: 2.0, detail: 0.92,
    seam: 0.24, drift: 0.018,
  },

  // Historia: el foco se va a la IZQUIERDA, único caso, así que las estrías
  // apuntan al lado contrario que en las otras ocho. Con el detalle bajo y el
  // `lift` alto —el negro nunca llega— queda velado, que es lo que se le pide a
  // una página que mira hacia atrás. Deriva mínima.
  about: {
    focus: [-0.34, 1.18], gradAngle: 0.86,
    contrast: 1.05, lift: 0.05, gradMix: 0.26, gradGamma: 1.85,
    scale: 2.3, curl: 1.55, curlScale: 1.25, blur: 3.0, detail: 0.42,
    seam: 0.12, drift: 0.012,
  },

  // Analytics: la página de las mediciones, y el campo se comporta como un
  // instrumento. Frecuencia alta con curvatura corta —muchas estrías finas que
  // se doblan poco—, el detalle arriba y la deriva contenida: se lee como una
  // señal muestreada, no como humo. El contraste va alto para que esa trama se
  // vea; el `gradMix` bajo para que el degradé no se la coma.
  analytics: {
    focus: [1.72, 0.16], gradAngle: 0.50,
    contrast: 1.42, lift: 0.0, gradMix: 0.31, gradGamma: 1.62,
    scale: 4.1, curl: 0.95, curlScale: 0.9, blur: 2.15, detail: 0.88,
    seam: 0.2, drift: 0.024,
  },

  // Comunidad: el más agitado. Curl alto con ondas cortas, la juntura más ancha
  // del set —los nueve carriles se ven separarse— y la deriva más rápida, casi
  // cinco veces la de `about`.
  community: {
    focus: [1.6, 1.05], gradAngle: 0.52,
    contrast: 1.35, lift: 0.0, gradMix: 0.40, gradGamma: 1.45,
    scale: 3.4, curl: 2.1, curlScale: 0.72, blur: 2.4, detail: 0.85,
    seam: 0.28, drift: 0.058,
  },

  // Economía: la frecuencia más baja del set, así que el campo es ancho y
  // pausado. Curl bajo con la curvatura más grande: las estrías se doblan una
  // vez, largo, en vez de ondular. Un sistema que compone, no uno que se agita.
  economics: {
    focus: [1.1, -0.24], gradAngle: 0.66,
    contrast: 1.22, lift: 0.03, gradMix: 0.34, gradGamma: 1.60,
    scale: 2.0, curl: 0.85, curlScale: 1.7, blur: 2.2, detail: 0.55,
    seam: 0.14, drift: 0.022,
  },

  // Ecosistema: la frecuencia más alta y la juntura más fina. Los nueve
  // carriles siguen ahí pero casi no se distinguen entre sí, y lo que se ve es
  // densidad. Cientos de proyectos y ninguno manda.
  ecosystem: {
    focus: [1.9, 0.5], gradAngle: 0.58,
    contrast: 1.28, lift: 0.0, gradMix: 0.38, gradGamma: 1.50,
    scale: 4.4, curl: 1.4, curlScale: 0.62, blur: 2.9, detail: 0.78,
    seam: 0.08, drift: 0.042,
  },

  // Gobernanza: la más sobria. Contraste y detalle en el piso, la juntura más
  // ancha de todas y el curl casi apagado. Es la única donde los nueve carriles
  // se cuentan de un vistazo: pocas decisiones, grandes, y visibles.
  governance: {
    focus: [0.5, 1.55], gradAngle: 0.78,
    contrast: 1.10, lift: 0.06, gradMix: 0.28, gradGamma: 1.75,
    scale: 2.15, curl: 0.65, curlScale: 1.9, blur: 2.35, detail: 0.38,
    seam: 0.3, drift: 0.015,
  },

  // Fundación: la mediana de casi todo, con el ángulo más abierto del arco.
  // Es lo que le queda a la página que sostiene a las demás — no se distingue
  // por un extremo sino por estar en el centro de los ocho.
  foundation: {
    focus: [1.35, 0.9], gradAngle: 0.94,
    contrast: 1.25, lift: 0.02, gradMix: 0.35, gradGamma: 1.58,
    scale: 2.85, curl: 1.15, curlScale: 1.35, blur: 2.7, detail: 0.62,
    seam: 0.18, drift: 0.03,
  },
};

/**
 * El preset completo de una página: la base compartida más sus doce
 * variaciones, con los nombres del shader.
 *
 * La traducción pasa acá y no en el componente para que `VARIATION` se pueda
 * leer como lo que es —una tabla de decisiones de diseño— sin que la
 * nomenclatura `u_*` del shader se le mezcle.
 */
export function heroXSurface(page: HeroXPage) {
  const v = VARIATION[page];
  return {
    ...BASE,
    u_focus: v.focus,
    u_gradAngle: v.gradAngle,
    u_contrast: v.contrast,
    u_lift: v.lift,
    u_gradMix: v.gradMix,
    u_gradGamma: v.gradGamma,
    u_scale: v.scale,
    u_curl: v.curl,
    u_curlScale: v.curlScale,
    u_blur: v.blur,
    u_detail: v.detail,
    u_seam: v.seam,
    u_drift: v.drift,
  };
}

/**
 * El color plano que se ve mientras el shader compila, o si WebGL no está.
 *
 * Es la SEGUNDA parada de la rampa y no la primera: la primera es casi el papel
 * de la página, así que un fallback ahí deja el hero indistinguible del fondo
 * hasta que el canvas arranca. La segunda ya es un tono, y el corte contra la
 * sección siguiente se ve desde el primer frame.
 *
 * Es una constante y no una función de la página, como todo lo que salga de la
 * paleta: las nueve comparten los cinco tonos.
 */
export const HERO_X_FALLBACK = PALETTE[1];

/**
 * El velo de legibilidad al pie, sobre el tono claro de la rampa.
 *
 * Plano y sólo al pie: el bloque de cuerpo y salida cae donde las estrías
 * todavía tienen contraste. No llega al borde inferior con el color de la
 * sección siguiente — eso sería un degradé de transición, y acá el corte entre
 * secciones se ve.
 */
export const HERO_X_VEIL =
  "linear-gradient(to bottom, transparent 0%, transparent 46%," +
  " rgba(247,247,239,0.55) 74%, rgba(247,247,239,0.72) 100%)";
