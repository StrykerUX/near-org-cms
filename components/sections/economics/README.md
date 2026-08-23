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

## El aparato gráfico (segunda pasada)

La página arrancó con tres figuras —el anillo de `a/LoopScene`, la curva de
emisión de `b/EmissionChart` y el riel de `b/LedgerFlow`— y con los dos tramos
de alrededor resueltos solo con tipografía. Esta pasada llenó esos dos huecos, y
**no tocó ninguna de las tres figuras que ya estaban**.

Todo lo que entró pasa la regla de las tres: es **evidencia** (el lugar de un
recurso real, con `MediaFrame`), **argumento** (un dibujo que carga una
afirmación, con SVG propio) o **estructura**. Nada entró para llenar.

### 1. Cuatro micro-glifos para los hechos estructurales — `factGlyphs.tsx`

`MATURITY.facts` era el bloque más dibujable de la página y eran cuatro párrafos
con una cifra grande. Ahora cada hecho lleva su propio dibujo de 1px, y cada
dibujo **ejecuta su afirmación** en vez de ilustrarla (mismo criterio que
`chain/WhyItMatters`; ningún glifo es un pictograma):

| | Hecho | Qué dibuja |
|---|---|---|
| 01 | Supply totalmente desbloqueado | Una barra cerrada de ocho compartimentos, **todos ocupados**. En otra red los últimos estarían vacíos y ese tramo vacío serían los tokens por liberar. El lector busca el hueco y no está |
| 02 | Emisión partida a la mitad | Dos barras y un corte. La vertical es a la vez el corte, el extremo derecho de la barra de abajo, y se pasa de las dos para leerse como evento y no como borde |
| 03 | Gobernanza onchain y en vivo | Cuatro propuestas de largo desigual llegando a un umbral; pasado el umbral son una sola línea con cuatro puntos **rellenos** — la marca de la casa para algo ya asentado. Ni urna ni martillo |
| 04 | Cinco años sin caídas | Cinco marcas de año, y un trazo que las cruza **sin cortarse**. Las marcas existen para que el trazo tenga dónde romperse, y no rompe en ninguna |

**Se dibujan una vez y las tres variantes los consumen.** Los hechos son los
mismos en `a/`, `b/` y `c/` — lo que se compara entre variantes es el LAYOUT, y
un glifo no es layout. Tres versiones a mano del mismo dibujo se despegan la
primera vez que alguien toca una.

Lo único que cambia por variante es **dónde se acomodan**:

- `a/Thresholds` — columna bajo filete, entre la cifra y la afirmación. Entra en
  la timeline que la sección ya tenía, como tercera ola (filetes → cifras →
  glifos → afirmaciones).
- `b/LedgerFacts` — dentro de la celda de la cifra, en la misma columna para las
  cuatro filas. Es lo que hace que la tabla se gane su forma: cuatro glifos
  comparables hacia abajo son una barra, una barra cortada, un umbral y una
  corrida. Es además el único tipo de dibujo que B admite — son medidas, no
  metáforas.
- `c/FactRow` — fila apretada, bajo la etiqueta de la cifra. Es donde más
  rinden: la banda es lo único que hay entre un hero enorme y cuatro pantallas
  de metáfora, y duplican lo que se lleva un lector que va rápido sin agregar
  una línea de copy.

Ninguno se anima solo. Entran con el reveal que su sección ya tiene: cuatro
dibujos del tamaño de una línea de texto no justifican doce ScrollTriggers.

### 2. Evidencia — los dos productos, y el panel de ingresos

Intents y NEAR AI son productos reales con interfaz, y la página no mostraba
ninguno. Un diagrama de Intents sería el diagrama de algo que no lo necesita, así
que acá va evidencia y no dibujo. Cada `MediaFrame` lleva su encargo escrito
abajo, y **las proporciones y los lados varían a propósito** — ocho slots 16/9
idénticos son una plantilla, no una composición.

Además entra **una sola vez** en toda la página una captura de
`revenue.near.org`, y entra en `b/EmissionChart`, que es donde más pesa: la
sección termina en un link a ese panel para responder la única objeción justa que
el gráfico invita («¿y los números?»), y un link es una respuesta débil porque
obliga a irse a comprobar. Ahora las dos cosas están enfrentadas y dicen cosas
distintas a propósito: forma dibujada a la derecha, que no afirma ninguna
magnitud, y registro fotografiado a la izquierda, que no tiene que hacerlo.
**Es una captura y no un embed**, y esa distinción es la honestidad del slot.

### 3. Argumento — un activo, tres trabajos (`c/DescentClose`)

`CENTER` afirma que los tres roles **se refuerzan entre sí**, y tres columnas de
texto pueden enunciarlo pero no mostrarlo: tres columnas son tres cosas
paralelas y la afirmación es sobre un retorno. La figura dibuja el retorno y nada
más — un activo, tres lóbulos, y cada lóbulo sale del activo y **vuelve a entrar
en él por otro punto**. La primera versión era un diagrama de rayos (un centro
con tres líneas hacia afuera) y ese es el dibujo de un token con tres usos, que
es justo lo que la copy dice que tienen los demás.

Va en `c/` y en ninguna otra:

- En `a/` sería el segundo anillo de la página después de `LoopScene`, y dos
  figuras circulares en una página hacen que el lector busque una relación entre
  ellas que no existe.
- En `b/` sería una metáfora en la única variante que las rechaza.
- `c/` era la única variante sin un solo dibujo propio, y es la que hace la
  afirmación más difícil de sostener con puro tamaño tipográfico.

