import { hermiteRamp } from "@/components/primitives/motion/velocityRamp";

// La escalera de transición, en su forma reutilizable: silueta y coreografía,
// sin DOM, sin GSAP y sin píxeles.
//
// ── Por qué esto existe aparte de `stairGeometry.ts` ─────────────────────────
//
// El hero ya tiene una cascada de escalones (`sections/home-v4/stairGeometry.ts`,
// consumida por `QuantumBars`), pero no se puede reutilizar. Su firma lo delata:
//
//     cascadeEdges({ eased, seamY, seamY0, span, viewportH, unitPx, drop, line, … })
//
// `seamY`, `budget` y `floorY` son el modelo del HERO — una juntura anclada en el
// documento y una escalera que sube a taparla, calibrada sobre ~1000px de
// recorrido. Una banda decorativa de 300px entre dos secciones no tiene juntura
// ni nada que cubrir, así que heredaría un vocabulario que no le aplica.
//
// La partición que sí viaja:
//
//   · ACÁ (puro, normalizado) — dado un progreso 0→1 y un anillo, cuánto avanzó
//     ese anillo. Nada más.
//   · EN CADA CONSUMIDOR — qué significa ese avance en píxeles. El hero lo mapea
//     contra su juntura; `StairTransition` lo mapea al `scaleY` de su propia caja.
//
// Una coreografía, dos mapeos. El recorrido es una ENTRADA, no un supuesto.
//
// Deuda declarada: hoy hay dos implementaciones de la cascada. Lo correcto es que
// `cascadeEdges` pase a ser el mapeo juntura→píxeles sobre este núcleo, pero eso
// toca `QuantumBars`, que es la pieza más calibrada de la página, y va en un
// cambio aparte.

/**
 * El perfil de la escalera con `depth = 1`, en % de la caja.
 *
 * Siete columnas y no un `count` configurable: el único consumidor de hoy es el
 * separador de `BelongsNewsletter`, y el repo ya tuvo el problema inverso —una
 * prop de altura libre que terminó con dos secciones llevando escaleras distintas
 * y el patrón dejando de leerse como el mismo elemento. Cuando aparezca un
 * segundo consumidor que necesite otro número, ESE es el momento de abrirlo.
 *
 * Es palindrómico a propósito: la silueta se espeja invirtiendo las alturas
 * (`100 − h`), no dando vuelta el array.
 */
const PROFILE = [100, 70, 40, 0, 40, 70, 100] as const;

/** Dónde queda el escalón más alto. */
export type StairPeak = "edges" | "center";

/**
 * Si la escalera se ARMA o se DESARMA a lo largo del recorrido.
 *
 * Dos transiciones que encierran una sección se leen como que esa banda se abre
 * y se cierra si la de arriba entra y la de abajo sale. Es lo que hace la
 * escalera del hero, que tiene los dos gestos.
 */
export type StairMode = "enter" | "exit";

// Las perillas calibradas que NO se exponen. Son las que el docblock de
// `velocityRamp` advierte que no hay que retocar a ojo: se piden por su efecto
// sobre la derivada, no por cómo se ven, y salen mal probando de a una.
//
// Los cuatro valores vienen de `CASCADE`, la tabla con la que está calibrada la
// escalera del hero, para que las dos figuras de la misma página se lean como el
// mismo gesto.
const SPREAD = 0.11;
const LAND = 0.92;
const LAG = 0.02;
const SETTLE = 0.25;
const FAST = 2.9;
const SLOW = 1.35;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * La silueta, en % de la caja y por columna.
 *
 * `depth` es la primera de las dos variables del efecto:
 *
 *   0 → todas las columnas al 100%: una banda de color plana, sin escalera
 *   1 → el perfil completo, con el escalón más bajo en 0%
 *
 * La interpolación va desde la banda llena y no desde el vacío
 * (`100 − depth·(100 − base)`) para que `depth = 0` siga siendo una transición
 * legible entre dos colores y no la desaparición del divisor.
 */
export function stairHeights(depth: number, peak: StairPeak = "edges"): number[] {
  const d = clamp01(depth);
  return PROFILE.map((h) => {
    const base = peak === "center" ? 100 - h : h;
    return 100 - d * (100 - base);
  });
}

/**
 * El anillo de cada columna, DERIVADO DE SU ALTURA y no de su posición.
 *
 * Esta distinción es el bug que costó una iteración entera, así que vive acá y no
 * en el llamador: numerar los anillos de afuera hacia adentro (`min(i, n−1−i)`)
 * coincide con la figura solo mientras el escalón más alto sea el exterior. Con
 * la silueta espejada (`peak: "center"`) el más alto pasa a ser el central, y con
 * el mapeo posicional la cascada arrancaba por las columnas de altura 0 —o sea
 * animando nada— y dejaba el escalón grande para el final Y con la velocidad más
 * lenta de todas. Se veía abrirse a media altura.
 *
 * El anillo 0 es siempre el escalón más alto, que es por donde entra la cascada
 * en las dos orientaciones.
 *
 * Con `depth = 0` todas las alturas son iguales: devuelve un solo anillo, y la
 * cascada degenera en un barrido uniforme sin ningún caso especial.
 */
