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

De la copy del deck no se agregó ni una línea. Lo único que se sumó al content
module después es lo que trajo el aparato gráfico —los ocho encargos de
`ARCHIVE` y los dos pies de `FIGURES`—, y está ahí y no en los componentes por
la misma razón que todo lo demás: se renderiza, así que es copy.

Hubo un lugar donde el layout pedía una
bajada que el deck no tiene —debajo del *eyebrow* del cierre de B— y se dejó
vacío a propósito: una frase escrita para tapar un hueco de composición es copy
que existe porque el diseño la necesitaba, no porque la página tuviera algo más
que decir. El comentario está en `b/ClosingCoda.tsx`.

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
variante C es la que lo gasta en su columna principal.

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

Todo lo gráfico de esta carpeta es una de dos cosas, y nada más:

| | Qué es | Con qué |
|---|---|---|
| **Evidencia** | El lugar reservado de un asset real que hay que producir | `MediaFrame`, vía [`ArchiveSlot`](./ArchiveSlot.tsx) |
| **Argumento** | Un dibujo que carga una afirmación que el párrafo tarda más en decir | SVG propio dentro de `Figure`, vía [`ChapterFigure`](./ChapterFigure.tsx) |

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
lámina a sangre— sí es composición, y vive con cada layout, igual que `TONES`
vive en `AboutBView`.

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

| | Carpeta | La apuesta |
|---|---|---|
| **A · Spine** | `a/` | Un aparato de lectura: raíl de años a la izquierda, prosa a la medida en el medio, notas al margen a la derecha. Un solo fondo para toda la historia. |
| **B · Chapters** | `b/` | Un libro: cada era abre a pantalla completa con su año enorme, y el fondo cambia con el arco. Sin raíl. |
| **C · Index** | `c/` | Un registro: índice real con anclas, y dos columnas sostenidas —año + `marker` a la izquierda, prosa a la derecha— para quien vino a buscar un dato. |

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
izquierda, después las 9 otra vez. Esa alternancia es toda la razón de que las
fichas estén acá; una columna de texto con ocho huecos idénticos a un costado
sigue siendo una columna de texto.

Dos capítulos usan el margen para el archivo (2017 y 2023) y uno lo comparte con
la nota (2024, cuadrado arriba de «The loop closes»). El único que va a la
medida de la prosa es el de sharding, porque su fila de lámina se la lleva la
figura y dos cosas a ancho completo en un capítulo son una galería.

**En móvil el raíl desaparece y cada capítulo lleva su año.** La otra opción era
una cinta horizontal pegada arriba, descartada por dos motivos. El header del
sitio ya es `fixed`, así que una segunda franja pegada en 375px gasta un tercio
del viewport en chrome antes de la primera palabra; y el trabajo real del raíl es
«dónde estoy entre ocho», que es una pregunta que nadie se hace cuando en
pantalla entra un capítulo por vez.

El raíl, la prosa y las notas son **hermanos de una sola grilla** con filas
declaradas a mano (`ROW_START`), no un raíl al lado de una sub-grilla de
capítulos. Es lo que hace que una nota caiga en las columnas 10-12 **de la
grilla de la página** y no en las 10-12 de una sub-grilla cuyos gutters ya no
coinciden con nada.

### B · Chapters

`CoverHero` · `ChapterSpread` ×8 · `ClosingCoda`

**El orden de fondos ES el argumento, y vive en `AboutBView`.** `ChapterSpread`
sabe ponerse un tono; no sabe cuál le toca. La secuencia es
`cream ×4 · ink ×2 · slate · white`, y el porqué de cada tramo está comentado en
la view. Lo que hay que proteger si alguna vez se rebalancea: el corte
`white → ink` entre el capítulo 2026 y la coda es el borde más duro de la
página y es lo único que separa al estribillo de ser una sección más.

**El archivo es una lámina de libro, y la mitad va a sangre.** Es la variante
que se lee como un libro, así que los cuatro assets apaisados y panorámicos
corren de borde a borde, pasando el `Container`, al ancho de la página — como
una lámina encuadernada al corte y no metida adentro de la caja de texto. Los
otros cuatro no pueden: un 3/4 a ancho completo es pantalla y media de una sola
foto, y el 1/1 no mejora mucho; la sangre que vuelve monumental a un panorama
vuelve obstrucción a un retrato. Esos toman columnas, y nunca las mismas dos
veces —tercio derecho, siete a la izquierda, cinco descentradas, cuatro a la
derecha—. Esa alternancia hace el trabajo que la sangre no puede hacer, porque
todo lo demás en esta variante está centrado y ocho láminas centradas debajo de
ocho títulos centrados son una pila, no un ritmo.

La figura, en los dos capítulos que tienen una, va **antes de la nota y más
ancha que la prosa**: antes porque la nota es la última palabra del capítulo y
un dibujo después se la saca; más ancha porque una figura a la medida de la
prosa no cambia nada de la página, y que la cambie es la única razón de
dibujarla acá.

