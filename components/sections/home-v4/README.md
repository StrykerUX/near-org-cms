# `home-v4` — secciones de `/prototype/homepage-v4`

**Fork de `home-v2/`** tomado en `eb12be8` (PR #7, footer takeover + rediseño de
NearStack). Nace como copia byte a byte y existe para poder rediseñar sin tocar
`/prototype/homepage-v2`, que se queda como está.

Que sea un fork y no una capa de overrides es deliberado: las dos páginas van a
divergir de verdad, y una jerarquía de props condicionales entre ellas terminaría
haciendo que cada cambio en v4 tenga que probarse también en v2. Copiar cuesta
duplicación; compartir costaría no poder mover nada. Ver la nota de duplicación
de [`../README.md`](../README.md).

El precio a pagar: **un arreglo real en `home-v2/` no llega solo acá**. Si se
corrige un bug de comportamiento en una de las dos, hay que decidir a mano si
aplica en la otra.

Todo lo que este archivo documenta más abajo describe el estado heredado de v2 y
sigue siendo cierto mientras el código no se toque. **A medida que v4 diverja,
esas secciones hay que actualizarlas o borrarlas** — no dejarlas mintiendo.

## Lo que NO se forkeó

Rige el contrato general de [`../README.md`](../README.md).

| Pieza | De dónde sale | Por qué no se copió |
|---|---|---|
| el header del sitio | `components/site/SiteHeader` | lo monta `app/prototype/layout.tsx`; ninguna view lo importa |
| `TestimonialMarquee`, `LatestUpdates`, `UpdatesList` | `sections/` | catálogo compartido, idénticas en las dos páginas |
| `primitives/`, `primitives/motion/` | `components/primitives/` | infraestructura del DS — se comparte siempre |

**Si alguna diverge, se copia a `home-v4/` en ese momento** — no antes. Dos
archivos idénticos en dos carpetas divergen en silencio, que es exactamente lo
que la separación por carpeta viene a evitar.

`NavPillV2.tsx` tampoco se copió: desde `eb12be8` ya no lo importa nadie ni
siquiera en v2. Su `NAV_LINKS` se quitó de `homeV4Content.ts` con él.

## Lo que se decidió distinto del original

### `NearStack`: track sticky sobre los SVG de marca (rediseño 2026-08)

`NearStack` no es un port del original. Pasó por dos rediseños:

1. Primero, la escena de scroll del original se cambió por un **acordeón por
   hover**: un estado `active` único contra un rail de cuatro cajas, todo por
   transición CSS, con la geometría isométrica calculada en un módulo propio
   (`nearStackGeometry.ts`).
2. Ahora vale la versión que trae la rama `homepage_LN_v03`: **arte isométrico
   de cubos exportado de los SVG de marca** (`stackArt.generated.tsx`, ver
   abajo) con z-layering real de la columna, y **build-up por scroll** sobre un
   track sticky. `nearStackGeometry.ts` se retiró — el arte ya no se calcula,
   viene dibujado.

Lo que hace hoy, en corto:

- **Track sticky de `460svh`** con un viewport `h-svh` adentro, encendido por
  `data-mode=track`. Nunca `pin: true` — la regla del repo sigue en pie, y el
  archivo lo dice en su propio comentario.
- **Rail de cajas colapsables**, sin numeración y con strokes cream que pasan a
  verde mint al abrir. Click en cualquier barra salta a su parada del track.
- **Hover por pieza**: la columna atenúa a los hermanos, y un *sheen* recorre el
  contorno de la pieza hovereada, cubo por cubo, con las puntas suavizadas.
- **Bubbles de producto ancladas al cursor** para los tres segmentos del anillo
  de AI (IronClaw, NEAR AI Cloud, Agent Market).
- `PROTOCOL_FEATURES` pasó de una lista de strings a `{ name, sub?, desc }` con
  copy verbatim del doc de sitemap (tab Protocol, secciones 4–9).

Los destinos de los links son los confirmados para el sitio —intents.near.org,
near.ai, near.com— y no los que traía la rama, que apuntaba Protocol a
`/prototype/protocol`, una ruta que ya no existe.

Esta sección vive **solo en `home-v4`**: `home-v2` se quedó a propósito con el
acordeón del punto 1, como registro de esa iteración.

### `pin: true` → `position: sticky` (`OwnYourOwn`)

El original pinnea dos secciones. Este repo lo prohíbe: el pin-spacer pelea con
Lenis, realimenta el `ResizeObserver` de `PrototypeMotionProvider` y en
StrictMode deja spacers fantasma. El razonamiento completo está en
[`../README.md`](../README.md).

En `OwnYourOwn` la conversión **no es mecánica**, porque el signo de la
velocidad cambia: pinneado, el documento está quieto y `y = −SPEED·s` es lo que
se ve; con sticky el documento aporta `−1·s`, así que hace falta
`y = (1 − SPEED)·s`. El detalle está comentado en el archivo.

