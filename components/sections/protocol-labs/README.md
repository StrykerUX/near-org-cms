# `protocol-labs/` — la página Protocol en curso

Cuatro cosas:

- **`a/`** — la estructura elegida para `near.org/protocol`, en
  `/prototype/protocol-a`. Su razonamiento completo está en
  `components/views/ProtocolLabAView.tsx`.
- **`hero-labs/`** — la alternativa viva para la primera pantalla, en
  `/prototype/protocol-heroes/h2`. Eran ocho: ganó **H4 · Cut** —ya copiada en
  `a/Hero.tsx`, y su copia del lab se borró— y se conservó **H2 · Count**. Tiene
  su propio [README](./hero-labs/README.md).
- **`opening-labs/`** — tres aperturas completas (hero + las seis cifras +
  «Built for AI scale»), en `/prototype/protocol-opening`. Cada una con su propia
  superficie: un shader WebGL y dos campos de caracteres en canvas. Sin decidir.
  Tiene su propio [README](./opening-labs/README.md).
- **`combo-labs/`** — qué va DEBAJO de cada hero, en `/prototype/protocol-combo`.
  Los cinco heroes que sobrevivieron llegaron con sus secciones 2 y 3 heredadas
  de la variante que los trajo —dos estructuras para cinco heroes, una de ellas
  repetida—; acá hay una propuesta por hero, y ninguna repite a otra. Cada ruta
  monta la página entera. Sin decidir. Tiene su propio
  [README](./combo-labs/README.md).

## Lo que se borró en la limpieza

De lo que este README describía antes queda menos de la mitad, y no por
descarte técnico sino porque no gustó. Todo está en el historial de git, en el
commit anterior a la limpieza — `git log --diff-filter=D -- components/sections/protocol-labs`:

- **`transition-labs/`, entera** — doce secciones de transición para la juntura
  entre el hero y el contenido, agrupadas por altura (25–30svh, ~50svh y
  85–100svh), con su copy propuesta en `transitionContent.ts`. Reemplazaban a
  `proof-labs/`, ocho dividers que trataban la franja de cifras como un
  separador; el problema de fondo nunca se resolvió y las doce se descartaron
  también. Antes de rehacer esta juntura conviene leer por qué fallaron las
  veinte: se estaban diseñando **sin una sola referencia visual**, que es
  exactamente el error que `docs/protocol-page-brief.md` documenta.
- **Seis heroes** — H1 · Ledger, H3 · Threshold, H5 · Index, H6 · Field,
  H7 · Mural y H8 · Terminal, más la `ProofBand`. Detalle de qué proponía cada
  uno en [`hero-labs/README.md`](./hero-labs/README.md).
- **Cuatro aperturas** — A · Lattice, B · Shards, D · Stack y F · Horizon, con
  sus shaders `gl/lattice.ts`, `gl/voronoi.ts` y `gl/horizon.ts`. Detalle en
  [`opening-labs/README.md`](./opening-labs/README.md).

## De dónde viene `a/`

Hubo tres direcciones completas —**A · Datasheet** (la evidencia primero, tabla
de especificación con las seis capacidades abiertas), **B · The Machine** (la
mecánica primero, un objeto isométrico que muta en un acto pegado) y
**C · The Argument** (la tesis primero, tipografía como estructura, seis entradas
de ensayo)— y una cuarta, **D**, que seleccionaba secciones de A y B.

Ganó D. Sus siete secciones se consolidaron en `a/` y las tres direcciones se
borraron. **Están enteras en el commit anterior a la limpieza** (`git log` sobre
esta carpeta); lo que se perdió y vale la pena recordar antes de rehacerlo:

- `SpecTable` + `specMarks` — la tabla de seis filas abiertas con una figura
  isométrica animada por CSS en cada una. Es la única versión que permitía
  comparar dos capacidades sin volver a scrollear, y la única con seis diagramas
  distintos.
- `Entries` + `entryMarks` — las seis capacidades como entradas de ensayo, cada
  una abierta por su palabra a escala mural.
- `ArgumentHero`, `Premise`, `Practice`, `Reading`, `Coda` — la línea tipográfica
  entera de C, incluidos el titular de tres renglones a escala de cartel y las
  cifras como aparato de datos al margen.

Rige el contrato general de [`../README.md`](../README.md).

## La copy vive en un solo módulo

Los quince bloques del doc de sitemap están en
[`protocolContent.ts`](./protocolContent.ts), y todo lo demás lo consume desde
ahí — la página, el hero que queda y las tres aperturas. Nada transcribe copy
por su cuenta:
así, cualquier diferencia entre dos versiones es una diferencia de diseño y no de
redacción, y una corrección de dato entra en un solo lugar.

`ProtocolLabAView` abre con la tesis de la página, su tabla de ritmo y lo que
sigue abierto.

## Qué se comparte y qué no

| Archivo | Qué es | Por qué se comparte |
|---|---|---|
| `protocolContent.ts` | La copy | Varias transcripciones divergen a la primera corrección, y entonces una comparación mide el error de transcripción en vez del diseño |
| `isoKit.tsx` | La proyección isométrica y los tres cubos | Varias copias del mismo eje se desalinean; acá no hay animación ni `"use client"`, solo geometría |
| `CodeSample.tsx` | El bloque de código de la sección 10 | El código y su tokenización no cambian; lo que cambia es el marco, y eso es un prop |
| `ArtPlaceholder.tsx` | Hueco declarado para un asset | Distingue "sección sin diseñar" de "sección diseñada esperando un render" |

La regla del README padre sigue en pie para lo que viene: si una variante gana,
**se copia** a `a/` — no se importa desde su laboratorio. Ya pasó con H4 · Cut, y
la vuelta completa incluye borrar la copia del lab: dos archivos que dicen ser el
mismo hero es la forma más barata de que uno quede desactualizado en silencio.

## Estado

Prototipos. Sin datos reales, sin assets generados: donde una render iría, hay un
`ArtPlaceholder` con la dirección de arte escrita. Todos los gráficos son SVG
propios sobre el eje isométrico del sitio.

Lo que falta antes de que esto pueda pasar a página real:

- **Decidir la apertura.** El hero de `a/` está a pantalla completa y sin
  superficie; las tres candidatas para ponerle una están en `opening-labs/`.
- **Mirarla en el navegador a 390, 1024 y 1920.** Todas las mediciones de acá
  salieron de la escala del DS, no de una pantalla — que es exactamente cómo el
  primer hero de la página viva terminó métricamente correcto y visualmente
  equivocado (ver `docs/protocol-page-brief.md`).
- **Reduced motion.** El acto cambia de layout entero, pero no se verificó con la
  preferencia activa.
- **Shiki.** El bloque de código sigue tokenizado a mano, igual que en la página
  viva. Es un reemplazo, no una reescritura: el markup ya es un span por token.

## De dónde salen las decisiones

- `docs/protocol-page-brief.md` — el brief de la página viva, incluida la
  autopsia del primer intento fallido. La lección que gobierna estas tres:
  *igualar medidas no es igualar diseño*.
- `components/sections/quantum/README.md` — el ritmo (claro/oscuro,
  fuerte/suave) que las tres respetan.
- `components/sections/homepage-update/` — la línea de diseño viva de la
  homepage: crema, Kepler en los acentos, cubos isométricos, `CtaPill` y
  `ArrowCircle`.
