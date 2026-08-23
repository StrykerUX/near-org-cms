# `foundation` — secciones de la página NEAR Foundation

Aplica el contrato general de [`../README.md`](../README.md). Acá solo va lo
específico de esta página.

> **Nota de idioma.** Los comentarios dentro de los `.tsx` de esta carpeta están
> en **inglés**, igual que en [`../chain`](../chain/README.md) y
> [`../quantum`](../quantum/README.md). Este README, como los de esas carpetas,
> en español.

Tres rutas de comparación: `/prototype/foundation-a`, `-b` y `-c`, montadas por
`components/views/Foundation{A,B,C}View.tsx`. **Las tres leen la misma copy**
(`foundationContent.ts`), y esa es la razón del split: puestas una al lado de
la otra, cualquier diferencia entre ellas es una diferencia de layout y nunca de
texto.

## La idea que las tres tienen que hacer sentir

Es una organización cuyo objetivo declarado es **volverse más chica** —«Our goal
is to make ourselves smaller»—. Una fundación suiza, legalmente atada a su
propósito, cuyo plan es devolverse. Las tres variantes atacan esa tensión desde
la **estructura** de la página, no desde una ilustración: no hay flechas
genéricas hacia afuera ni cajas que se achican de adorno en ninguna de las tres.

## A — «Receding column» (`a/`)

El estilo de la casa ejecutado con precisión. Crema de punta a punta con **un
solo corte a tinta**, al final.

**La decisión que la distingue: el trazo es uno solo y atraviesa tres
secciones.** El hero baja un filete que cruza el `Container` entero —la medida
completa—; `Pillars` corta esa medida en tres; y `Devolution` la repite hacia
abajo cada vez más corta hasta dejar un tick. Nada crece, nada apunta a ningún
lado: una escala que se retira. El kicker cae justo debajo del filete más corto,
en el espacio que la medida dejó libre. `Close` se lleva ese resto a la tinta.

Si se reordenan las secciones, lo que hay que preservar es **ese trazo**, no el
orden nominal de los bloques.

Otras dos decisiones que valen para leer el resto de la carpeta:

- **Los pilares no escalonan.** `chain/WhyItMatters` desplaza sus tres columnas
  en escalera porque son una secuencia con dirección. Estos tres no son una
  secuencia sino tres rangos del mismo peso, y escalonarlos afirmaría una
  jerarquía que el texto no tiene.
- **El Council es un solo trazo cerrado**, un óvalo tipo pista entre los dos
  bloques nombrados, con las dos etiquetas (`empowers`, `reports to`) contra su
  propia pata. Dos flechas serían dos objetos y el lector contaría dos
  relaciones; un lazo cerrado es la única circulación que el texto describe, y
  además no necesita puntas de flecha, o sea que no sale del vocabulario de 1px
  del resto de la página.

## B — «Stiftung dossier» (`b/`)

La página como el instrumento legal que describe: densa, de registro, con aire
de documento archivado — pero sigue siendo el mismo sitio, no un PDF.

**La decisión que la distingue: la retícula la impone un componente, no cada
sección.** `Clause.tsx` es dueño del raíl angosto de la izquierda —**2 columnas
de 12**, que es lo que mide un margen— y del filete que cruza **las dos
columnas**. Si cada bloque declarara sus propios `col-span`, el borde izquierdo
del argumento se correría una columna en algún punto de la página y con eso se
iría el efecto entero: un documento es un documento porque su medida no cambia
nunca.

**Y el raíl va lleno.** La columna ancha lleva el argumento; el raíl lleva los
**datos** del documento, en mono. Bloque por bloque:

| Bloque | Qué va en el raíl |
|---|---|
| `DossierHero` | Membrete: nombre + dos de los cuatro hechos legales |
| `DossierPillars` | Número de cláusula sobre la **clave** del pilar (`id`) |
| `StiftungInstrument` | Los **cuatro** `STIFTUNG_FACTS`, término sobre valor |
| `CouncilClause` | Los dos cuerpos en orden de autoridad, con `COUNCIL.relation` en el tramo que los separa |
| `OperationsClauses` | Etiqueta de sección; después, número de cláusula sobre la clave de cada actividad |
| `EcosystemAnnex`, `DossierClose` | Solo la etiqueta — las dos excepciones, y están comentadas en el código |

Un raíl vacío no se lee como el margen de un documento: se lee como una columna
que nadie llenó. Si una sección tiene material de registro y termina en la
columna ancha, la variante se queda sin motivo.

**Y el contraste que la salva de ser aburrida: `DevolutionBreak`.** Es el único
bloque sin raíl, sin número y sobre blanco —el único blanco de la página, que el
DS permite una vez—. Es la frase en la que la organización dice que piensa dejar
de ser lo que el resto del documento describe: el layout no ilustra eso, el
layout **es** la excepción. Tiene que seguir siendo **la única**; dos
excepciones son un ritmo, un ritmo es un formato, y ahí la página vuelve a tener
un solo registro con una variante gritada.

Dos detalles que parecen repetición y no lo son:

- El hero lleva **dos** de los cuatro hechos legales y la sección del Stiftung
  lleva **los cuatro**. Es la distinción que hace cualquier documento entre su
  membrete y su anexo.
- La numeración **reinicia** en `01` en las actividades. Los pilares y las
  actividades no son una lista de seis: tres son rangos y tres son deberes, y
  cada grupo tiene su propio encabezado, como un 2.1/2.2/2.3.

