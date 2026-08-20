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

### 3. `ProofStepper` → `ProofDatum`

Seis pruebas colgando de un eje que cruza el ancho, alternando arriba y abajo,
en lugar del carril sticky que pasaba cinco de a una.

Es la versión **B · Datum** de [`../proof-alt/`](../proof-alt/README.md), el
laboratorio donde se compararon tres estructuras para estas mismas seis pruebas.
**Copiada, no importada** — lo pide el README de esa carpeta: es un laboratorio,
su contenido puede cambiar o borrarse sin aviso, y ya pasó dos veces.

No es un reskin. El stepper gastaba 325svh para entregar cinco datos de a uno;
esto mide lo que mide su contenido y muestra las seis desde el primer frame.

**El cambio respecto del lab: fichas más anchas y desfasadas.** Allá la retícula
es de seis columnas y cada ficha ocupa una (1/6 = 16.7%), y el propio README del
lab anota que a esa medida la cifra queda apretada. Acá son **trece columnas con
fichas de tres** (3/13 = 23%, ~365px contra ~250px), arrancando en 1/5/9 arriba
y en 3/7/11 abajo: cada ficha de abajo empieza dos columnas después de la de
arriba que la precede, así que se solapa con sus vecinas de la otra fila por un
tercio de su ancho, sin colisionar con ellas.

Lo que se calibra es el par **ancho/desfase**, no el ancho solo: con desfase de
una columna el solape sube a dos tercios y las fichas se leen encimadas; con
desfase de tres desaparece y vuelven a ser dos filas de tres. Trece columnas es
el mínimo donde ese par entra sin desbordar.

`ProofStepper.tsx` no está en esta carpeta, y `PROOF_STEPS` salió de
`homeAb9Content.ts`. Los datos nuevos son otros —cambia la cantidad, las cifras
y los rótulos—, y se copiaron de `proofAltContent.ts` sin tres campos que allá
existen para las otras dos versiones del lab (`plain`, `short`, `count`).

### 4. `NearStackV2` → `StackAnchors`

El mismo ensamble isométrico, pero con las cuatro capas escritas **en las cuatro
esquinas**, cada una anclada a la pieza de la que habla, en vez de en una columna
al lado del arte.

Es la variante **C · Anchors** de [`../stack-labs/`](../stack-labs/README.md).
**Copiada, no importada**, igual que `ProofDatum` — y acá la copia arrastra tres
archivos más, que son la infraestructura de la escena:

| Archivo | Qué es |
|---|---|
| `stackAssembly.tsx` | el ensamble isométrico (usa `stackArt.generated.tsx`, que ya estaba) |
| `useStackScene.ts` | el recorrido de 200svh, el hover por delegación y el tag al cursor |
| `StackCursorTag.tsx` | la tarjeta que sigue al puntero |

Esos tres son idénticos a los del lab salvo por sus imports. El README del lab
deja abierta la pregunta de si el arte y la escena se promueven a módulos
compartidos de verdad; **acá no se decidió eso**, se copiaron. Si una segunda
página los necesita, esa es la señal para promoverlos.

`NearStackV2.tsx` ya no está en esta carpeta. `stackArt.generated.tsx` sí: lo
sigue usando `stackAssembly`.

**Lo que cambia respecto del lab**, y es el pedido del prototipo:

1. **Sin titular.** El lab abre con "The NEAR Stack" centrado. Con cuatro fichas
   en las esquinas y el arte en el medio, un quinto bloque de texto solo empuja
   al resto contra los bordes.
2. **La ficha es otra cosa.** Cuatro registros tipográficos, cada uno con su
   trabajo: el nombre en mono a escala de heading, una regla con el destino
   externo, el cuerpo en sans, y abajo las piezas de la capa y las capacidades
   del stack en mono.
3. **Copy nueva** en `nearStackContent.ts` para los cuatro cuerpos, más dos
   constantes que el stack no tenía: `STACK_PIECES` (las piezas de Intents
   y de AI, como etiquetas — Protocol no lleva: las suyas son los cubos de la
   columna y cada uno se cuenta solo al pasar el puntero) y `STACK_CAPABILITIES` (las seis capacidades, iguales en las
   cuatro fichas — la repetición es el mensaje).

`--text-h4-mono` entra al DS: las otras dos monos son letra pequeña, y acá la
monoespaciada es el titular.

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
