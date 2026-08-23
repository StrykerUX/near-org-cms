# `community` — secciones para `/community`

Aplica el contrato general de [`../README.md`](../README.md). Acá va solo lo
específico de esta página.

> **Nota de idioma.** Los comentarios de los componentes de esta carpeta están
> en **inglés**, igual que [`../chain`](../chain/README.md) y `../quantum`. Este
> README, como todos los README de carpeta, en español.

---

## ⚠️ Antes de publicar: tres placeholders

Esta es la única página del set cuyo contenido es **en parte dato vivo**, y hay
tres cosas que hoy son de mentira. Están marcadas una por una en
`communityContent.ts`, arriba de su definición, pero la lista corta es:

| Qué | Dónde | Qué hay que hacer |
|---|---|---|
| **Las cifras** | `STATS` + `STATS_NOTE` + `LEGION.statLine` | El deck las entregó como `{X}+`. Los cuatro valores de acá son de forma, no de contenido: **ninguno es un dato real**. `STATS_NOTE` describe cómo se contaron — si el conteo real no es de los últimos doce meses, esa frase queda mal **antes** que los números. |
| **El feed de eventos** | `SAMPLE_EVENTS` | La página real lo saca del calendario Luma de la comunidad. Una sección no puede fetchear, así que la lista llega por props desde `page.tsx`. **La forma de `CommunityEvent` ES la forma del prop**: `dateLabel` ya formateado, nunca un `Date`. Conectarlo es cambiar la fuente, no rehacer la sección. |
| **Las URLs de los canales** | `SOCIALS.channels[].href` | El deck dio handles, no links. Los ocho destinos de acá son los canónicos para esos handles y **cada uno necesita una verificación** antes de que la página salga. |

Nada más de esta página es provisional.

---

## 📷 Los assets a producir

Esta es la lista completa de fotografías que la página tiene reservadas. Cada
hueco es un `<MediaFrame>` y **el `label` que se ve en pantalla ES el encargo**:
dice qué foto, qué tiene que haber en cuadro y con qué encuadre. Los textos
viven todos juntos en `MEDIA`, al final de `communityContent.ts` — no hay copy
de encargo escrita dentro de ningún componente, justamente para que esta lista
pueda leerse de un tirón.

Son **siete encargos** para dieciséis huecos, y de esos siete solo **cinco hay
que salir a producirlos**: la foto de la Legión es UNA fotografía que las tres
variantes recortan distinto, y las dos de eventos llegan con el propio feed.

| # | Encargo (`label`) | Dónde aparece | Proporción | Spec |
|---|---|---|---|---|
| 1 | **The Legion together** — wide group shot at a regional event, 40+ people, faces to camera and recognisable | A (`LegionBand`, sobre tinta) · B (`BoardLegion`) · C (`RallyLegion`) | `5/2` · `21/9` · `16/9` | 2800×1200 · JPG |
| 2 | **`{evento}, {ciudad}`** — wide shot of the full room, lead image for the section | A (`HubEvents`, cabecera) | `5/2` | 2000×800 · JPG |
| 3 | **`{evento}, {ciudad}`** — event photo, room or stage | C (`RallyEvents`, una por fila) | `16/9` | 1200×675 · JPG |
| 4 | **Host an event** — someone presenting on their feet to about 30 people, borrowed room, late-afternoon light | A (`HubInvolvement`) · C (`RallyInvolvement`) | `4/3` · `1/1` | 1200×900 · JPG |
| 5 | **NEAR on Campus** — long table of students with laptops in a lecture room or library, shot on the diagonal | ídem | `4/3` · `1/1` | 1200×900 · JPG |
| 6 | **Contribute code** — close shot of a screen with an open pull request on a NEAR repo, hands in frame | ídem | `4/3` · `1/1` | 1200×900 · JPG |
| 7 | **Create content** — someone recording a stream or a workshop, with the camera or the mic inside the frame | ídem | `4/3` · `1/1` | 1200×900 · JPG |

