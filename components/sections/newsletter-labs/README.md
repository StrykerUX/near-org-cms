# `newsletter-labs/` — once maneras de pedir un correo

Alimenta **una sola ruta**: `/prototype/newsletter-labs`. No la importa ninguna
página real, y eso es el punto.

## Qué se está probando

La banda «NEAR belongs to you» de la homepage (`home-ab7/BelongsNewsletter`).
Las once llevan **exactamente la misma copy** —wordmark, el claim, el párrafo de
siempre y el campo con su "email address" / "sign up"— y no se añadió nada: ni
frecuencia, ni prueba social, ni línea de privacidad. Lo único que cambia es la
composición, el fondo y la forma del campo.

## Las escaleras quedaron FUERA de las ocho

`BelongsNewsletter` abre y cierra con dos `StairTransition`. En este lab
**ninguna las lleva**: fue una decisión explícita al abrirlo.

Lo que las reemplaza no es "nada" — cada variante resuelve la juntura a su
manera: un corte recto de color (01, 02, 05, 07), un corte VERTICAL en medio de
la banda (03), o el propio color a sangre haciendo de borde (06, 08).

Al elegir una hay que decidir si las escaleras vuelven. Son de lo poco que hoy
hace memorable a esta sección, y su ausencia se nota más en las variantes de
fondo stone que en las de color.

## Las ocho

| | Variante | Fondo | Campo |
|---|---|---|---|
| 01 | `Belongs01Marquee` | stone | píldora ancha — el claim a escala de cartel, rozando los dos bordes |
| 02 | `Belongs02Rule` | stone | **línea de escritura** — se escribe sobre una regla, como en papel |
| 03 | `Belongs03Split` | verde profundo + stone | píldora, en la mitad clara — la banda partida por un corte vertical |
| 04 | `Belongs04Inline` | stone | **dentro de la frase** — «near belongs to ▁▁▁» |
| 05 | `Belongs05Halo` | materia · luz | píldora grande — la composición de HOY con una luz que respira detrás |
| 06 | `Belongs06Grain` | materia · grano + lima | **bloque sólido** con el botón adosado |
| 07 | `Belongs07Column` | materia · retícula | compacto, a la izquierda, con dos tercios vacíos |
| 08 | `Belongs08Field` | verde de marca, a sangre | píldora blanca grande |

La **05** es la comparación más directa contra la sección actual: misma
composición, otra escala, fondo con materia. Si esa no se siente mejor, el
problema de la banda no era el fondo.

## Y tres con movimiento

Las ocho de arriba son composición pura: entran y ya están. Estas tres agregan
un gesto, que es la única variable nueva.

| | Variante | Qué se mueve |
|---|---|---|
| 09 | `Belongs09Teletype` | **El párrafo se escribe**, con un cursor que lo guía, y el campo entra cuando el cursor se apaga. Nadie dice dónde seguir escribiendo: lo dice el orden |
| 10 | `Belongs10Ascii` | **El wordmark está dibujado con caracteres** y llega hecho ruido: cada bloque parpadea por unos glifos y se estabiliza en la palabra |
| 11 | `Belongs11Curtain` | **Un telón de lima barre** la sección de abajo arriba, sale por el borde superior, y el bloque sube detrás desde su máscara |

La 11 es la única que trata la juntura como un GESTO: las otras diez resuelven
el corte contra las vecinas con una decisión de color, y esta con movimiento —
que es lo que hacían las escaleras, con otro vocabulario.

### Detalles de las tres

**09 — el cursor se COLOCA, no se anima.** Animar su `x` de un extremo al otro
falla en cuanto el párrafo hace wrap: cruzaría el hueco entre el final de una
línea y el principio de la siguiente por el aire. Se mide la caja de cada
carácter y la timeline lleva un `set` por carácter, con `offsetLeft/Top`
(relativos al párrafo, así no hay que restar scroll). Mismo mecanismo que
`hero-alt/ShatterBars`.

**09 — `words,chars` y no solo `chars`.** Partiendo únicamente en caracteres,
cada glifo queda en su propio nodo y el navegador corta la línea entre dos
cualesquiera: el párrafo salía partido a mitad de palabra («milesto / nes»). Con
las palabras como nodo intermedio el wrap vuelve a respetar sus límites y el
escalonado sigue yendo por carácter.