`DossierClose` repite la medida de `Clause` a mano en vez de usarlo, y es por un
color: `border-rule` (#c9c7c1) es un filete sobre crema y nada sobre tinta.

## C — «Hand-off» (`c/`)

Una escena pegada en el corazón de la página y todo lo demás en silencio para
dejarla hablar.

**La decisión que la distingue: la materia se conserva.** En `HandoffScene`, 132
marcas de 1px arrancan apretadas dentro del límite de la Foundation y, a lo
largo del scroll, **se van**: cada una viaja a uno de doce lugares del borde y
se queda ahí. Al final el centro está vacío, el borde poblado, y el anillo que
contenía todo es un círculo tenue alrededor de nada. Las tres actividades
(`OPERATIONS.activities`) son las estaciones del recorrido: la copy cambia
mientras la masa se mueve.

Un diagrama de flechas saliendo de un hub diría «esto distribuye», que no es lo
mismo: un hub con flechas tiene al final tanto hub como al principio. Acá no se
crea nada en el borde — todo lo que hay ahí salió del medio. Esa es la
diferencia entre una distribución y una devolución.

Mecánica, para quien la edite:

- `position: sticky` de CSS + `enableScene`/`trackTimeline` de `stickyScene`, un
  ScrollTrigger que solo **lee** progreso. Nunca `pin: true`.
- Posiciones deterministas con `createSeededRandom()`, y todo lo que sale de
  `Math.sin`/`Math.cos` redondeado a cuatro decimales antes de llegar al DOM
  (si no, el server y el cliente difieren en el último ulp y React no hidrata).
- **El JSX renderiza el estado FINAL** y la escena lo rebobina. Sin JS, en móvil
  o con `prefers-reduced-motion`, el lector recibe la figura terminada más las
  tres estaciones en flujo normal. No hay nada preescondido en CSS.
- El anillo del centro **no** baja a opacidad 0: la Foundation no dice que va a
  desaparecer, dice que va a ser más chica.
- Las doce estaciones del borde son doce porque `ECOSYSTEM_NAMES` tiene doce
  entradas y la sección siguiente las nombra. En la escena no se etiqueta
  ninguna —etiquetadas, esto es un organigrama—: el lector que contó se lleva la
  rima de regalo. Si esa lista cambia de largo, `CLUSTERS` la sigue.

El resto de la página es deliberadamente olvidable: un hero grande **por
espacio** y no por cuerpo tipográfico, los pilares colgando de un único filete
en vez de tres, y Stiftung y Council como bloques de texto cortos. Es el trato
que paga la escena. Cierra en crema, no en tinta: la página ya gastó su negro en
la escena y volver a cerrarlo dejaría el final leyéndose como la cola de la
escena en vez de como la página hablándole al lector después.

## Qué se descartó

| Idea | Por qué no |
|---|---|
| Cards con borde para los pilares | La doctrina de la casa está escrita en `chain/WhyItMatters.tsx`: el filete separa sin encerrar. Tres rectángulos después de un hero hecho de aire se leen como otro sitio |
| Flechas saliendo de un centro (A) | Es la ilustración de la idea, no la idea; y además es el trabajo de la variante C, hecho mejor |
| Una caja que se achica (A) | Una forma que se achica es una transición, no una medida: no hay contra qué leerla |
| Una cuarta pata de la medida con etiquetas («Foundation» arriba, «Ecosystem» abajo) | El gesto tiene que leerse en tres segundos sin pedir explicación. Etiquetado deja de ser una escala y pasa a ser un gráfico |
| El raíl de B a 3 columnas (~450px a 1440) | A ese ancho deja de ser un margen: una entrada de dos líneas mono deja el resto de la columna vacía, y lo vacío es lo que se lee. Quedó en 2, y el ancho recuperado se lo lleva el argumento |
| Los cuatro hechos legales en tabla de filetes dentro de la columna ancha (B) | Se leía bien solo, y estaba mal dos veces: dejaba en blanco el margen del bloque más denso de la página, y ponía los cuatro hechos en la misma columna que el párrafo que ya los explica, uno debajo del otro. En el margen hacen otro trabajo — el párrafo dice qué te cuesta un Stiftung, el margen dice qué **es** |
| Un diagrama del Council en B y en C | En B, la única ilustración de un documento que no tiene ninguna: los dos cuerpos y la dirección entre ellos van fichados en el raíl, en mono. En C, un segundo diagrama en la antesala de una figura de tres pantallas |
| Cerrar C en tinta | Ver arriba: el negro ya está gastado, y el final se leería como cola de la escena |

## La grilla de logos de dApps

El deck pide conservar la grilla de logos de dApps del sitio actual. **Todavía
no existe**: este repo tiene cinco assets de logo (`public/logos`), así que una
grilla serían cinco marcas reales al lado de una docena de placeholders — el
mismo problema que se topó `chain/ProofBand`, y se resuelve igual. Los nombres
van **en tipo**, en `ECOSYSTEM_NAMES`, y cada variante los pone en la forma que
le corresponde:

| | Forma | Qué afirma |
|---|---|---|
| A | Marquesina continua | Una población sin principio ni final — «hundreds» |
| B | Anexo numerado, en filetes | Una lista enumerada, contable: un anexo del documento |
| C | Bloque suelto que hace wrap, a escala de heading | Sin filas y sin ranking |

**Cuando lleguen los assets se cambia la forma, no la sección**: los tres
bloques quedan donde están y en la misma celda.

## Dos cosas que se tocaron en `foundationContent.ts`

Ambas están comentadas en el módulo, y las dos son de forma, no de texto:

1. **El último elemento de `body` ES el kicker**, tanto en `MISSION` como en
   `TRANSPARENCY`. La frase de remate estaba además enterrada al final del
   último párrafo de `MISSION`, así que cualquier layout que la destacara —o
   sea, los tres— la mostraba dos veces en tres renglones. Se sacó del párrafo y
   quedó como última entrada: los layouts renderizan `body.slice(0, -1)` como
   prosa y `kicker` aparte.
2. **`COUNCIL.relation`** (`empowers` / `reports to`) son los dos verbos de la
   relación, ya sueltos, para que el dibujo de la variante A no tenga que
   hardcodear dos strings en inglés adentro de un componente.
