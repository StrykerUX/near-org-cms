# `mural-labs/` — una sección, catorce maneras de entrar

Alimenta **tres rutas**: `/prototype/mural-lab` (el índice),
`/prototype/mural-lab/triggered` y `/prototype/mural-lab/scroll`. No la importa
ninguna página real.

## Qué es

La **Section #2** del diseño de Caro — Figma `NEARORG_CLAUDE_QUANTUM`, nodo
`184:476` dentro del frame `186:26` — con cuatro tratamientos de animación
sobre el mismo bloque.

Cuatro líneas. Cada una es un rótulo chico en sans y una palabra en serif que
cruza la sección de borde a borde, pintada con un degradado que va del negro al
verde. Las líneas alternan de qué lado arranca el verde, y esa alternancia es lo
que hace que el bloque se lea como una pieza y no como cuatro frases apiladas.

### La distinción que estructura el lab: quién lleva el tiempo

| | `trigger` (8) | `scroll` (6) |
|---|---|---|
| Qué decide el scroll | solo CUÁNDO empieza y cuándo se deshace | el progreso, frame a frame |
| Duraciones y curvas | propias, siempre iguales | no existen: la curva es el gesto |
| Scrollear rápido | no acelera nada | pasa en un borrón |
| Reversa | escrita (`enterExit`, a 1.7×) | gratis, por construcción |

Mezcladas en una lista se terminarían comparando cosas que no compiten. Y hay
un motivo técnico que empuja igual: catorce bloques en una página son ~28
viewports y hasta tres contextos WebGL vivos, y Chrome corta alrededor de
dieciséis por página descartando los más viejos sin avisar.

### Las ocho de `trigger`

| # | Variante | Técnica | La apuesta |
|---|---|---|---|
| 01 | `Ramp` | `background-position` | El verde barre la palabra. Se anima el encuadre del degradado, no el color: por eso el encendido tiene dirección |
| 02 | `Rise` | máscaras por línea | La tipografía entra; el color ya estaba. Contracara exacta de 01 |
| 03 | `Split` | SplitText, vertical | Cada letra recibe el color que le toca al aterrizar |
| 04 | `Cascade` | entrada lateral alterna | Cada línea llega desde el borde OPUESTO al que se alinea; el cruce en el medio es la figura |
| 05 | `Typeset` | `scaleX` desde el borde | Las palabras llegan condensadas y se abren — guiño a la divergencia de la fuente (ver abajo) |
| 06 | `Bands` | `clip-path` por franjas | El texto no se mueve un píxel: solo cambia cuánto se ve |
| 07 | `Kern` | SplitText, horizontal | Las letras arrancan apiladas en el centro y se desdoblan |
| 08 | `Flare` | **WebGL2** | Un frente de calor con distorsión del propio trazo |

### Las seis de `scroll`

| # | Variante | Técnica | La apuesta |
|---|---|---|---|
| 09 | `Scrub` | scrub simple | Las líneas derivan a velocidades distintas |
| 10 | `Weave` | desplazamiento cruzado | Existe UNA posición de scroll donde las cuatro caen donde el artboard las puso |
| 11 | `Zoom` | `position: sticky` + scrub | La única que se gana su propio tramo de scroll |
| 12 | `Ripple` | **WebGL2** | La amplitud sale de la VELOCIDAD, no de la posición |
| 13 | `Peel` | `rotateX` con perspectiva | Las cuatro pasan por su posición frontal en momentos distintos |
| 14 | `Melt` | **WebGL2** | Cada columna cae una distancia distinta; pico en el centro del recorrido |

Once de las catorce montan `MuralBlock`, que es el diseño **sin una sola línea
de animación**. Si cada variante escribiera su marcado, las diferencias de
layout se leerían como diferencias de animación.

Las tres de WebGL montan `MuralGlScene`, que es el mismo marcado con una
envoltura `relative` por palabra —para colgarle el canvas— y la palabra en
`opacity-0`. Se separó en vez de sumarle una prop a `MuralBlock` porque once
variantes no necesitan nada de eso, y una prop que solo tres usan convierte al
componente compartido en un condicional. Lo que se comparte de verdad
—contenido, degradado, tokens— sigue viniendo de `muralContent`, así que los
dos no pueden divergir en lo que importa.

## Las tres de WebGL

Un solo shader con tres modos (`gl/muralShader.ts`), no tres programas: los tres
leen la MISMA textura —la palabra ya pintada con su degradado— y solo difieren
en cómo desplazan la coordenada antes de muestrearla. Compartir el programa
mantiene idénticos el muestreo, la mezcla con el fondo y el tratamiento del
alfa, que es justo lo que no debe variar entre variantes que se comparan.

**El texto sigue en el DOM**, debajo del canvas y en `opacity: 0`: conserva el
árbol de accesibilidad, el flujo (la caja la mide la tipografía real, no el
canvas) y el layout fluido en `cqw`. El precio, entero: **ese texto ya no es
texto en pantalla** — no se selecciona, no se traduce y no lo encuentra el
buscador del navegador. Es el mismo trato que `hero-alt` documenta para sus
versiones 04 y 05, y por eso solo tres de las catorce lo pagan.

