# `quantum-security-heroes/` — comparación de hero para `/quantum-security`

Dos variantes del hero de `/quantum-security`, montadas en
`/prototype/quantum-security-h2` y `-h3`. Mismo copy, mismo cuerpo de página
(`quantum-security-copy/*`, sin modificar), solo cambia cómo se compone el
hero.

## De dónde sale cada acomodo

Cada variante copia la composición (jerarquía, alineación, no el copy) de un
hero ya construido en `protocol-labs/hero-labs/`:

| Variante | Referencia | Acomodo |
|---|---|---|
| `HeroH2` | `/prototype/protocol-heroes/h2` (`H2Count.tsx`) | Centrado en vertical, apoyado a la **izquierda** en horizontal |
| `HeroH3` | `/prototype/protocol-heroes/h3` (`H3Threshold.tsx`) | Centrado en vertical **y** horizontal |

**Nota:** al pedido original, H2 se describía como "centrado en los dos
ejes" y H3 como "centrado en vertical, apoyado a la izquierda" — al revés de
la tabla de arriba. Leyendo el código de las dos referencias, es `H2Count`
el que **no** centra el eje horizontal (`Container` sin `items-center` ni
`text-center`) y `H3Threshold` el que centra los dos (`items-center` +
`text-center`). Cada `HeroHN` toma el acomodo real de su `N`, así que si la
lectura visual era la que pedía el mensaje original, el fix es renombrar
los dos archivos (`HeroH2.tsx` ↔ `HeroH3.tsx`) y las dos rutas, no
reescribir el CSS.

Las seis cifras de prueba (`ProofMarquee`) NO viven dentro de ningún hero acá,
aunque `H2Count` sí las trae dentro de las suyas: el brief de esta página
separa "[Hero]" de "[Proof strip]" como dos bloques, y esa sección tiene que
ser idéntica en las tres versiones — meterla dentro del hero en una sola
variante la duplicaría contra el `ProofMarquee` que igual sigue abajo.

## El fondo

Los **dos** heroes llevan fondo ASCII hecho a mano, sin librerías ni
referencia externa — dos efectos DISTINTOS con el mismo lenguaje visual
(grid de dígitos monoespaciados, base al 30% negro, verde `#00dc8d` para lo
activo — mismo verde que `quantumLattice`) y el mismo ritmo: un tick a 10Hz
sobre `gsap.ticker`, nunca un rAF propio.

`asciiField.ts` guarda las piezas de dibujo compartidas (pool de dígitos,
fuente del canvas, dimensionado por DPR, la fuente de bloque 7×9).
`asciiCanvas.ts` (2026-08-23) guarda el ANDAMIO: dimensionar, cortar en
celdas, sembrar el grid, correr el tick, pausar fuera de viewport,
reconstruir en resize y decidir contra `matchMedia` si se anima o se queda un
frame fijo. La máquina de estados de cada efecto es propia y no se comparte.
Hoy lo usa solo el bloom de h2 — está factorizado igual porque es
exactamente lo que se repetía palabra por palabra en cada fondo nuevo, y
todo fondo que se agregue lo va a necesitar. El rain de h3 no lo usa: es
anterior, funciona y comparte canvas con `wordReveal`, así que migrarlo era
riesgo sin ganancia.

- **`BloomField.tsx`** (h2) — "bloom": islas de verde que se forman, derivan,
  se funden y se disuelven. Reemplaza a `PipesField` (las "tuberías",
  borrado 2026-08-23: el equipo pidió rehacer ese fondo de cero). No hay
  entidades, hay un CAMPO: cada celda evalúa una suma de cuatro senos de
  frecuencias no múltiplas entre sí (para que el patrón no cierre y no se
  lea el loop) y se enciende según qué tan cerca esté su valor del centro de
  una franja. Como la franja es un rango y no un umbral, el borde de cada
  isla sale con alpha parcial: entra y sale en rampa y la silueta no puede
  ser recta porque no la dibuja nadie. `EDGE_FEATHER` cierra la banda contra
  los cuatro bordes del canvas para que las islas no queden cortadas por una
  línea; a la izquierda, además, la máscara en gradiente del wrapper las
  desvanece contra el texto. Esa máscara es diagonal (145deg, 2026-08-23):
  en horizontal pura sus curvas de nivel eran rectas verticales de alto
  completo y se leía una raya cruzando la sección de arriba abajo. El panel
  ocupa el 78% del ancho y no el 46% original: con 46% el campo terminaba en
  el canto de su propia caja a mitad de pantalla y la diagonal no tenía nada
  que recortar, así que el borde visible seguía siendo vertical. Interactivo: el cursor no dibuja nada propio —
  ENSANCHA la banda a su alrededor, así que la masa florece donde pasás con
  la forma que el ruido ya tenía ahí (un disco de brillo se leería como un
  objeto pegado encima; esto se lee como el campo reaccionando). Único de
  los tres que repinta el campo entero por tick: no hay "celdas que
  cambiaron", cambian todas un poco. Solo desde `lg:`.