**Las dos de eventos (2 y 3) no hay que pedirlas por separado.** Su encargo se
arma con el título y la ciudad del propio evento, así que no puede nombrar algo
que la página no liste; y el campo donde aterrizan es
`CommunityEvent.image`, que es **la portada que Luma ya trae con cada evento**.
El día que se conecte el calendario esas fotos llegan solas, una fila a la vez,
sin tocar el layout: el `MediaFrame` recibe `src` y el hueco se convierte en la
imagen dentro de la misma caja.

Quedan entonces **cinco fotos que sí hay que salir a producir**: la de la Legión
(la más importante de la página, y la única que se pide expresamente con gente
reconocible de frente) y las cuatro de las formas de participar.

> **Los `label` están en inglés**, igual que los pies de las figuras y que todo
> lo demás que esta página imprime: el sitio está en inglés, y un encargo en
> español dentro de un hueco rodeado de párrafos en inglés se lee como un error,
> no como una nota interna. Siguen siendo órdenes de trabajo y no títulos
> decorativos — «room shot», nunca «Image». Lo que está en castellano es este
> README, y nada más de esta carpeta.

---

## Qué es esta página, y por qué no se parece a las otras tres del set

`/protocol`, `/chain-abstraction` y `/quantum-security` **argumentan**: abren con
una tesis y la sostienen sección por sección. Esta **enruta**. Alguien llega
queriendo entrar por algún lado —un evento, un canal, la Legión, el código— y
tiene que encontrar su puerta rápido. Cada bloque termina en una acción concreta,
y la medida del éxito no es que se lea lindo de arriba abajo: es que en diez
segundos encuentres tu puerta.

De ahí salen dos reglas que cualquiera de las tres variantes respeta:

- **Ningún bloque es solo informativo.** Si una sección no termina en un link,
  sobra.
- **Nada se anima antes de poder usarse.** No hay escenas pegadas, ni heroes con
  recorrido propio, ni nada que tenga que terminar de reproducirse para que la
  página quede quieta. Las tres animaciones que hay (revelados al entrar, dos
  marquesinas y la cascada del tablero) no bloquean ni un click.

El orden del deck es: hero → cifras → eventos → **la Legión** → canales →
formas de participar → FAQ → cierre + newsletter.

---

## Las tres variantes, y el eje que las separa

**El eje es la Legión.** Es el programa de embajadores y la conversión principal
de la página; el deck pide que vaya ancha y prominente. Cada variante la hace
prominente con un recurso distinto, y esa es la comparación:

| | Cómo destaca la Legión | Qué se está probando |
|---|---|---|
| **A · Hub** | Por **fondo**: banda a sangre sobre tinta, a mitad de página. El único corte oscuro. | El directorio canónico bien ejecutado |
| **B · Board** | Por **forma**: es el único bloque que no es una fila, sobre el único blanco de la página. | Densidad: ¿la página escanea mejor como tablero? |
| **C · Rally** | Por **posición**: va segunda, pegada al hero, sin ningún separador. | ¿Y si la Legión es la tesis y no un bloque más? |

### A — «Hub» (`a/`)

El directorio canónico. Es la referencia contra la que se leen las otras dos, y
por eso **mantiene el orden del deck sin tocarlo**: si A cambiara el orden, las
otras dos perderían su control.

- Hero corto (`HubHero`) y la barra de cifras justo debajo, sobre filete, en
  fila de cuatro (`HubStats`). **Debajo de la fila va el campo de ciudades**
  (`a/CityField`) en las columnas 1–7, y `STATS_NOTE` se corrió a las 9–12, al
  pie del dibujo: la nota explica cómo se contó, y ahora está al lado de lo que
  se cuenta en vez de debajo de todo.
- Eventos como **lista de filas**, no cards: fecha en mono a la izquierda,
  título, ciudad, tipo. Toda la fila es un link (`HubEvents`). La cabecera del
  bloque abre con **una foto ancha del evento que encabeza el feed**, en las
  columnas 4–12 — desplazada a propósito, para que la lista que empieza en el
  margen izquierdo no sea otra pila más del mismo ancho.
- `LegionBand`: banda a sangre sobre tinta, ancha, con el CTA grande, y
  **cerrando con la foto de grupo de la Legión** a `5/2` sobre las doce
  columnas (`tone="dark"`, que no es cosmético: las marcas de registro claras
  desaparecen sobre tinta).
