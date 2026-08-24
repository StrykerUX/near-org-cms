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

| | Estilo | Qué es acá |
|---|---|---|
| **A** | Editorial | «Hand-off» — una escena pegada sobre negro, y siete secciones que se corren para dejarla hablar |
| **B** | Instrumento | «Un aparato con lectura pública» — página oscura, paneles, y un solo objeto leído cuatro veces |
| **C** | Escenario | «El terreno que se entrega» — superficie de curvas de nivel, cards, color, y una figura a sangre |

Las letras significan lo mismo en las cuatro páginas A/B/C del sitio: el
armazón de B y C sale de [`../shells`](../shells/README.md) —`Panel`, `Readout`,
`ActRail`, `Surface`, `Card`— y **el vocabulario gráfico es propio de esta
página**. Eso fue una decisión explícita: armazón compartido para que las cuatro
B se lean como una familia, arte propio para que ninguna diga lo que no tiene
que decir.

## A — «Hand-off» (`a/`)

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

**Lo gráfico de A:** exactamente dos cosas, y las dos son evidencia. La
**grilla de marcas** en `HandoffEcosystem` (cuatro columnas, celdas `5/2`) y
**cuatro retratos** al pie de `HandoffCouncil`, sangrados a columna 5. Nada más:
el resto sigue callado para que hable la escena.

## B — «Instrumento» (`b/`)

La página oscura de punta a punta, y **un solo objeto leído cuatro veces**.

Una fundación que declara que su transparencia es estructural y no elegida está
describiendo, literalmente, una caja con instrumentación: se ve qué entra, qué
está retenido y qué sale. Así que la variante le da al lector ese objeto y
después lo lee.

| Sección | Qué muestra el aparato |
|---|---|
| `InstrumentHero` | La caja **cerrada**, en la placa de identificación, con dos de los cuatro hechos legales como `Readout` |
| `DevolutionMeter` | La misma caja como **nivel y consigna**: el nivel donde está, la consigna punteada debajo, y un raíl con marcas sin números (**Fig. 01**) |
| `CustodyCutaway` | La misma caja **abierta**: cinco entradas, cuatro se paran en el piso, la quinta sigue por la única abertura y se va del cuadro (**Fig. 02**) |
| `OperationsScene` | La misma caja como **losa repartida** en tres actos con `ActRail`; dos parcelas quedan en el cuadro, la tercera lo cruza |

La geometría de las cuatro vive en **`b/apparatus.ts`** y en ningún otro lado:
cuatro dibujos de un objeto solo se sostienen si el objeto conserva su tamaño y
su punto de vista. La proyección es **dimétrica plana (~20°)** y no la isométrica
canónica de 30° a propósito — a 30° cualquier caja de este sitio se lee como el
campo de cubos de `/prototype/protocol-a`.

**Lo que hace que no sea «la A pintada de negro»:** la unidad de composición.
Ahí es un párrafo, acá es un **panel** — un objeto con borde, etiqueta en una
esquina, estado en la otra y una banda de lecturas al pie. Todas las secciones
son un panel salvo dos, y las dos excepciones están argumentadas en el archivo:
la escena de operaciones (que es un panel que **se mueve**) y el cierre (que no
lleva caja porque las últimas cuatro líneas no las dice el instrumento).

Detalles que valen para editarla:

- **Una sola lectura encendida en toda la página**: `Smaller / Declared target`,
  en `DevolutionMeter`. `accent` marca lo que la sección afirma; si se encienden
  todas, ninguna es el argumento. (`CustodyCutaway` enciende `Bound to` dentro de
  su propio bloque de cuatro, que es la lectura de la que habla su figura.)
- **Sin magnitudes.** El raíl del medidor está marcado y sin números, y ninguna
  parcela lleva cifra: el deck no da ninguna, y ponerle una al tesoro sería
  inventar el único dato que esta página no puede inventar.
