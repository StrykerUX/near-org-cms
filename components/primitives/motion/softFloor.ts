// Un piso que frena en vez de chocar.
//
// `Math.max(x, 0)` es la forma obvia de impedir que algo pase de un tope, y en una
// animación conducida por scroll es también la forma obvia de que se vea un golpe: la
// función es continua pero su DERIVADA no, así que en el codo la velocidad del elemento
// pasa de lo que traía a cero en un frame. Eso es exactamente lo que el ojo lee como
// frenazo, y no lo arregla ninguna curva de easing por encima — la curva reparte el
// recorrido en el tiempo, pero el corte lo produce el clamp.
//
// Lo consumen las animaciones cuyo elemento viaja hasta un borde y se queda ahí, donde
// el clamp es la LLEGADA y no una red de seguridad. El precedente que motivó extraerlo
// es la cascada de paneles del descenso del hero, pero el patrón ya estaba resuelto a
// mano en `quantum/ThreatSequence.tsx` con una cúbica que llega al tope con pendiente
// nula — la misma idea, escrita otra vez porque no había dónde buscarla.
//
// NO es para clamps de seguridad —acotar un `currentTime` de vídeo contra su duración,
// o un índice contra el largo de un array—: ahí el tope no se ve y una parábola solo
// agrega confusión. Es para clamps que el lector MIRA.

/**
 * `max(x, 0)` con los últimos `k` píxeles redondeados.
 *
 * Es C¹ en los dos empalmes —en `x = k` vale `k` con derivada 1, en `x = −k` vale 0 con
 * derivada 0— así que la VELOCIDAD llega a cero de forma continua. Esa continuidad es
 * todo el efecto.
 *
 *   const y = floorY + softFloor(libre - floorY, 0.25 * unitPx);
 *
 * `k` es el radio del amortiguador en las mismas unidades que `x`, y conviene pensarlo
 * como distancia y no como fracción: es cuántos píxeles antes del tope empieza a frenar.
 * Con `k <= 0` devuelve el `Math.max` de siempre, que es la comparación honesta para
 * decidir si el amortiguador está aportando algo.
 *
 * Es una parábola y no un softplus a propósito: llega a cero EXACTO en vez de acercarse
 * asintóticamente (que dejaría el elemento medio píxel corto para siempre), no tiene
 * `exp` que pueda desbordar, y cuesta dos comparaciones y una multiplicación.
 *
 * Monótona creciente en `x`, así que no rompe la reversibilidad de un scrub: si lo que
 * le entra es función pura del progreso, lo que sale también.
 */
export function softFloor(x: number, k: number): number {
  if (k <= 0) return x > 0 ? x : 0;
  if (x >= k) return x;
  if (x <= -k) return 0;
  const t = x + k;
  return (t * t) / (4 * k);
}
