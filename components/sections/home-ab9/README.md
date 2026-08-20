# `home-ab9` — secciones de `/prototype/homepage-ab9`

**Fork de `home-ab7/`,** que a su vez es fork de `home-ab6/`. Nace como copia
byte a byte de ab7, **menos una sección**. `home-ab7/` no se tocó: sigue siendo
el rollback de `/prototype/homepage-ab7`.

Rige el contrato general de [`../README.md`](../README.md), y la nota de
duplicación de ahí explica por qué esto es un fork y no una capa de overrides.

## Lo que ab9 cambia respecto de ab7

### 1. Fuera `QuantumBars` — la sección entera, no solo su animación

`QuantumBars.tsx` y `stairGeometry.ts` **no existen en esta carpeta**. Con ellos
se fue también `BARS_STATEMENT` de `homeAb9Content.ts`, que era la copy que esa
sección pintaba y no la lee nadie más.

Tres piezas que existían *por* la vecina y quedaron sin dueño:

- **`heroGeometry.ts`** — borrado. Exportaba `HERO_UNIT`, un séptimo del
  viewport: el ancho de una columna de la escalera. De esa unidad colgaba la
  juntura entre las dos secciones. `HeroVideo` la declaraba como `--u` en su
  `style` y **no la consumía en ningún lado** — la declaraba para la vecina.
- **El `marginTop: calc(-100svh - 2px)`** con el que QuantumBars montaba encima
  del hero se fue con la sección. Nada quedó colgando: las secciones de ab9 son
  hermanas en flujo normal.
- **El `z-[1]` de `OwnYourOwn`** se queda, pero ya no compite con el `z-[2]` de
  las barras. El comentario del archivo lo dice: hoy sostiene el borde inferior
  animado del gris, no un orden contra una vecina que no está.

El hero sigue llenando el viewport (`100svh`) y su video sigue sobresaliendo por
abajo sin `overflow-hidden`. En ab7 ese sobrante moría bajo los escalones; acá
solo evita un borde duro contra el crema de la sección siguiente.

### 2. Fuera las dos escaleras de `BelongsNewsletter`

La banda stone de "NEAR belongs to you" venía encerrada entre dos
`StairTransition` —una de entrada desde el blanco del stepper, una de salida
hacia el crema—. Las dos se fueron: la banda ahora corta recto contra sus dos
vecinas.

**El primitivo no se tocó.** `components/primitives/StairTransition.tsx` sigue
donde estaba y lo siguen montando `home-ab6`, `home-ab7`, `home-v4` y los
`newsletter-labs`. Acá solo dejó de usarse — ab9 es la versión sin escaleras,
no una poda del recurso.

## Lo heredado

Todo lo que ab9 NO cambia está documentado en
[`../home-ab7/README.md`](../home-ab7/README.md) y en
[`../home-ab6/README.md`](../home-ab6/README.md), y sigue siendo cierto acá: el
hero con el clip de v5 (`hero-descent-v2.mp4`, 24/1, 192 frames, 8.00s), el
`NearStackV2` de track 320svh, el `position: sticky` en vez de `pin: true` de
`OwnYourOwn`, la medición en JS convertida en layout, el scrub sin
`fetch → Blob → objectURL`, los tokens agregados al DS y
`stackArt.generated.tsx`.

**No se re-documenta acá a propósito**: dos copias del mismo texto divergen en
silencio, que es justo lo que la separación por carpeta viene a evitar. Cuando
una de esas piezas cambie EN ab9, su explicación se escribe arriba y deja de
heredarse.

El precio del fork es el de siempre: **un arreglo real en `home-ab7/` no llega
solo acá.** Si se corrige un bug de comportamiento en una, hay que decidir a
mano si aplica en la otra.

## Lo que NO se forkeó

`TestimonialMarquee`, `LatestUpdates` y `UpdatesList` siguen viniendo del
catálogo compartido de `sections/`, y el header y el footer los monta
`app/prototype/layout.tsx`. **Si alguna diverge, se copia a `home-ab9/` en ese
momento** — no antes.
