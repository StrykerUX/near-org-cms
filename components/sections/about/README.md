# `about` — las tres propuestas para `/about`

El contrato general de [`../README.md`](../README.md) aplica. Acá va solo lo
específico de esta página.

> **Nota de idioma.** Los comentarios de esta carpeta están en **inglés**, igual
> que [`../chain`](../chain/README.md) y [`../quantum`](../quantum/README.md).
> Los README de carpeta siguen en español.
>
> Todo string que se **renderiza** va en inglés, sin excepción: eso incluye los
> `label` y `spec` de cada `MediaFrame` —aunque sean encargos internos, hoy se
> imprimen dentro del hueco— y el `caption` de cada `Figure`, que es contenido
> permanente de la página. Un pie en español debajo de un párrafo en inglés se
> lee como un error, no como una nota interna.

**Las palabras no se deciden acá.** Vienen del deck y viven en
[`aboutContent.ts`](./aboutContent.ts). Los titulares siguen en el JSX por el
motivo que da el README padre: llevan `<Accent>`, y pasarlos a datos exige
elegir un esquema para "texto con un tramo acentuado", que es una decisión del
modelo de contenido y no un refactor.

De la copy del deck no se agregó ni una línea. Lo que se sumó al content module
después son cuatro cosas, y todas por la misma razón —se renderizan, así que son
copy—: los ocho encargos de `ARCHIVE`, los dos pies de `FIGURES`, el agrupamiento
en `ACTS` y las cuatro cifras de `READOUTS`. Las dos últimas las trajo la
variante B y viven ahí igual, porque una afirmación sobre el contenido que vive
en un solo layout es una afirmación que los otros dos contradicen en silencio.

Los rótulos de una palabra de la máquina de B —Models, Network, Shards, Intents,
Agents— son la excepción y están en el componente: son sustantivos del propio
deck y son parte del dibujo, no prosa. El razonamiento está en `b/StateStack`.

## Los años son datos, no prosa

Es la decisión que sostiene a las tres variantes y está explicada largo en la
cabecera de `aboutContent.ts`. En resumen: el deck trae ocho capítulos titulados
con las fechas metidas adentro de las oraciones. Esta es **la única página del
sitio donde el orden es información** —el arco va de dos personas esperando
modelos a los modelos llegando— así que el año se sacó de la prosa y se hizo un
campo (`year`, `yearLabel`). Cada layout lo puede poner de marcador sin que
ninguno tenga que parsear un párrafo.

`marker` es el capítulo reducido a la línea que un raíl o un índice pueden
cargar. No es un resumen del cuerpo: es el mismo golpe dicho una vez y corto. La
variante B es la que más lo gasta: dentro del panel de la escena, cada acto se
lee como dos `title` con su `marker` debajo, y no hay una sola línea escrita
para esa sección.

Los dos rangos (`2018 — 2020`, y el capítulo fundacional) están sin emprolijar a
propósito. Redondear cualquiera de los dos a un año inventaría una fecha que la
fuente no afirma.

## La forma de la historia, que es lo que las tres tienen que dejar legible

Empieza con dos personas que querían que la IA escribiera código, se topan con
un problema de pagos, construyen una blockchain «que iban a tardar seis meses», y
ocho años después los modelos que necesitaban por fin existen — y la red que
construyeron mientras esperaban resulta ser la que esos modelos necesitan.

**Es un círculo, no una línea.** Las tres preguntas de `QUESTIONS` son el
estribillo que lo cierra: son las preguntas del principio y vuelven al final.
Cada variante las trata distinto y ahí es donde más se diferencian entre sí.

## El aparato gráfico

La página se escribió sin una sola imagen: ocho capítulos de prosa seguidos, que
es exactamente donde un lector se va. Pero es también la única de las cuatro
donde el material **existe** —el paper, los dos fundadores, la pizarra, la
pantalla de Rainbow Bridge, la lámina donde Chain Abstraction recibió su
nombre—, así que lo que faltaba no era decidir qué dibujar sino **declarar dónde
va cada cosa y pedirla por su nombre**.

Todo lo gráfico de esta carpeta es una de tres cosas, y nada más:

| | Qué es | Con qué |
|---|---|---|
| **Evidencia** | El lugar reservado de un asset real que hay que producir | `MediaFrame`, vía [`ArchiveSlot`](./ArchiveSlot.tsx) |
| **Argumento** | Un dibujo que carga una afirmación que el párrafo tarda más en decir | SVG propio dentro de `Figure`, vía [`ChapterFigure`](./ChapterFigure.tsx) |
| **Estructura** | Un campo que ORGANIZA la sección | la máquina de cuatro estados de `b/StateStack`, con su escena pegada |

La tercera fila la trajo la variante B y solo existe ahí: es la única de las
tres donde el objeto que se mira ES la sección, en vez de vivir dentro de una.

Los dos wrappers existen por el mismo motivo: tres layouts × ocho capítulos son
veinticuatro puntos de llamada, y con la ficha copiada en cada uno la primera
corrección —una especificación arreglada, un encargo afinado después de hablar
con quien lo tiene que buscar— entra en una sola variante y las otras dos
quedan mintiendo en silencio. Los layouts pasan un `id` y deciden **solo lo que
es suyo**: en qué columnas cae y sobre qué fondo.

### Las ocho fichas de archivo

Están en `ARCHIVE`, dentro de [`aboutContent.ts`](./aboutContent.ts). **El
`label` no es un título: es la orden de trabajo**, y se imprime debajo del hueco
porque lo leen dos personas que no son la misma — quien mira la página, que se
entera de qué va a haber ahí, y quien tiene que ir al archivo a buscarlo.
Escrito «Foto» le falla a los dos.

Esta es la lista completa de lo que hay que producir:

| Capítulo | `label` — la orden de trabajo, tal como se imprime | `spec` | Proporción |
|---|---|---|---|
| 2017 · `paper` | Attention Is All You Need, page one — screenshot of the arXiv PDF, full page with the author list visible, uncropped | 1200×1600 · PNG | 3/4 |
| 2018 · `problem` | Illia Polosukhin and Alexander Skidanov, 2018 — the two founders together, any NEAR AI archive frame from before the pivot | 1600×1200 · JPG | 4/3 |
| 2018–2020 · `sharding` | The sharding whiteboard — photograph of an architecture diagram of the period, or a scan of the design notebook, drawing legible edge to edge | 2400×1030 · JPG | 21/9 |
| 2021 · `unifying` | Rainbow Bridge, 2021 — full browser capture of the transfer interface as it shipped, browser chrome included | 2560×1440 · PNG | 16/9 |
| 2023 · `chain-abstraction` | The slide where Chain Abstraction was named, 2023 — keynote frame, or the diagram from the original announcement post | 2400×1350 · PNG | 16/9 |
| 2024 · `ai` | Chain Signatures on mainnet, 2024 — the announcement card, or an explorer capture of the first cross-chain signature | 1400×1400 · PNG | 1/1 |
| 2025 · `intents` | Wallets shipping Intents, 2025 — three phone captures of the same cross-chain flow, mounted as one image | 1080×1440 · PNG | 3/4 |
| 2026 · `now` | Confidential Intents and the agent runtime, 2026 — current NEAR AI / IronClaw product capture, or the TEE render | 2400×960 · PNG | 5/2 |

**La proporción se decide una vez, y ahí.** Es un hecho del asset —una página de
un paper es vertical, una pizarra es un panorama, una placa de anuncio es
cuadrada—, no del layout; decidirla en el content module es lo que impide que la
misma foto salga retrato en una variante y letterbox en otra. Y es lo que evita
el resultado por defecto: ocho slots 16/9 idénticos apilados, que es una
plantilla y no una composición. Dónde cae cada uno —margen, columna de prosa,
lámina a sangre— sí es composición, y vive con cada layout: la tabla `LAYOUT` de
`a/ChapterSpine`, la de `b/ChapterLog`, y el ritmo de fondos de
`c/ChapterTerrain`.

Cuando el asset llegue se le pasa `src` al mismo componente y el hueco
desaparece sin tocar nada del layout, que ya está calibrado a su caja.

### Las dos figuras dibujadas