- `HubChannels`: grilla compacta de ocho, cada uno con nombre, handle y una
  línea. Se lee como directorio, no como ocho botones. **Sin gráfico**, a
  propósito.
- `HubInvolvement`: cuatro columnas bajo filete, cada una con su link, sobre el
  blanco de la página, y **una foto `4/3` por puerta** — es donde el formato de
  cuatro columnas idénticas más necesita que se note que son cuatro cosas
  distintas.
- `HubFaq` con el `Accordion` compartido, y `HubClose` con el cierre y el
  newsletter en una sola sección.

Progresión de fondos: crema, crema, crema, **tinta**, crema, **blanco**, crema,
crema. La tinta es la Legión y es el único corte oscuro — **un segundo corte
oscuro le cuesta a este todo su efecto**, que es lo que hay que recordar si
alguien alguna vez agrega uno.

### B — «Board» (`b/`)

Un **tablero de salidas**: mono, denso, todo en filas y filetes. Para quien
escanea.

- Los CTA del hero son las **dos primeras filas** del tablero, no pills
  (`BoardHero`).
- Las cifras van en una **cinta corrida** (`BoardTicker`) — se mueven en
  horizontal y **nunca cuentan hacia arriba**: un número que sube implica
  telemetría en vivo y estos cuatro no están conectados a nada. El mismo
  rechazo, largo, está escrito en `chain/ProofBand`.
- `BoardEvents` es una **tabla de verdad**, con encabezado de columnas
  (fecha · evento · ciudad · tipo · acción), anchos compartidos en un solo mapa
  `COL` y hover por fila. Su cabecera lleva **el campo de ciudades**
  (`b/RouteField`) en las columnas 7–12, funcionando como el diagrama de rutas
  que en una estación va arriba del horario: primero la forma, después las
  filas.
- `BoardChannels`, `BoardInvolvement` y `BoardFaq` son la misma fila otra vez.
  **Ninguna lleva imagen**, y eso es la variante, no una omisión — ver abajo.
- `BoardLegion` es **el único bloque que no es una fila**: a sangre, blanco,
  centrado, con más aire que las dos tablas juntas. Ese contraste ES el diseño.
  Y es donde va **la única fotografía de toda la variante**, a `21/9` sobre el
  ancho completo del container — más ancha que la frase que tiene encima.

**El gesto firmado de B**: el tablero se llena. Las filas de eventos aterrizan de
arriba abajo y la fecha de cada una se asienta carácter por carácter medio
tiempo después. Es **un** gesto, no dos. Lo que deliberadamente no es: un
flip-clock imitado con CSS — es la primera idea que a cualquiera se le ocurre
frente a un tablero de salidas, y es un disfraz.

### C — «Rally» (`c/`)

Cálida, grande, centrada en la gente. **Invierte el orden del deck a propósito.**

- La Legión va **segunda** (`RallyLegion`), sin banda, sin card y sin filete que
  la separe del hero: hero y Legión se leen como una sola apertura. Lo que eso
  cuesta —quien vino por el calendario se come una pantalla entera antes de
  llegar— está dicho en el comentario del archivo; ese es el trade que la
  variante propone. Entre el titular y el CTA va **la foto de grupo más grande
  del set**: `16/9` sobre las columnas 2–12. La sangría de una columna no es un
  capricho — el bloque es la segunda oración de la apertura, y una foto sangrada
  se lee como continuación donde una a sangre se leería como capítulo nuevo. Es
  además lo que le da peso propio a un bloque que se distingue solo por
  posición.
- Las cifras van **dentro** de la apertura (`RallyHero`), grandes y en serif
  itálica, no en una barra aparte.
- `RallyCities`: **el campo de ciudades y después la marquesina**, en la misma
  banda de tinta. La lista **sale del feed de eventos**, no de una lista escrita
  a mano: no puede nombrar una ciudad que la página no muestre, y crece sola el
  día que se conecte Luma. El dibujo va arriba (columnas 1–7, con `CITIES.note`
  bajado a las 9–12) y los mismos nombres pasan corriendo debajo: dónde están,
  y después ahí vienen. Es además lo que **cierra** la apertura, que si no se
  derrama sobre la tabla de eventos.
