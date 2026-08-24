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

Al módulo de copy se le agregaron tres cosas, y ninguna es un texto nuevo:

| | Qué es | Quién lo usa |
|---|---|---|
| `PROJECTION` | Las etiquetas del gráfico de convergencia, con `label`, `axisNote` y `note` — las condiciones bajo las cuales esa figura tiene permiso de existir | `b/ProjectionPanel` |
| `FLYWHEEL.steps[].intake` / `.emits` | Qué entra a cada etapa y qué sale. **La entrada de cada paso es literalmente la salida del anterior**, y la salida del cuarto es la entrada del primero | `b/LoopBench` |
| `FLYWHEEL.restart` | El quinto tiempo: la etiqueta y la frase del retorno | `b/LoopBench`, `c/AscentLoop` |

Los tres tienen su docstring en el propio módulo explicando por qué son DATO y
no algo escrito dentro de un componente.

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

| | Variante | Estilo | Cómo impide leerlos fuera de orden |
|---|---|---|---|
| `a/` | **Four-beat loop** | Editorial | Los cuatro pasos son cuatro posiciones de UN trazo. El anillo se dibuja de nodo en nodo con el scroll, y no hay forma de ver el tercero sin haber visto llegar al segundo |
| `b/` | **The bench** | Instrumento | Cuatro estaciones de un conducto cerrado, con un riel de actos que declara cuántas son. Además, la lectura `In` de cada etapa es la `Out` de la anterior: el encadenamiento está en los datos |
| `c/` | **The ascent** | Escenario | Una sola travesía que sube de izquierda a derecha sobre el terreno. Leerlos fuera de orden es leer la ruta al revés, y el dibujo lo hace obviamente incorrecto |

## `a/` — Four-beat loop · editorial

**NO SE TOCA.** Es la variante de la primera pasada y es la vara de comparación:
filete de 1px, fondo plano, sin cajas, tipografía primero.

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
(`stickyScene`), **nunca `pin: true`**. El JSX renderiza el estado FINAL (todo
dibujado) y la escena lo rebobina; sin JS, en móvil o con
`prefers-reduced-motion` el lector recibe el anillo completo y cinco bloques
apilados en orden.

Progresión de fondo: crema, crema, **tinta**, blanco, crema.

## `b/` — The bench · instrumento

**La decisión:** la economía como **banco de pruebas de una máquina**. La
máquina existe, está corriendo, y cada sección es un aparato con su lectura. La
página es oscura de punta a punta y su unidad de composición no es el párrafo,
es el **panel**: un objeto con canto, etiqueta en la esquina y algo adentro que
se mira.

Monta el armazón [`shells/instrument/`](../shells/README.md) — `Panel`,
`Readout`, `ActRail`, `Section` — sin variantes locales.

### El sistema gráfico: un circuito con volumen

El volante NO podía ser otro anillo. La variante A ya dibuja este bucle como un
círculo de 1px sobre tinta, y repetirlo en una caja más oscura habría dejado a B
como «la A pintada de negro», que es el único resultado que esta variante no
puede tener.

Así que B dibuja la misma afirmación como **aparato**: los cuatro pasos son
cuatro bloques que se paran sobre un plano, lo que los une es un **conducto con
ancho** en vez de una línea, y lo que circula se ve adentro. Un anillo dice
«ciclo» antes de decir qué se mueve; un ducto con algo adentro dice primero qué
se mueve y deja que «ciclo» salga del hecho de que cierra. La geometría vive en
[`b/circuit.ts`](./b/circuit.ts), con el razonamiento largo arriba.

**Deliberadamente NO es el campo de cubos isométricos de `/prototype/protocol-a`.**
De protocol se toma la paleta y el peso, no las figuras — fue una decisión
explícita del cliente: sistema gráfico nuevo por página.

### Las secciones