El efecto lateral bueno: el original tiene que **medir** para deducir cuánto dura
el bloqueo, y para eso escribe `grid.style.marginTop`/`marginBottom` en vivo con
un `MutationObserver` que los repara. Acá el recorrido se **declara** en CSS y
las posiciones se derivan de él, así que desaparecen `measureRaw()`, el
observer, el handler de resize y el anti-duplicado de pin-spacers.

### Medición en JS → layout (varias)

| Original | Acá |
|---|---|
| `initBelongsGeometry` calcula 14 alturas de barra y las escribe | `ZigguratDivider` con porcentajes |
| `sizeRail()` + `ResizeObserver` para el `minHeight` de los títulos | los 6 títulos en la misma celda de grid |
| clon del `<h2>` + `ResizeObserver` sincronizando `left/top/width` | dos capas de texto en la misma celda de grid |
| `height: scrollHeight → auto` con `onComplete` diferido | `grid-template-rows: 0fr → 1fr` |

### `fetch → Blob → objectURL` para el video: eliminado (`HeroVideo`)

El original descarga el mp4 entero a memoria antes de poder hacer seek, porque
su servidor de preview no responde HTTP Range. Next sirve `public/` con Range en
dev y en producción (verificado: `206` con `Range: bytes=0-1023`), así que se
scrubbea `currentTime` directo. Si algún entorno devuelve `200` en vez de `206`,
el video deja de ser seekable y hay que reponer ese rodeo.

## Lo que se perdió a propósito

- **`initBarFields`, `initQuantumBarEffect`, `[data-sr-stack]`.** Código muerto
  en el original: sus selectores no existen en el HTML o la función no se llama.
- **`image-slot.js`.** Web component de placeholder del canvas de diseño. Su
  reemplazo es `next/image`.

## `stackArt.generated.tsx`

Reemplaza a `nearStackGeometry.ts`, que calculaba los prismas isométricos con
back-face culling y ya no existe. Acá el arte **no se calcula**: son los SVG de
marca exportados a componentes por un script de una sola vez.

**No editar el path data a mano.** Ocho componentes, en pares verde/wire:
`ColumnGreen`/`ColumnWire`, `AiRingGreen`/`AiRingWire`,
`IntentsGreen`/`IntentsWire`, `NearcomGreen`/`NearcomWire`.

Lo que el componente engancha por atributo:

- **`data-stack-cube="0"…"5"`** en la columna (Protocol), de arriba hacia abajo.
  Es el índice que mapea contra `PROTOCOL_FEATURES`.
- **`data-stack-seg="ironclaw" | "cloud" | "market"`** en el anillo de AI,
  estampado por región (derecha / arriba-izquierda / abajo). Si una cara se
  enciende con el segmento equivocado, se re-ajusta en el generador, no acá.

Los anillos y las carcasas se emiten **verbatim** —grupos de blend anidados,
máscaras y orden de dibujo intactos—: re-parsear su estructura pierde caras sin
avisar.

También: el `fill` de las caras opacas sale de `--ink`, el mismo token que el
fondo de la sección. El culling solo se lee como oclusión sólida si coinciden
**exactamente**; con dos literales distintos se verían las aristas de atrás.

## Tokens agregados al DS

En `app/globals.css`, todo aditivo. Colores: `--ink`, `--near-green-accent`,
`--gray-blue`, `--bar`, `--card-tint`, `--ink-deep`, `--sweep`. Roles
tipográficos: `--text-statement` (entre `h1` y `display`) y `--text-rail`
(decorativo, por encima de `display`).

Los tres verdes —`--near-green` (#00ec97), `--near-green-dark` (#00c97f) y
`--near-green-accent` (#00DC8D)— **no son alias**: el rebuild los usa en tres
jerarquías distintas y unificarlos aplana el contraste entre ellas.

## Geometría compartida hero ↔ barras

`heroGeometry.ts` exporta `HERO_UNIT` (`calc(100vw / 7)`), el ancho de una columna de
la escalera. De esa unidad salen el alto del hero (`100svh − u·1.75`), el alto
del video (`100% + u·1.5`) y el `margin-top` negativo de `QuantumBars`. El efecto
neto es que el top de `QuantumBars` queda **siempre** a `100svh − u·1.75` del
documento, que es exactamente donde termina el video: los escalones nacen del
borde inferior de la imagen.

Vive en su propio módulo puro y no exportada desde `HeroVideo.tsx` —que es donde
estaba— porque `QuantumBars` la importaba de ahí: dos secciones acopladas a nivel
de módulo por una constante, y un componente cliente actuando de fuente de
geometría para otro.

Cambiar uno de esos números sin los otros rompe la juntura, en silencio y solo a
ciertos anchos de ventana.