Dos, no ocho. **Una figura por capítulo convierte una historia en un manual**, y
seis de estos ocho capítulos hacen afirmaciones que un dibujo no dice más rápido
que la oración que ya está escrita. Estas dos sí:

**`ShardingDiagram`** (capítulo 2018–2020) — el párrafo gasta cuatro renglones
en explicar que el trabajo se reparte en subconjuntos paralelos en vez de que
cada nodo lo haga todo. El dibujo son las **mismas doce marcas en las mismas
doce posiciones**, primero bajo un borde y después bajo cuatro. El primer boceto
las hacía viajar y estaba mal de una forma que importaba: se leía como que el
trabajo se divide y por lo tanto se achica. El sharding no achica el trabajo.

**`ConvergenceDiagram`** (capítulo 2024) — la forma de toda la página. La línea
de arriba son los modelos, y se corta en 2018; la vertical es el pivot, el
obstáculo volviéndose el proyecto; la línea de abajo es la red, construida
mientras esperaban; los modelos vuelven, las dos convergen en un punto y **la
línea sigue y se va del cuadro**. No es un ouróboros a propósito: un lazo
cerrado dice que la historia vuelve a donde empezó, y esta llega a un lugar al
que el principio no podía llegar.

**Las dos existen en tres registros, y son evoluciones y no archivos nuevos.**
El de 1px es el de esta carpeta y lo monta la variante A. La B las hace crecer a
volumen sobre oscuro: el sharding adentro de la máquina (`b/StateStack`, acto
02) y la convergencia como `b/ConvergenceSolid`. La C le da escala, relieve y
color a la convergencia en `c/ConvergenceRelief`, y reusa la del sharding tal
cual, plana, porque a media columna sobre crema ya hace todo su trabajo. Lo que
no cambia en ninguna de las seis puestas es qué afirma el dibujo.

**Ninguna de las dos se anima**, y no por pereza. La regla de la casa es que una
figura se dibuja sola cuando el trazado *es* la afirmación. Acá las dos
afirmaciones son comparaciones entre dos estados, así que una animación tendría
que sostener uno de los dos como estado de reposo — y el estado de reposo es lo
que le queda a un lector sin JS o con `prefers-reduced-motion`. Media
comparación no es una versión más chica del argumento: es otro argumento, y
falso. Entran con el reveal que la sección que las monta ya corre.

El pie de `Figure` es obligatorio y es el filtro: si la única frase disponible
fuera «diagrama de sharding», el dibujo no muestra nada y se borra. Los dos pies
están en `FIGURES`, en el content module, porque son copy.

## Las tres

Desde la segunda pasada las tres letras significan lo mismo en las cuatro
páginas del set (`about`, `community`, `economics`, `foundation`), y lo que
cambia entre ellas ya no es solo la retícula: es **el estilo**. El contrato de
los armazones compartidos está en
[`../shells/README.md`](../shells/README.md) y conviene leerlo antes de tocar
`b/` o `c/`.

| | Carpeta | Estilo | La apuesta |
|---|---|---|---|
| **A · Spine** | `a/` | Editorial | Un aparato de lectura: raíl de años a la izquierda, prosa a la medida en el medio, notas al margen a la derecha. Un solo fondo para toda la historia. |
| **B · Log** | `b/` | Instrumento | La historia como el registro de una máquina que estuvo corriendo ocho años. Página oscura de punta a punta, un tablero de lecturas, una escena pegada donde el sistema gana estratos, y ocho entradas de log. |
| **C · Terrain** | `c/` | Escenario | La historia como terreno que se fue formando. Hero con shader de curvas de nivel, cards con el archivo adentro, y el círculo dibujado a sangre como remate. |

### A · Spine

`AboutHero` · `ChapterSpine` · `ClosingRefrain`

El raíl es un `<nav>` de anclas, no un adorno: dice dónde estás **y** te lleva a
otro lado. Es `position: sticky` de CSS; el ScrollTrigger por capítulo solo LEE
qué índice está cruzando el 55% del viewport. Nada de `pin`.

