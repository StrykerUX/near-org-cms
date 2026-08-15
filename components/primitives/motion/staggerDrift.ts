// Destiempo entre elementos: varios se mueven con el scroll a velocidades
// distintas, se desfasan entre sí, y NUNCA se superponen.
//
// Módulo puro: recibe cajas ya medidas y devuelve números. Sin DOM, sin GSAP.
// Quien lo usa mide y escribe; acá solo vive la aritmética, que es la parte que
// se puede verificar sin abrir un navegador.
//
// ── Por qué la amplitud sale del LAYOUT y no de una constante ────────────────
//
// El intento anterior (`OwnYourOwn`, antes de esto) declaraba la amplitud en
// `vh` y repartía el desvío con las velocidades. Falla por una razón que no se
// puede tunear: el hueco entre dos elementos se mide en píxeles y escala con el
// ANCHO de la ventana, mientras que `vh` escala con el ALTO. La relación entre
// "cuánto se desvía" y "cuánto espacio hay" cambia con la proporción de la
// pantalla, así que cada ajuste arregla un tamaño y rompe otro. Medido: a 900px
// de alto, dos cards se desplazaban 1156px una respecto de la otra con 640px de
// separación — se cruzaban medio elemento.
//
// Es el MISMO fallo que el docblock de `OwnYourOwn` ya declaraba irreparable en
// su versión con constantes en `svh`. Volvió por otra puerta, y por eso acá la
// dirección se invierte: **el layout decide la amplitud máxima y `k` decide qué
// fracción de ella se usa**. Con `k ≤ 1` el choque es imposible por
// construcción, no por elegir bien los números.

export type DriftBox = {
  /** Borde superior, en coordenadas de documento y SIN transform aplicado. */
  top: number;
  /** Borde inferior, ídem. */
  bottom: number;
  /** Bordes horizontales. Deciden qué pares pueden llegar a chocar. */
  left: number;
  right: number;
};

export type DriftOptions = {
  /**
   * Qué fracción de la amplitud máxima segura se usa. `1` deja los elementos
   * rozándose a `minGap`; por debajo, sobra aire.
   */
  k?: number;
  /** Aire mínimo que tiene que quedar entre dos elementos, en px. */
  minGap?: number;
};

/** Media de las velocidades. Ver `driftOffsets` para por qué se centra. */
function mean(values: readonly number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Dos cajas solo pueden chocar si sus rangos horizontales se cruzan. */
function overlapsInX(a: DriftBox, b: DriftBox): boolean {
  return a.left < b.right && b.left < a.right;
}

/**
 * La amplitud más grande con la que ningún par de elementos se acerca a menos de
 * `minGap`. Devuelve `Infinity` si no hay ningún par que pueda chocar.
 *
 * ── La cuenta ───────────────────────────────────────────────────────────────
 *
 * Con el desvío `d[i] = (media − speed[i]) · A`, el hueco entre un elemento de
 * arriba `u` y uno de abajo `l` después del desvío es
 *
 *     clearance + d[l] − d[u]  =  clearance + (speed[u] − speed[l]) · A
 *
 * Así que solo se encoge cuando el de abajo va MÁS RÁPIDO que el de arriba (que
 * es cuando lo alcanza). Exigiendo que quede en `minGap` se despeja
 *
 *     A ≤ (clearance − minGap) / (speed[l] − speed[u])
 *
 * y la amplitud segura del grupo es el mínimo sobre todos los pares. No se mira
 * solo a los vecinos inmediatos: con desvíos grandes un elemento puede saltar
 * por encima del siguiente y alcanzar al de más allá.
 */
export function driftAmplitude(
  boxes: readonly DriftBox[],
  speeds: readonly number[],
  minGap = 0
): number {
  let limit = Infinity;

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (!overlapsInX(boxes[i], boxes[j])) continue;

      // Cuál está arriba lo decide la posición, no el orden del array.
      const iIsUpper = boxes[i].top <= boxes[j].top;
      const upper = iIsUpper ? i : j;
      const lower = iIsUpper ? j : i;

      const closing = speeds[lower] - speeds[upper];
      // El de abajo va igual o más lento: el hueco se abre, no hay nada que
      // limitar.
      if (closing <= 0) continue;

      const clearance = boxes[lower].top - boxes[upper].bottom;
      limit = Math.min(limit, (clearance - minGap) / closing);
    }
  }

  return limit;
}

