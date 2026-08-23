# `economics` — tres layouts para `/economics`

El contrato general de [`../README.md`](../README.md) aplica. Este archivo
documenta solo lo específico de esta página.

> **Nota de idioma.** Los comentarios dentro de las carpetas `a/`, `b/` y `c/`
> están en **inglés**, igual que [`../chain`](../chain/README.md) y
> [`../quantum`](../quantum/README.md). Los README de carpeta, en español.

**La copy no se posee acá.** Vive entera en
[`economicsContent.ts`](./economicsContent.ts) y las tres variantes leen exactamente
la misma. Eso es deliberado y es lo que hace comparable la comparación: lo que
cambia entre `/prototype/economics-a`, `-b` y `-c` es el LAYOUT, nunca las
palabras. Si algo no cierra, se corrige ahí primero.

Se agregó **un solo bloque** al módulo de copy: `PROJECTION`, las etiquetas del
gráfico de la variante B. Está explicado más abajo, y su docstring en el propio
módulo dice por qué la honestidad de ese gráfico tenía que ser DATO y no
caption.

## La página, y la única cosa que las tres tienen que resolver

Cinco bloques: hero → cuatro hechos estructurales → **el volante** → los dos
productos que generan el ingreso → la síntesis y el cierre.

El volante es un bucle de cuatro pasos, y el paso 4 solo significa algo porque
**reinicia el paso 1**. De ahí sale la única regla que gobierna las tres
variantes:

> Cualquier layout que deje leer los cuatro pasos fuera de orden rompió la
> sección.

Las tres gastan ahí su dispositivo estructural, y lo gastan de tres formas
distintas — que es toda la comparación:

| | Variante | Cómo impide leerlos fuera de orden |
|---|---|---|
| `a/` | **Four-beat loop** | Los cuatro pasos son cuatro posiciones de UN trazo. El anillo se dibuja de nodo en nodo con el scroll, y no hay forma de ver el tercero sin haber visto llegar al segundo |
| `b/` | **Ledger** | Cada asiento declara su ENTRADA y su SALIDA, y la entrada de cada uno es la salida del anterior. El encadenamiento está en los datos, no en un dibujo |
| `c/` | **Descent** | Un paso por pantalla. El paso 3 es inalcanzable sin atravesar el 2, porque hay un viewport de tinta en el medio |

## `a/` — Four-beat loop

**La decisión:** el volante es una **escena pegada** y es el centro de gravedad
de la página. Todo lo demás está calibrado para no competir con él — el hero es
un server component sin una sola animación, y los cuatro hechos son columnas
bajo filete.

Sobre tinta, un anillo de cuatro nodos a 1px. El trazo lo recorre nodo por nodo
mientras la copy del paso correspondiente entra al lado. **Al cerrar la vuelta
no se detiene:** hay un QUINTO tiempo en el que el trazo vuelve a salir por la
primera pata, más brillante, mientras se lee `FLYWHEEL.closing`. Un bucle que
termina su vuelta y frena es el diagrama de un ciclo; uno que se pasa de su
propio arranque es el diagrama de un volante, que es lo que la copy afirma.

Mecánica: `position: sticky` de CSS + un ScrollTrigger que solo LEE progreso
(`stickyScene`), **nunca `pin: true`** — el razonamiento largo está en el README
padre. El JSX renderiza el estado FINAL (todo dibujado) y la escena lo rebobina;
sin JS, en móvil o con `prefers-reduced-motion` el lector recibe el anillo
completo y cinco bloques apilados en orden.

Progresión de fondo: crema, crema, **tinta**, blanco, crema. La tinta es el
anillo —la única sección que se gana un corte duro— y el blanco son los
productos, el único respiro y el único momento en que la página nombra dos cosas
que existen. Volver a crema al final es el gesto del propio anillo a escala de
página.

## `b/` — Ledger

**La decisión:** la economía como **cuenta corriente**. Denso, numérico, de
registro. Es la variante para quien quiere ver los números y no la metáfora — y
por eso el hero abre con el ÍNDICE de la página antes que con el argumento (los
cuatro `eyebrow` leídos del módulo de copy, así que no pueden desincronizarse).

Mono en todas las etiquetas de dato. Los cuatro hechos son **filas de tabla** —
índice, cifra, afirmación, cuerpo, siempre en las mismas cuatro posiciones — y
los cuatro asientos del volante repiten esa forma.

