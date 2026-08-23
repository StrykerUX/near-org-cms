# `combo-labs/` — qué va DEBAJO de cada hero

Índice en `/prototype/protocol-combo`; cada combo en
`/prototype/protocol-combo/h4`, `/h2`, `/c`, `/e` y `/g`.

## El hueco que llena

Cinco heroes sobrevivieron a los laboratorios: **H4 · Cut** (el de la página),
**H2 · Count** y los tres de las aperturas —**C · Spectrum**, **E · Field** y
**G · Field claro**—. Ninguno eligió lo que va debajo. Las secciones 2 y 3 —las
seis cifras y «Built for AI scale»— venían heredadas de la variante que trajo el
hero, no decididas:

- H4 y H2 arrastran `a/ScaleClaim` (franja de seis columnas + tres bullets).
- C trae seis columnas con barra y tres columnas numeradas.
- E y G comparten `opening-labs/ScaleSection`, idéntica en las dos.

O sea: dos estructuras para cinco heroes, y una de ellas repetida. Este
laboratorio propone **una por hero**, y ninguna repite la estructura de otra.

## Las cinco

| | Hero | Estructura | Tesis | Riesgo |
|---|---|---|---|---|
| **h4** | H4 · Cut | Nueve filas de un registro, 01 a 09 | Las cifras y las propiedades son el MISMO documento: una sola columna de índices que no se interrumpe. Cada cifra tiene el ancho entero y le entran label, unidad y nota | Nueve filas ocupan casi dos pantallas |
| **h2** | H2 · Count | **Fondo de rotación de claves** + columna pegada | La única que no repite las cifras: el hero ya las dio contando, acá se DESARROLLAN. El título queda pegado mientras las respuestas pasan | Funde las secciones 2 y 3 en un bloque; si el sticky se siente largo, no hay dónde cortarlo |
| **c** | C · Spectrum | Seis escalones en diagonal | El trío de C es vertical tres pantallas seguidas. La escalera cruza la dirección del campo: la superficie es el fondo, no el molde | Impone un orden de lectura, y obliga a decidir qué cifra va primera |
| **e** | E · Field | Seis franjas a escala de cartel | E resolvía «el momento en que el texto del fondo se vuelve texto de verdad» a cuerpo de nota — el tamaño del ruido. Acá cada cifra ocupa una franja y las propiedades bajan a mono | Invierte la jerarquía; si las tres propiedades se sienten abandonadas, falló |
| **g** | G · Field claro | Un tablero de celdas asimétricas | La única sin secciones 2 y 3 separadas. Va con G porque su riesgo es que el crema se vea plano, y una rejilla de filetes es lo contrario de plano sin usar textura | Ver todo junto también es no jerarquizar nada |

## Cada ruta trae la página ENTERA

No las tres primeras pantallas. El riesgo de estas propuestas no está en cómo se
ven: está en qué le hacen al **acto** —el bloque oscuro de seis pantallas con la
pieza pegada, que es el centro de la página—. Tres secciones que le comen el
rango o le roban el contraste lo dejan sin efecto, y eso no se ve en una captura
de la apertura: se ve al llegar.

Por lo mismo va el resto (developers, ecosistema, apéndice, cierre). El ritmo
claro · claro · OSCURO · claro · claro · claro · OSCURO es justamente lo que
estas propuestas pueden romper.

## Los heroes se importan, no se copian

Contra la regla general del repo —«si una versión gana se COPIA»— y a propósito.
Esa regla protege a una **página real** de moverse cuando alguien toca un
laboratorio. Acá los cinco heroes siguen sin decidirse y las rutas de origen
siguen vivas: dos copias del mismo hero divergirían mientras se compara, que es
el único momento en que divergir es fatal.

Lo que existe sólo acá son las cinco propuestas de secciones 2 y 3.

**Consecuencia práctica:** los heroes de C, E y G tuvieron que salir de dentro de
`OpeningC/E/G`, donde estaban embebidos. Viven en `opening-labs/HeroSpectrum.tsx`,
`HeroField.tsx` y `HeroFieldLight.tsx`, y sus tríos originales los consumen desde
ahí — o sea que las rutas de `/prototype/protocol-opening` y las de acá muestran
literalmente el mismo hero.

## `KeyRotationField` — el primer fondo con un mecanismo adentro

Va en **h2** y sólo en h2. Una retícula densa de caracteres, muy tenue. Cada
tantos segundos un frente cruza el plano **en una sola pasada** y todos los
glifos cambian de alfabeto a su paso. Ni una celda se mueve: cambia lo que dice,
no dónde está.

Entre el ruido hay dos clases de palabras, y la diferencia entre ellas es el
argumento entero:

- **Los esquemas de firma** —ED25519, SECP256K1, ML-DSA, FIPS-204— rotan con el
  campo.
- **Las cuentas** —`alice.near`, `agent.near`, `vault.near`— **no cambian
  nunca**. El frente les pasa por encima y quedan idénticas.