- `RallyEvents`: más presencia que en A (el doble de aire, título a `text-h3`) y
  ahora **una foto por fila**, a `16/9` en tres columnas. Sigue sin ser una
  card: la foto entra en la celda sin mover la fecha de su columna, que es lo
  único que la fila no puede perder. El encargo de cada foto se arma con el
  título y la ciudad de la propia fila, y el campo donde aterriza
  (`CommunityEvent.image`) es la portada que Luma ya trae.
- `RallyChannels` es la variante que **edita** en vez de listar: los ocho canales
  agrupados en tres respuestas (`CHANNEL_GROUPS`), y sin la línea por canal, que
  el rótulo del grupo ya contesta. Cada grupo lleva **una marca dibujada de 1px**
  (`c/ChannelMarks`) — tres, no ocho.
- `RallyInvolvement`: las cuatro puertas 2×2, cada una con **una foto cuadrada
  chica** (`1/1`, tope de 15rem) al lado del índice. Mismo encargo que en A,
  otro recorte: acá la celda mide 700px y una foto que la llenara convertiría
  cada puerta en un afiche.
- FAQ y cierre sobrios, para que el peso quede arriba.

---

## El aparato gráfico: qué entró, y qué se rechazó

Esta página se construyó primero **sin un solo gráfico en veinticuatro
secciones**, y era la página del set donde más se notaba, por una razón
específica: es una página sobre gente y no se veía una sola persona. Un
directorio tipográfico de eventos, canales y formas de participar es correcto y
es frío.

La regla con la que se decidió qué entra: **un gráfico tiene que ser evidencia,
argumento o estructura.** Evidencia es el lugar reservado de un recurso real
(`MediaFrame`); argumento es un dibujo que carga una afirmación más rápido que
el párrafo de al lado (`Figure`); estructura es una superficie que organiza la
sección. Lo que no es ninguna de las tres es decoración y no se puso.

### La figura firmada: dónde está la comunidad

La única afirmación de esta página que un dibujo dice mejor que un párrafo es
**geográfica**. «70+ countries» es el número menos creíble de los cuatro, no
porque sea falso sino porque no se puede imaginar; las ciudades del calendario,
en cambio, son lugares comprobables.

`cityField.ts` tiene la proyección, la retícula y la tabla de coordenadas; cada
variante escribe su propio dibujo encima (`a/CityField`, `b/RouteField`,
`c/PlacesField`). Lo que hay que saber:

- **No es un mapa, y el pie lo dice.** El fondo es la **retícula de
  coordenadas** —un punto de 1px por cada grado redondo de latitud y longitud— y
  nada más. Una costa es un dibujo del mundo, y esta figura no es sobre el mundo:
  es sobre cinco entradas de un calendario. Además, cualquier costa real es o un
  GeoJSON que este proyecto no tiene por qué cargar para una figura, o un trazo a
  mano que es *un dibujo de un mapa*. Y ninguna de las dos sobrevive al estilo de
  la casa: una masa de tierra es una forma rellena.
- **Proyección equirectangular**, a propósito: x es lineal en longitud e y en
  latitud, así que Lisboa y Lagos comparten x porque comparten meridiano. Esa
  relación es lo único que la figura afirma.
- **Ninguna marca tiene radio.** El SVG es fluido —de ~955px a ~255px, un rango
  de 3.7×— así que un punto medido en unidades de usuario desaparece en móvil.
  Cada punto es una **línea de longitud cero con cap redondo y
  `vector-effect="non-scaling-stroke"`**, que pinta un círculo de exactamente
  `strokeWidth` píxeles a cualquier escala: 1px la retícula, 4px una ciudad. Ojo
  con el atributo: `vector-effect` **no se hereda**, ponerlo en el `<g>` no hace
  nada y las marcas vuelven a escalar en silencio.
- **Los rótulos son HTML encima del SVG**, no `<text>` adentro: el texto SVG se
  maquetó en unidades de usuario y escalaría con la caja, que es justo lo que la
  escala tipográfica existe para evitar.
