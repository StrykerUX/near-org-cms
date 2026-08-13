// Una curva de la que se piden las VELOCIDADES, no la forma.
//
// Las eases con nombre (`power2.out`, `sine.inOut`) se eligen por cómo se ven y se ajustan
// probando. Eso alcanza mientras un elemento se mueve solo, y deja de alcanzar en cuanto
// varios se mueven a la vez y tienen que relacionarse entre sí: que el de afuera entre más
// rápido que el de adentro, que el de adentro lo alcance a mitad de camino, que los dos
// aterricen suave. Eso son pedidos sobre la derivada, y no hay forma de traducirlos a un
// nombre de ease — se llega probando, y el resultado no sobrevive a que alguien cambie un
// número al lado.
//
// `hermiteRamp` invierte el trato: se le pide con qué velocidad entra y con cuál sale, y
// devuelve la única cúbica que cumple las dos. Lo consumen las escenas donde varios
// elementos recorren el mismo progreso con perfiles distintos — la cascada de paneles del
// descenso del hero, y el barrido del radar de `quantum/ThreatSequence`, que antes escribía
// a mano el caso `hermiteRamp(3, 0)`.
//
// ── La convención de la velocidad, que es la mitad del valor ─────────────────
//
// En una animación conducida por scroll, la velocidad que uno pide tiene que estar en
// MÚLTIPLOS DE LA VELOCIDAD DEL SCROLL, nunca en píxeles. La razón: un elemento dentro de
// una página que scrollea ya se mueve a 1× sin animarse nada — lo arrastra el documento. Un
// pedido en px no dice nada sin saber cuánto scroll dura el recorrido, y cambia de
// significado entre un portátil y un monitor 4K; un pedido en múltiplos significa lo mismo
// en los dos, y el 1× marca la frontera legible entre "se adelanta" y "se queda atrás".
//
// `OwnYourOwn` ya usaba esta convención antes de que existiera este archivo (sus `SPEEDS`
// son múltiplos, y el drift sale de `1 − speed`).
//
// La conversión de "quiero entrar a `v×` el scroll" a la pendiente `entry` depende del
// recorrido concreto —cuánto scroll dura la ventana del elemento y cuántos píxeles viaja—
// así que vive en quien llama, no acá. La fórmula es `entry = span · (v − 1) · win / viaje`.

/**
 * La cúbica de Hermite en [0,1] con `g(0)=0`, `g(1)=1` y las dos pendientes prescritas.
 *
 *   const g = hermiteRamp(2.9, 0.25);   // entra rápido, aterriza suave
 *   const y = origen - viaje * g(t);
 *
 * `entry` y `settle` son pendientes en unidades de progreso, o sea `d(avance)/d(t)`. Con
 * `entry = settle = 1` sale la recta; por encima de 1 arranca disparado, por debajo arranca
 * lento. Un `settle` bajo es lo que produce el aterrizaje suave.
 *
 * ── El pico de velocidad no se programa, sale ───────────────────────────────
 * Cuando se pide entrada LENTA y salida LENTA sobre el mismo recorrido, la curva no tiene
 * más remedio que acelerar en el medio: hay un máximo interior de `g'` en
 * `t* = (3 − 2·entry − settle) / (3·(2 − entry − settle))` siempre que `entry + settle < 2`.
 * Ese pico es el que hace que un elemento rezagado alcance a los que salieron antes, y es
 * la razón de usar esta familia y no dos eases pegadas.
 *
 * ── Monotonía: probada, no calibrada ────────────────────────────────────────
 * `g'` es una parábola con `g'(0) = entry` y `g'(1) = settle`; solo puede hacerse negativa
 * si abre hacia arriba y su vértice cae dentro de (0,1), y eso exige `entry > 3 − 2·settle`.
 * Por eso `entry` se clampea ahí: con el tope puesto, `g` es monótona creciente para
 * cualquier par de argumentos, así que una escena no puede retroceder por haber pedido mal.
 * El tope es exacto en `settle = 0` (con 3.2 la curva sí retrocede) y algo conservador por
 * encima; se prefiere conservador antes que tener que verificar caso por caso.
 *
 * `t` se clampea a [0,1], así que la función es total: fuera de la ventana devuelve 0 o 1.
 */
export function hermiteRamp(entry: number, settle: number): (t: number) => number {
  const out = Math.min(1, Math.max(0, settle));
  // El tope que vuelve imposible el retroceso. Ver la nota de monotonía.
  const start = Math.min(3 - 2 * out, Math.max(0, entry));
  const a2 = 3 - 2 * start - out;
  const a3 = start + out - 2;

  return (t: number) => {
    const x = t <= 0 ? 0 : t >= 1 ? 1 : t;
    // Horner: dos multiplicaciones en vez de las potencias.
    return x * (start + x * (a2 + x * a3));
  };
}
