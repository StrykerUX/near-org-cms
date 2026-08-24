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

**Las cifras no cuentan hacia arriba en ninguna variante**, y eso es una regla y
no una omisión: un número que sube implica telemetría en vivo, y estos cuatro no
están conectados a nada. En B, además, el panel lo dice en la esquina
(`INSTRUMENT.state.meta` → «Declared figures · not telemetry»), que es la
defensa más barata posible contra la única lectura equivocada que un panel
oscuro con cifras adentro invita.

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
  página quede quieta.

El orden del deck es: hero → cifras → eventos → **la Legión** → canales →
formas de participar → FAQ → cierre + newsletter.

---

## Las tres variantes

Desde el 2026-08-24 las letras significan lo mismo en las cuatro páginas del set
(`about`, `community`, `economics`, `foundation`), y las dos últimas se apoyan en
los armazones compartidos de [`../shells`](../shells/README.md):

| | Estilo | Armazón | Qué se está probando |
|---|---|---|---|
| **A · Hub** | **Editorial.** Filete de 1px, crema, sin cajas, tipografía primero. | ninguno — es la primera pasada | El directorio canónico bien ejecutado |
| **B · Network** | **Instrumento.** Tinta de punta a punta, paneles con borde, lecturas, arte con volumen. | `shells/instrument/` | ¿La comunidad se lee mejor como el estado de una red que está corriendo? |
| **C · Rally** | **Escenario.** Terreno con shader, cards, color cálido, fotografía grande. | `shells/stage/` | ¿Y si la Legión es la tesis y la página es un territorio poblado? |

**El eje que las separa es la Legión** — el programa de embajadores y la
conversión principal de la página, que el deck pide ancha y prominente. Cada
variante la hace prominente con un recurso distinto, y esa es la comparación:

| | Cómo destaca la Legión |
|---|---|
| **A** | Por **fondo**: banda a sangre sobre tinta a mitad de página. El único corte oscuro de una página crema. |
| **B** | Por **formato**: es el único bloque de la página que **no está dentro de un panel**. Sin borde, sin radio, sin sangría — titular a `text-mural` y la foto de punta a punta del viewport. |
| **C** | Por **posición**: va segunda, pegada al hero, sin separador. Hero y Legión se leen como una sola apertura. |

Los tres recursos son el mismo mecanismo —romper la regla que la página sostiene
en todos los demás bloques— y los tres se rompen igual: **funcionan porque son
los únicos**. Un segundo corte oscuro en A, un segundo bloque sin panel en B o
una segunda sección pegada al hero en C le cuestan a la Legión todo su efecto.

### A — «Hub» (`a/`)

El directorio canónico. Es la referencia contra la que se leen las otras dos, y
por eso **mantiene el orden del deck sin tocarlo**.

- Hero corto (`HubHero`) y la barra de cifras justo debajo, en fila de cuatro
  (`HubStats`), con el campo de ciudades (`a/CityField`) en las columnas 1–7 y
  `STATS_NOTE` corrido a las 9–12.
- Eventos como **lista de filas** (`HubEvents`), encabezada por una foto ancha
  del evento que lidera el feed, en las columnas 4–12.
- `LegionBand`: banda a sangre sobre tinta, con la foto de grupo a `5/2`.
- `HubChannels`: grilla compacta de ocho, sin gráfico, a propósito.
- `HubInvolvement`: cuatro columnas bajo filete, una foto `4/3` por puerta,
  sobre el blanco de la página.
- `HubFaq` con el `Accordion` compartido, y `HubClose`.

Progresión de fondos: crema, crema, crema, **tinta**, crema, **blanco**, crema,
crema.

### B — «Network» (`b/`)

**La comunidad como una red que está corriendo ahora.** No un directorio: un
estado. Tinta de la primera sección a la última, y **la unidad de composición no
es el párrafo sino el aparato** — si esta variante se lee como la A pintada de
negro, falló.

- `NetHero` — la cara frontal. Titular, sub, dos CTA, y debajo un **índice de
  cuatro filas en mono** (eventos · la Legión · canales · participar) que baja a
  los anclas de la propia página. Es la traducción más directa posible de «esta
  página enruta»: quien llegó con un destino se va del primer scroll en un
  click. Los cuatro rótulos son los `eyebrow` de las cuatro secciones, no copy
  nueva.
