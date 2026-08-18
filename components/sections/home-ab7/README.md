# `home-ab7` — secciones de `/prototype/homepage-ab7`

**Fork de `home-ab6/`.** Nace como copia byte a byte de esa carpeta, con dos
piezas cambiadas y una borrada. `home-ab6/` no se tocó: sigue siendo el
rollback de `/prototype/homepage-ab6`.

Rige el contrato general de [`../README.md`](../README.md), y la nota de
duplicación de ahí explica por qué esto es un fork y no una capa de overrides.

## Lo heredado

Todo lo que ab7 NO cambia está documentado en
[`../home-ab6/README.md`](../home-ab6/README.md) y sigue siendo cierto acá:
`QuantumBars` y su juntura con el hero vía `heroGeometry.ts`, el
`position: sticky` en vez de `pin: true` de `OwnYourOwn`, la medición en JS
convertida en layout, el scrub sin `fetch → Blob → objectURL`, los tokens
agregados al DS y `stackArt.generated.tsx`.

**No se re-documenta acá a propósito**: dos copias del mismo texto divergen en
silencio, que es justo lo que la separación por carpeta viene a evitar. Cuando
una de esas piezas cambie EN ab7, su explicación se escribe en esta sección y
deja de heredarse.

El precio del fork es el de siempre: **un arreglo real en `home-ab6/` no llega
solo acá.** Si se corrige un bug de comportamiento en una, hay que decidir a
mano si aplica en la otra.

## Lo que ab7 cambia respecto de ab6

### 1. El hero usa el clip de v5 (`HeroVideo`)

Solo el ASSET:

```
src    /prototype/v2/hero-descent.mp4     → /prototype/v2/hero-descent-v2.mp4
poster /prototype/v2/hero-descent-poster  → /prototype/v2/hero-descent-v2-poster
```

Lo que **no** cambió, y es la diferencia con `home-v4/HeroVideo` (el que monta
v5): acá el componente sigue siendo el de ab6 —conserva su bajada y su intro de
titular por `SplitText`—, mientras que v5 monta el de v4 con `subheading={false}`
y con las máscaras permanentes en el JSX. Si además se quiere el hero *sin
bajada* o *sin el pop del `split.revert()`*, eso es un segundo cambio y hay que
pedirlo aparte.

El clip nuevo está medido con `ffprobe`: **24/1, 192 frames, 8.00s, 2560×1440**,
contra 24/1, 193 frames, 8.04s del viejo. Como el fps y la duración coinciden,
`FPS`, `SCRUB_RATE`, `CHASE` y `CHASE_DOCKING` quedaron como estaban — están
calibrados contra "un descenso continuo de 8s" y eso sigue valiendo.

Lo que sí cambió de tamaño y está reflejado en los comentarios del archivo: el
mp4 pasa de 12.7MB a **19MB**, y el poster de 59KB a **216KB**. `preload="metadata"`
y las range requests son justamente lo que hace que ese peso no bloquee el
primer paint, pero el scrub sí pide más bytes a medida que se scrollea.
`public/prototype/v2/hero-descent-v2-1080.mp4` (14MB) existe como fallback
liviano y **ninguna view lo usa hoy**.

### 2. El stack es `NearStackV2`, no `NearStack`

Copiado de `home-v4/NearStackV2.tsx` — la iteración con anillos continuos detrás
de la columna (copias de fondo sin máscara; el porqué está en el propio archivo).
Track de **320svh** contra los 460svh del `NearStack` de ab6.

`NearStack.tsx` **no está en esta carpeta**: ab7 no lo monta, y dejarlo sería un
archivo muerto divergiendo en silencio. Vive en `home-ab6/` y en `home-v2/`.

`stackArt.generated.tsx` es el de ab6, no el de v4. Los dos difieren solo en un
atributo `data-stack-shadow` que la copia de v4 estampa y que **no lee nadie** —
`NearStackV2` engancha por `data-shadow-when`, que emite su propio `<svg>` de
sombras. Verificado con un grep global antes de decidirlo.

### 3. `homeAb6Content.ts` → `homeAb7Content.ts`

Renombrado, mismo contenido. Los imports de `CustomerStories`, `ProofStepper`,
`QuantumBars` y `OwnYourOwn` apuntan acá.

## Lo que NO se forkeó

`TestimonialMarquee`, `LatestUpdates` y `UpdatesList` siguen viniendo del
catálogo compartido de `sections/`, y el header y el footer los monta
`app/prototype/layout.tsx`. **Si alguna diverge, se copia a `home-ab7/` en ese
momento** — no antes.
