# `protocol-labs/` — la página Protocol

Tres versiones de la página completa, y lo único que cambia entre ellas es el
hero:

| | Ruta | Hero |
|---|---|---|
| **A** | `/prototype/protocol-a` | **Layerflow** — capas que fluyen en un shader, y el hero se recoge en una tarjeta al scrollear |
| **B** | `/prototype/protocol-b` | **Spectrum** — bandas verticales en interferencia, shader |
| **C** | `/prototype/protocol-c` | **Field** — campo de caracteres con las palabras del protocolo, canvas |

Las siete secciones son las MISMAS en las tres, y viven en la raíz de esta
carpeta. Es lo que hace que compararlas mida la apertura y no otra cosa.

## Ya no hay laboratorios

Hubo tres —`hero-labs/`, `opening-labs/` y `combo-labs/`, con sus rutas de
comparación— y se borraron: lo que sobrevivió de cada uno está montado en una de
las tres páginas de arriba, que es donde se juzga de verdad. Un laboratorio
existe para elegir; una vez elegido, mantenerlo es mantener dos versiones de lo
mismo.

Todo está en el historial de git:
`git log --diff-filter=D -- components/sections/protocol-labs`.

Lo que se decidió por el camino, por si alguna vez se rehace:

- **De ocho heroes** ganó *Cut* —titular a la izquierda, cifras fuera— y su
  composición sigue viva; el resto (registro en columna, barra pegada, índice de
  la página, mural de la categoría, terminal) se descartó.
- **De siete aperturas** quedaron las tres de arriba. Se fueron una retícula
  isométrica en fuga, un Voronoi, unos planos SVG con paralaje, un degradé cálido
  con grano y una luz difusa sin estructura.
- **De cinco maneras de seguir el hero** ganó el reparto en cuatro columnas de
  «Built for AI scale». Se descartaron un registro de nueve filas, una columna
  pegada con las cifras desarrolladas, una escalera diagonal, un mural de cifras
  a escala de cartel y un tablero de celdas asimétricas.

## Cómo está repartido

```
heroes/          los tres heroes — es lo único distinto entre A, B y C
gl/              los shaders y el ruido que comparten
GlSurface.tsx    el andamiaje WebGL (contexto, resize, visibilidad, fallback)
GlyphField.tsx   el campo de caracteres en canvas, de C
*.tsx            las siete secciones, comunes a las tres páginas
protocolContent.ts   toda la copy, en un solo módulo
isoKit.tsx       la proyección isométrica y sus cubos
countUp.ts       el contador que conserva formato y bloquea el ancho
```

## La copy vive en un solo módulo

Los quince bloques del doc de sitemap están en
[`protocolContent.ts`](./protocolContent.ts) y todo lo demás los consume desde
ahí. Así, cualquier diferencia entre dos versiones es una diferencia de diseño y
no de redacción, y una corrección de dato entra en un solo lugar.

## Estado

Prototipos. Sin datos reales y sin assets: todos los gráficos son SVG propios
sobre el eje isométrico del sitio, y las superficies son shaders o canvas.

Lo que falta antes de que esto pueda pasar a página real:

- **Elegir entre A, B y C.**
- **Mirarlas a 390, 1024 y 1920**, y con `prefers-reduced-motion`.
- **Rendimiento** en un portátil sin GPU dedicada: las tres traen una superficie
  a pantalla completa, y la de A corre a resolución plena.
- **Shiki.** El bloque de código sigue tokenizado a mano, igual que en la página
  viva. Es un reemplazo, no una reescritura: el markup ya es un span por token.

## De dónde salen las decisiones

- `docs/protocol-page-brief.md` — el brief de la página viva, incluida la
  autopsia del primer intento fallido. La lección que gobierna todo esto:
  *igualar medidas no es igualar diseño*.
- `components/sections/quantum/README.md` — el ritmo (claro/oscuro,
  fuerte/suave) que las tres respetan.
- `components/sections/homepage-update/` — la línea de diseño viva de la
  homepage: crema, Kepler en los acentos, cubos isométricos, `CtaPill`,
  `ArrowCircle`, y el objeto de card que usa «Built for AI scale».
