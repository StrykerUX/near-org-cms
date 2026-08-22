# `transition-labs/` — doce maneras de entregar al lector

La juntura entre el hero y el contenido de la página Protocol. **No son
separadores**: cada una introduce el contenido o hace de transición entre la
afirmación del hero y la explicación que sigue.

- `/prototype/protocol-transitions` — el índice, agrupado por altura.
- `/prototype/protocol-transitions/t1` … `t12` — cada una **entre el hero real y
  la sección real que sigue**, que es lo único que permite juzgar una transición.

## La altura es la decisión, no un detalle

Una banda de 28svh y una escena de siete pantallas no son la misma pieza a
distinta escala: son dos respuestas a **cuánto vale este momento de la página**.
Por eso el índice agrupa por altura y no por técnica — lo primero que hay que
decidir es cuánto recorrido merece la juntura.

### 25 – 30 svh · la juntura es un cambio de superficie

Las cifras se leen enteras y el lector no se detiene: pasa.

| | Idea | Riesgo |
|---|---|---|
| **T1 · Fold** | El papel se pliega. El crema del hero dobla en una franja con sombra dirigida; las cifras viven sobre el doblez | Es la más contenida. Elegirla es decir que la transición no debe llamar la atención |
| **T2 · Aperture** | Cifras a `--text-poster` en una banda más baja que ellas: se ve una franja de números gigantes, cortados, con parallax al scroll | Legibilidad. Cortar `<$0.002` pierde más silueta que cortar un dígito |
| **T3 · Seam** | El campo de shards de `/blockchain` recortado en banda. La juntura pasa a ser donde la red se parte | El mismo canvas a 26svh se lee como muestra y no como atmósfera |
| **T4 · Handoff** | La única que hace el puente con **lenguaje**: una línea que convierte la afirmación del hero en la pregunta que el contenido responde | Si la frase no funciona, no hay nada más |

### ≈ 50 svh · alcanza para una escena corta

| | Idea | Riesgo |
|---|---|---|
| **T5 · Fan** | Seis planos isométricos llegan **apilados** y se abren en abanico. Seis que salen de uno es lo que hace la red | La geometría isométrica no tolera rotación libre: pasados unos grados los ejes dejan de coincidir |
| **T6 · Split** | Las cifras partidas por la línea crema/blanco, con las mitades desalineadas. Al scrollear se alinean: la evidencia **cose** el corte | Durante buena parte del recorrido las cifras son ilegibles — y ese es el estado que más se ve |
| **T7 · Bridge** | Una pregunta a `--text-statement` en el único momento donde el lector ya sabe qué se afirma y no sabe cómo | La pregunta retórica es un recurso gastado; funciona sólo si es la que el lector tiene ahí |
| **T8 · Grid** | Las doce columnas que gobiernan la página se dibujan **una única vez** y se desvanecen hacia abajo | Mostrar el andamiaje puede leerse como recurso de portfolio |

### 85 – 100 svh · la transición se vuelve una sección

Sólo se paga si el equipo cree que estas seis cifras son lo más importante de la
página.

| | Idea | Riesgo |
|---|---|---|
| **T9 · Descent** | Siete pantallas pegadas: cada cifra sola a escala de cartel, y un séptimo tramo donde las seis se contraen a la fila que encabeza el contenido | Seis pantallas para seis datos es mucho recorrido |
| **T10 · Curtain** | Pantalla negra con el campo de shards; el negro se abre hacia el blanco por su borde inferior, ligado al scroll | El acto y el cierre ya son oscuros y son escasos **a propósito**. Un tercer negro les baja el rango |
| **T11 · Mural** | Una palabra del ancho de la página —`proven`, extraída del hero— con las cifras como su aparato. Una pausa, no un efecto | Es la más silenciosa. Existe para preguntar si acá hace falta que la transición haga algo |
| **T12 · Genesis** | La plancha isométrica del acto central **nace** acá: el plano vacío, diez shards en orden de profundidad, y el privado al final | Deja de ser un intervalo y pasa a ser el prólogo del acto |

## Decisiones que valen para todas

**El séptimo estado de T9 no es un detalle.** Sin él sería un carrusel que
termina con la sexta cifra llenando la pantalla, o sea dejando al lector arriba
en vez de entregándolo abajo. Es la diferencia entre una transición y una galería.

**T9 usa sticky de CSS y nunca `pin: true`.** El recorrido lo declara el alto del
track y ScrollTrigger sólo LEE. `data-scene` lo escribe únicamente el efecto: sin
JS, en móvil o con `prefers-reduced-motion`, las siete pantallas se convierten en
la fila de seis cifras — que es exactamente el séptimo estado.

**T3 y T10 importan `shardField` de la página publicada.** 215 líneas de canvas ya
medidas, con su `destroy`. La dependencia va del laboratorio hacia la página real,
que es la dirección aceptable; lo que el README padre prohíbe es la inversa.

**T12 dibuja su propia plancha en vez de usar `machineArt`.** Tiene que moverse
por partes y ese archivo entrega la pieza entera con sus capas conmutadas por
`data-beat`. Comparten lo único que no puede divergir: la proyección y las piezas
de `isoKit`. Si T12 gana, lo correcto no es unificar los dos archivos — es que
`machineArt` exponga un estado vacío y esta escena lo llene.

**El orden de aparición de T12 no es aleatorio.** Los shards entran de atrás
hacia adelante en el eje isométrico, así que la plancha se construye alejándose
del lector. Con un stagger `random` el mismo movimiento se lee como ruido: la
profundidad isométrica sólo se sostiene si el orden la respeta.

## La copy propuesta

`transitionContent.ts` — las frases de T4 y T7, y la palabra de T11. **No están
aprobadas.** Dos de esas variantes hacen el puente con lenguaje y sin una frase no
existen; la palabra de T11 no se inventó, se extrajo del hero (`Proven on mainnet
for five years`).

## Estado

Sin decidir y sin ver en navegador. Lo primero a mirar, **en las rutas en
contexto**:

- Si la transición **entrega** al lector o si se lee como una tercera sección.
- **T2** — si los valores se reconocen recortados.
- **T6** — si el desalineado se lee como decisión o como error de renderizado.
- **T9** — si seis pantallas se sostienen, y si el aterrizaje cierra.
- **T10** — el ritmo de la página entera, no esta pantalla.
- Todas — a 390, 1024 y 1920, y con `prefers-reduced-motion`.