Sale de la sección 8, textual: *«NEAR accounts are decoupled from cryptography,
so upgrading to quantum-safe keys takes a single key rotation. NEAR supports
FIPS-204 (ML-DSA), a NIST-approved post-quantum signing scheme.»* Las tres cosas
que dice esa frase están en el dibujo: la criptografía cambia, la cuenta no, y
pasa en una sola pasada.

**Sin licencias.** Rotar es una operación repetible, así que cada pasada estrena
un alfabeto nuevo en vez de alternar entre dos estados. El fondo no tiene que
des-hacer lo que acaba de hacer para volver a mostrarlo.

### El puntero

Dos gestos, y los dos dicen lo mismo que el párrafo:

- **Mover** revuelve el ruido bajo el cursor y lo enciende en verde. Las cuentas
  que caen dentro del halo **no se inmutan** — el argumento otra vez, ahora
  provocado por el lector en vez de mostrado.
- **Hacer clic** dispara la rotación **desde ese punto**, en frente radial. La
  pasada automática es diagonal; la que dispara el lector sale de su mano.

Se revuelve sólo el ruido: romper un esquema o una cuenta destruiría lo único
estable que tiene el campo.

Los eventos se escuchan en la **sección**, no en el canvas: el canvas vive en
`z-0` con `pointer-events-none` bajo el titular y el marcador, así que
escuchando en él el puntero sólo respondería en los huecos entre bloques. Un clic
sobre un enlace o un botón no dispara nada.

### Los dos verdes

`--near-green-accent` (#00dc8d) no llega a 3:1 sobre crema; `--green-ink`
(#00a86b) sí. La división no es estética: **el filo del frente va en el verde de
marca** —un destello de un cuarto de segundo, no texto que haya que leer— y todo
lo que tiene que leerse (las cuentas, la cola del frente, el halo) va en
`--green-ink`.

Es canvas 2D. Comparte técnica con `opening-labs/GlyphField` —celda estable,
alfa bajo, texto en canvas y no en el DOM— pero no lo reusa: aquél tiene una onda
que enciende glifos fijos, éste tiene un evento que los reescribe, y metérselo a
`GlyphField` se lo metería también a las aperturas E y G, que no lo piden.

### Lo que se descartó antes en este mismo hero

`ShardSurface`: un plano que se partía solo en diez shards más el privado,
latiendo al block time (600 ms) y a la finalidad (1.2 s). El concepto estaba bien
anclado —sección 5 y dos de las seis cifras— y **se veía mal**: sobre crema, las
regiones con relleno y el tramado del shard privado quedaban sucios detrás de un
titular y de un marcador de cifras.

La lección, que vale para el próximo fondo de este hero: **acá el fondo tiene que
ser tipografía, no formas.** La pantalla ya tiene dos elementos fuertes
peleándose el espacio.

Está en el historial de git.

## Dos técnicas que conviene mirar antes de copiarlas

**El tablero de `BoardScale` dibuja sus filetes con el `gap`,** no con bordes:
`gap-px` sobre un fondo del color de filete, y cada celda pinta su crema encima.
Las líneas son el fondo asomando por las juntas. Se hace así porque en una
retícula irregular los bordes se duplican donde dos celdas se tocan y faltan
donde una linda con el borde del tablero.

La condición que impone: **cada fila tiene que sumar doce columnas exactas**, o
el hueco se ve como un bloque del color del filete. Las cuatro filas están
verificadas en el archivo: (5+7) · (5+3+4) · (3+4+5) · (3+4+5).

**El sticky de `SustainedScale` es CSS,** nunca `pin: true`. El pin de
ScrollTrigger mueve el elemento a un contenedor propio, recalcula alturas y pelea
con Lenis; sticky no toca el layout y funciona con el JS apagado. Su `top` sale
de `--site-header-block` más aire, porque el header es fijo.

## Las clases de retícula son mapas literales

`STEP`, `SIDE`, `STAT_CELL`, `POINT_CELL`, `PLACE`: todas arrays de strings
completos. **Nunca un template string.** Tailwind v4 no detecta clases
construidas en tiempo de ejecución y las purga del CSS — el layout se rompe sólo
en producción, donde el purge corre de verdad.

## Estado

Sin ver en navegador, sin decidir. Lo primero a mirar:

- **El paso al acto en las cinco.** Es el motivo de que la página vaya entera.
- **h4** — si dos pantallas de registro cansan antes de llegar al acto.
- **h2, el fondo** — tres cosas: si la pasada se lee como un **evento** o como
  un parpadeo; si las cuentas se distinguen del ruido (si no, el argumento se
  pierde y queda textura); y si el halo del puntero distrae mientras se lee el
  titular. El halo hierve mientras el cursor esté dentro, aunque esté quieto — si
  molesta, la salida es decaerlo cuando no hay movimiento, no bajarle el alfa.
- **h2** — el largo del sticky, y si las seis lecturas + tres propiedades en una
  sola columna se leen como un bloque o como una lista interminable.
- **e** — si las tres propiedades en mono se leen como condiciones técnicas o
  como un pie de página. Es la apuesta entera de esa variante.
- **g** — el tablero a 1024px, donde las columnas se aprietan pero todavía no
  colapsa a la pila de móvil.
- Todas — a 390, 1024 y 1920, y con `prefers-reduced-motion`.