**Un solo mecanismo marca el capítulo en curso, y es el filete.** Los candidatos
eran color, peso, sangría y largo del filete; usar dos a la vez es lo que hace
que un marcador se lea como diseño en vez de como información. El filete del año
activo corre todo el ancho del raíl y los otros siete quedan en un tick corto.
Nada más cambia. El color sí se usa, pero para otro trabajo —hover y foco de
teclado—, y esa separación es deliberada: el puntero del lector se lleva el
color, la posición de lectura se lleva el largo. `aria-current` se escribe desde
el mismo lugar, así que el estado no viaja solo en una propiedad visual.

El estado de reposo del filete está en CSS (`scale-x-[0.18]`) y el tween solo se
mueve desde ahí: sin JS el raíl queda con ocho ticks cortos, no con ocho filetes
enteros ni con ninguno.

**Dos filas por capítulo, y por qué la grilla siguió plana.** El archivo y las
figuras necesitan anchos que la columna de prosa no tiene: un panorama de
pizarra a seis columnas es un hilo, y una figura que siempre cae a la medida de
lectura no cambia nada del ritmo de la página, que es la única razón para
haberla puesto. La salida fácil era anidar una grilla adentro de cada
`<article>`, y es justo lo que esta sección no puede hacer: una nota en las
columnas 10-12 de una sub-grilla no está en las 10-12 de la página, sus gutters
dejan de coincidir con el raíl y con el hero, y nada se ve lo bastante mal como
para que alguien lo note hasta que toda la página está corrida. Así que la
grilla siguió plana y **cada capítulo pasó a ocupar dos filas**: la de prosa
(artículo + margen) y una de lámina debajo que puede reclamar cualquier cosa
ancha. `grid-ds` no declara `row-gap`, así que un capítulo que no usa su fila de
lámina la colapsa a cero.

Dónde cae cada ficha lo dice la tabla `LAYOUT`, y es una tabla y no una regla
porque la decisión depende de qué es el asset, cuánto pesa el capítulo y —sobre
todo— de qué hizo el capítulo anterior. **Los anchos de lámina no se repiten**:
6 columnas corridas a la derecha, después las 9 enteras, después 4 pegadas a la
izquierda, después las 9 otra vez.

**En móvil el raíl desaparece y cada capítulo lleva su año.** La otra opción era
una cinta horizontal pegada arriba, descartada porque el header del sitio ya es
`fixed` —una segunda franja en 375px gasta un tercio del viewport en chrome
antes de la primera palabra— y porque el trabajo real del raíl es «dónde estoy
entre ocho», una pregunta que nadie se hace cuando en pantalla entra un capítulo
por vez.

### B · Log — instrumento

`LogHero` · `StateSequence` · `ChapterLog` · `ClosingLog`
Arte propio: `iso.ts` · `StateStack` · `ConvergenceSolid`

**La idea:** ocho años de una máquina que estuvo prendida. No es una línea de
tiempo, es un log — y la unidad de composición no es el párrafo sino el
**aparato**. Si esta variante se leyera como la A pintada de negro, estaría mal.

**Un solo fondo, `bg-ink`, de punta a punta.** Un instrumento no cambia de color
a la mitad de una lectura. Lo que alterna es el objeto: un tablero, una máquina
pegada al viewport, un log, y un panel de preguntas abiertas.

**La máquina (`StateStack`) es el vocabulario gráfico de la página**, y es
propio: de `/prototype/protocol-a` se toma la cámara —el hecho de dibujar
sólidos— y nada más. La unidad acá no es un cubo sino un **estrato**, porque lo
que la página afirma es que se acumularon capas durante ocho años. La geometría
vive en `iso.ts` para que la máquina y `ConvergenceSolid` no puedan discrepar
sobre dónde está el suelo.

**Cuatro actos y no ocho.** El agrupamiento vive en `ACTS`, en el content
module, con el argumento de los cortes escrito ahí: cada acto es el tramo en que
**lo que estaban construyendo sigue siendo la misma cosa**, y cada borde es
donde deja de serlo — investigación → red → abstracción → operación. Ocho
estados serían dieciséis pantallas de scroll y un riel de ocho pasos que nadie
espera. Los actos **no tienen nombre**: el `ActRail` lleva el rango de años que
sus propios capítulos declaran, y adentro del panel va el `title` + `marker` de
cada uno. Una estructura de cuatro partes que el deck nunca nombró no tiene por
qué llegar con cuatro títulos inventados para justificarla.

