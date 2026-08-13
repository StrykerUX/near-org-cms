# `home-v2` — secciones de `/prototype/homepage-v2`

Port del rebuild de la homepage que llegó como paquete de "design canvas"
(`Homepage.dc.html` + `effects.js`, 706 + 1471 líneas) al design system del repo.

Rige el contrato general de [`../README.md`](../README.md). Este archivo solo
documenta lo que es propio de este port.

## Qué se comparte con `/prototype/homepage`

Cuatro secciones del rebuild quedaron **idénticas** a las que ya existían, así
que la vista las importa de `components/sections/` en vez de duplicarlas:

| Sección del rebuild | Componente que se usa |
|---|---|
| Quotes (marquee) | `TestimonialMarquee` |
| The latest from NEAR | `LatestUpdates` |
| Latest updates | `UpdatesList` |
| Footer | `PrototypeFooter` |

**Si alguna diverge, se copia a `home-v2/` en ese momento** — no antes. Dos
archivos idénticos en dos carpetas divergen en silencio, que es exactamente lo
que la separación por carpeta viene a evitar.

## Lo que se decidió distinto del original

### `pin: true` → `position: sticky` (`OwnYourOwn`, `NearStack`)

El original pinnea dos secciones. Este repo lo prohíbe: el pin-spacer pelea con
Lenis, realimenta el `ResizeObserver` de `PrototypeMotionProvider` y en
StrictMode deja spacers fantasma. El razonamiento completo está en
`../ProofStats.tsx`.

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
| `root.style.height = '100vh'` para que el rail no desincronice el pin | el track manda la altura; el contenido no puede cambiarla |

### `attr: { stroke }` → `stroke-opacity` + `currentColor` (`NearStack`)

Los dos estados del original son el mismo blanco con distinta alpha (0.85 y
0.3), así que el dim/bright es una transición CSS de **un** número por grupo en
vez de ~30 tweens de atributo. Como efecto secundario, React y GSAP dejan de
tener que compartir el atributo `stroke`: GSAP se queda solo con `opacity` e `y`.

### `fetch → Blob → objectURL` para el video: eliminado (`HeroVideo`)

El original descarga el mp4 entero a memoria antes de poder hacer seek, porque
su servidor de preview no responde HTTP Range. Next sirve `public/` con Range en
dev y en producción (verificado: `206` con `Range: bytes=0-1023`), así que se
scrubbea `currentTime` directo. Si algún entorno devuelve `200` en vez de `206`,
el video deja de ser seekable y hay que reponer ese rodeo.

## Lo que se perdió a propósito

- **Click en un tier del rail de `NearStack` para saltar a su fase.** Usa
  `lenis.scrollTo()`, y Lenis está encapsulado en `PrototypeMotionProvider`; las
  secciones tienen prohibido importar de `@/components/site/*`. Reponerlo
  significa exponer un `useLenis()` desde el provider.
- **Popover del tier 4 (near.com).** El original tampoco lo tiene: el HTML
  define `data-tier-popover` 1, 2 y 3, y el JS pide `i + 1`, así que el 4 nunca
  existió y el 3 es código muerto. La geometría se ilumina igual. Agregar la
  clave `"3"` a `POPOVERS` en `nearStackContent.ts` lo hace aparecer solo.
- **`initBarFields`, `initQuantumBarEffect`, `[data-sr-stack]`.** Código muerto
  en el original: sus selectores no existen en el HTML o la función no se llama.
- **`image-slot.js`.** Web component de placeholder del canvas de diseño. Su
  reemplazo es `next/image`.

## `nearStackGeometry.ts`

Módulo puro (sin `"use client"`, sin DOM) que porta el renderer de prismas
isométricos con back-face culling. Se evalúa una vez al importar —también en el
servidor— y exporta 30 paths ya formateados.

Dos cosas que no se pueden tocar:

- **El `toFixed(1)` de cada coordenada.** Los `d` se calculan en el servidor y se
  comparan al hidratar; sin redondeo fijo, cualquier diferencia de formateo de
  float da un warning de mismatch por path.
- **El orden de `LAYERS`.** Es el z-order del SVG. Cada anillo tiene una parte
  por detrás del eje y otra por delante, y ese cruce es todo el efecto de
  profundidad.

El port se verificó comparando los 30 `d` y sus roles de cara contra una
reimplementación literal del `prism()` original: coinciden carácter por carácter.
Ese script no quedó en el repo — el módulo es determinista y no tiene entradas
externas, así que no hay nada que pueda derivar.

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