- **el rain + SECURITY de `HeroH3.tsx`** (inline, un solo canvas — ver por
  qué abajo) — columnas de dígitos que SUBEN desde el borde inferior, cada
  una con su propio tramo de 4 celdas encendidas. El campo no llena su caja:
  cada columna tiene su fila de arranque (`topRow`), y entre las tres cosas
  que la fijan —embudo al centro, dentado columna a columna y alguna columna
  suelta más abajo— queda despejado el cuerpo del hero y el borde superior no
  lee como una línea recta. El campo ocupa el 40% de abajo del hero.
  SECURITY (2026-08-23, tercer intento — reemplaza brillo por letra con
  `color-mix` y, después, un canvas chico aparte con 8 caracteres sueltos:
  ninguno leía bien ni era lo pedido) es arte ASCII de BLOQUE dentro de este
  MISMO grid: una región de celdas se ilumina en el patrón de sus letras
  (fuente 7×9 de trazo doble en `blockWordCells()`, `asciiField.ts`) en vez
  de al azar — nada dibujado aparte. Va a sangre de ancho, escalando por
  reparto proporcional de celdas y no por múltiplo entero (con múltiplo
  entero, a 15px de celda, solo se podía elegir entre media pantalla y
  desbordarla), y anclada al borde inferior con un 30% del bloque fuera de la
  sección. Sale en un barrido de izquierda a derecha, celda por celda con su
  propia rampa de alpha (`CELL_FADE_TICKS`), nunca de golpe; mientras está en
  pantalla el rain se pinta gris (`MUTED_RGBA`) para que el único verde de la
  sección sea la palabra. Cíclico — decisión explícita: un reveal único
  rompería la lógica de "esto nunca termina" y quien llegue tarde a la
  pestaña no lo vería nunca.
  Accesibilidad: como SECURITY ya no es una palabra en el flujo del titular,
  el `<h1>` se separa en un bloque visible `aria-hidden` ("Post-quantum" /
  "live on mainnet") y un `sr-only` con la oración completa y real — eso es
  lo único que anuncia un lector de pantalla o indexa un buscador para este
  heading.
Con `prefers-reduced-motion`: los dos quedan en un frame fijo, no vacíos —
el bloom deja sus islas quietas y SECURITY queda resuelta y sostenida. El
punto de la preferencia es evitar movimiento, no esconder contenido. Los dos
se pausan enteros fuera de viewport (`onViewportToggle`, el mismo mecanismo
que ya usa `quantumLattice`).

En mobile, el bloom cae detrás del texto a ancho completo, así que ahí queda
solo el ruido base. Es una decisión tomada con el usuario, no una omisión.

El rain (+ SECURITY, que vive en el mismo canvas) va inline en `HeroH3.tsx` y
no en su propio archivo, a diferencia del bloom: comparte el mismo
grid de celdas que `wordReveal` — separarlos en dos canvas hubiera
significado coordinar posición entre dos sistemas de coordenadas por un
acoplamiento que ya existe naturalmente estando en el mismo lugar.

## Sobre las variantes de fondo (2026-08-23, retiradas)

Hubo una ronda con dos fondos adicionales por hero (h2: "nodo de
convergencia" / "retícula rota"; h3: "deriva hacia el centro" / "horizonte
quebrado"), como rutas `-v2`/`-v3` separadas, más dos páginas consolidadas
(`-h2-variants`, `-h3-variants`) apilándolas para comparar. El usuario pidió
retirar toda esa dirección y volver a iterar sobre las dos bases (h2, h3)
únicamente — los archivos (`PipesFieldV2/V3.tsx`, `HeroH2V2/V3.tsx`,
`HeroH3V2/V3.tsx`, las views y rutas `-v2`/`-v3`/`-variants`) se borraron.
`wordReveal.ts` y `asciiField.ts` quedaron: los sigue usando el base de h3.

## Qué NO cambia entre versiones

`ProofMarquee`, `ThreatSequence`, `MathStatement`, `LiveToday`, `FieldBreak`,
`BeyondAccounts`, `Comparison`, `Roadmap`, `InTheNews`, `QuantumFaq` y
`ClosingRing` se importan sin modificar desde `quantum-security-copy/`. Dos
de ellas — `Roadmap` e `InTheNews` — es explícitamente lo que pidió no
tocarse; el resto quedó igual porque el pedido fue variar el hero, no la
página.