**Los cuatro estados son cuatro dibujos completos, no un rig que se deforma.**
Se cruzan con un fade. Sin JS, en móvil o con `prefers-reduced-motion` caen a
flujo normal y cada estado sigue siendo una figura legible — un rig no tiene
estado de reposo, tiene primer frame. Y como la geometría es determinista, todo
lo que dos estados comparten está en coordenadas idénticas: el fade solo mueve
la diferencia, que es exactamente el efecto (los bordes apareciendo debajo de
doce marcas que no se mueven). Escena `position: sticky` de CSS con un
ScrollTrigger que solo LEE progreso; nunca `pin: true`.

**La figura del sharding creció adentro de la escena, no al lado.** El acto 02
es el suelo llegando ya particionado: cuatro bordes sobre la huella que tenía
uno, con las mismas doce unidades de trabajo en las mismas doce posiciones. Es
la afirmación de `ShardingDiagram` con volumen, así que el capítulo de sharding
en el log no repite el dibujo — lo que en el log lleva es su panorama a ancho
completo.

**`ConvergenceSolid` es la única figura dibujada del log**, y vive **dentro de
un `Panel`** compartiendo espacio con su lectura, que acá es la nota del
capítulo («The loop closes») y no una cifra. Es duplicado y no un prop de la
plana: las dos difieren en construcción, no en configuración, y la plana la
sigue montando la variante A. Usa tramos rectos donde la plana curva, porque una
curva con pared necesita su offset aproximado y eso hace que el grosor de la
barra respire — que en un instrumento se lee como una medición.

**Las lecturas (`READOUTS`) se imprimen dos veces, a propósito.** El panel del
hero declara las cuatro antes de que empiece la historia; dos vuelven abajo, en
el pie del `Panel` del capítulo que se las gana. Un instrumento que muestra un
resumen que el log nunca confirma está mostrando un resumen de nada. Las otras
dos se tratan distinto justamente para que la repetición no se vuelva sistema:
`35+` queda suelta en el margen de su capítulo, y `6 months` no se repite nunca,
porque la última oración de ese capítulo **ya es** la cifra.

**El log usa grilla anidada y la variante A no**, y no es una inconsistencia: A
mantiene una sola grilla plana porque sus notas al margen tienen que caer en las
columnas 10-12 **de la página** o dejan de coincidir con el raíl. Acá no hay
raíl y cada entrada ocupa las doce columnas, así que un `grid-ds` adentro tiene
el mismo ancho, la misma cuenta y el mismo gutter: alinea exacto. Lo que compra
es que una entrada sea **un** elemento, que es lo que permite un trigger de
reveal por entrada en vez de una tabla de números de fila.

**Ninguna celda de `MediaFrame` lleva `data-reveal`.** Una caja reservada que
aparece con fade se lee como una imagen que falló y después se recuperó.

### C · Terrain — escenario

`TerrainHero` · `ChapterTerrain` · `ClosingCircle`
Piezas propias: `ChapterCard` · `ConvergenceRelief`

**La idea:** cada era deja relieve, y el mapa de curvas de nivel es literalmente
el registro acumulado de lo que pasó.

**La paleta es la más fría de las cuatro páginas**, y eso fue una decisión y no
un gusto: una historia se archiva, no se fotografía, así que el suelo es papel y
tinta —`#eae8e3` sobre `#c8cfd0` con línea `#5b686a`— contra los tanes y verdes
de community y foundation. Trece bandas y `scale: 3` (más que la calibración de
referencia) porque curvas juntas leen como una hoja de relevamiento y curvas
anchas leen como paisaje.

**Y resuelve el hero con shader por estructura, no por suerte.** El defecto
clásico es que el titular cruza un borde de valor a mitad de palabra, y el
arreglo habitual —buscar una meseta donde apoyarlo— es una apuesta: el campo
deriva, y lo que está plano al cargar no lo está un minuto después. Acá `bg` y
`high` son **los dos claros**, a unos ocho puntos de valor: no hay borde del que
el texto pueda caerse. Es también la razón de que el terreno pueda ser denso acá
y no pueda serlo en una página cuya paleta va de claro a oscuro.