| Sección | Qué hace |
|---|---|
| `HeroBench` | El titular dentro de un panel, y en el pie del panel **la lista de etapas de la máquina** (los cuatro `short` leídos del módulo de copy, con las flechas y el retorno). Un instrumento declara sus etapas antes de correr. Server component, sin movimiento |
| `FactBench` | Los cuatro hechos como **la cara del instrumento**: una banda de cuatro `Readout` a la misma altura, cada uno con su glifo en una placa hundida, y debajo —dentro del mismo panel— la fila de afirmaciones. `100%` es la única lectura encendida |
| `LoopBench` | La escena firmada. Panel con retícula, figura a la izquierda, copy a la derecha, `ActRail` en el pie. Sticky + ScrollTrigger que solo lee progreso |
| `ProjectionPanel` | El tercer tiempo del bucle, dibujado: las dos curvas convergiendo, enfrentadas a la captura del panel público de ingresos |
| `EngineModules` | Los dos productos como **dos módulos del mismo aparato**: dos paneles a ancho completo, el arte alternando de lado |
| `CenterSolid` | El activo como la pieza a la que llegan las tres líneas — y llegan a **tres caras del mismo sólido**, no a un punto |

### Tres detalles de `LoopBench` que parecen decoración y no lo son

- **El riel vuelve a 01 en el quinto tiempo.** Hay cinco slots y cuatro actos.
  En el quinto el `ActRail` enciende 01 otra vez en vez de apagarse: es
  `FLYWHEEL.closing` dicho por el instrumento y no por la frase de al lado. Por
  eso el acto activo es estado de React alimentado desde el trigger — `ActRail`
  es presentacional a propósito, así hay UNA fuente del paso en curso.
- **Las lecturas `In`/`Out` cambian con el acto, y la del quinto es la del
  primero, sin tocar.** El reinicio se ve en los datos en vez de afirmarse en
  una oración.
- **`In`/`Out` NO son `Readout`s.** Esa pieza pone su valor en Kepler itálica
  para que una CIFRA gane sobre su etiqueta a cuerpo chico; con una frase de
  tres palabras lo único que hace es gritarla. Van en mono, chicas y del mismo
  peso las dos, porque el argumento no es ninguna de las dos frases: es que la
  izquierda es literalmente la derecha del paso anterior.

### El portador, y por qué no es telemetría

Una sola cuenta recorre la línea central cerrada del conducto, para siempre, con
un tween propio sin relación con el scroll. Es un dibujo de mecanismo y no
afirma ninguna magnitud: nada cuenta hacia arriba, ninguna lectura cambia sola,
y no hay una tasa en ninguna parte de la página. Lo único que dice es lo que la
copy dice —que esto no se detiene— y es lo que evita que el diagrama se lea como
el esquema de algo que corrió una vez.

Corre también en móvil, donde no hay escena pegada: es la forma más barata de
que «está corriendo» siga siendo cierto en el layout que no recibe nada de la
escena.

### Los glifos de los hechos se reusan tal cual

`FactBench` monta `../factGlyphs` sin redibujarlos. Son cuatro afirmaciones con
un dibujo correcto cada una, y un dibujo no es layout — por eso se sacaron de las
variantes en su momento. Lo que cambia en B es su **alojamiento**: cada uno va en
una placa hundida bajo su lectura, que es la diferencia entre un dibujo en una
columna y una ventana en un instrumento.

El volumen que esta variante debe está en `LoopBench` y en `CenterSolid`, donde
la figura ES el argumento. Extruir además cuatro glifos del tamaño de una línea
de texto gastaría el mismo gesto dos veces y haría que la sección compitiera con
la escena de abajo.

## `c/` — The ascent · escenario

**La decisión:** la economía como **paisaje que se levanta con el uso**. La
superficie de curvas de nivel no es una metáfora forzada acá: más actividad, más
relieve. La unidad de composición es la **card**, y el suelo es un terreno —
primero como shader en el hero, después como figura dibujada en el medio.

Monta el armazón [`shells/stage/`](../shells/README.md) — `Surface`, `Card`,
`Section` — sin variantes locales.

### La paleta, que es un argumento y no un humor