- `NetState` — **el aparato central, y la razón de existir de la variante.** Un
  `Panel` con la retícula de puntos encendida: a la izquierda el campo de
  ciudades con volumen (`b/NetField`), a la derecha las cuatro cifras como
  `Readout`s en 2×2 con **una sola encendida** (Countries — la única que el
  dibujo de al lado puede corroborar), y `STATS_NOTE` en el pie del panel. En A
  la fila de cifras y el dibujo son dos bloques; acá son un objeto.
- `NetSchedule` — el calendario como **riel**, no como tabla. Cada evento es una
  parada sobre un eje continuo: fecha arriba, nodo sobre la línea, evento
  debajo. El eje **no está a escala** y el panel lo dice (`In feed order`),
  porque `dateLabel` es un string ya formateado y parsear copy de pantalla se
  rompe el día que el calendario formatee distinto. El primer nodo va en verde:
  es el próximo. Los dos CTA de la sección viven en el pie del panel.
- `NetLegion` — el bloque sin paredes (ver la tabla de arriba).
- `NetChannels` — los ocho canales en **tres paneles**, uno por familia
  (`CHANNEL_GROUPS`), en `tone="slate"` para que la fila de tres no se lea como
  un panel partido en pedazos. Cada canal conserva su línea de para-qué-sirve,
  que es lo que una grilla de logos no puede cargar.
- `NetDoors` — las cuatro puertas dentro de un panel, colgando de **un bus**: un
  filete cruza el panel y cuatro bajadas de 1px terminan en un nodo verde. Dice
  algo que el texto nunca dice y un cuarto titular no podría: son cuatro
  entradas a lo mismo.
- `NetFaq` — siete preguntas con `<details>` nativo. **No** el `Accordion`
  compartido: sus filetes son `gray-800`, que sobre tinta cae entre el fondo del
  panel y sus hairlines de `white/12` — lo bastante cerca para parecer un error.
  `<details>` no necesita estado (la sección queda server component), degrada a
  siete preguntas abiertas sin JavaScript, y trae el teclado y el lector de
  pantalla gratis.
- `NetClose` — cierre y newsletter en un panel. El `ShineField` blanco es el
  único control encendido de la página.

Todo el fondo es `bg-ink` y **`data-nav-dark` vive en el `<main>` de la view**,
no en cada sección: el header lee todos los `[data-nav-dark]` del documento y
crea un ScrollTrigger por cada uno.

### C — «Rally» (`c/`)

**La comunidad como territorio poblado.** La paleta más cálida de las cuatro
páginas, la fotografía más grande del set, y **el único cambio de orden**: la
Legión va segunda.

- `RallyHero` — `Surface` con el terreno de curvas de nivel en arena y luz de
  tarde (`c/ground.ts`). El titular se apoya en la **meseta baja** —contenido
  pegado abajo con `items-end`, porque el `tilt` del shader levanta el relieve
  hacia arriba— que es exactamente para lo que este armazón usa un contorno.
- `RallyLegion` — segunda, sin banda, sin card, sin filete. La foto de grupo a
  `16/9` **sangrada una columna** (2–12): una foto a sangre se lee como capítulo
  nuevo, una sangrada como continuación de la frase de arriba, que es lo que
  este bloque es.
- `RallyPlaces` — las cuatro cifras en **Kepler itálica** (no en la sans de A:
  esta variante las trata como algo que la página dice, no como un registro),
  `STATS_NOTE` y `CITIES.note` debajo, y después **la figura grande a sangre**:
  el campo de ciudades sobre el mismo terreno del hero, a lo ancho del viewport.
- `RallyEvents` — una foto `16/9` por evento, en una grilla de tres. La sexta
  celda son los dos CTA de la sección: cinco eventos en una grilla de tres dejan
  un agujero, y un agujero en una grilla se lee como un ítem que falta.