- **Los `Readout` salen de `STIFTUNG_FACTS`** y las etiquetas del Council se
  arman con `COUNCIL.bodies`. Nada se copia dos veces.
- **`data-nav-dark` va en el `<main>`**, no por sección: el header lee el DOM, la
  página es oscura entera, y es un trigger en vez de ocho.
- Los paneles con celdas reservadas o retratos van en `tone="slate"` y no `ink`:
  sobre #101010 las marcas de esquina de 1px se leen como agujeros.
- La escena de operaciones sigue el mismo contrato que `a/HandoffScene`: sticky
  de CSS, ScrollTrigger que solo lee, JSX en estado final, y `ActRail` recibiendo
  `active` desde la timeline (fuera de rango = ningún acto encendido, que es lo
  correcto cuando la escena está desarmada y los tres actos se leen apilados).

**El Council de B no lleva diagrama** y es deliberado: la relación se dibuja una
vez en toda la comparación, y le tocó a C. Acá va **fichada** —`empowers` y
`reports to` como dos lecturas en la banda del panel— más los cuatro retratos.

## C — «Escenario» (`c/`)

El terreno que se entrega. La superficie de curvas de nivel del armazón se toma
**literal**: la Foundation sostiene un territorio y su plan es soltarlo.

La paleta es **fría y mineral** (`#e7eaec` / `#aebcc4` / `#46545c`, en
`c/terrain.ts`) — suiza, no tropical, y a diez bandas: apretada para leerse como
una medición, abierta para que quede meseta donde apoyar el titular. Fue lo
primero que se calibró en pantalla: a catorce bandas el hero era legible y el
suelo, ruido.

**Todo lo que se dibuja en la página son curvas de nivel del mismo terreno.** No
es una decisión estética: el hero ya le enseñó al lector que esta página dibuja
suelo, así que una figura hecha de las mismas curvas se lee como una medición y
no como una ilustración pegada encima.

| Sección | Figura | Qué afirma |
|---|---|---|
| `PillarCards` 01 | Una **depresión cerrada**, con las marcas hacia adentro que un mapa usa para distinguir una cuenca de una cima | Lo que entra no puede salir: «legally bound to its purpose» |
| `PillarCards` 02 | Una **repisa ancha** que drena hacia los relieves chicos de alrededor | Lo que la repisa cede es de lo que están hechos los otros |
| `PillarCards` 03 | El mismo terreno **sin nada por encima del resto**, con el contorno punteado del relieve único que había | «Decentralized, self-sufficient» |
| `DevolutionRelief` | **La figura grande a sangre**: la cima se retira mientras el lector baja, y el terreno queda | «Smaller», no «gone» |
| `CouncilTerraces` | Dos **terrazas** y dos carriles entre ellas, con los verbos de `COUNCIL.relation` | La autoridad baja, la rendición sube |
| `OperationsSlope` | Tres terrazas en una pendiente: dos circuitos se cierran, el tercero se va del cuadro | La devolución es la única cuyo producto no vuelve |

Dos reglas que sostienen a C:

1. **El color significa una cosa.** La rampa del CTA (`--cta-lime` → `--cta-mint`
   → `--cta-deep`) se usa como **relleno**, no como acento, y siempre sobre lo
   mismo: suelo que al final del dibujo es de otro. Por eso la figura del Council
   es monocroma y el pilar de descentralización no.
2. **Una sola figura se anima**, la del relieve, y se anima porque **el trazado
   es la afirmación**: la cima que se retira ES la frase. Va con scrub y no
   reproducida una vez, por el mismo motivo que `chain/CompletePicture` — la
   animación y la oración son el mismo enunciado, así que el retiro tiene que
   pasar al ritmo al que el lector baja. El JSX renderiza el estado **final**
   (cima recogida, relleno drenado, la cota todavía marcada) y la escena lo
   rebobina.