De las cuatro páginas que comparten la superficie de contorno, **esta es la
única cuya tesis es el crecimiento**, así que se lleva el extremo más verde y
más cálido del rango: meseta baja arena-crema (`#efe9d5`), meseta alta verde
cálido (`#a3d78d`), curva oliva (`#4e7a3f`). El terreno de community es
terracota y el de foundation es más callado; la calibración existe para que un
lector que ya vio dos sepa en cuál está antes de que resuelva el titular.

Los otros tres números pesan igual que los colores: `bands` bajo (7) para
**mesetas anchas** donde apoyar el display, `scale` bajo (1.5) para colinas
amplias, `tilt` alto (0.62) para que el terreno tenga una dirección y esa
dirección sea hacia arriba. El contenido va al PIE de la superficie, que es donde
está la banda más plana.

### Las secciones

| Sección | Qué hace |
|---|---|
| `HeroTerrain` | `Surface` a pantalla completa con la paleta de arriba, el titular apoyado en la meseta baja |
| `GrowthCards` | Los cuatro hechos como cuatro `Card`. La placa de arte lleva la lectura (`100%`) y el sólido que muestra su forma; el título de la card lleva la afirmación |
| `AscentLoop` | La figura grande a sangre: cuatro estaciones sobre el terreno, la travesía que sube, y el retorno |
| `EngineCards` | Los dos productos como dos cards grandes sobre blanco, con la captura en la placa de arte y el `claim` arriba de ella |
| `CenterClose` | Los tres roles bajo filete, y el cierre sobre una banda del mismo terreno del hero |

### Los glifos crecidos: `c/factReliefs.tsx`

Es el único caso de la página en que un dibujo se duplica en vez de compartirse,
y la razón está escrita arriba del archivo: los glifos de `../factGlyphs` son el
dibujo correcto en el material equivocado para esta variante. Son marcas de 1px
del tamaño de una línea de texto, hechas para vivir dentro de una columna de
prosa; C pone cada hecho en una card con su propia placa de arte, y un filete en
el medio de una placa blanca de 320px se lee como un accidente — la placa parece
vacía y el dibujo parece haber perdido su párrafo.

Así que son **las mismas cuatro afirmaciones ejecutando los mismos cuatro
argumentos**, crecidas a sólidos: mismo orden, misma geometría, **mismas
ausencias**. Lo que cambia es que son cuerpos que reciben luz, rellenos con la
rampa del CTA (cara superior `--cta-lime`, frente `--cta-mint`, lado
`--cta-deep`), a un tamaño en el que la placa tiene algo adentro. Un solo vector
de extrusión para los cuatro, o serían cuatro piezas de clip-art con cuatro
direcciones de luz.

**Ninguna afirmación cambió con el material.** 01 siguen siendo ocho
compartimentos sin hueco que buscar, 02 sigue siendo una magnitud y la mitad de
ella con la mitad que falta simplemente faltando, 03 siguen siendo cuatro
propuestas desiguales cruzando un umbral, 04 siguen siendo cinco marcas de año y
una corrida que no se rompe en ninguna.

### La figura grande: `c/AscentLoop`

A dibuja este bucle como un círculo y B como un conducto cerrado. Las dos son
correctas para lo que son, y las dos comparten un límite: **una forma cerrada
vuelve exactamente a donde arrancó**, así que «una vuelta más fuerte» hay que
agregarlo encima del dibujo (las dos lo hacen con una segunda pasada más
brillante sobre la primera pata).

C lo dibuja sobre un TERRENO, que es la única superficie donde el retorno puede
aterrizar en otro lado. La travesía sube de izquierda a derecha por las cuatro
estaciones; el retorno barre de vuelta por el primer plano y llega a la columna
de la estación 01 **una banda más arriba que la estación 01**. El bucle cierra
en x y no cierra en y, que es todo `FLYWHEEL.closing` sin nada escrito al lado.

- **El portador no se detiene.** Una sola cuenta recorre subida-y-retorno como
  un solo `<path>`, para siempre. Sin `MotionPathPlugin` —que no está en este
  proyecto— con un `strokeDasharray` de una raya corta sobre `pathLength={100}`:
  el hueco es el resto del circuito, así que nunca hay más de una cuenta.
