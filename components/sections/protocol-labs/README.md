# `protocol-labs/` — alternativas para la página Protocol

Laboratorio de comparación para `near.org/protocol`. Tres direcciones de diseño
completas (`a/`, `b/`, `c/`) más una cuarta que las mezcla, montadas en
`/prototype/protocol-a`, `-b`, `-c` y `-d`, con un índice que las compara en
`/prototype/protocol-labs`.

Rige el contrato general de [`../README.md`](../README.md).

## Qué es lo que se compara

**El mismo contenido, tres jerarquías.** Los quince bloques del doc de sitemap
viven en un único módulo —[`protocolContent.ts`](./protocolContent.ts)— que las
tres importan. Ninguna transcribe copy por su cuenta, así que cualquier
diferencia entre ellas es una diferencia de diseño y no de redacción.

| | Tesis | Qué se ve primero | Las seis cifras | Las seis capacidades |
|---|---|---|---|---|
| **A · Datasheet** | La evidencia primero | El titular y las cifras, juntos | Fundidas con el hero, repetidas al cierre | Tabla de especificación, las seis abiertas |
| **B · The Machine** | La mecánica primero | Un objeto isométrico en reposo | Telemetría, una por beat del acto | Seis estados de una sola pieza, panel pegado |
| **C · The Argument** | La tesis primero | La frase a escala de cartel | Al margen, como aparato de datos | Seis entradas de un ensayo, con palabra mural |
| **D · La mezcla** | Afirmar con datos, después demostrar | El titular y las cifras (hero de A) | En el hero y como telemetría del acto — la banda de B queda apagada | El acto pegado de B |

Cada `View` (`components/views/ProtocolLab{A,B,C,D}View.tsx`) abre con la tesis
de su alternativa y su tabla de ritmo. Ahí está el razonamiento completo; esto es
el índice.

**D no tiene carpeta propia**: importa siete secciones de `a/` y `b/` tal cual.
Es la excepción a la regla de abajo y el porqué está escrito en su `View` — D no
es un fork, es una afirmación sobre A y B, y copiada dejaría de serlo en la
primera corrección. Lo único que hubo que agregar para armarla es la prop
`proof` de `b/ScaleClaim`, que apaga su banda de cifras porque el hero de A ya
las trae.

## Qué se comparte y qué no

| Archivo | Qué es | Por qué se comparte |
|---|---|---|
| `protocolContent.ts` | La copy | Tres transcripciones divergen a la primera corrección, y entonces la comparación mide el error de transcripción en vez del diseño |
| `isoKit.tsx` | La proyección isométrica y los tres cubos | Tres copias del mismo eje se desalinean; acá no hay animación ni `"use client"`, solo geometría |
| `CodeSample.tsx` | El bloque de código de la sección 10 | El código y su tokenización no cambian entre alternativas; lo que cambia es el marco, y eso es un prop |
| `ArtPlaceholder.tsx` | Hueco declarado para un asset | Distingue "sección sin diseñar" de "sección diseñada esperando un render" |

Todo lo demás —`a/`, `b/`, `c/`— es de su alternativa y **no se importa entre
carpetas**, con la única excepción de la vista D descrita arriba. Es la regla de
laboratorio del README padre: si una versión gana, se COPIA a la carpeta de la
página que la reciba.

## Estado

Prototipos. Sin datos reales, sin assets generados: donde una render iría, hay un
`ArtPlaceholder` con la dirección de arte escrita. Todos los gráficos son SVG
propios sobre el eje isométrico del sitio.

Lo que falta antes de que cualquiera de las tres pueda pasar a página real:

- **Mirarlas en el navegador a 390, 1024 y 1920.** Todas las mediciones de acá
  salieron de la escala del DS, no de una pantalla — que es exactamente cómo el
  primer hero de la página viva terminó métricamente correcto y visualmente
  equivocado (ver `docs/protocol-page-brief.md`).
- **Reduced motion.** Las tres degradan por diseño (B cambia de layout entero),
  pero no se verificó con la preferencia activa.
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
