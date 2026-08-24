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

**Lo gráfico que entró en A (segunda pasada):** solo dos cosas, y ninguna cerca
del trazo.

- La **marquesina de `Ecosystem`** dejó de ser nombres en tipo y corre celdas
  `MediaFrame` de 16rem en `5/2` — cinco con su logo real, siete reservadas. La
  forma no cambió (una banda sin principio ni final sigue siendo la única que
  dice «hundreds»); cambió lo que lleva adentro.
- Una **fila de cuatro retratos reservados** (`3/4`) al pie de `Council`,
  colgada de la columna 5 en adelante. Arranca adentro a propósito: el lazo de
  arriba es un dibujo chico que vive del aire, y una fila de cuatro marcos al
  ancho completo debajo se lo cierra. Entran con el `[data-council-item]` que
  la sección ya tenía — **el timeline del lazo no se tocó**.

`Pillars` y `Devolution` quedaron **exactamente como estaban**. Es donde vive el
gesto de la variante y lo que lo hace legible es el vacío alrededor.

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

**El aparato gráfico de B (segunda pasada).** Era la única variante sin una sola
pieza dibujada, que en un dossier de dos columnas es lo mismo que decir «texto».
Entraron **dos figuras, cuatro retratos y la grilla**:

| Bloque | Qué entró | Por qué ahí |
|---|---|---|
| `StiftungInstrument` | **Fig. 01** — un recipiente abierto arriba, con el piso cerrado salvo por una abertura; cinco trazos entran, cuatro se paran en el piso y solo el que cae sobre la abertura sigue | «Funds given to it cannot be removed for any reason except the fulfillment of that purpose» es la afirmación más dibujable de la página y la cargaba un párrafo. La figura no ilustra el párrafo: dice lo mismo más rápido |
| `OperationsClauses` | **Fig. 02** — una barra con tres patas: dos terminan en un punto, la tercera se va por abajo del marco | El tesoro es una palanca repartida en tres, y la tercera actividad («devolution of functions to the ecosystem») es la única cuyo producto no vuelve. Una línea que se corta adentro de la caja es una cantidad; una que sale es una dirección |
| `CouncilClause` | Cuatro retratos `3/4` chicos (2 columnas) en el cuerpo de la cláusula | Un expediente que nombra dos cuerpos y no muestra a ninguno es un expediente incompleto |
| `EcosystemAnnex` | La grilla de marcas, con el número afuera de la celda | Ver abajo |

Tres decisiones de composición que valen para cualquier figura que se agregue
después:

1. **Las figuras van en la columna ancha, nunca en el raíl.** El raíl son 2
   columnas de mono; un marco ahí no es un exhibit, es un sello.
2. **Las dos figuras no cuelgan igual.** Fig. 01 va sola en las últimas 5
   columnas del argumento (registro en los dos márgenes del bloque más denso, y
   el kicker se queda con la medida entera abajo); Fig. 02 va **al lado** del
   intro, en 4 columnas. Dos figuras al mismo ancho y sobre el mismo eje
   convierten dos exhibits en una plantilla.
3. **Las dos van numeradas** (`Fig. 01` / `Fig. 02`) aunque el texto no las
   referencie, que es la excepción a la regla de `Figure`. Acá el número es
   registro y no cross-reference: en esta variante están numeradas las
   cláusulas, los pilares, las actividades y el anexo, y un exhibit sin numerar
   dentro de un instrumento que numera hasta sus párrafos se lee como papel
   suelto.

`DevolutionBreak` sigue **sin nada**, y es deliberado: es la excepción de la
página, y una excepción con una figura adentro deja de ser una excepción.

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
- Las doce estaciones del borde son doce porque `ECOSYSTEM_MARKS` tiene doce
  entradas y la sección siguiente las muestra. En la escena no se etiqueta
  ninguna —etiquetadas, esto es un organigrama—: el lector que contó se lleva la
  rima de regalo. Si esa lista cambia de largo, `CLUSTERS` la sigue.

El resto de la página es deliberadamente olvidable: un hero grande **por
espacio** y no por cuerpo tipográfico, los pilares colgando de un único filete
en vez de tres, y Stiftung y Council como bloques de texto cortos. Es el trato
que paga la escena. Cierra en crema, no en tinta: la página ya gastó su negro en
la escena y volver a cerrarlo dejaría el final leyéndose como la cola de la
escena en vez de como la página hablándole al lector después.

