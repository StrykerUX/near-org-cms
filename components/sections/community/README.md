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
  fila de cuatro (`HubStats`).
- Eventos como **lista de filas**, no cards: fecha en mono a la izquierda,
  título, ciudad, tipo. Toda la fila es un link (`HubEvents`).
- `LegionBand`: banda a sangre sobre tinta, ancha, con el CTA grande.
- `HubChannels`: grilla compacta de ocho, cada uno con nombre, handle y una
  línea. Se lee como directorio, no como ocho botones.
- `HubInvolvement`: cuatro columnas bajo filete, cada una con su link, sobre el
  blanco de la página.
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
  `COL` y hover por fila.
- `BoardChannels`, `BoardInvolvement` y `BoardFaq` son la misma fila otra vez.
- `BoardLegion` es **el único bloque que no es una fila**: a sangre, blanco,
  centrado, con más aire que las dos tablas juntas. Ese contraste ES el diseño.

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
  variante propone.
- Las cifras van **dentro** de la apertura (`RallyHero`), grandes y en serif
  itálica, no en una barra aparte.
- `RallyCities`: las ciudades como **marquesina** sobre tinta. La lista **sale
  del feed de eventos**, no de una lista escrita a mano: no puede nombrar una
  ciudad que la página no muestre, y crece sola el día que se conecte Luma. Es
  además lo que **cierra** la apertura, que si no se derrama sobre la tabla de
  eventos.
- `RallyEvents`: más presencia que en A (el doble de aire, título a `text-h3`)
  pero sin caer en cards — no hay imágenes, y una card sin imagen es un borde
  alrededor de cuatro campos de texto.
- `RallyChannels` es la variante que **edita** en vez de listar: los ocho canales
  agrupados en tres respuestas (`CHANNEL_GROUPS`), y sin la línea por canal, que
  el rótulo del grupo ya contesta.
- FAQ y cierre sobrios, para que el peso quede arriba.

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