- `RallyChannels` — los ocho agrupados en tres respuestas, cada una en una
  `Card` compartida con **una marca dibujada de 1px** (`c/ChannelMarks`) y los
  canales colgando debajo como lista de links. La card no puede contenerlos:
  `Card` tiene un `body` y un `href`, y un grupo lleva dos o tres destinos.
- `RallyDoors` — las cuatro puertas en 2×2, con la foto a sangre dentro del
  radio de la card. **Card local y no la compartida**, con motivo escrito en el
  archivo: la caja de arte de `stage/Card` es papel blanco con padding, correcto
  para un dibujo y equivocado para una fotografía.
- `RallyFaq` — el `Accordion` compartido sobre el **único blanco** de la página.
- `RallyClose` — sobrio, para que el peso quede arriba.

Progresión de fondos: superficie · crema · crema+superficie · tinte · crema ·
tinte · **blanco** · crema. Los dos tintes son los dos bloques con cards, que es
para lo que `tint` existe; el blanco se gasta una sola vez.

---

## El aparato gráfico: qué entró, y qué se rechazó

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
variante escribe su propio dibujo encima (`a/CityField`, `b/NetField`,
`c/PlacesField`). Lo que hay que saber:

- **No es un mapa, y el pie lo dice.** El fondo es la **retícula de
  coordenadas** —un punto de 1px por cada grado redondo de latitud y longitud— y
  nada más. Una costa es un dibujo del mundo, y esta figura no es sobre el
  mundo: es sobre cinco entradas de un calendario.
- **Proyección equirectangular**, a propósito: x es lineal en longitud e y en
  latitud, así que Lisboa y Lagos comparten x porque comparten meridiano. Esa
  relación es lo único que la figura afirma.
- **Ninguna marca de punto tiene radio.** El SVG es fluido, así que un punto
  medido en unidades de usuario desaparece en móvil. Cada punto es una **línea
  de longitud cero con cap redondo y `vector-effect="non-scaling-stroke"`**, que
  pinta un círculo de exactamente `strokeWidth` píxeles a cualquier escala. Ojo:
  `vector-effect` **no se hereda** — ponerlo en el `<g>` no hace nada y las
  marcas vuelven a escalar en silencio.
- **Lo que sí escala es la geometría**: las columnas de B y los anillos de
  huella de B y C están en unidades de usuario a propósito, porque son sólidos
  apoyados en el plano y tienen que encoger con él.
- **Los rótulos son HTML encima del SVG**, no `<text>` adentro: el texto SVG se
  maqueta en unidades de usuario y escalaría con la caja.
- **Una ciudad sin coordenada no se descarta en silencio.** `placeCities`
  devuelve `unplaced` y las tres variantes lo imprimen. Por eso «Online» —que
  está en el feed y no es un lugar— aparece como «Not a place», y por eso el día
  que Luma traiga Ulaanbaatar la página lo va a decir en mono.

Las tres versiones son el **segundo eje de comparación** después de la Legión:

| | Tamaño y fondo | Retícula | Marca de ciudad | Rótulos |
|---|---|---|---|---|
| **A** | cols 1–7, crema | 12° | punto de 4px + guía de 1px al rótulo | todos, en `micro-mono` |
| **B** | cols 1–7 de un panel, tinta | 15° + meridianos y paralelos | **columna isométrica** de tres caras en verde, con anillo de huella | sobre la tapa de la columna, en `micro-mono` |
| **C** | a sangre, sobre el terreno | 10° | punto verde de 7px + anillo de 1px | debajo del punto, en `caption-mono` |

**Todas las columnas de B miden lo mismo**, y eso es una decisión, no una
omisión: variar la altura por «eventos por ciudad» o «tamaño del grupo» haría
que el dibujo afirmara una magnitud que nadie midió. Altura uniforme dice
exactamente lo que dice el dato — esta ciudad está en el calendario.

**En C la figura no usa el primitivo `Figure`.** Sus dos tonos están calibrados
para fondos planos (`--rule` + `gray-intermediate` sobre crema, `white/15` +
`white/50` sobre tinta) y el mapa vive sobre un shader: adentro de la banda, el
filete aterriza como una curva de nivel de más y el pie cae a ~3:1. Así que la
lámina va a sangre y su filete y su pie se quedan arriba, en la crema, con un
`<figure>`/`<figcaption>` armado a mano y la misma semántica. El día que
`Figure` tenga un tono que pueda apoyarse en una superficie, esto vuelve a
colapsar en el primitivo.