**Lo gráfico que entró en C (segunda pasada):** exactamente dos cosas, y las dos
son evidencia, no gesto. La **grilla de marcas** en `HandoffEcosystem` (cuatro
columnas, celdas `5/2`) y **cuatro retratos** al pie de `HandoffCouncil`, con la
misma sangría a columna 5 que en A.

Nada más, y eso es el trato de esta variante: el resto sigue callado para que
hable la escena. Los retratos no la pisan porque un marco reservado no afirma
nada —no se mueve, no dibuja, no compite—; y la grilla llega **después** del
negro, donde lo único que corresponde es una constatación plana. Cualquier cosa
con movimiento ahí se leería como la escena continuando.

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
| **Tres iconitos para los pilares** | Es el ejemplo de manual de lo prohibido. Solo entraban si los tres *ejecutaban* su afirmación como los glifos de `chain/WhyItMatters` —algo cerrado que no puede abrirse, recursos que salen, un centro que se disuelve—; lo que salía eran tres pictogramas. Y en A el trazo continuo ya atraviesa esa zona: no necesita compañía |
| Una figura en `DevolutionBreak` (B) | Es **la** excepción del documento. Una excepción con un exhibit adentro vuelve a ser un bloque del documento |
| Una figura en el raíl de B | 2 columnas de mono: ahí un dibujo no es un exhibit, es un sello |
| Un gráfico en los cierres (`Close`, `DossierClose`, `HandoffClose`) | Un remate corto tiene que respirar. El objetivo no era 24 de 24 secciones |
| Mapear un logo real a un proyecto que no es | Precedente en `chain-ab-propuesta-a/Proof.tsx`, y es un truco de laboratorio: pone la marca de Ledger sobre «Infinex». Acá los cinco assets se sirven a los cinco proyectos que efectivamente retratan, y los otros cinco nombres del deck salieron de la lista |
| El nombre del proyecto repetido debajo de la celda | Los cinco logos son **wordmarks**: la marca ya dice el nombre. Y una línea extra solo bajo las celdas servidas deja las filas de la grilla desparejas |

## La grilla de logos de dApps

El deck pide conservar la grilla de logos de dApps del sitio actual. **En la
primera pasada se resolvió con nombres en tipo** (esa nota ya no vale): el repo
tiene cinco assets de logo y una grilla habría sido cinco marcas reales al lado
de siete huecos rotos.

`MediaFrame` cambió la respuesta. Un hueco dejó de ser un hueco: es una celda
reservada con marcas de registro y su propio encargo escrito adentro, así que la
grilla puede existir hoy **en su estado real** —cinco servidas, siete
encargadas—. Ver la mitad llena y la mitad reservada es más honesto y más útil
que doce nombres en una tipografía: el lector ve el ecosistema, y quien produzca
los assets ve exactamente qué falta.

Las doce viven en `ECOSYSTEM_MARKS` y la celda es una sola para las tres
variantes: **`EcosystemMark.tsx`**, que envuelve a `MediaFrame` y resuelve las
dos cosas que no son layout —el encargo de la celda reservada, y
`object-scale-down` para la servida, porque `object-cover` recorta un wordmark y
`object-contain` lo agranda—. Que las tres compartan la celda es lo que mantiene
honesta la comparación: cualquier diferencia entre A, B y C sigue siendo de
acomodo.

| | Forma | Qué afirma |
|---|---|---|
| A | Marquesina continua de celdas de 16rem | Una población sin principio ni final — «hundreds» |
| B | Anexo numerado: filete, número en mono **afuera** de la celda, celda debajo | Una lista enumerada, contable: un anexo con entradas todavía por presentar, que es como se ve un anexo de verdad |
| C | Grilla tranquila de cuatro columnas, después del negro | Una constatación plana de a dónde fue la masa |

**Cinco nombres del deck salieron de la lista** para dejar entrar a los cinco que
sí tienen asset (Ledger, Venice, Abound, Brave, ZODL — los cinco son case
studies reales de NEAR). La alternativa era mapear `ledger.png` sobre «Aurora»,
que es lo que hace `chain-ab-propuesta-a/Proof.tsx` y es un truco de
laboratorio. Siguen siendo **doce**, y eso es estructural: `c/HandoffScene`
manda la masa a doce clusters. Si la lista cambia de largo, `CLUSTERS` la sigue.

## Assets a producir

La lista completa de lo que hay que encargar, que es literalmente lo que cada
celda tiene escrito adentro. Cuando un asset llega, se le pasa `src` a la entrada
correspondiente en `foundationContent.ts` y **ningún layout cambia**.

**Logos del ecosistema** — `ECOSYSTEM_MARKS`, celdas `5/2`, spec «Monochrome
SVG». Siete pendientes:

| Proyecto | Estado |
|---|---|
| Ref Finance | pendiente |
| Ledger | ✅ `/logos/ledger.png` |
| Meteor Wallet | pendiente |
| Aurora | pendiente |
| Venice | ✅ `/logos/venice.png` |
| Rainbow Bridge | pendiente |
| Abound | ✅ `/logos/abound.png` |
| Mintbase | pendiente |
| Sweat Economy | pendiente |
| Brave | ✅ `/logos/brave.png` |
| Burrow | pendiente |
| ZODL | ✅ `/logos/zodl.png` |

**Retratos del Council** — `COUNCIL_PORTRAITS`, celdas `3/4`, spec «1200×1600 ·
JPG». Los cuatro, pendientes:

| Encargo (`label`) |
|---|
| Council member 01 — portrait |
| Council member 02 — portrait |
| Council member 03 — portrait |
| Executive team — portrait |

**Cuatro no es el Council.** El deck no dice cuántos miembros tiene, y en la
página que argumenta que su transparencia es estructural, inventar un padrón
sería fabricar el registro que dice llevar. Cuatro es la cantidad que compone
en todos los breakpoints (4 · 2 · 1) y nada más. Cuando llegue el padrón real,
ese array pasa a ser las personas.

> **Idioma: todo lo que se renderiza va en inglés.** Los `label`, los `spec` y
> los `caption` de esta carpeta, como el resto de la copy de la página. Los
> comentarios del código y este README siguen en español, como en `chain/` y
> `quantum/`.
>
> Hubo una primera versión con los `label` y los pies en español, con el
> argumento de que son orden de trabajo y no copy. Para el `label` de
> `MediaFrame` el argumento es cierto a medias —es un encargo, y desaparece en
> cuanto llega el `src`— pero **hoy se ve**, así que va en el idioma de la
> página; sigue siendo una orden de trabajo, solo que en inglés («Council member
> — portrait», no «Image»). Para el `caption` de `Figure` era directamente
> falso: el pie no es un placeholder, es contenido permanente que se imprime
> debajo del dibujo y no desaparece nunca. Un pie en español bajo un párrafo en
> inglés no se lee como registro interno, se lee como un error.

> **Ninguna celda `MediaFrame` de esta carpeta lleva `data-reveal`.** Es una
> regla, no un olvido, y salió de un agujero real: los cuatro retratos de
> `CouncilClause` dejaban ~400px de crema vacía entre «Executive team» y la
> cláusula siguiente. `useScrollReveal` preesconde sus targets **al montar**
> (`.from()` con `immediateRender`, documentado en el propio hook), así que una
> celda reservada adentro de un reveal está invisible hasta que el stagger le
> llega — y mientras tanto lo que hay es un hueco del tamaño exacto del asset
> que falta. Es lo único que un placeholder no puede hacer: la celda existe
> para **declarar** la falta, y una declaración que aparece con fade no declara
> nada mientras no está. Se pintan en reposo.
>
> El segundo factor del mismo agujero era el tamaño: en B las celdas estaban a
> 3 columnas de la grilla anidada (~235 × 314, las más grandes de la página) y
> cuatro en fila son una banda cuya única tinta son dieciséis marcas de esquina.
> Pasaron a 2 columnas (~150 × 200), que es la fotografía adjunta de un
> expediente y es lo que el bloque dice ser.

## Lo que se tocó en `foundationContent.ts`

Todo está comentado en el módulo:

1. **El último elemento de `body` ES el kicker**, tanto en `MISSION` como en
   `TRANSPARENCY`. La frase de remate estaba además enterrada al final del
   último párrafo de `MISSION`, así que cualquier layout que la destacara —o
   sea, los tres— la mostraba dos veces en tres renglones. Se sacó del párrafo y
   quedó como última entrada: los layouts renderizan `body.slice(0, -1)` como
   prosa y `kicker` aparte.
2. **`COUNCIL.relation`** (`empowers` / `reports to`) son los dos verbos de la
   relación, ya sueltos, para que el dibujo de la variante A no tenga que
   hardcodear dos strings en inglés adentro de un componente.
3. **`ECOSYSTEM_NAMES` pasó a ser `ECOSYSTEM_MARKS`** — de doce strings a doce
   entradas con `id`, `name` y `src` opcional. Ver arriba: es lo único de
   los cuatro que toca el texto y no solo la forma, y está argumentado.
4. **`COUNCIL_PORTRAITS`** — cuatro lugares reservados, con su encargo. Nuevo.
