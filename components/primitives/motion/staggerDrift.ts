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

/**
 * Mediana. La usa `spacingAmplitude` cuando el mínimo de los pasos no sirve —
 * ver la nota larga ahí.
 *
 * Con un número par de valores devuelve el menor de los dos centrales y no su
 * promedio: acá la medida se usa como TOPE de amplitud, así que ante la duda
 * conviene el más chico.
 */
function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)];
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
 *
 * ── Cuando los elementos se SOLAPAN en vertical ─────────────────────────────
 *
 * Un layout puede escalonar sus elementos con menos de un alto de separación —
 * es lo que hace `home-ab6/OwnYourOwn`, donde las cards viven en dos columnas y
 * las filas se pisan a propósito para que entren tres en pantalla. Ahí el hueco
 * entre consecutivos es NEGATIVO, y devolver `Infinity` por eso era un fallo
 * silencioso: si además ningún par se cruza en horizontal, `driftAmplitude`
 * también da `Infinity`, el mínimo de los dos no es finito y `driftOffsets`
 * devuelve ceros. El efecto no se rompe: desaparece, sin error.
 *
 * Para esos pares la medida correcta de la escala del layout es el PASO entre
 * bordes superiores, que es lo que separa un elemento del siguiente cuando se
 * pisan. Con hueco positivo el paso siempre es mayor que el hueco, así que usar
 * el hueco donde lo hay mantiene el resultado idéntico al de antes para los
 * layouts que no se solapan.
 */
export function spacingAmplitude(
  boxes: readonly DriftBox[],
  speeds: readonly number[]
): number {
  if (boxes.length < 2) return Infinity;

  const byTop = [...boxes].sort((a, b) => a.top - b.top);
  const spacings: number[] = [];
  for (let i = 1; i < byTop.length; i++) {
    const gap = byTop[i].top - byTop[i - 1].bottom;
    const step = byTop[i].top - byTop[i - 1].top;
    spacings.push(gap > 0 ? gap : step);
  }

  // ── El mínimo no puede ser la única medida ────────────────────────────────
  //
  // Tomar el mínimo a secas tiene un modo de fallo que ya se cobró dos tardes:
  // basta UN par de elementos que compartan borde superior —o casi— para que el
  // mínimo sea 0, la función devuelva `Infinity`, y `driftOffsets` conteste con
  // ceros. El efecto no se rompe, DESAPARECE, y desde afuera se ve como si
  // todos los elementos se movieran a la misma velocidad: la del scroll.
  //
  // Pasa en cuanto un layout escalona con márgenes negativos grandes. En
  // `OwnYourOwn` una card lleva `-mt-[101%]`, y los porcentajes de margen se
  // resuelven contra el ANCHO del contenedor: son ~1700px hacia arriba, así que
  // dos cards terminan con el borde superior a la misma altura y el mínimo se va
  // a cero.
  //
  // La mediana no tiene ese punto de fallo: un par pisado no la mueve, y sigue
  // representando la escala del layout —que es todo lo que esta función quiere
  // medir— mientras la mayoría de los pasos sean sanos.
  //
  // El mínimo se conserva mientras sea positivo, porque cuando lo es es la
  // medida correcta y más conservadora. Solo se cae a la mediana cuando el
  // mínimo deja de ser utilizable, que es exactamente el caso que antes
  // apagaba el efecto.
  const usable = spacings.filter((v) => v > 0);
  if (usable.length === 0) return Infinity;

  const smallest = Math.min(...usable);
  const closest =
    usable.length === spacings.length ? smallest : median(usable);
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

  if (!Number.isFinite(amplitude) || amplitude <= 0) {
    // ── Este caso era MUDO, y ahí estaba el problema ──────────────────────
    //
    // Devolver ceros es la respuesta correcta —sin sitio para desviarse,
    // quietos— pero desde afuera es indistinguible de que el efecto funcione
    // mal: los elementos se mueven con la página, o sea todos a la misma
    // velocidad, y no hay ningún error que lo explique. Encontrarlo cuesta
    // recorrer dos funciones de geometría hacia atrás.
    //
    // El aviso solo existe en desarrollo. En producción el comportamiento es
    // el mismo de siempre.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[staggerDrift] Sin amplitud segura: los elementos quedan quietos. " +
          "Suele ser un layout donde dos cajas comparten borde superior " +
          "—márgenes negativos grandes— o un `minGap` mayor que el hueco disponible.",
        { boxes, speeds, minGap },
      );
    }
    return zeros;
  }

  const a = Math.max(0, k) * amplitude;
  const centre = mean(speeds);
  return speeds.map((speed) => (centre - speed) * a);
}