Se apoya a la **izquierda** de `CENTER.body`, que invierte el hábito de la página
(titular a la izquierda, prosa a la derecha). Si cayera del mismo lado y al mismo
ancho que todo lo de arriba, no cambiaría el ritmo en nada, que es la única
razón para meter una figura en un cierre.

### Los assets que hay que producir

Todos los `label` son la orden de trabajo. En inglés, porque se imprimen en la
página; los comentarios del código siguen en inglés y este README en español.

| Variante · sección | Asset | Proporción · spec |
|---|---|---|
| `a/RevenueEngines` | NEAR Intents — cross-chain swap in progress: the stated intent, the route it takes, and settlement on both chains | 16/9 · 2400×1350 · PNG @2x |
| `a/RevenueEngines` | NEAR AI — agent infrastructure console: one agent running in a confidential environment, execution proof in view | 4/3 · 1600×1200 · PNG @2x |
| `b/EmissionChart` | revenue.near.org — screenshot of the public dashboard: cumulative revenue and buybacks, with the date of the snapshot visible | 4/3 · 1600×1200 · PNG @2x, recorte del panel, sin cromo del navegador |
| `b/LedgerEntries` | NEAR Intents inside a wallet — portrait capture of a cross-chain swap: the stated intent, the route, and the settled balance | 3/4 · 1200×1600 · PNG @2x, solo el device |
| `b/LedgerEntries` | NEAR AI — wide crop of the agent console: active agents, their confidential environment, and the execution log | 21/9 · 2520×1080 · PNG @2x |
| `c/SplitProducts` | NEAR Intents — wide strip of a cross-chain swap: the stated intent, the route between chains, and settlement | 5/2 · 2500×1000 · PNG @2x |
| `c/SplitProducts` | NEAR AI — agent console: one agent running in a confidential environment, with its execution proof | 4/3 · 1600×1200 · PNG @2x |

Son siete capturas de tres productos: Intents (tres encuadres distintos, porque
las tres variantes lo piden distinto), NEAR AI (tres) y el panel de ingresos
(una). Mientras no existan, el hueco se ve como un área reservada con su encargo
escrito, no como una imagen rota. Cuando lleguen, se les pasa `src` y el layout
no se mueve.

## La honestidad no se relajó al agregar dibujos

Un dibujo afirma más rápido que un párrafo, también cuando afirma de más. Lo que
esta pasada NO hizo, y no puede hacerse después:

- **Ningún glifo dibuja la deflación como hecho consumado.** El glifo 02 dibuja
  el recorte de emisión, que ya ocurrió y es verificable. La convergencia
  emisión/recompra sigue viviendo solo en `EmissionChart`, con sus tres
  retenciones intactas (ejes sin valores, marca de encuentro hueca, `Projection`
  dentro del área de trazado).
- **Ninguna figura sugiere telemetría en vivo.** El panel de ingresos entra como
  captura fechada dentro de marcas de registro, con su encargo en mono debajo. Un
  embed, o peor un widget que parezca en vivo, sería actualidad fabricada.
- **Sigue sin haber contadores animados**, por las cuatro razones de más abajo.
- **Los glifos no llevan color propio.** Heredan `currentColor` del bloque que
  los monta, igual que todo trazo de la casa. El verde sigue reservado a las
  frases `reinforces` y a los `claim` de producto.

## Los heroes se quedaron sin ancla visual, a propósito

Se evaluó y se descartó en las tres. En `a/` y `c/` el hero es tipografía a
tamaño deliberadamente grande y su trabajo es establecer la escala antes de que
llegue la primera sección; cualquier figura al lado llega primero y se gasta la
atención en el lugar equivocado — que es exactamente el argumento que ya está
escrito en `a/Hero`. En `b/` el ancla ya existe y es el ÍNDICE: un libro de
registro abre diciendo qué contiene, y eso es un dispositivo visual, no un
adorno. Las tres variantes ganaron entre cinco y siete momentos gráficos sin
tocarlos.

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
| Un diagrama de rayos para `CENTER` (un centro y tres líneas hacia afuera) | Es el dibujo de «un token con tres usos», que es justo lo que la copy dice que tienen los DEMÁS tokens. Sin el trazo de vuelta la figura no dice nada que las tres columnas no digan |
| La figura de `CENTER` también en `a/` y en `b/` | En `a/` sería el segundo anillo de la página; en `b/`, una metáfora en la variante que las rechaza. Ver arriba |
| Un pictograma por hecho estructural (urna para gobernanza, reloj para uptime) | Un pictograma nombra el tema y le deja la afirmación al párrafo, que es exactamente el trabajo que el dibujo venía a ahorrar |
| Animar cada glifo con su propio ScrollTrigger | Doce triggers más para animar cuatro objetos del tamaño de una línea de texto, en una página que ya tiene una escena pegada y un gráfico dibujado. Entran con el reveal de su sección |
| Una figura en los tres heroes | Ver la sección de arriba: en `a/` y `c/` compite con la escala tipográfica, en `b/` el índice ya es el ancla |
| Un embed o un widget «en vivo» de revenue.near.org | Telemetría que este sitio no tiene. La captura fechada dentro de marcas de registro no se puede confundir con un feed |
| Repetir la captura del panel de ingresos en las tres variantes | La sección tiene dos CTAs al panel, pero el respaldo se gasta una vez y donde más pesa: enfrentado al gráfico que se niega a poner valores en los ejes |
| Slots `MediaFrame` idénticos 16/9 apilados | Es una plantilla, no una composición: repetiría la simetría que el layout ya tiene y no cambiaría el ritmo de la página en nada |

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
