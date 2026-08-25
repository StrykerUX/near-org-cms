import { hexToRgb } from "@/components/primitives/gl/color";
import type { HeroXPage } from "@/components/sections/hero-x/heroXContent";

// Los nueve presets de la superficie, uno por página.
//
// ── Qué varía y qué no ─────────────────────────────────────────────────────
//
// El shader es el mismo (`HERO_SURFACE_FRAG`, layerflow) y el layout es el
// mismo. Lo único que cambia entre una página y otra son CUATRO cosas, y las
// cuatro están elegidas porque se leen a un metro de distancia sin que la pieza
// deje de reconocerse:
//
//   · **La rampa de color** — las cinco paradas. Es lo que da la temperatura.
//   · **El ángulo de la luz** (`u_gradAngle`) — de dónde entra la sombra.
//   · **Las capas** (`u_layers`) — cuántas franjas cruzan el campo.
//   · **El estirado** (`u_blur`) — cuánto se funden las estrías de cada capa.
//
// Todo lo demás sale de `BASE` y no se toca. Es lo que hace que las nueve
// aperturas se lean como la misma pieza: si además cambiaran el contraste, el
// grano, la deriva y el foco, cada página tendría un shader propio y la familia
// se perdería.
//
// ── Por qué la rampa nunca llega al blanco ni al negro ─────────────────────
//
// Ninguna paleta arranca en `#ffffff` ni termina en `#000000`, y no es un
// descuido: esos dos topes son buena parte de por qué la referencia se lee como
// una película velada y no como un degradé sintético. El primer tono es un
// papel teñido y el último se detiene antes del negro.
//
// ── Y por qué todas las claras son casi el mismo crema ─────────────────────
//
// Porque debajo hay un titular en tinta. El tono profundo de cada página
// aparece en UNA esquina —la que el ángulo de la luz deja en sombra— y el resto
// del cuadro es papel. Una página cuya rampa oscurece pronto se queda sin sitio
// donde poner el titular, y ahí la única salida sería un velo más opaco, que es
// tapar el shader con una cortina.
//
// ── El ángulo, en vueltas ──────────────────────────────────────────────────
//
// `u_gradAngle` va en vueltas (0..1), no en grados. 0.62 es ~223°: la sombra
// cierra arriba a la derecha y la luz queda abajo a la izquierda, debajo del
// titular. Los nueve valores se mueven en una franja estrecha alrededor de ese
// número por el mismo motivo que las paletas: el titular siempre está en el
// mismo sitio, así que la luz tiene que estar cerca del mismo sitio también.

/**
 * Lo que las nueve comparten. Sale del preset de `protocol-labs/HeroLayerflow`,
 * que es de donde viene esta apertura; el razonamiento de cada valor está allá.
 */
const BASE = {
  u_focus: [1.24, 0.62],
  u_scale: 3.1,
  u_curl: 1.25,
  u_curlScale: 1.05,
  u_detail: 0.68,
  u_detailFall: 1.35,
  u_contrast: 1.3,
  u_lift: 0.0,
  u_gradSpread: 1.1,
  u_gradGamma: 1.55,
  u_gradMix: 0.36,
  u_grain: 0.032,
  u_drift: 0.035,
  u_seam: 0.16,
  u_seamLift: 0.2,
  u_dither: 0.007,
  // Sin `as const`: `GlSurface` pide `Record<string, number | number[]>` y una
  // tupla `readonly` no es asignable a `number[]`. Congelar esto no compraría
  // nada —es un objeto de módulo que nadie muta— y costaría un cast en el
  // consumidor.
};

/** Los cuatro grados de libertad de cada página. */
type HeroXVariation = {
  /** Las cinco paradas de la rampa, de la luz a la sombra. */
  ramp: [string, string, string, string, string];
  /** De dónde entra la sombra, en vueltas. */
  gradAngle: number;
  /** Cuántas franjas cruzan el campo. */
  layers: number;
  /** Cuánto se funden las estrías. Más alto, más liso. */
  blur: number;
};