- **La marca del retorno es HUECA.** Es donde EMPIEZA la vuelta siguiente, no un
  quinto evento que ya ocurrió.
- **El relleno bajo la subida es la rampa del CTA de verdad**, no un acento. Es
  la licencia de esta variante y de ninguna otra.
- **Se lee en un scroll, no en cinco.** No hay escena pegada acá; el orden lo
  impone la figura.
- **La fila de texto NO está alineada a las estaciones.** Se probó y se
  descartó: el padding del `Container` es un número distinto en cada breakpoint,
  así que cualquier alineación cierta a un ancho es falsa al siguiente, y un
  tick que casi conecta es peor que ninguno. Lo que carga el mapeo es la
  numeración y el escalonado — cada bloque se sienta más arriba que el anterior,
  en la misma proporción que su estación.

### El cierre de C no tiene figura, y es una decisión

La página ya gastó cuatro momentos gráficos: el terreno con shader, los cuatro
sólidos, la travesía a sangre y las dos capturas. Un quinto dibujo ahí sería la
segunda figura casi circular de la página, y el lector busca entre dos figuras
así una relación que no existe. La regla es que un gráfico tiene que ser
evidencia, argumento o estructura; «el cierre se veía vacío» no es ninguna de
las tres.

Lo que sí hace el cierre es volver al terreno del hero en una banda corta: la
página vuelve a donde empezó, una vuelta más arriba, que es el gesto de su
propia figura central a escala de documento.

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
   conectado detrás. En la variante B esto pesa el doble: una cifra subiendo
   dentro de un panel oscuro con etiquetas en mono es exactamente el dashboard
   conectado que esta página no tiene.
4. **Es el ornamento por defecto del género.** Contadores que suben y gradientes
   son precisamente lo que cualquier lector de una página de tokenómica ya vio
   cien veces.

## La deflación NO se dibuja como hecho consumado

`FLYWHEEL.steps[2]` dice que el sistema **«está diseñado para acercarse»** a un
punto en que salen más tokens de circulación de los que entran. No dice que haya
llegado, y ninguna de las tres variantes puede decirlo por su cuenta.

El riesgo es de `b/ProjectionPanel`, la única sección que dibuja esa afirmación:
un gráfico es muchísimo mejor que un párrafo para afirmar algo por accidente.
Por eso la figura retiene **cuatro** cosas, y ninguna es un olvido:

1. **Ningún valor en ningún eje.** No hay escala porque no hay dataset. La forma
   es la afirmación.
2. **La marca del encuentro es HUECA.** En este sitio un punto relleno es un dato
   graficado (ver `chain/ProofBand`); un contorno dice «acá van a dar las
   líneas», que es exactamente el estatus de ese punto.
3. **La palabra `Projection` va dentro del área del gráfico**, no en un caption
   debajo. Los captions se caen cuando alguien re-maqueta una sección; una
   palabra parada en medio del dibujo viaja con él.
4. **Ninguna de las dos curvas sigue más allá del punto de encuentro.**
   Dibujarlas cruzándose sería dibujar el umbral deflacionario como algo ya
   pasado. El dibujo se detiene donde se detiene la afirmación.

Las tres cadenas —`label`, `axisNote` y `note`— viven en `PROJECTION`, en el
módulo de copy y no en el componente. Esa es la parte importante: son las
condiciones bajo las cuales la figura tiene permiso de existir, así que tienen
que ser tan difíciles de borrar como los datos.

**Las dos curvas se dibujan a la vez y a la misma velocidad.** Escalonadas, una
llegaría al punto de encuentro y esperaría, y esperar se lee como que una causa
a la otra.

## Los assets que hay que producir

Todos los `label` son la orden de trabajo, y van en inglés porque se imprimen en
la página. Son **tres productos, cinco encuadres**: la captura de Intents y la de
NEAR AI de `a/` y `b/` son la MISMA foto (los `label` son idénticos palabra por
palabra a propósito, para no duplicar la lista de tomas por una diferencia que
nadie pidió).

