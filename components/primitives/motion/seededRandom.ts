// Generador determinista para las escenas que necesitan desorden REPETIBLE.
//
// El caso que lo pide es siempre el mismo: una escena siembra ruido por
// elemento (la deriva en reposo de cada nodo del lattice, qué palabra va en cada
// celda del word field) y después la reconstruye — un resize, un cambio de
// breakpoint. Con `Math.random()` la reconstrucción reshufflea todo y el lector
// ve saltar el campo entero; peor en el word field, donde las palabras dibujan
// una marca y esa marca cambiaría de dibujo bajo el cursor.
//
// Es un LCG (el de ANSI C: a=1103515245, c=12345, m=2³¹). No es aleatoriedad
// criptográfica ni pretende serlo: es ruido visual barato y estable.

/** La semilla por defecto no significa nada — es solo un valor fijo compartido. */
export const DEFAULT_SEED = 4297;

/**
 * Devuelve una función `() => number` en [0, 1). Cada llamada a `createSeededRandom`
 * arranca su propia secuencia, así que dos escenas no se pisan el estado.
 *
 *   const rnd = createSeededRandom();
 *   nodes.push({ ..., seed: rnd() * Math.PI * 2 });
 *
 * Para rearmar la MISMA secuencia (el caso del rebuild por resize), creá un
 * generador nuevo en vez de resetear el estado a mano.
 */
export function createSeededRandom(seed: number = DEFAULT_SEED): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}
