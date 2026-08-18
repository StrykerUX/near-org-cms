# `hero-alt/` — seis versiones de las dos primeras secciones

Alimenta **una sola ruta**: `/prototype/hero-alt`. No la importa ninguna página
real, y eso es el punto.

## Qué se está probando

Las **dos primeras secciones** de la homepage —el hero y el statement que lo
sigue— seis veces, con **la misma copy en las seis**. Lo único que cambia
entre versiones es el mecanismo; si la copy también cambiara, la comparación
mediría dos cosas a la vez.

| # | Versión | Técnica | La apuesta |
|---|---|---|---|
| 01 | `Aperture` | CSS + GSAP, cero canvas | Un diafragma de 13 lamas y un titular que se retrae desde 2.6× |
| 02 | `Flow` | WebGL2, shader propio | Campo de flujo que **no avanza con el reloj**: avanza con el scroll, y la velocidad sube el contraste |
| 03 | `Shatter` | SplitText + transforms 3D | Sin fondo. Cada carácter llega desde su propia Z con su propia rotación |
| 04 | `Glass` | WebGL2 + textura de texto | El titular está **dentro** del vidrio: se rasteriza y el shader lo refracta |
| 05 | `Lattice` | Canvas 2D | ~2600 puntos que colapsan en la silueta del titular, **muestreada del propio texto** |
| 06 | `Cutout` | Canvas 2D + el clip de v5 | El video de v5 visible **sólo dentro de los glifos**, scrubbeado con el scroll |

## Cómo están hechos los pares

Cada versión son **dos componentes independientes**, no una unidad indivisible:
`XHero.tsx` y `XBars.tsx`. Se pueden mezclar entre sí — el par es una propuesta
de qué va con qué, no un acoplamiento.

Tres versiones comparten un **motor** entre sus dos mitades:

| Motor | Lo usan | Qué cambia entre las dos mitades |
|---|---|---|
| `FlowCanvas` | `FlowHero`, `FlowBars` | `cols`: 0 = campo continuo, 7 = el mismo campo muestreado a siete columnas |
| `GlassCanvas` | `GlassHero`, `GlassBars` | `cols`, y si hay o no texto en la textura |
| `LatticeCanvas` | `LatticeHero`, `LatticeBars` | `target`: `"text"` o `"bars"` |
| `CutoutCanvas` | `CutoutHero`, `CutoutBars` | `target`: recorta a los glifos o a las columnas |

Que sea un solo motor **no es ahorro de código, es la idea**: la segunda sección
no imita al hero con barras parecidas, es el mismo material visto de otra
manera. Dos implementaciones que se parecen serían otra cosa, y se notaría en
cuanto una de las dos cambiara.

## El trato del texto rasterizado (04 y 05)

Un shader no puede leer el DOM. Para que el titular se **doble** con el vidrio
—y no flote encima de un fondo que se dobla— tiene que estar dentro de la misma
imagen que el shader muestrea.

El precio, entero: **ese texto no es texto.** No se selecciona, no se traduce,
no lo lee un lector de pantalla y no lo indexa nadie. Además hay que partirlo en
líneas a mano, porque un canvas 2D no hace wrap.

Las dos versiones lo pagan distinto, y la diferencia es parte de lo que hay que
evaluar:

- **04 · Glass** monta el `<h1>` real como `sr-only`. El árbol de accesibilidad
  ve el titular; la pantalla ve la versión refractada. Es el trato completo.
- **05 · Lattice** monta el `<h1>` real **visible**, encima de la nube. Los
  puntos son el eco del titular, no su reemplazo — por eso van en gris y el
  titular en negro. Sólo se pierde la forma, no el texto.

En **`GlassBars` el statement SÍ es texto del DOM**, a propósito: un párrafo de
190 caracteres rasterizado a través de un vidrio ondulado no se lee, se
descifra. El par entero enseña las dos mitades del trato — cuándo el texto puede
entrar al material y cuándo no.

En los dos casos la familia y el peso salen del `computedStyle` del host, nunca
hardcodeados: hardcodear la familia sería una segunda fuente para la tipografía
y caería a Helvetica en silencio el día que el DS cambie.

## Lo que las cinco cumplen