El `note` es un **epígrafe de cierre**, no un intercalado. El brief pedía
intercalarlo en la prosa, y no se puede: de los dos capítulos que tienen nota, el
primero tiene **un solo párrafo**. Ponerla al final en los dos casos mantiene el
recurso idéntico, que es lo que lo hace leerse como recurso y no como accidente
de longitud.

La serif itálica se la lleva la **etiqueta** de la nota, no su cuerpo. «Attention
Is All You Need» y «The loop closes» ya son la frase que el capítulo venía
ganando; el mismo tratamiento sobre cuatro oraciones de explicación sería un
párrafo en itálica, que es otra cosa y peor. Kepler sigue siendo acento.

El año usa `text-display lg:text-mural`. `Container` mantiene 60px de padding a
cualquier ancho, así que en 375px el *query container* mide 255px, `10.2cqw` cae
por debajo del piso del propio clamp y el mural sale a 40px — un h2 disfrazado.
Los dos son tokens de la escala; es una elección responsive entre ellos, no un
override local.

### C · Index

`IndexHero` · `ChapterIndex` · `ChapterLedger` · `ClosingAnswer`

La afirmación del layout es comprobable: **leé solo la columna izquierda, de
arriba abajo, y tenés la historia entera en ocho líneas.** Para eso existe
`marker` en el content module, y esta es la variante que le da su columna
principal.

**La columna izquierda es sticky, y eso es la promesa de las dos columnas.** Sin
eso, un lector cuatro párrafos adentro de 2024 tiene el año y el marcador fuera
de pantalla, y el layout se volvió en silencio una sola columna con una etiqueta
arriba. El sticky la mantiene a la vista exactamente lo que dura su propia prosa
y la suelta en el capítulo siguiente: el encabezado de una fila de registro,
comportándose como tal.

**Cinco fichas archivadas, tres exhibidas.** Es la variante densa, así que el
archivo se archiva en vez de exponerse: la ficha va debajo del `marker`, en la
columna sticky de la izquierda, y las ocho filas se leen hacia abajo como una
hoja de contactos al lado de la historia. Ese es el registro correcto para un
registro — pero ocho seguidas son una tira, y una tira pegada a un borde es
empapelado. Así que tres rompen para el otro lado y toman la columna del
registro entera, al ancho de la prosa a la que pertenecen: la pizarra, la lámina
y el último panorama. Son los tres capítulos donde el asset es evidencia que hay
que **mirar**, no anotar que existe, y están lo bastante separados (filas 3, 5 y
8) como para que el quiebre no se vuelva el patrón. Las dos figuras siempre van
en la columna del registro: un diagrama cuyo trabajo es leerse más rápido que el
párrafo de al lado no se puede archivar a un cuarto de ancho.

**El índice se quedó sin miniaturas**, y se probó con ellas. Un `MediaFrame`
imprime su propio encargo —esa es la razón de que no sea una caja gris— y a dos
columnas en una pantalla de 1024px el encargo son cinco renglones de mono dentro
de una caja de 117px, así que el índice deja de ser escaneable justo donde tenía
que ser más rápido. Y esta sección es aparato: ocho miniaturas la convertirían
en una segunda versión, peor, del registro de abajo, que ya archiva las ocho
fichas a anchos usables. El índice se quedó en tipografía, que es lo que es un
índice.

El índice usa `<a href="#id">` pelado, no `<Link>`: son enlaces de fragmento
dentro del documento, no navegaciones, y la regla del repo sobre `<Link>` es
para cruzar rutas. **`scroll-behavior: smooth` está deliberadamente apagado**:
la ruta monta Lenis, que maneja el scroll por su cuenta, y una animación nativa
corriendo al mismo tiempo le pelea. El salto es instantáneo y aterriza bien
porque cada capítulo lleva `scroll-mt-[var(--site-header-block)]` para el header
fijo.

Las tres preguntas aparecen **dos veces** —chicas al lado del hero, a escala de
heading después del último capítulo— con la misma numeración mono. Es la firma
de la variante. Si se edita una instancia hay que mover la otra: media rima es
una sobra.

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

**Una escena pegada con el año animándose.** Se descartó antes de escribirla: el
recurso ya está gastado en `chain/CapabilityStack` y `quantum/ThreatSequence`, y
esta página tiene ocho capítulos, no cuatro tiempos. Ocho escenas pegadas son
dieciséis pantallas de scroll para leer prosa.

## Reusado, no copiado

Las tres variantes importan `CtaPill` de [`../quantum`](../quantum/README.md),
igual que `chain` y `protocol`. El link secundario del cierre es interno
(`/blockchain`) y va con `next/link`, no con la pill: la pill siempre renderiza
un `<a>` pelado, y dos pills juntas además dejarían al par sin jerarquía.
