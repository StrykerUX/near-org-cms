# `opening-labs/` — siete maneras de abrir la página

Hero + las seis cifras + «Built for AI scale», rediseñados **como una sola
pieza**. Índice en `/prototype/protocol-opening`; cada trío en
`/prototype/protocol-opening/a` … `f`.

## Por qué un trío y no un hero

La queja que originó esto fue que el hero se veía plano. Pero un hero no se
arregla solo: si las dos secciones que le siguen lo dejan caer en el vacío, el
problema vuelve dos pantallas más abajo. Cada alternativa decide **una
superficie y cómo se consume a lo largo de las tres secciones** — eso es lo que
se compara.

## Las seis

| | Superficie | Tesis | Riesgo |
|---|---|---|---|
| **A · Lattice** | Shader — retícula isométrica en perspectiva | Las tres son un descenso: el hero flota sobre la red, las cifras se apoyan al ras, la superficie se agota antes del texto | Vive cerca del cliché de la grilla en fuga; la salva o la hunde la inclinación |
| **B · Shards** | Shader — Voronoi que deriva | La única que **explica**: un espacio partido en regiones que se redistribuyen es el tema de la página. Las cifras van dentro de regiones dibujadas | Si se lee como «efecto de shader» y no como la red, pierde lo que la distingue |
| **C · Spectrum** | Shader — bandas verticales en interferencia | Una idea formal atraviesa las tres: la columna. La superficie no se retira, **se convierte en el layout** (doce columnas = las de la página) | Es la más cercana a lo que ya hace Sui |
| **D · Stack** | **SVG puro** — cuatro planos isométricos con paralaje | ¿Hacía falta inventar una superficie, o alcanzaba con dejar de usar el lenguaje propio en miniatura? El mismo cubo, a 900px en vez de 20 | Sin la densidad de un shader puede leerse simple al lado de las otras |
| **E · Field** | Canvas — retícula de caracteres | La superficie es texto: SHARD, FINALITY, WITNESS, SIGNATURE escondidas entre ruido, encendidas por una onda diagonal | El campo de caracteres es un recurso muy usado en cripto; lo distingue que las palabras sean las de esta página — y sólo si se alcanzan a leer |
| **F · Horizon** | Shader — degradé con banda de luz y grano | La única cálida. El trío progresa de noche a día | La más bonita y la menos argumentada: no dice nada del protocolo |
| **G · Field claro** | Canvas — el campo de E, sobre crema | La única que abre en el color de la marca. Pregunta si la página **necesita** abrir en oscuro | Vuelve al fondo que se veía plano; la diferencia tiene que venir entera del campo |

## Ninguna funde una sección con la siguiente

Regla del laboratorio. Los velos que hay son de **legibilidad** —tinta o crema
plana sobre la superficie, para que el texto se lea— y no degradés que terminan
en el color del bloque de abajo. Un degradé así disuelve el borde entre dos
secciones; acá el corte se ve.

Consecuencia: donde dos secciones comparten color (A, C, D, E, F y G tienen el
hero y las cifras del mismo tono) la frontera la marca un **filete**, no un
fundido.

## `GlyphField` sirve a E y a G, y no comparten calibración

Sobre negro el ojo suma luz y un alfa de 6% ya se ve; sobre crema resta, y esa
misma tinta se lee más marcada. El claro arranca de una base más baja y su pico
llega menos lejos.

Y usa **dos colores** donde el oscuro usa uno: gris de tinta en reposo y
`--green-ink` en el frente de la onda, porque `--near-green-accent` no llega a
3:1 sobre crema. Es la misma distinción que `globals.css` documenta entre esos
dos tokens.

## Infraestructura

**`GlSurface.tsx`** — el andamiaje WebGL de las cuatro aperturas con shader.
`HeroFoliage` ya había resuelto este problema completo para la homepage, pero con
~90 líneas de infraestructura por 20 de calibración; repetirlas cuatro veces
repetiría también los cuatro modos de fallo que costó encontrar una vez.

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

`renderScale` por defecto 0.6 — el costo cae con el **cuadrado** del factor. B lo
sube a 0.85 porque su Voronoi tiene bordes finos que a baja resolución aliasean
y titilan al derivar.

## Los shaders

`gl/lattice.ts`, `gl/voronoi.ts`, `gl/spectrum.ts`, `gl/horizon.ts`. GLSL 1.0 sin
`#version` sobre contexto WebGL2, igual que el resto del toolkit.

**Ojo al editar: no puede haber backticks dentro del GLSL.** Cierran el template
literal de TypeScript y el error que da no señala el shader.

## Cada ruta monta el acto debajo

No es decorado. Cinco de las seis aperturas abren en oscuro, y el acto ya era el
único bloque oscuro largo de la página: si la apertura le come el rango, se ve
ahí y en ningún otro lado. Montar la apertura sola contestaría «¿se ve bien?»,
que no es la pregunta.

## Estado

Sin ver en navegador — **y esta vez importa más que nunca**, porque todo lo que
distingue a estas seis es lo que hace la superficie en movimiento, que es
exactamente lo que no se puede juzgar desde el código.

Lo primero a mirar:

- **A** — la inclinación del plano. Es un parámetro (`u_tilt`) y decide si la
  retícula se lee como un plano o como una carretera.
- **B** — si el Voronoi se lee como la red o como un efecto.
- **E** — si las palabras se alcanzan a leer. Si no, el campo es ruido bonito.
- **Todas** — el paso al acto oscuro, y `prefers-reduced-motion` (la superficie
  queda en un cuadro fijo, no desaparece).
- Rendimiento en un portátil sin GPU dedicada: cuatro rutas traen un canvas WebGL
  a pantalla completa.