Los fondos, en orden: `SURFACE · tint · cream · WHITE · tint · cream · tint ·
cream`. El blanco se gasta **una vez**, en el Stiftung, que es lo más plano que
dice la página. **No hay tinta en ninguna parte**: B es un objeto encendido en un
cuarto oscuro y C es luz de día sobre campo abierto; una sección negra acá se
leería como un pedazo de la otra página.

Móvil: el relieve se **recorta** en vez de encogerse (`preserveAspectRatio
xMinYMid slice` + alto en `svh`), porque escalado a 375px es una franja de 110px
sin cima; y la pendiente de operaciones **scrollea** dentro de su caja, porque
recortarla se comería una terraza — justo la tercera, que es de la que habla.

## Qué se descartó

| Idea | Por qué no |
|---|---|
| Cards con borde para los pilares en A y B | La doctrina de la casa está en `chain/WhyItMatters.tsx`: el filete separa sin encerrar. En C sí hay cards, y el porqué está en `shells/stage/Card.tsx` — una unidad **con figura** necesita caja; tres columnas de prosa, no |
| Tres iconitos para los pilares (A y B) | Es el ejemplo de manual de lo prohibido. Solo entraban si los tres *ejecutaban* su afirmación; lo que salía eran pictogramas. En C entran porque el mapa tiene gramática para las tres —cuenca, repisa que drena, campo parejo— y ninguna sobrevive convertida en símbolo |
| Un diagrama del Council en B | La relación se dibuja **una vez** en la comparación. Dibujarla en dos variantes deja la diferencia entre ellas en la pintura |
| Una caja que se achica (B) | Una forma que se encoge es una transición: no hay contra qué leerla. El medidor arregla exactamente eso — nivel, consigna, y la distancia entre los dos es la frase |
| Animar el nivel bajando (B) | La copy declara una intención («our goal is»); un nivel que baja solo afirma que ya está pasando |
| Números en el raíl del medidor o cifras en las parcelas (B) | El deck no da ninguna magnitud del tesoro |
| Cerrar C con una segunda superficie con shader | La superficie es la frase de apertura; repetirla al final pliega el cierre sobre el arranque en vez de soltar al lector |
| Un `Figure` alrededor de la caja del hero (B) | El panel ya la enmarca y la nombra. Dos marcos sobre un objeto |
| Un `Figure` alrededor del relieve (C) | Su filete y su pie están medidos al ancho del arte, y un filete de 1px cruzando el viewport entero se lee como separador de sección, no como el techo de una figura. El pie va abajo, a la medida de la retícula |
| Un gráfico en los cierres (`HandoffClose`, `InstrumentClose`, `StageClose`) | Un remate corto tiene que respirar. El objetivo no era 24 de 24 secciones |
| Mapear un logo real a un proyecto que no es | Precedente en `chain-ab-propuesta-a/Proof.tsx`, y es un truco de laboratorio |
| El nombre del proyecto repetido debajo de la celda | Los cinco logos son **wordmarks**: la marca ya dice el nombre, y una línea extra solo bajo las celdas servidas deja las filas desparejas |

## La grilla de logos de dApps

El deck pide conservar la grilla de logos del sitio actual. El repo tiene cinco
assets, así que la grilla existe **en su estado real**: cinco servidas y siete
reservadas, cada reserva con su encargo escrito adentro. Ver la mitad llena y la
mitad encargada es más honesto y más útil que doce nombres en una tipografía.

Las doce viven en `ECOSYSTEM_MARKS` y la celda es una sola para las tres
variantes: **`EcosystemMark.tsx`**, que envuelve a `MediaFrame` y resuelve las
dos cosas que no son layout —el encargo de la celda reservada, y
`object-scale-down` para la servida—. Que las tres compartan la celda es lo que
mantiene honesta la comparación.