- **Una ciudad sin coordenada no se descarta en silencio.** `placeCities`
  devuelve `unplaced` y las tres variantes lo imprimen. Por eso «Online» —que
  está en el feed y no es un lugar— aparece correctamente como «Not a place», y
  por eso el día que Luma traiga Ulaanbaatar la página lo va a decir en mono en
  vez de mostrar un punto menos que la tabla de abajo.

Las tres versiones son el **segundo eje de comparación** después de la Legión:

| | Tamaño y fondo | Retícula | Marca de ciudad | Rótulos |
|---|---|---|---|---|
| **A** | cols 1–7, crema | 12° | punto + guía de 1px al rótulo | todos, en `micro-mono` |
| **B** | cols 7–12, crema | 15° | retícula de puntería (4 ticks con hueco) | **ninguno** en el dibujo |
| **C** | cols 1–7, tinta | 10° | punto verde + anillo de 1px | todos, en `caption-mono` |

B no rotula porque la columna «City» de la tabla que tiene tres centímetros
abajo ya dice los cinco nombres; repetirlos encima del dibujo sería poner el
mismo dato dos veces en una pantalla, que es exactamente el hábito que un
tablero existe para evitar. Los nombres igual corren en mono bajo la figura, una
vez.

### Las marcas de familia de canales (solo en C)

Las tres variantes siguen sin darle logo a ningún canal, por la razón aritmética
de siempre (ver la trampa 1, abajo). Pero **C agrupa los ocho en tres familias**,
y una familia no es una marca: nadie es dueño de un símbolo para «talk to
someone», así que no hay nada que falsificar y el dibujo puede *ser* la conducta.

`c/ChannelMarks` tiene las tres, en trazo de 1px y caja fija: una transcripción
de renglones que alternan de margen (turnarse), una escalera de cuatro tramos
(acumular) y una línea de puntos que entra y sale de la caja (un feed que ya
venía corriendo). El filtro que tuvieron que pasar está escrito en el archivo:
el pie que cada una habría llevado si fuese una `Figure`. Lo que salió
«burbujita de diálogo», «martillo» o «icono de RSS» se tiró.

### Composición: lo que los gráficos vinieron a arreglar

Las tres variantes eran pilas de filas del mismo ancho. Cada gráfico entró
**rompiendo esa simetría**, no llenando un hueco:

- En A, el campo de ciudades ocupa 1–7 y empuja `STATS_NOTE` a 9–12; la foto guía
  de eventos arranca en la columna 4 mientras la lista de abajo arranca en la 1.
- En B, la cabecera de la tabla se parte en 5 + 6 columnas, y la única foto es lo
  más ancho de la página.
- En C, la foto de la Legión va sangrada una columna, las fotos de eventos meten
  una celda de imagen en filas que antes eran cuatro campos de texto, y el campo
  de ciudades corre la nota de la banda a la derecha.

Y **hay secciones que se quedaron sin gráfico a propósito**: los canales de A y
de B, las FAQ de las tres, los tres cierres. Un remate corto necesita respirar,
y el objetivo nunca fue 24 de 24.

---

## Dos trampas del género, y cómo se resolvieron acá

**1. La grilla de ocho cards con su iconito.** Es el default de toda página de
comunidad y no se usó en ninguna de las tres. El motivo es aritmético, no de
gusto: de estos ocho destinos `lucide-react` trae marca real para dos (GitHub,
LinkedIn), una vieja para un tercero (el pajarito pre-rebranding) y nada para
Discord, Telegram, Reddit, Farcaster ni YouTube. Una fila donde dos logos son
reales, uno está desactualizado y cinco son inventados se lee rota, y no hay
alineación que lo arregle. Así que el nombre hace el reconocimiento (nadie
necesita un dibujo para identificar «Discord»), el handle va en mono porque un
handle es un dato, y una línea dice para qué sirve el canal — que es justo lo
que una grilla de logos no puede cargar. **Una** flecha, repetida, es el único
glifo.

Las tres marcas de C **no son una excepción a esto**: están sobre las tres
familias, no sobre los ocho canales, y una familia no tiene dueño. Sigue sin
haber un solo logo de plataforma en la página.

