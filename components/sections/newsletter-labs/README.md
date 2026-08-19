# `newsletter-labs/` — ocho maneras de pedir un correo

Alimenta **una sola ruta**: `/prototype/newsletter-labs`. No la importa ninguna
página real, y eso es el punto.

## Qué se está probando

La banda «NEAR belongs to you» de la homepage (`home-ab7/BelongsNewsletter`).
Las ocho llevan **exactamente la misma copy** —wordmark, el claim, el párrafo de
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

## Tres variantes pierden el brillo del campo, y hay que contarlo

`primitives/ShineField` —la píldora con el brillo WebGL recortado a la silueta
de los glifos— necesita una estructura muy concreta: el `<input>` con el texto
transparente y un overlay de un `<span>` por carácter, que es lo que el shader
mascara. **Esa estructura ES la píldora.**

Las tres variantes que piden otra forma (02 línea, 04 dentro de la frase, 06
bloque) montan campos propios de `NewsletterFields.tsx` y **no llevan el
glyph-shine**. Es una pérdida real, no un detalle de implementación: si una de
esas tres gana, o se reescribe el shine para su forma, o la sección se queda sin
él.

Las cinco restantes montan el `ShineField` de producción, no una copia.

## Dos cosas que se descubrieron mirándolo

**El verde de marca es CLARO.** La primera pasada de la 08 puso el titular y el
párrafo en crema —el reflejo de "fondo de color ⇒ texto claro"— y el resultado
no llegaba ni a 2:1. Va todo en tinta, wordmark incluido.

**El grano es un SVG inline** (`feTurbulence`), no una imagen: cero bytes de
red, cualquier tamaño sin pixelarse, y el mismo grano en retina que en 1×. La
opacidad es la perilla — por encima de 0.18 empieza a ensuciar el texto en vez
de dar textura al fondo.

## Las ocho en una ruta, y no una por variante

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
cambio de color. Con una pantalla por vecina, recorrer las ocho serían dieciséis
pantallas de relleno.

## Si una gana

Se lleva a `home-ab7/BelongsNewsletter`, y ahí hay que decidir:

1. **Si las escaleras vuelven**, y cómo conviven con el fondo elegido.
2. **El campo**: si la ganadora es 02, 04 o 06, qué pasa con el glyph-shine.
3. **El móvil**, que este lab no diseñó — las ocho se resuelven en desktop y por
   debajo caen a su flujo vertical, que es correcto pero no está pensado.