**El degradado no se re-implementa en GLSL.** El canvas 2D pinta el texto con el
mismo `linear-gradient` del DOM, parseando sus paradas desde el string de
`rampGradient`. Un degradado escrito dos veces sería una segunda fuente para el
color y divergiría en cuanto alguien tocara una parada.

**El `letter-spacing` va aparte, y no es opcional.** El canvas 2D ignora el
tracking que viene dentro del shorthand de `font`, y `--text-mural` lleva
-0.04em: sin pasarlo por `ctx.letterSpacing`, la palabra se rasteriza ~4% más
ancha que su caja y el canvas la corta por el borde. El síntoma exacto fue "THE
AGENT ECONOMY" empezando en "HE".

**El alfa se muestrea PREMULTIPLICADO, y la fórmula de mezcla depende de eso.**
El canvas 2D entrega el texto con el color ya multiplicado por su alfa, y la
subida pide conservarlo así (`UNPACK_PREMULTIPLY_ALPHA_WEBGL`); la mezcla
correcta es entonces una suma sobre el fondo atenuado —
`bg * (1 - a) + ink` — y nunca un `mix` con el color dividido.

Dividir por el alfa para "recuperar" el color puro, que es lo que hacía la
primera versión, produce un **halo claro** alrededor de cada letra: en el borde
antialiaseado el alfa vale una fracción, y dividir por esa fracción dispara el
color hacia el blanco. Se veía en las cuatro líneas y era más notorio cuanto más
oscura la tinta. Por lo mismo, el `alphaMul` de cada modo se aplica al color y
al alfa a la vez: escalar solo el alfa rompe la premultiplicación y trae el
mismo halo por la puerta de atrás.

Sin WebGL2 el canvas no se monta y la palabra del DOM se queda visible: se
pierde el efecto, no el contenido.


## Lo que se transcribió literal y lo que se adaptó

**Literal**: la copy, el orden, la alineación de cada palabra, y los
porcentajes de las paradas del degradado. Son las cuatro cosas que definen el
diseño.

**Adaptado**, y por qué:

| Del artboard | Acá | Motivo |
|---|---|---|
| `#D9D9D9` de fondo | `bg-bar` | El token ya existía en el DS con exactamente ese valor |
| 153px de cuerpo | token `--text-mural` | Un tamaño a mano no pasa `lint:typography`, y el rol no existía en la escala — ver el comentario del token en `globals.css` |
| coordenadas absolutas | flex | El ancho es fluido y el tamaño es un `clamp`; las coordenadas dejan de calzar apenas cambia el viewport. Se conserva la RELACIÓN: rótulo contra un borde, palabra ocupando el resto |
| tracking -0.04/-0.05em según línea | -0.04em en todas | El DS prohíbe parchear tracking sobre un token, y a este cuerpo la diferencia es de un píxel |
| Kepler **Semicondensed** | Kepler Display | El proyecto no tiene ese master (ver abajo) |

### El corte de la fuente, que es la divergencia real

El diseño está compuesto en **Kepler Std Medium Semicondensed Display** y este
proyecto solo tiene los masters de ancho normal — Display y Subhead. La misma
palabra al mismo cuerpo mide acá **~16% más**.

A la proporción del artboard (153px sobre 1280px de contenido = `11.95cqw`),
"THE AGENT ECONOMY" y "QUANTUM-RESISTANT" se pasaban ~245px de su caja y el
`overflow-hidden` de la máscara las cortaba a media palabra. El token quedó en
`10.2cqw`: la misma proporción corregida por el ancho de la fuente que sí
tenemos. **Lo que se conserva es lo que el diseño busca** —la palabra cruzando
la sección de borde a borde— y no el número. Si algún día entra el master
Semicondensed, vuelve a 11.95.

### `cqw` y no `vw`

El tamaño se mide contra el ancho del **bloque**, no del viewport, y el
`@container` va en el div interior y **no** en el `Container`: éste incluye su
propio `px-[60px]`, así que medir contra él da un `cqw` mayor que el ancho de
contenido real — un 7% más grande, que es justo lo que hacía que "ECONOMY"
quedara en "ECONO".

## Dos cosas que se rompen fácil

**El recorte no puede ir en el elemento del degradado.** `background-clip: text`
usa el fondo del elemento; ponerle `overflow: hidden` encima apaga el degradado
en algunos motores. Por eso cada palabra va envuelta en `[data-mural-mask]`, que
es lo único que recorta — y es lo que `02 · Rise` necesita.

**El degradado vive en el contenedor, no en las letras.** Es lo que permite que
`03 · Split` funcione sin calcular un color por carácter: SplitText envuelve las
letras en nodos sin fondo propio, así que cada una sigue mostrando el tramo de
la imagen que le cae encima por su posición.

## Los verdes no son tokens del DS

`#7ed461` y `#0ca329` viven en `muralContent.ts` y no en la paleta. Los verdes
del DS —`--cta-mint` (#8bf29c), `--green-ink` (#00a86b)— son más fríos y
saturados que estos dos, que tiran a oliva; sustituirlos cambiaría el diseño que
se está evaluando. Meter dos colores globales por una sección de prototipo lo
contamina. Si la sección se aprueba, ahí entran con nombre propio.