**2. Las cifras sin contexto.** «4.000+ / Contributors» es ilegible como
afirmación: contadas en qué ventana, desde qué fuentes, a qué fecha. Por eso
existe `STATS_NOTE`, y por eso está en las tres variantes: no está para leerse
primero, está para que la fila sobreviva a que la cuestionen.

---

## Cosas que conviene saber antes de editar

- **Los anclas.** `HERO.primary` y `CLOSING.primary` apuntan a `#get-involved`, y
  `HERO.secondary` a `#events`. Los ids viven en las secciones de participar y de
  eventos de cada variante, con su `scroll-mt-[var(--site-header-block)]` para
  que el header fijo no les tape el título. Renombrar uno rompe dos links.
- **El feed llega por props, siempre.** Las tres views importan `SAMPLE_EVENTS` y
  se lo pasan a su sección de eventos, que declara
  `readonly CommunityEvent[]`. Ninguna sección importa la lista directamente —
  es lo único de esta página que va a cambiar de fuente. El resto de la copy sí
  se importa directo, igual que hace `chain/ProofBand`.
- **Las ciudades se derivan una sola vez, con `citiesFromEvents`.** En A y en C
  las deriva la view y las baja como prop, porque el dibujo y la tabla viven en
  secciones distintas y hay que mantenerlas de acuerdo desde arriba. En B las
  deriva `BoardEvents` de su propio prop: ahí el dibujo y la tabla son el mismo
  componente leyendo el mismo array, así que un prop extra no podría discrepar
  ni queriendo.
- **Los encargos de foto viven en `MEDIA`** (final de `communityContent.ts`), no
  dentro de los componentes, y ese es el motivo por el que la tabla de assets de
  arriba se puede leer de un tirón. La foto de la Legión es **una sola entrada**
  usada por las tres variantes: un encargo, tres recortes. Si alguna vez hay que
  agregar una quinta forma de participar, `MEDIA.ways` está tipado por el mismo
  `id` que `INVOLVEMENT.ways`, así que no se puede agregar sin decidir cuál es su
  foto — el build no compila hasta que se decida.
- **Coordenadas ≠ copy.** La tabla de ciudades vive en `cityField.ts` y no en el
  módulo de copy, siguiendo la división que marca el README padre: lo que es
  geometría o dato del mundo va con el dibujo que lo lee. Lo único que está en
  `communityContent.ts` es `CITY_FIELD`, que son las dos frases que se imprimen.
- **`Accordion` en A y en C, pero no en B.** El primitivo dibuja sus filetes en
  `gray-800` y no en el `bg-rule` de la casa. En A y en C eso se lee como un
  bloque autocontenido apoyado en la página. En B sería el único bloque con
  filetes de otro color en una página que es una sola grilla continua de filas,
  así que B tiene su propia lista de revelado — once líneas de estado, sin
  ninguna ambición de ser reusable. **Forkear el primitivo no era la
  alternativa**: dos accordions divergentes es exactamente el fracaso que
  documenta el README padre. Si alguna vez hace falta de verdad, la solución es
  un prop `tone` en el primitivo.
- **Las dos marquesinas** (`BoardTicker`, `RallyCities`) usan el mecanismo de
  `chain/ProofBand`: exactamente **dos** copias idénticas de la lista, así el
  track mide 2× un set y `-50%` es exacto por construcción y no por medición. La
  segunda copia va `aria-hidden`. Poner una copia suelta y la otra en un div
  hace que el track mida 2× un set **más un gap**, y el loop se corre ese gap
  cada vuelta.
- **`.from` y no `staggerChars()`** en la cascada de B. `staggerChars` emite
  tweens `.to`, que exigen que los caracteres ya estén escondidos antes de que
  corra la timeline. En una timeline scrubbeada eso es gratis; acá la timeline se
  dispara una sola vez en `top 80%`, así que preesconder sería o un flash de las
  fechas terminadas o un CSS que las deja invisibles para siempre si el JS no
  llega. `.from` tiene `immediateRender: true` — el mismo motivo por el que
  `useScrollReveal` se niega a preesconder en CSS.