const VARIATION: Record<HeroXPage, HeroXVariation> = {
  // El original, sin tocar: verde protocolo, nueve capas, la luz abajo a la
  // izquierda. Es la referencia contra la que se calibraron las otras ocho.
  protocol: {
    ramp: ["#f7f7ef", "#e6ecd2", "#c2d8b4", "#8fb894", "#4a7a63"],
    gradAngle: 0.62,
    layers: 9,
    blur: 2.6,
  },
  // Chain abstraction: el verde vira a agua. Es la página de las cadenas que se
  // funden en una, y las capas suben a doce con el estirado más alto de las
  // nueve — las franjas se distinguen menos entre sí, que es el argumento de la
  // página dicho en el fondo.
  chain: {
    ramp: ["#f5f8f4", "#dfeceb", "#b4d5d4", "#7fb3b5", "#3c6f74"],
    gradAngle: 0.66,
    layers: 12,
    blur: 3.2,
  },
  // Quantum: el frío del set, y el único que se va al azul. Seis capas anchas y
  // el estirado más bajo, así que las estrías se ven una por una: es lo más
  // cerca de una estructura legible que el shader llega a dibujar.
  quantum: {
    ramp: ["#f4f6fa", "#e0e7f2", "#bccbe4", "#8a9fc6", "#465a86"],
    gradAngle: 0.58,
    layers: 6,
    blur: 2.1,
  },
  // Historia: papel envejecido. La única rampa cálida sin verde, y la que menos
  // contraste recorre — se detiene en un pardo, no en una tinta.
  about: {
    ramp: ["#f8f5ec", "#eee6d2", "#dbc9a8", "#b89e78", "#7d6449"],
    gradAngle: 0.68,
    layers: 8,
    blur: 2.8,
  },
  // Comunidad: el verde de marca es el más saturado del set, y es a propósito —
  // es la página que más cerca está de la identidad. Catorce capas: muchas
  // franjas angostas, que es lo que se parece a mucha gente.
  community: {
    ramp: ["#f6faf2", "#e4f2dc", "#bfe4b6", "#83c98d", "#3d8a5c"],
    gradAngle: 0.6,
    layers: 14,
    blur: 2.5,
  },
  // Economía: verde profundo con el estirado bajo y solo siete capas anchas. Es
  // la más quieta de las nueve, que es lo que la página pide — un sistema que
  // compone, no uno que se agita.
  economics: {
    ramp: ["#f6f8ee", "#e5eccd", "#c4d7a5", "#93b581", "#4f7448"],
    gradAngle: 0.64,
    layers: 7,
    blur: 2.3,
  },
  // Ecosistema: la rampa más larga en tono, del papel a un verde casi negro.
  // Dieciséis capas, el máximo del set: son cientos de proyectos y ninguno
  // manda.
  ecosystem: {
    ramp: ["#f7f8f1", "#e8eede", "#c8dcc3", "#8db8a0", "#3f6b58"],
    gradAngle: 0.7,
    layers: 16,
    blur: 3.0,
  },
  // Gobernanza: gris verdoso, la más sobria. Cinco capas —el mínimo— y anchas:
  // pocas decisiones, grandes. Es la única donde las capas se cuentan de un
  // vistazo.
  governance: {
    ramp: ["#f6f7f3", "#e5e8de", "#c6cdbe", "#96a292", "#4e5b4e"],
    gradAngle: 0.56,
    layers: 5,
    blur: 2.4,
  },
  // Fundación: el verde institucional, entre el de protocolo y el de economía,
  // con la luz más baja del set. Diez capas: la mediana exacta, que es lo que
  // le queda a la página que sostiene a todas las demás.
  foundation: {
    ramp: ["#f7f8ef", "#e7edd6", "#c9dcbc", "#95bc9d", "#48765f"],
    gradAngle: 0.72,
    layers: 10,
    blur: 2.7,
  },
};

/**
 * El preset completo de una página: la base más sus cuatro variaciones, con la
 * rampa ya convertida a los cinco uniformes que el shader espera.
 *
 * La conversión pasa acá y no en el componente para que `VARIATION` se pueda
 * leer como lo que es —una tabla de decisiones de diseño, en hex— sin que la
 * mecánica del shader se le mezcle.
 */
export function heroXSurface(page: HeroXPage) {
  const v = VARIATION[page];
  return {
    ...BASE,
    u_blur: v.blur,
    u_gradAngle: v.gradAngle,
    u_layers: v.layers,
    u_c0: hexToRgb(v.ramp[0]),
    u_c1: hexToRgb(v.ramp[1]),
    u_c2: hexToRgb(v.ramp[2]),
    u_c3: hexToRgb(v.ramp[3]),
    u_c4: hexToRgb(v.ramp[4]),
  };
}

/**
 * El color plano que se ve mientras el shader compila, o si WebGL no está.
 *
 * Es la SEGUNDA parada de la rampa y no la primera: la primera es casi el papel
 * de la página, así que un fallback ahí deja el hero indistinguible del fondo
 * hasta que el canvas arranca. La segunda ya es un tono, y el corte contra la
 * sección siguiente se ve desde el primer frame.
 */
export function heroXFallback(page: HeroXPage) {
  return VARIATION[page].ramp[1];
}

/**
 * El velo de legibilidad al pie, en el tono claro de la página.
 *
 * Va sobre el color más claro de SU rampa y no sobre un crema fijo: el velo
 * tiene que desaparecer contra la superficie que cubre, y un crema común sobre
 * la rampa fría de quantum o la parda de about se ve como una mancha.
 */
export function heroXVeil(page: HeroXPage) {
  const [r, g, b] = hexToRgb(VARIATION[page].ramp[0]).map((n: number) =>
    Math.round(n * 255),
  );
  return (
    `linear-gradient(to bottom, transparent 0%, transparent 46%, ` +
    `rgba(${r},${g},${b},0.55) 74%, rgba(${r},${g},${b},0.72) 100%)`
  );
}