**La circularidad vive en el margen.** No hay un segundo diagrama al costado
explicando que la lista es un bucle: la salida del cuarto asiento deja la fila,
dobla al margen izquierdo, sube por delante de los cuatro y vuelve a entrar en
el primero. Son tres reglas de 1px con tres orígenes de transformación (fuera,
arriba, adentro) y no un `<path>` SVG, porque la altura del riel es la que midan
los cuatro asientos: un SVG estirado a una caja desconocida o distorsiona el
grosor del trazo o exige una pasada de medición.

**El gesto firmado es el gráfico** (`EmissionChart`): dos curvas a 1px —emisión
y recompra— que convergen, dibujadas con `pathLength={100}` + `strokeDashoffset`,
el mismo mecanismo sin plugins de `chain/ProofBand`. Las dos dibujan **a la vez
y a la misma velocidad**: escalonadas, una llegaría al punto de encuentro y
esperaría, y eso se lee como que una causa a la otra.

Fondos: crema, crema, **tinta** (el volante), crema (el gráfico), blanco (los
dos productos), crema. El cierre es a propósito la sección más callada de la
variante — un libro de registro cierra totalizando, no levantando la voz.

## `c/` — Descent

**La decisión:** editorial y grande. La página se lee **cayendo**. Cada paso del
bucle es un panel de altura completa que se atraviesa, alternando crema y tinta,
con su numeral colosal (`text-mural`, con su `@container` obligatorio) y una
sola línea grande; el cuerpo va en una medida angosta al costado. El contraste
entre una línea muy ancha y una columna muy angosta es todo el argumento
tipográfico de la variante.

**El retorno es una sección, no una frase al pie del panel 4.** En una página
que se lee cayendo, «vuelve a empezar» tiene que ser un lugar al que se llega:
el suelo vuelve a crema, la flecha apunta hacia arriba —la única de la página
que lo hace— y el link lleva de verdad al ancla del primer panel.

Dos cosas que parecen prolijas y romperían la variante:

- **Mover `FactRow` debajo de los paneles.** C gasta cuatro pantallas en una
  metáfora antes de ofrecer algo verificable, y una página editorial que pide
  esa confianza tiene que dar la prueba primero. Por eso los cuatro hechos van
  apretados, en una fila, apenas pasado el fold: es la sección más corta de la
  página a propósito.
- **Meter el retorno dentro de `DescentPanels` como un párrafo más.** Es una
  sección de altura completa porque tiene que sentirse como una llegada.

Los productos son **dos mitades a sangre**, tinta a la izquierda y crema a la
derecha, sin filete ni gap entre ellas: dos suelos que se tocan en una vertical
dura separan mejor que cualquier borde. Es el único momento en que la página
abandona la retícula de 12 columnas, y cae justo donde el argumento deja de
describir un mecanismo. El blanco se guarda para el cierre — que es el único
suelo que no es ni crema ni tinta después de cinco pantallas alternando.

## No hay contadores animados, y no es una cuestión de gusto

Ninguna de las tres variantes anima una cifra hacia arriba. Cuatro razones, en
orden de peso:

1. **La mitad de las cifras no puede contar.** `Onchain` no es un número y
   `−50%` es un recorte: un contador tendría que hacer un caso especial con dos
   de los cuatro hechos, y eso destruye exactamente la uniformidad que permite
   leer la fila de un vistazo. Es la misma objeción concreta —no estética— que
   `chain/ProofBand` documenta para `<$0.01`.
2. **Un contador retiene el número y hace esperar al lector.** El trabajo de esa
   fila es «un vistazo = esto ya pasó», y un tally lo convierte en tres
   movimientos.
3. **Movimiento ascendente implica telemetría en vivo**, y no habría nada
   conectado detrás. Eso es fabricar actualidad sobre una cifra presentada como
   hecho.
4. **Es el ornamento por defecto del género.** Esta es una página de tokenómica:
   contadores que suben y gradientes son precisamente lo que cualquier lector ya
   vio cien veces, y lo único que no puede permitirse una página que se presenta
   como un libro de registro es pedir prestado ese vocabulario.

Lo que las cifras hacen en su lugar es llegar en el vocabulario de la casa: el
filete se dibuja y el número sube desde debajo de él.

## La deflación NO se dibuja como hecho consumado

`FLYWHEEL.steps[2]` dice que el sistema **«está diseñado para acercarse»** a un
punto en que salen más tokens de circulación de los que entran. No dice que haya
llegado, y ninguna de las tres variantes puede decirlo por su cuenta.

El riesgo es concreto y es de la variante B, que es la única que dibuja esa
afirmación: un gráfico es muchísimo mejor que un párrafo para afirmar algo por
accidente. Con valores en un eje y fechas debajo, el lector lee un registro
histórico, diga lo que diga el pie de foto. Por eso el gráfico retiene tres
cosas, y ninguna es un olvido:

1. **Ningún valor en ningún eje.** No hay escala porque no hay dataset. La forma
   es la afirmación.
2. **La marca del encuentro es HUECA.** En este sitio un punto relleno es un dato
   graficado (ver `chain/ProofBand`); un contorno dice «acá van a dar las
   líneas», que es exactamente el estatus de ese punto.
3. **La palabra `Projection` va dentro del área del gráfico**, no en un caption
   debajo. Los captions se caen cuando alguien re-maqueta una sección; un chip
   dentro del dibujo viaja con él.

Las tres cadenas —`label`, `axisNote` y `note`— viven en `PROJECTION`, en el
módulo de copy y no en el componente. Esa es la parte importante: son las
condiciones bajo las cuales la figura tiene permiso de existir, así que tienen
que ser tan difíciles de borrar como los datos.

## Lo que se descartó

| Se probó / se consideró | Por qué no |
|---|---|
| Contadores animados en las cifras | Las cuatro razones de arriba |
| Cards con borde para los cuatro hechos | La doctrina de la casa está en `chain/WhyItMatters.tsx`. Acá pesa una razón extra en la variante A: la sección de abajo es un ANILLO, y cuatro rectángulos entrando a un círculo hacen ver la página como dos argumentos engrapados |
| El anillo de A también en B | Un anillo es una metáfora: dice «ciclo» antes de decir qué se mueve. B es para quien quiere la cuenta, no la metáfora |
| Los dos productos lado a lado en A | Se leen como una comparación —«elegí uno»— y no son alternativas, son dos motores del mismo bucle. Apilados a ancho completo, el lector los recibe en el orden del deck |
| Un quinto paso escrito en el copy para «cerrar el bucle» | El cierre ya existe (`FLYWHEEL.closing`). Agregar copy nueva para lo que el layout tiene que demostrar es la salida fácil, y es la que rompe la comparación entre variantes |
| Fondo verde saturado para una mitad del split de C | Fuera de la paleta de suelos del DS (`cream`, `ink`, `ink-slate`, `background`). La costura tinta/crema ya es el corte más duro de la página |
| `pin: true` de GSAP para la escena de A | Nunca, en ninguna sección de este repo. El razonamiento largo está en el README padre |

## Detalles que es fácil deshacer sin querer

- **El verde chico sobre claro es `text-green-ink` (#00a86b), nunca
  `near-green-accent`.** El accent es un verde de UI y no llega a 3:1 sobre
  crema. Está escrito en `app/globals.css` y es la regla de la casa; en tinta se
  invierte (`text-near-green-accent`). Las líneas `reinforces` y los `claim` de
  producto son los usos de esta página, todos frases mono cortas — el mismo
  patrón que `community/c/RallyLegion`.
- **`pathLength` es 100 y no 1** en todo trazo dibujado (el anillo de A, las dos
  curvas de B). GSAP redondea valores en píxeles por defecto (`autoRound`) y
  `stroke-dashoffset` es una propiedad en píxeles: normalizado a 1 el dibujo
  SALTA de no-dibujado a dibujado sin nada en el medio, y no da ningún error.
- **`loopRing.ts` redondea a cuatro decimales** antes de que las coordenadas
  lleguen al DOM. `Math.sin`/`Math.cos` no están obligadas por la spec a estar
  correctamente redondeadas, así que Node y el navegador difieren en el último
  ulp y React se niega a hidratar. Mismo motivo que `chain/chainDiagram.ts`.
- **El atributo `data-loop` de la escena de A lo escribe SOLO `enableScene`.**
  Declarado también en el JSX, el primer re-render lo devuelve a su estado
  inicial y el sticky se desarma en silencio.
- **Ningún ancestro del hijo pegado puede tener `overflow` distinto de
  `visible`.** El `overflow-hidden` va sobre el elemento pegado, que sí puede
  tenerlo.
- **`text-mural` en C exige `@container` en el bloque.** Mide su cuerpo en `cqw`;
  sin contenedor declarado resuelve contra el viewport y el numeral sigue
  creciendo después de que el `Container` topó en su `max-width`.
- **Cada panel de C tiene su propio ScrollTrigger** (un componente por panel).
  Cuatro paneles de `min-h-svh` son más altos que cuatro viewports, así que una
  sola timeline en el padre dispararía con tres de los cuatro todavía fuera de
  cuadro y el lector llegaría a tres pantallas terminadas.