/**
 * La amplitud a la que el desvío más grande del grupo iguala al hueco más chico
 * entre dos elementos consecutivos.
 *
 * ── Por qué no alcanza con `driftAmplitude` ─────────────────────────────────
 *
 * El límite por colisión solo mira los pares que PUEDEN chocar, y si esos pares
 * están lejos o sus velocidades se parecen, la amplitud que autoriza es enorme.
 * Medido sobre la geometría real de `OwnYourOwn`: las cards de una misma columna
 * están a 802px y difieren 0.3 en velocidad, así que el límite por colisión daba
 * 2593px — desvíos de ±1102px, más grandes que el bug que esto viene a arreglar.
 * No chocaban; volaban.
 *
 * O sea: no chocar es una condición NECESARIA y no suficiente. Este segundo
 * límite es el que ata la amplitud a la escala del layout — un elemento no se
 * separa de su sitio más de lo que mide el hueco más apretado del grupo — y es
 * el que hace que el efecto se lea como destiempo y no como dispersión.
 *
 * Se mira el hueco entre CONSECUTIVOS por posición, sin importar si se cruzan en
 * horizontal: aunque dos elementos de columnas distintas no puedan chocar, su
 * separación sigue siendo la medida correcta de "cuánto espacio hay acá".
 */
export function spacingAmplitude(
  boxes: readonly DriftBox[],
  speeds: readonly number[]
): number {
  if (boxes.length < 2) return Infinity;

  const byTop = [...boxes].sort((a, b) => a.top - b.top);
  let closest = Infinity;
  for (let i = 1; i < byTop.length; i++) {
    closest = Math.min(closest, byTop[i].top - byTop[i - 1].bottom);
  }
  if (!Number.isFinite(closest) || closest <= 0) return Infinity;

  const centre = mean(speeds);
  const swing = Math.max(...speeds.map((s) => Math.abs(centre - s)));
  if (swing === 0) return Infinity;

  return closest / swing;
}

/**
 * El desvío de cada elemento, en px.
 *
 * ── Las velocidades se centran en su media ──────────────────────────────────
 *
 * `d[i] = (media − speed[i]) · A` y no `(1 − speed[i]) · A`. La diferencia entre
 * dos elementos cualesquiera es idéntica en los dos casos —el término común se
 * cancela— así que el destiempo no cambia; lo que cambia es que el grupo queda
 * BALANCEADO: la suma de los desvíos es cero, nadie se va entero hacia un lado y
 * ningún elemento queda inerte por haberle tocado justo el valor de referencia.
 *
 * Con el `1` fijo, una velocidad de exactamente 1 daba desvío cero y ese
 * elemento no participaba del efecto — que es lo que pasaba con una de las cards.
 *
 * Devuelve ceros si no hay una amplitud segura (grupo mal formado, elementos ya
 * superpuestos en el layout, o `minGap` más grande que el hueco disponible): sin
 * sitio para desviarse, quietos es la respuesta correcta.
 */
export function driftOffsets(
  boxes: readonly DriftBox[],
  speeds: readonly number[],
  { k = 1, minGap = 0 }: DriftOptions = {}
): number[] {
  const zeros = boxes.map(() => 0);
  if (boxes.length !== speeds.length || boxes.length === 0) return zeros;

  // Los DOS límites, y manda el más chico. El de colisión evita que se toquen;
  // el de espaciado evita que se dispersen. Ver `spacingAmplitude` para por qué
  // el primero solo no alcanza.
  const amplitude = Math.min(
    driftAmplitude(boxes, speeds, minGap),
    spacingAmplitude(boxes, speeds)
  );

  if (!Number.isFinite(amplitude) || amplitude <= 0) return zeros;

  const a = Math.max(0, k) * amplitude;
  const centre = mean(speeds);
  return speeds.map((speed) => (centre - speed) * a);
}