| Variante · sección | Asset | Proporción · spec |
|---|---|---|
| `a/RevenueEngines` · `b/EngineModules` | NEAR Intents — cross-chain swap in progress: the stated intent, the route it takes, and settlement on both chains | 16/9 · 2400×1350 · PNG @2x |
| `a/RevenueEngines` · `b/EngineModules` | NEAR AI — agent infrastructure console: one agent running in a confidential environment, execution proof in view | 4/3 · 1600×1200 · PNG @2x |
| `b/ProjectionPanel` | revenue.near.org — screenshot of the public dashboard: cumulative revenue and buybacks, with the date of the snapshot visible | 4/3 · 1600×1200 · PNG @2x, recorte del panel, sin cromo del navegador |
| `c/EngineCards` | NEAR Intents — wide strip of a cross-chain swap: the stated intent, the route between chains, and settlement | 5/2 · 2500×1000 · PNG @2x |
| `c/EngineCards` | NEAR AI — agent console: one agent running in a confidential environment, with its execution proof | 16/9 · 2400×1350 · PNG @2x |

Mientras no existan, el hueco se ve como un área reservada con su encargo escrito
abajo, no como una imagen rota. Cuando lleguen, se les pasa `src` y el layout no
se mueve.

**El panel de ingresos entra UNA vez en toda la página**, y entra en
`b/ProjectionPanel`, que es donde más pesa: la sección termina en un link a ese
panel para responder la única objeción justa que el gráfico invita («¿y los
números?»), y un link es una respuesta débil porque obliga a irse a comprobar.
Enfrentados, los dos dicen cosas distintas a propósito: forma dibujada a la
derecha, que no afirma ninguna magnitud, y registro fotografiado a la izquierda,
que no tiene que hacerlo. **Es una captura y no un embed**, y esa distinción es
la honestidad del slot.

## Detalles que es fácil deshacer sin querer