**El ritmo de los ocho capítulos es el layout entero**, y no cambia por
calendario:

| Fondo | Capítulos | Registro |
|---|---|---|
| `cream` | 2017, 2018 | dos cards a la par |
| `cream` | 2018 — 2020 | abierto: la pizarra a sangre, prosa + figura del sharding debajo |
| `tint` | 2021, 2023, 2024 | tres cards a tres anchos y dos filas; la de 2024 encendida |
| `white` | 2025, 2026 | **sin cards**: prosa abierta y el último panorama a sangre |
| `cream` | el cierre | el círculo a sangre, las tres preguntas y el remate |

El blanco se gasta una sola vez y es también el único lugar donde las cajas se
terminan: el respiro es estructural y no un color más claro. Y el cierre vuelve
a `cream`, así que el último fondo es el primero.

**A sangre van solo los dos panoramas** (21/9 y 5/2). Un 3/4 a ancho de página
es pantalla y media de una sola foto: la sangre que vuelve monumental a un
panorama vuelve obstrucción a un retrato. Por eso también son los dos únicos
capítulos que se abren — el layout sigue a los assets, no a un patrón.

**`ChapterCard` es local y no `shells/stage/Card`.** Es el mismo objeto a la
vista —mismo radio, mismo padding, misma caja de arte más clara adentro— pero la
card del armazón fija su arte en 4/3, que es correcto cuando el arte es un
dibujo que el layout puede escalar. Acá el arte es un `MediaFrame` y su
proporción es un **hecho del asset** declarado una vez en `ARCHIVE`. Pasar ocho
por un solo aspect ratio recorta o pone bandas, y en cualquier caso mueve una
decisión del content module a un layout, que es exactamente lo que
`ARCHIVE.shape` existe para impedir. **Si las otras tres páginas necesitan lo
mismo, esto va al armazón como una segunda card, no copiado.**

**La figura grande de la página es el círculo, y va al final.** Las otras dos
variantes imprimen `ConvergenceDiagram` al lado del capítulo de 2024; acá es la
última imagen, al ancho de la página, porque el dibujo es la forma de **toda**
la historia y no la ilustración de un capítulo. A mitad de página sería un
diagrama; en el remate es la página diciendo lo que fue. Es el único elemento de
la variante que pasa el `Container`, que es lo que mantiene al gesto valiendo
algo.

`ConvergenceRelief` es la tercera puesta del mismo dibujo: la corrida de la red
—lo que se estuvo construyendo durante los años en que los modelos no
existían— lleva curvas de nivel alrededor. Solo esa: relieve alrededor de las
tres corridas es una trama, y además sería falso, porque la línea de los modelos
es justo la que **no** se estaba construyendo. La rampa del CTA se usa como
relleno de verdad y va pálida en 2017 y sólida en el encuentro: al revés, el
color más fuerte caería sobre los años con menos adentro. Cada cinta se traza
dos veces —un filete 1px más ancho abajo, el degradado encima—, que es lo que
permite que el extremo lime exista sobre crema.

**Las tres preguntas van en claro y con aire**, a escala de heading, sobre la
crema pelada y sin nada alrededor: ni card, ni marco, ni filete entre ellas.
Toda la página fueron cajas y fondos; el estribillo es lo que pasa cuando eso se
termina — y es lo único que esta variante puede hacer que la B, que es toda
bordes y lecturas, estructuralmente no.

## Qué se descartó

**La línea de tiempo de puntitos.** Es el dibujo obvio para ocho capítulos
fechados y no está en ninguna de las tres, por un motivo concreto y no por
gusto: una timeline de nodos le da a los ocho capítulos el mismo peso visual y
la misma forma, así que una página cuyo argumento entero es que la historia
**se dobla** —investigación, desvío, infraestructura, regreso— se renderiza como
ocho cuentas idénticas. Encima gasta una columna en un adorno que no carga ni
una palabra.