### El bus de las cuatro puertas (solo en B)

Un filete cruza el panel de `NetDoors` y cuatro bajadas de 1px terminan en un
nodo. Es **estructura**: dice «cuatro entradas a lo mismo», que ni la copy ni un
cuarto titular dicen. Está hecho con dos elementos por columna y sin SVG, así
que refluye con la grilla en vez de ser una imagen que hay que mantener
sincronizada con un layout. Bajo `lg` desaparece en lugar de girar noventa
grados: una espina vertical en un teléfono es una línea de tiempo, y estas
cuatro no tienen orden.

### Las marcas de familia de canales (solo en C)

Las tres variantes siguen sin darle logo a ningún canal, por la razón aritmética
de siempre (ver la trampa 1, abajo). Pero **C agrupa los ocho en tres familias**,
y una familia no es una marca: nadie es dueño de un símbolo para «talk to
someone», así que no hay nada que falsificar y el dibujo puede *ser* la conducta.

`c/ChannelMarks` tiene las tres, en trazo de 1px y caja fija: renglones que
alternan de margen (turnarse), una escalera de cuatro tramos (acumular) y una
línea de puntos que entra y sale de la caja (un feed que ya venía corriendo). El
filtro que tuvieron que pasar está escrito en el archivo: el pie que cada una
habría llevado si fuese una `Figure`. Lo que salió «burbujita de diálogo»,
«martillo» o «icono de RSS» se tiró.

### Y las secciones que se quedaron sin gráfico

Las FAQ de las tres, los canales de A y B, los tres cierres. Un remate corto
necesita respirar, y el objetivo nunca fue una figura por sección.

---

## 📷 Los assets a producir

Cada hueco es un `<MediaFrame>` y **el `label` que se ve en pantalla ES el
encargo**: dice qué foto, qué tiene que haber en cuadro y con qué encuadre. Los
textos viven todos juntos en `MEDIA`, al final de `communityContent.ts` — no hay
copy de encargo escrita dentro de ningún componente, justamente para que esta
lista pueda leerse de un tirón.

Son **siete encargos** para diecinueve huecos, y de esos siete solo **cinco hay
que salir a producirlos**: la foto de la Legión es UNA fotografía que las tres
variantes recortan distinto, y las de eventos llegan con el propio feed.

| # | Encargo (`label`) | Dónde aparece | Proporción | Spec |
|---|---|---|---|---|
| 1 | **The Legion together** — wide group shot at a regional event, 40+ people, faces to camera and recognisable | A (`LegionBand`, sobre tinta) · B (`NetLegion`, a sangre del viewport) · C (`RallyLegion`, sangrada una columna) | `5/2` · `21/9` · `16/9` | 2800×1200 · JPG |
| 2 | **`{evento}, {ciudad}`** — wide shot of the full room, lead image for the section | A (`HubEvents`, cabecera) | `5/2` | 2000×800 · JPG |
| 3 | **`{evento}, {ciudad}`** — event photo, room or stage | C (`RallyEvents`, una por celda) | `16/9` | 1200×675 · JPG |
| 4 | **Host an event** — someone presenting on their feet to about 30 people, borrowed room, late-afternoon light | A (`HubInvolvement`) · C (`RallyDoors`) | `4/3` | 1200×900 · JPG |
| 5 | **NEAR on Campus** — long table of students with laptops in a lecture room or library, shot on the diagonal | ídem | `4/3` | 1200×900 · JPG |
| 6 | **Contribute code** — close shot of a screen with an open pull request on a NEAR repo, hands in frame | ídem | `4/3` | 1200×900 · JPG |
| 7 | **Create content** — someone recording a stream or a workshop, with the camera or the mic inside the frame | ídem | `4/3` | 1200×900 · JPG |