**10 — el ASCII es un dibujo, no un titular.** Va en `text-caption-mono` fijo y
no en una escala fluida: el dibujo depende de que cada carácter ocupe lo mismo, y
una escala fluida cambia el interlineado antes que el avance — las filas se
separan y la palabra se abre. Las cinco filas miden exactamente 30 caracteres; si
una difiere, la palabra se tuerce.

**10 — accesibilidad.** El `<pre>` es `aria-hidden` y al lado va un `sr-only`
con la palabra: el heading dice «NEAR belongs to you» igual que en las otras
diez. Un lector de pantalla leyendo cinco filas de bloques sería ruido puro.

**11 — el telón arranca DEBAJO de la sección (`top-full`), no dentro con un
`translate-y-full`.** En Tailwind v4 esa clase compila a la propiedad
`translate`, NO a `transform`; GSAP anima `yPercent` por `transform`, así que
las dos se suman y el telón terminaba su recorrido «fuera por arriba» desplazado
otro +100% por la clase — o sea justo encima del contenido, cubriéndolo para
siempre. Es el mismo bug que `home-ab7/NearStackV2` documenta en sus capas.
Además así degrada bien: sin JS el telón se queda debajo y no tapa nada.

## Cuatro variantes pierden el brillo del campo, y hay que contarlo

`primitives/ShineField` —la píldora con el brillo WebGL recortado a la silueta
de los glifos— necesita una estructura muy concreta: el `<input>` con el texto
transparente y un overlay de un `<span>` por carácter, que es lo que el shader
mascara. **Esa estructura ES la píldora.**

Las cuatro variantes que piden otra forma (02 línea, 04 dentro de la frase, 06 y
10 bloque) montan campos propios de `NewsletterFields.tsx` y **no llevan el
glyph-shine**. Es una pérdida real, no un detalle de implementación: si una de
esas cuatro gana, o se reescribe el shine para su forma, o la sección se queda
sin él.

Las siete restantes montan el `ShineField` de producción, no una copia.

## Dos cosas que se descubrieron mirándolo

**El verde de marca es CLARO.** La primera pasada de la 08 puso el titular y el
párrafo en crema —el reflejo de "fondo de color ⇒ texto claro"— y el resultado
no llegaba ni a 2:1. Va todo en tinta, wordmark incluido.

**El grano es un SVG inline** (`feTurbulence`), no una imagen: cero bytes de
red, cualquier tamaño sin pixelarse, y el mismo grano en retina que en 1×. La
opacidad es la perilla — por encima de 0.18 empieza a ensuciar el texto en vez
de dar textura al fondo.

## Las once en una ruta, y no una por variante

Al revés que `stack-labs`, que reparte sus cinco en cinco rutas porque cada una
monta ~287KB de paths y un track sticky. Acá la sección más pesada es la que
anima un radial, y solo cinco montan el `ShineField` (que sí abre un contexto
WebGL2 por instancia — cinco está holgadamente por debajo del límite del
navegador).

Y hay una razón positiva: estas ocho se diferencian sobre todo por el FONDO, y
el fondo se juzga comparando. Cambiar de página entre una y otra obliga a
recordar el color en vez de verlo.

## Cada una con sus dos vecinas

`NewsletterLabFrame` envuelve cada variante entre una banda blanca (la sección
de pruebas, que va encima en la homepage) y una crema (customer stories, que va
debajo). Buena parte de lo que se decide acá es el corte contra esos dos
vecinos — sobre todo ahora que las escaleras no están.

Las bandas miden 28svh y no una pantalla: lo justo para que el ojo registre el
cambio de color. Con una pantalla por vecina, recorrer las once serían veintidós
pantallas de relleno.

## Si una gana

Se lleva a `home-ab7/BelongsNewsletter`, y ahí hay que decidir:

1. **Si las escaleras vuelven**, y cómo conviven con el fondo elegido — salvo
   que gane la 11, que ya trae su propia respuesta a la juntura.
2. **El campo**: si la ganadora es 02, 04, 06 o 10, qué pasa con el glyph-shine.
3. **El móvil**, que este lab no diseñó — las once se resuelven en desktop y por
   debajo caen a su flujo vertical, que es correcto pero no está pensado. En la
   10 hay que mirarlo de cerca: una rejilla de 30 caracteres a 375px no entra.
