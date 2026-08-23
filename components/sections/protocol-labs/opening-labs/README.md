# `opening-labs/` — tres maneras de abrir la página

Hero + las seis cifras + «Built for AI scale», rediseñados **como una sola
pieza**. Índice en `/prototype/protocol-opening`; cada trío en
`/prototype/protocol-opening/c`, `/e` y `/g`.

## Por qué un trío y no un hero

La queja que originó esto fue que el hero se veía plano. Pero un hero no se
arregla solo: si las dos secciones que le siguen lo dejan caer en el vacío, el
problema vuelve dos pantallas más abajo. Cada alternativa decide **una
superficie y cómo se consume a lo largo de las tres secciones** — eso es lo que
se compara.

## Las tres

| | Superficie | Tesis | Riesgo |
|---|---|---|---|
| **C · Spectrum** | Shader — bandas verticales en interferencia | Una idea formal atraviesa las tres: la columna. La superficie no se retira, **se convierte en el layout** (doce columnas = las de la página) | Es la más cercana a lo que ya hace Sui |
| **E · Field** | Canvas — retícula de caracteres | La superficie es texto: SHARD, FINALITY, WITNESS, SIGNATURE escondidas entre ruido, encendidas por una onda diagonal | El campo de caracteres es un recurso muy usado en cripto; lo distingue que las palabras sean las de esta página — y sólo si se alcanzan a leer |
| **G · Field claro** | Canvas — el campo de E, sobre crema | La única que abre en el color de la marca. Pregunta si la página **necesita** abrir en oscuro | Vuelve al fondo que se veía plano; la diferencia tiene que venir entera del campo |

## Eran siete

Se borraron cuatro, con sus shaders:

- **A · Lattice** — shader de retícula isométrica en perspectiva (`gl/lattice.ts`).
  Las tres secciones eran un descenso: el hero flotaba sobre la red, las cifras se
  apoyaban al ras, la superficie se agotaba antes del texto.
- **B · Shards** — Voronoi que deriva (`gl/voronoi.ts`). La única que
  **explicaba**: un espacio partido en regiones que se redistribuyen es el tema
  de la página, y las cifras iban dentro de regiones dibujadas.
- **D · Stack** — **SVG puro**, cuatro planos isométricos con paralaje. Sin
  WebGL: el mismo cubo de la marca a 900px en vez de 20.
- **F · Horizon** — degradé profundo con banda de luz y grano (`gl/horizon.ts`).
  La única cálida; el trío progresaba de noche a día.

Están enteras en el historial de git, en el commit anterior a esta limpieza:
`git log --diff-filter=D -- components/sections/protocol-labs/opening-labs`.

**`ScaleSection` salió de `OpeningA` al borrarla.** Vivía exportada desde ahí
porque A fue la primera y las siete la compartían; ahora tiene archivo propio
(`ScaleSection.tsx`), que es donde debió estar siempre — una pieza compartida
dentro de una de sus consumidoras queda a un borrado de romper a las demás, y eso
fue exactamente lo que pasó.

## Los tres heroes viven en archivos propios

`HeroSpectrum.tsx`, `HeroField.tsx` y `HeroFieldLight.tsx`. Estaban embebidos
dentro de sus tríos hasta que `combo-labs/` necesitó montarlos con otras
secciones 2 y 3; `OpeningC`, `OpeningE` y `OpeningG` los importan desde ahí, así
que las rutas de este laboratorio y las de `/prototype/protocol-combo` muestran
literalmente el mismo hero y no pueden divergir mientras se compara.

## Ninguna funde una sección con la siguiente

Regla del laboratorio. Los velos que hay son de **legibilidad** —tinta o crema
plana sobre la superficie, para que el texto se lea— y no degradés que terminan
en el color del bloque de abajo. Un degradé así disuelve el borde entre dos
secciones; acá el corte se ve.

Consecuencia: donde dos secciones comparten color (las tres tienen el hero y las
cifras del mismo tono) la frontera la marca un **filete**, no un fundido.