**Las dos de eventos (2 y 3) no hay que pedirlas por separado.** Su encargo se
arma con el título y la ciudad del propio evento, así que no puede nombrar algo
que la página no liste; y el campo donde aterrizan es `CommunityEvent.image`,
que es **la portada que Luma ya trae con cada evento**. El día que se conecte el
calendario esas fotos llegan solas, una celda a la vez, sin tocar el layout.

> **Los `label` están en inglés**, igual que los pies de las figuras y que todo
> lo demás que esta página imprime. Lo que está en castellano es este README, y
> nada más de esta carpeta.

---

## Dos trampas del género, y cómo se resolvieron acá

**1. La grilla de ocho cards con su iconito.** Es el default de toda página de
comunidad y no se usó en ninguna de las tres. El motivo es aritmético, no de
gusto: de estos ocho destinos `lucide-react` trae marca real para dos (GitHub,
LinkedIn), una vieja para un tercero (el pajarito pre-rebranding) y nada para
Discord, Telegram, Reddit, Farcaster ni YouTube. Una fila donde dos logos son
reales, uno está desactualizado y cinco son inventados se lee rota, y no hay
alineación que lo arregle. Así que el nombre hace el reconocimiento, el handle
va en mono porque un handle es un dato, y una línea dice para qué sirve el canal.

Las tres marcas de C **no son una excepción**: están sobre las tres familias, no
sobre los ocho canales. Sigue sin haber un solo logo de plataforma en la página.

**2. Las cifras sin contexto.** «4.000+ / Contributors» es ilegible como
afirmación: contadas en qué ventana, desde qué fuentes, a qué fecha. Por eso
existe `STATS_NOTE`, y por eso está en las tres variantes. Cuanto más grande se
setean las cifras —C las pone en itálica de display— más carga esa línea.

---

## Cosas que conviene saber antes de editar

- **Los anclas.** `HERO.primary` y `CLOSING.primary` apuntan a `#get-involved`, y
  `HERO.secondary` a `#events`. En B, además, las cuatro filas del índice del
  hero bajan a `#events`, `#legion`, `#channels` y `#get-involved`. Los ids viven
  en las secciones de cada variante, con su
  `scroll-mt-[var(--site-header-block)]`. Renombrar uno rompe dos links en A y C,
  y hasta cuatro en B.
- **El feed llega por props, siempre.** Las tres views importan `SAMPLE_EVENTS` y
  se lo pasan a su sección de eventos, que declara `readonly CommunityEvent[]`.
  Ninguna sección importa la lista directamente — es lo único de esta página que
  va a cambiar de fuente.
- **Las ciudades se derivan una sola vez, con `citiesFromEvents`.** En las tres
  variantes las deriva la view y las baja como prop, porque el dibujo y la lista
  de eventos viven en secciones distintas y hay que mantenerlas de acuerdo desde
  arriba.
- **`INSTRUMENT` es copy, aunque parezca chrome.** Los rótulos que B imprime en
  las esquinas de sus paneles se ven en pantalla, así que viven en
  `communityContent.ts` como todo lo demás, y en inglés. Mismo precedente que
  `CHANNEL_GROUPS` y `CITIES`, que solo lee `c/`.
- **`c/ground.ts` es calibración, no copy.** La paleta del terreno y sus dos
  ajustes (hero y mapa) viven junto al dibujo que los lee, igual que las
  coordenadas viven en `cityField.ts`. Las dos superficies de C tienen que ser
  el MISMO lugar; una paleta copiada en dos archivos diverge en el primer ajuste.
- **`Accordion` en A y en C, pero no en B.** El primitivo dibuja sus filetes en
  `gray-800`. Sobre crema y sobre blanco se lee como un filete de libro mayor al
  pie de la página; sobre la tinta de B cae entre el fondo y sus hairlines de
  `white/12`. Forkear el primitivo no era la alternativa — dos accordions
  divergentes es el fracaso que documenta el README padre. Si alguna vez hace
  falta de verdad, la solución es un prop `tone` en el primitivo.
- **`text-mural` en B exige `@container` en el bloque.** Mide su cuerpo en `cqw`;
  sin el contenedor declarado, el titular de `NetLegion` cae al piso del clamp
  sin avisar.