En A esa columna la ocupan los años, que además son anclas. En C la ocupan los
marcadores, que son la historia en ocho líneas. En C el argumento es todavía más
fuerte: el borde izquierdo es lo único que un lector que escanea llega a leer, y
el adorno es la cosa más cara que podría ir ahí.

**Las cajas con borde para agrupar capítulos.** Doctrina de la casa; el
razonamiento largo está en el comentario «Why not cards» de
[`../chain/WhyItMatters.tsx`](../chain/WhyItMatters.tsx). Acá separa el filete,
en las tres variantes.

**Una figura para las tres preguntas.** Era la candidata obvia para el cierre —
tres líneas corriendo de 2017 a 2026 para mostrar que son las mismas preguntas
del principio— y no pasó la prueba del pie. Lo único que podía decir el pie es
«son las mismas preguntas», que es literalmente lo que la página ya hace al
imprimirlas dos veces (en C, textualmente; en A y B, al ponerlas después de los
ocho capítulos que las contestan). Una figura que repite el recurso que tiene al
lado es adorno. **Los tres cierres quedaron sin gráfico a propósito**: un remate
corto necesita respirar, y el objetivo nunca fue que ninguna sección quedara sin
nada.

**Una figura para 2021 —«el destino importa, la ruta no»—.** Es el segundo mejor
candidato a dibujo de la página y se descartó por una razón que no es de diseño:
ese dibujo es el argumento entero de [`../chain`](../chain/README.md), que es una
página propia con sus propias figuras. Hacerlo acá sería dibujar la figura de
otra página en la nuestra.

**Una escena pegada por capítulo, con el año animándose.** Descartada, y sigue
descartada: ocho escenas pegadas son dieciséis pantallas de scroll para leer
prosa, y el recurso ya está gastado en `chain/CapabilityStack` y
`quantum/ThreatSequence`. Lo que la variante B sí tiene es **una** escena de
cuatro actos, que es otra cosa — no anima la lectura de los capítulos, anima el
objeto del que los capítulos hablan, y los ocho se siguen leyendo después en
flujo normal.

**Ocho cards iguales en la variante C.** Es el resultado por defecto de un
armazón con card y ocho unidades de contenido, y es una plantilla: los ocho
capítulos quedan con el mismo peso visual en una página cuyo argumento es que la
historia se dobla. Por eso el ritmo de C alterna card y bloque abierto, cambia
de fondo tres veces y deja la última sección sin ninguna caja.

**Repetir el círculo en la C.** `ConvergenceRelief` está una sola vez, en el
remate. Imprimirlo además al lado del capítulo de 2024 —como hacen A y B, donde
es una figura de capítulo y no el remate— gastaría dos veces la única imagen
grande de la página.

## Lo que le falta al armazón

Una sola cosa, y está detallada arriba: **una card cuyo arte respete la
proporción declarada de su asset**. `shells/stage/Card` fija su caja de arte en
4/3, que es correcto para un dibujo y no para un `MediaFrame` con `shape`
propio. Acá se resolvió local (`c/ChapterCard`) porque de momento la necesita
una página; si community, economics o foundation terminan queriendo lo mismo, va
al armazón como una segunda card y las cuatro la importan.

Nada más se agregó al content module por razones de layout salvo `ACTS` y
`READOUTS`, y las dos están justificadas en su propio comentario dentro de
[`aboutContent.ts`](./aboutContent.ts): la primera es una afirmación sobre el
contenido (que estos ocho capítulos son cuatro movimientos), la segunda son las
únicas cuatro cifras que la página puede mostrar honestamente. **La lista de
assets a producir no cambió**: son los mismos ocho `ARCHIVE` de la tabla de más
arriba, y las tres variantes los montan todos.

## Reusado, no copiado

Las tres variantes importan `CtaPill` de [`../quantum`](../quantum/README.md),
igual que `chain` y `protocol`. `ArchiveSlot` y `ChapterFigure` los comparten las
tres sin modificar, y B y C montan además los armazones de
[`../shells`](../shells/README.md) tal como están. El link secundario del cierre es interno
(`/blockchain`) y va con `next/link`, no con la pill: la pill siempre renderiza
un `<a>` pelado, y dos pills juntas además dejarían al par sin jerarquía.