- **Nunca `pin: true`** — las cuatro escenas pegadas usan `position: sticky` de
  CSS con un ScrollTrigger de solo lectura, vía `enableScene()` + `trackTimeline()`.
  Razonamiento largo en [`../README.md`](../README.md).
- **`prefers-reduced-motion` no deja una sección vacía.** Cada versión degrada a
  su estado final, no a la nada: el diafragma queda abierto, el campo se pinta
  quieto en un frame, la nube aparece ya formada, el statement se lee entero.
- **Los canvas se cuelgan de `gsap.ticker`**, nunca de un `rAF` propio, no
  dibujan fuera de vista (`onViewportToggle` con un viewport de anticipación,
  porque el primer frame de un shader incluye el warm-up del pipeline) y
  dimensionan el buffer con `deviceRatio()`.
- **Sin WebGL2 no hay agujero**: `getGl2` devuelve `null` y queda el gradiente
  CSS de `fallback`, que va en el contenedor y no en el canvas.
- **El desorden es sembrado** (`createSeededRandom`), nunca `Math.random`: con
  random puro, "el gesto quedó mejor esta vez" es una observación sobre la
  tirada y no sobre el diseño.

## Los backticks del GLSL

Los shaders viven en template literals, así que **un backtick en un comentario
del GLSL cierra el literal** y TypeScript reporta el error en una línea que no
tiene nada que ver. Los dos archivos de `shaders/` usan comillas simples en sus
comentarios por eso. Es el error más fácil de reintroducir de toda la carpeta.

## Dos arreglos que valen como advertencia

Las dos primeras versiones de esta carpeta fallaron por motivos que se repiten,
y quedan acá para no volver a pagarlos.

### 04 · Glass iba laggy: el gradiente por diferencias finitas

La normal del vidrio salía de muestrear el campo de altura en **tres puntos**
—`h(p)`, `h(p+dx)`, `h(p+dy)`— y cada evaluación cuesta 3 senos y una
exponencial. Nueve senos por píxel, a pantalla completa, en dos instancias que
se solapan al scrollear.

`h()` es una suma de senos y una gaussiana, así que su derivada **se escribe a
mano**: la de `sin` es `cos`, y la de `exp(-k·d²)` es `-2k·d·exp(-k·d²)`. Una
sola evaluación devuelve la altura y las dos parciales — un tercio del costo, y
además exacta en vez de aproximada.

El precio: las constantes de la derivada son el producto de amplitud por
frecuencia de cada término, así que **tocar una amplitud obliga a tocar las
dos** — está anotado en el shader.

Se sumaron dos cosas más: techo de dpr en 1.25 (este es el único de los seis
donde bajar la resolución casi no se ve, porque el borde de los glifos ya está
distorsionado a propósito) y el `lead` del gate de viewport de 1 a 0.35, para
que las dos instancias pasen menos tiempo dibujando a la vez.

### 05 · Lattice se veía vacía: dos fallos que se tapaban

1. **El gesto no ocurría.** El colapso iba atado al scroll con
   `start: "top bottom"`, y un hero ocupa el viewport desde el frame cero: el
   trigger nacía ya por la mitad de su recorrido, así que la nube estaba formada
   antes de que nadie tocara nada. Ahora la entrada es una timeline que corre al
   montar (`drive="intro"`) y al scroll le queda la **salida**.
2. **No se veía.** Los puntos iban en `--bar` (#D9D9D9) sobre `--cream`
   (#F5F4F1): **1.1:1** de contraste. Ahora van en `--gray-intermediate`, que
   sobre crema da ~5:1.

La regla general que dejan las dos: **un hero no puede atar su entrada al
scroll.** Quien llega no ha tocado la rueda todavía, así que un gesto conducido
por scroll no existe para él. Entrada por timeline, salida por scroll — es lo
que hacen las seis ahora.

## Apilarlas tiene un costo

Un hero es lo **primero** que alguien ve, con la página recién cargada y sin
haber tocado la rueda. En esta página sólo el 01 se ve en esas condiciones; a
los otros cinco se llega scrolleando, ya en movimiento.

Eso favorece o perjudica según el gesto. El **05** en particular necesita que el
lector ya esté empujando —quieto no muestra más que una retícula— y apilado
arranca con una ventaja que no tendría arriba de todo. Para juzgar uno en frío
hay que montarlo solo en una view propia.