## `GlyphField` sirve a E y a G, y no comparten calibración

Sobre negro el ojo suma luz y un alfa de 6% ya se ve; sobre crema resta, y esa
misma tinta se lee más marcada. El claro arranca de una base más baja y su pico
llega menos lejos.

Y usa **dos colores** donde el oscuro usa uno: gris de tinta en reposo y
`--green-ink` en el frente de la onda, porque `--near-green-accent` no llega a
3:1 sobre crema. Es la misma distinción que `globals.css` documenta entre esos
dos tokens.

## Infraestructura

**`GlSurface.tsx`** — el andamiaje WebGL. Hoy lo usa una sola apertura (C), pero
se queda: `HeroFoliage` ya había resuelto este problema completo para la
homepage, con ~90 líneas de infraestructura por 20 de calibración, y volver a
inline-arlas dentro de `OpeningC` es lo que hace que la próxima superficie repita
también los cuatro modos de fallo que costó encontrar una vez.

Lo que hereda y no se toca:

- **Sin `loseContext()` en el cleanup.** React reusa el mismo `<canvas>` entre los
  dos montajes de StrictMode; perderlo ahí deja al segundo con un contexto muerto
  donde `createShader` devuelve objetos inertes y los info logs vuelven `null` —
  un error sin mensaje y sólo en dev. Ver `glContext.ts`.
- **`prefers-reduced-motion` no apaga la superficie: la congela.** Un cuadro y se
  queda ahí. Quitarla dejaría un rectángulo vacío detrás del titular.
- **`IntersectionObserver`** — estas superficies viven arriba de una página larga;
  sin él seguirían pintando a 60fps detrás de todo lo que se scrollea después.
- **Fallback obligatorio** — sin WebGL2 utilizable queda un color sólido, nunca un
  agujero transparente sobre el que el texto pueda quedar ilegible.

Los uniformes entran al efecto **serializados** y no por identidad de objeto: un
literal nuevo en cada render del padre reconstruiría el programa entero. Es
correcto porque son tablas de una docena de números; si el JSON cambia, alguien
editó el archivo.

`renderScale` por defecto 0.6 — el costo cae con el **cuadrado** del factor.

## El shader

Queda `gl/spectrum.ts`, el de C. **GLSL ES 3.00** (`#version 300 es`, `in`/`out`),
no GLSL 1.0: en 1.0 las derivadas (`fwidth`) vienen de `OES_standard_derivatives`,
una extensión que WebGL2 **no expone** —`getExtension` devuelve `null`— porque en
ES 3.00 son parte del núcleo. El síntoma era
`ERROR: 0:39: 'fwidth' : no matching overloaded function found`.

Dos trampas al editar:

- **`#version` tiene que ser la primerísima línea**, sin un salto antes. Por eso
  las fuentes van `.trimStart()`eadas antes de compilar.
- **No puede haber backticks dentro del GLSL.** Cierran el template literal de
  TypeScript y el error que da no señala el shader.

## Cada ruta monta el acto debajo

No es decorado. C y E abren en oscuro, y el acto ya era el único bloque oscuro
largo de la página: si la apertura le come el rango, se ve ahí y en ningún otro
lado. Montar la apertura sola contestaría «¿se ve bien?», que no es la pregunta.

Para G —la clara— el acto contesta lo contrario y es igual de útil: si abrir en
crema hace que el acto recupere el peso que tenía, es un argumento a su favor que
ninguna captura del hero puede dar.

## Estado

Sin decidir. Lo primero a mirar:

- **E y G** — si las palabras se alcanzan a leer. Si no, el campo es ruido bonito,
  y es lo único que lo distingue del recurso genérico.
- **G** — si a este tono el campo pesa lo suficiente. Si no, es el hero plano de
  antes con textura encima.
- **Las tres** — el paso al acto oscuro, y `prefers-reduced-motion` (la superficie
  queda en un cuadro fijo, no desaparece).
- Rendimiento en un portátil sin GPU dedicada.