- **El verde chico sobre claro es `text-green-ink` (#00a86b), nunca
  `near-green-accent`.** El accent es un verde de UI y no llega a 3:1 sobre
  crema. En tinta se invierte (`text-near-green-accent`). Las líneas
  `reinforces` y los `claim` de producto son los usos de esta página.
- **`pathLength` es 100 y no 1** en todo trazo dibujado. GSAP redondea valores en
  píxeles por defecto (`autoRound`) y `stroke-dashoffset` es una propiedad en
  píxeles: normalizado a 1 el dibujo SALTA de no-dibujado a dibujado sin nada en
  el medio, y no da ningún error.
- **Con `pathLength={100}`, `strokeDasharray` también está en unidades de path.**
  Un `strokeDasharray="8 7"` no son 8 píxeles: es el 8% del recorrido, y el
  retorno de `c/AscentLoop` llegaba como seis fragmentos enormes. Los valores
  correctos ahí son del orden de `1.3 1.5`.
- **Un trazo que se dibuja con `strokeDashoffset` no puede además llevar un
  patrón de rayas.** Son la misma propiedad. Por eso el retorno de `c/AscentLoop`
  entra con `autoAlpha` y no dibujándose.
- **`loopRing.ts`, `b/circuit.ts` y `c/ascentRoute.ts` redondean a cuatro
  decimales** antes de que las coordenadas lleguen al DOM. `Math.sin`/`Math.cos`
  no están obligadas por la spec a estar correctamente redondeadas, así que Node
  y el navegador difieren en el último ulp y React se niega a hidratar. Mismo
  motivo que `chain/chainDiagram.ts`.
- **El atributo de escena (`data-loop` en `a/`, `data-bench` en `b/`) lo escribe
  SOLO `enableScene`.** En `b/LoopBench` esto importa de verdad y no en teoría:
  esa sección TIENE estado de React (el acto activo del riel), así que declarar
  el atributo en el JSX haría que el primer re-render lo devuelva a su estado
  inicial y el sticky se desarme en silencio.
- **Ningún ancestro del hijo pegado puede tener `overflow` distinto de
  `visible`.** El `overflow-hidden` va sobre el elemento pegado, que sí puede
  tenerlo.
- **Las etiquetas de las figuras van en HTML y no en `<text>`**, posicionadas en
  % de la misma geometría. Dentro de un viewBox escalado, el cuerpo de un
  `<text>` se multiplica por la escala de la figura y deja de coincidir con la
  escala mono del resto de la página.
- **Un `top` en % se resuelve contra la ALTURA del bloque contenedor.** Las
  etiquetas de `b/LoopBench` viven en el mismo `div` que el svg y no en un
  hermano vacío: un `div` relativo sin altura mide 0 y las cuatro se apilan en el
  origen.
- **La placa de arte de `Card` recorta en silencio.** Es 4/3 del ancho interno de
  la card con `p-6` adentro, y la card tiene `overflow-hidden`: un stack que se
  pasa pierde su parte de abajo sin ningún error. El presupuesto de altura de
  `c/GrowthCards` está anotado en el propio componente.
- **El plato del banco de `b/circuit.ts` tiene que quedar DENTRO del viewBox.**
  El svg dibuja con `overflow-visible` (el portador lo necesita), así que un
  plato que se pasa no lo recorta el svg: lo recorta el `Panel`, y un plato
  cortado por el borde de su propio panel se lee como un error.

## Lo que se descartó

| Se probó / se consideró | Por qué no |
|---|---|
| Contadores animados en las cifras | Las cuatro razones de arriba |
| El anillo de A también en B | Un anillo es una metáfora: dice «ciclo» antes de decir qué se mueve. B es el aparato, y un aparato muestra primero qué circula |
| El campo de cubos isométricos de `/prototype/protocol-a` en B | De protocol se toma la paleta y el peso, no las figuras. Un segundo campo de cubos se leería como la página de protocol pintada de otro color |
| Redibujar los cuatro glifos con volumen para B | El volumen de B está donde la figura ES el argumento (`LoopBench`, `CenterSolid`). Extruir además cuatro dibujos del tamaño de una línea de texto gasta el gesto dos veces y hace competir a la sección con la escena de abajo |
| Un diagrama de rayos para `CENTER` (un centro y tres líneas hacia afuera) | Es el dibujo de «un token con tres usos», que es justo lo que la copy dice que tienen los DEMÁS tokens. Por eso las líneas van al revés y llegan a tres CARAS del mismo sólido |
| La figura de `CENTER` también en `a/` | Sería el segundo anillo de la página después de `LoopScene`, y dos figuras circulares hacen que el lector busque una relación que no existe |
| Cards con borde para los cuatro hechos en `a/` y `b/` | La doctrina de la casa está en `chain/WhyItMatters.tsx`. En `c/` sí van, y el porqué está escrito en `shells/stage/Card.tsx`: cada unidad tiene una FIGURA, y una figura necesita un fondo propio |
| Una escena pegada para el volante de C | El encargo de C es una pantalla, no cinco. El orden lo impone la figura |
| Alinear la fila de texto de `c/AscentLoop` a las estaciones con ticks | El padding del `Container` cambia por breakpoint; una alineación cierta a un ancho es falsa al siguiente |
| Una figura en el cierre de C | Sería la segunda figura casi circular de la página. Una sección puede quedarse sin gráfico |
| Un embed o un widget «en vivo» de revenue.near.org | Telemetría que este sitio no tiene. La captura fechada dentro de marcas de registro no se puede confundir con un feed |
| Repetir la captura del panel de ingresos en las tres variantes | El respaldo se gasta una vez y donde más pesa: enfrentado al gráfico que se niega a poner valores en los ejes |
| Slots `MediaFrame` idénticos 16/9 apilados | Es una plantilla, no una composición: repetiría la simetría que el layout ya tiene y no cambiaría el ritmo de la página en nada |
| `pin: true` de GSAP para las escenas | Nunca, en ninguna sección de este repo. El razonamiento largo está en el README padre |
