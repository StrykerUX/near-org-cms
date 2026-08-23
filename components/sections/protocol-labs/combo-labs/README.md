# `combo-labs/` — qué va DEBAJO de cada hero

Índice en `/prototype/protocol-combo`; cada combo en
`/prototype/protocol-combo/stair`, `/layerflow` y `/mural`.

Las rutas se llaman por la **propuesta** y no por el hero: `c`, `c-layers` y `e`
venían de la apertura que había traído cada hero y dejaron de significar nada en
cuanto los combos empezaron a proponer estructuras propias.

## El hueco que llena

Los heroes que sobrevivieron a los laboratorios llegaron con sus secciones 2 y 3
—las seis cifras y «Built for AI scale»— **heredadas** de la variante que trajo
el hero, no decididas: C traía seis columnas con barra y tres columnas
numeradas; E y G compartían `opening-labs/ScaleSection`, idéntica en las dos;
H4 y H2 arrastraban `a/ScaleClaim`.

Dos estructuras para cinco heroes, y una de ellas repetida. Este laboratorio
propone una por hero, y ninguna repite la estructura de otra.

## Las tres

| | Hero | Estructura | Tesis | Riesgo |
|---|---|---|---|---|
| **stair** | C · Spectrum | Seis escalones en diagonal | El trío de C es vertical tres pantallas seguidas. La escalera cruza la dirección del campo: la superficie es el fondo, no el molde | Impone un orden de lectura, y obliga a decidir qué cifra va primera |
| **layerflow** | C · layout claro | Cifras asomando en el hero · «Built for AI scale» debajo | ¿Necesita la página abrir en oscuro? Misma composición que `stair` con una sola variable distinta — el fondo. Las cifras no van en una sección propia: asoman cortadas por el borde de la primera pantalla | Es la única que apuesta todo a la superficie |
| **mural** | E · Field | Seis franjas a escala de cartel | E resolvía «el momento en que el texto del fondo se vuelve texto de verdad» a cuerpo de nota — el tamaño del ruido. Acá cada cifra ocupa una franja y las propiedades bajan a mono | Invierte la jerarquía; si las tres propiedades se sienten abandonadas, falló |

## Lo que se descartó

Eran siete. Se fueron cuatro, y con ellas dos superficies:

- **Ledger** (h4 · Cut) — las seis cifras y las tres propiedades como **nueve
  filas de un solo registro**, numeradas 01 a 09 sin interrupción. Era la única
  que cosía la evidencia y la explicación con un mismo índice.
- **Sustained** (h2 · Count) — una columna pegada con el título mientras la otra
  desfilaba, y la única que **no repetía** las cifras: las desarrollaba. Iba con
  el fondo `KeyRotationField`, un campo de caracteres donde un frente reescribía
  todo el alfabeto en una sola pasada menos las cuentas, que quedaban idénticas
  — la sección 8 dibujada. Respondía al puntero: mover revolvía el ruido, hacer
  clic disparaba la rotación desde ese punto.
- **Haze** (hero claro) — luz difusa sin ninguna estructura, con el método del
  hero de la homepage. Su shader era `opening-labs/gl/haze.ts`.
- **Board** (g · Field claro) — título, cifras y propiedades como piezas de un
  **tablero de celdas asimétricas**, leídas todas a la vez. Dibujaba sus filetes
  con el `gap` sobre un fondo de color, no con bordes.

Todo está en el historial de git, en el commit anterior a esta limpieza:
`git log --diff-filter=D -- components/sections/protocol-labs/combo-labs`.

## Cada ruta trae la página ENTERA

No las tres primeras pantallas. El riesgo de estas propuestas no está en cómo se
ven: está en qué le hacen al **acto** —el bloque oscuro de seis pantallas con la
pieza pegada, que es el centro de la página—. Tres secciones que le comen el
rango o le roban el contraste lo dejan sin efecto, y eso no se ve en una captura
de la apertura: se ve al llegar.

Por lo mismo va el resto (developers, ecosistema, apéndice, cierre). El ritmo
claro · claro · OSCURO · claro · claro · claro · OSCURO es justamente lo que
estas propuestas pueden romper.

## Los heroes se importan, no se copian

Contra la regla general del repo —«si una versión gana se COPIA»— y a propósito.
Esa regla protege a una **página real** de moverse cuando alguien toca un
laboratorio. Acá los cinco heroes siguen sin decidirse y las rutas de origen
siguen vivas: dos copias del mismo hero divergirían mientras se compara, que es
el único momento en que divergir es fatal.

Lo que existe sólo acá son las cinco propuestas de secciones 2 y 3.

**Consecuencia práctica:** los heroes de C, E y G tuvieron que salir de dentro de
`OpeningC/E/G`, donde estaban embebidos. Viven en `opening-labs/HeroSpectrum.tsx`,
`HeroField.tsx` y `HeroFieldLight.tsx`, y sus tríos originales los consumen desde
ahí — o sea que las rutas de `/prototype/protocol-opening` y las de acá muestran
literalmente el mismo hero.

## Una técnica que conviene mirar antes de copiarla

**El buffer de `Layerflow` no usa los valores por defecto de `GlSurface`.**
Renderiza a resolución plena (`renderScale={1}`) y con `maxDpr={2}`, contra el
0.6 y el 1.75 que trae el componente. Aquellos números están calibrados para
superficies **sin bordes** —el follaje de la home es blur puro y lo que se pierde
al escalar no se ve—; una superficie con estructura escalada así muestra
escalones en cada borde diagonal, y el 1.75 además obliga a un reescalado
fraccionario en cualquier pantalla a dpr 2.

Va con dither ordenado de Bayer sobre el índice de la rampa, dimensionado sobre
el tramo y no sobre 1/256: el índice recorre 0..1 en cuatro tramos y cada tramo
cubre la distancia de color entre dos paradas, así que un nivel son ~0.006 de
índice.

## Las clases de retícula son mapas literales

`STEP` y `SIDE`: arrays de strings completos. **Nunca un template string.** Tailwind v4 no detecta clases
construidas en tiempo de ejecución y las purga del CSS — el layout se rompe sólo
en producción, donde el purge corre de verdad.

## Estado

Sin ver del todo en navegador, sin decidir. Lo primero a mirar:

- **El paso al acto en las tres.** Es el motivo de que la página vaya entera.
- **layerflow** — si las nueve capas se leen como capas apiladas. Si no, es
  follaje con rayas, y los números para empujar son `u_layers`, `u_seam`,
  `u_seamLift` y `u_blur` a la baja.
- **mural** — si las tres propiedades en mono se leen como condiciones técnicas o
  como un pie de página. Es la apuesta entera de esa variante.
- **El asomo de layerflow** — si la pasada de opacidad se lee como un revelado o
  como un parpadeo, y si `PEEK` deja asomando la mitad de la cifra en pantallas
  de distinta altura. Es un porcentaje calibrado contra este contenido.
- Todas — a 390, 1024 y 1920, y con `prefers-reduced-motion`.