| | Forma | Qué afirma |
|---|---|---|
| A | Grilla tranquila de cuatro columnas, después del negro | Una constatación plana de a dónde fue la masa |
| B | Anexo dentro de un panel `slate`, con el link al pie | El registro de lo que el aparato **no** contiene |
| C | Grilla de cuatro columnas sobre `tint`, sin caja propia | Los únicos de la página que la Foundation no sostiene: darles un contenedor nuestro contradice la sección |

**Cinco nombres del deck salieron de la lista** para dejar entrar a los cinco que
sí tienen asset (Ledger, Venice, Abound, Brave, ZODL — los cinco son case
studies reales de NEAR). Siguen siendo **doce**, y eso es estructural:
`a/HandoffScene` manda la masa a doce clusters. Si la lista cambia de largo,
`CLUSTERS` la sigue.

## Assets a producir

La lista completa es literalmente lo que cada celda tiene escrito adentro.
Cuando un asset llega, se le pasa `src` a la entrada correspondiente en
`foundationContent.ts` y **ningún layout cambia**. Las tres variantes muestran
las mismas celdas, así que la lista **no creció** con B y C.

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
JPG». Los cuatro, pendientes, y aparecen en las tres variantes (en B con
`tone="dark"`):

| Encargo (`label`) |
|---|
| Council member 01 — portrait |
| Council member 02 — portrait |
| Council member 03 — portrait |
| Executive team — portrait |

**Cuatro no es el Council.** El deck no dice cuántos miembros tiene, y en la
página que argumenta que su transparencia es estructural, inventar un padrón
sería fabricar el registro que dice llevar. Cuatro es la cantidad que compone
en todos los breakpoints (4 · 2 · 1) y nada más.

> **Idioma: todo lo que se renderiza va en inglés.** Los `label`, los `spec`, los
> `caption` y las placas de los paneles, como el resto de la copy. Los
> comentarios del código y este README siguen en español, como en `chain/` y
> `quantum/`.
>
> El `label` de `MediaFrame` es una orden de trabajo y desaparece cuando llega el
> `src`, pero **hoy se ve**, así que va en el idioma de la página. El `caption`
> de `Figure` ni siquiera es placeholder: es contenido permanente que se imprime
> bajo el dibujo y no desaparece nunca.

> **Ninguna celda `MediaFrame` de esta carpeta lleva `data-reveal`.** Es una
> regla, no un olvido, y salió de un agujero real. `useScrollReveal` preesconde
> sus targets **al montar** (`.from()` con `immediateRender`), así que una celda
> reservada adentro de un reveal está invisible hasta que el stagger le llega — y
> mientras tanto lo que hay es un hueco del tamaño exacto del asset que falta. Es
> lo único que un placeholder no puede hacer: la celda existe para **declarar**
> la falta. Se pintan en reposo. El razonamiento largo está en `EcosystemMark`.

## Lo que se tocó en `foundationContent.ts`

Todo está comentado en el módulo:

1. **El último elemento de `body` ES el kicker**, tanto en `MISSION` como en
   `TRANSPARENCY`. Los layouts renderizan `body.slice(0, -1)` como prosa y
   `kicker` aparte.
2. **`COUNCIL.relation`** (`empowers` / `reports to`), los dos verbos sueltos
   para que el dibujo de C no hardcodee dos strings en inglés.
3. **`ECOSYSTEM_MARKS`** — doce entradas con `id`, `name` y `src` opcional.
4. **`COUNCIL_PORTRAITS`** — cuatro lugares reservados, con su encargo.
5. **`PLATES`** — las placas de los paneles de la variante B (nombre del
   aparato y estado, más la lectura encendida de la misión). Van al módulo por
   el mismo motivo que `COUNCIL.relation`: son texto que se ve, y la alternativa
   era una docena de strings en inglés escondidos en componentes. Lo que un
   layout puede **derivar** —los hechos legales, las etiquetas del Council, la
   cuenta de marcas— no está ahí.
