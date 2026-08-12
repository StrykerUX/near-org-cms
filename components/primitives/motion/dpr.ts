// Densidad de píxel efectiva para dimensionar un canvas.
//
// El tope existe porque el coste de un canvas crece con el CUADRADO del ratio: en
// una pantalla a dpr 3, respetarlo al pie de la letra son 9 veces los píxeles de
// un buffer a dpr 1 para una diferencia que a esas densidades ya no se ve. 2 es
// donde está el codo de esa curva.
//
// Lo consumen el lattice 2D del hero de quantum y los dos canvas WebGL
// (`flowField`, `glyphShine`), que antes repetían el mismo `Math.min(..., 2)`
// cada uno con su propio literal.

export const MAX_DPR = 2;

export function deviceRatio(max: number = MAX_DPR): number {
  return Math.min(window.devicePixelRatio || 1, max);
}