export function stairRings(heights: number[]): number[] {
  const levels = [...new Set(heights)].sort((a, b) => b - a);
  return heights.map((h) => levels.indexOf(h));
}

export type RingAdvanceInput = {
  /** Progreso del recorrido, 0→1. Lo provee el scroll. */
  progress: number;
  /** Anillo de esta columna. 0 = el escalón más alto. */
  ring: number;
  /** Cuántos anillos distintos hay. */
  rings: number;
  /** La segunda variable del efecto. Ver abajo. */
  lead: number;
  /** Armar o desarmar. Por defecto arma. */
  mode?: StairMode;
};

/**
 * Cuánto avanzó un anillo, de 0 (sin entrar) a 1 (en su sitio).
 *
 * `lead` es la segunda variable, y colapsa en un eje las tres perillas que hacen
 * la cascada:
 *
 *   0 → los anillos arrancan juntos y avanzan al mismo ritmo lineal: un barrido
 *       uniforme, sin escalonado ni gradiente de velocidad
 *   1 → la cascada completa: el escalón más alto arranca primero y entra a 2.9×,
 *       el más bajo arranca último y entra a 1.35×
 *
 * Que en 0 quede un barrido usable —y no el efecto roto— es lo que hace que la
 * variable se pueda mover sin leer este archivo.
 *
 * `hermiteRamp` devuelve la única cúbica con las dos pendientes pedidas, y ya
 * clampea `t` a [0,1], así que fuera de la ventana del anillo esto da 0 o 1 sin
 * guardas extra.
 *
 * ── La salida no es la entrada reproducida al revés ──────────────────────────
 *
 * Con `mode: "exit"` pasan DOS cosas, y hacen falta las dos:
 *
 *   · el avance se invierte (`1 − g`), o sea la escalera empieza formada y se
 *     retira;
 *   · el orden de los anillos se da vuelta, así que el escalón más BAJO se retira
 *     primero y el más alto último.
 *
 * Sin lo segundo el hueco se cerraría desde los mismos escalones por los que se
 * abrió, y el par de transiciones que encierra una sección se leería como dos
 * veces el mismo gesto en vez de como una banda que se abre y se cierra. Es la
 * misma decisión que toma la escalera del hero para su retiro, y ahí está escrito
 * por qué no alcanza con intercambiar `fast` y `slow`: eso dejaría las velocidades
 * invertidas pero los arranques en el orden viejo.
 */
export function ringAdvance({
  progress,
  ring,
  rings,
  lead,
  mode = "enter",
}: RingAdvanceInput): number {
  const l = clamp01(lead);

  // ── El recorrido se usa entero ────────────────────────────────────────────
  //
  // Los aterrizajes viven en [0, LAND] —el último anillo toca su sitio en 0.92—
  // así que sin esto el 8% final del recorrido no mueve nada. En el hero ese
  // margen tiene sentido porque el recorrido lo define la altura del hero y
  // sobra tramo; acá el recorrido lo define este componente, y ese 8% se traduce
  // en scroll real en el que la figura ya está quieta pero el separador todavía
  // no llegó a donde el gesto tenía que terminar. Se veía como que la escalera
  // cerraba antes de tocar el techo.
  //
  // Reescalando, el aterrizaje del último anillo cae exactamente en `progress: 1`.
  const p = clamp01(progress) * LAND;

  const span = rings - 1;
  // `max(1, …)` y no `span` pelado: con `depth = 0` hay un solo anillo y esto
  // sería una división por cero.
  const last = Math.max(1, span);

  // El anillo EFECTIVO. Dar vuelta el índice invierte el gesto entero —arranques
  // escalonados y gradiente de velocidad— sin duplicar constantes ni tocar el
  // reloj. El guard de `span > 0` evita que con un solo anillo el índice se
  // vaya fuera de rango y pida una velocidad que no existe.
  const r = mode === "exit" && span > 0 ? span - ring : ring;

  const startAt = l * SPREAD * r;
  const landAt = LAND - l * LAG * (last - r);
  const win = Math.max(1e-3, landAt - startAt);

  // La velocidad de entrada de ESTE anillo. Se interpola desde 1 —o sea, lineal—
  // hacia el par `FAST`/`SLOW`, así que `lead = 0` deja los anillos indistintos.
  const v = 1 + l * (FAST - 1 + ((SLOW - FAST) * r) / last);

  const advance = hermiteRamp(v, SETTLE)((p - startAt) / win);
  return mode === "exit" ? 1 - advance : advance;
}
