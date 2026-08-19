# `transition-labs/` — cinco maneras de pasar del cream al negro

Alimenta **seis rutas**: `/prototype/transition-labs` (el índice) y una por
transición. No las importa ninguna página real, y eso es el punto.

## Qué se está probando

El corte entre **«Own Your Own»** (cream) y **«The NEAR Stack»** (ink). Hoy es
un cambio de `background-color` y nada más: la sección de arriba termina, la de
abajo empieza, y entre las dos no pasa nada.

Las cinco variantes resuelven ese mismo salto. Lo único que cambia es el
mecanismo y lo que cuesta.

| | Variante | Coste neto | Técnica | La apuesta |
|---|---|---|---|---|
| **A** | `TransWipe` | 60svh | CSS + GSAP | El negro SUBE y tapa. El gesto del takeover del footer, entre secciones |
| **B** | `TransCounter` | 80svh | medir el DOM + transform | El agujero de la «O» se traga la página: el negro sale de DENTRO de la tipografía |
| **C** | `TransAscii` | 100svh | WebGL2, el shader de EX3 | La página se vuelve texto: el campo se densifica y la paleta rueda a negro |
| **D** | `TransLattice` | 60svh | Canvas 2D, el motor de hero-alt 05 | ~2600 puntos deletrean «The NEAR Stack» cuando el fondo termina de irse a negro |
| **E** | `TransColumn` | 80svh | el arte del stack | La columna sube y se trae el negro con ella |

## La regla que las cinco comparten: SOLAPAR, no sumar

Cada transición es una `<section>` con `-mt-[100svh]` y `z-[2]`. El tramo
empieza una pantalla **antes** de donde terminaría la sección anterior, así que
el gesto ocurre encima de ella —todavía con las cards en pantalla— y no sobre un
rectángulo vacío.

Es la corrección más importante que salió de mirarlas: la primera versión no
solapaba, y el resultado era una pantalla entera de cream con nada, el gesto
arrancando después, y una lectura que no era «transición» sino «pausa y después
efecto». De ahí también que el coste de la tabla sea NETO — el recorrido menos
la pantalla que solapa.

Las que pintan encima (B, C, D) traen además un velo que despeja lo de arriba en
el primer 10-15% del gesto: sin él hay dos titulares en pantalla a la vez, o una
nube de puntos sobre las cards que se lee como suciedad.

## Lo que se importa y no se copia

- `LatticeCanvas` de `hero-alt` (D) — muestrea el propio texto para sacar la
  silueta; copiarlo para cambiarle dos líneas serían dos motores divergiendo.
- El shader `ex/shaders/exAscii` (C) — **sin tocar una línea**. Lo único que
  cambia es cómo se alimentan sus uniformes: allá el bulbo lo mueve el cursor y
  la paleta es fija, acá el bulbo está clavado en el centro y lo abre el scroll.
- `ColumnGreen` del arte generado de ab7 (E).

## Dos trampas de GSAP que costaron encontrarse

Las dos aparecieron en B y las dos valen para cualquier escena nueva:

1. **`transform` de GSAP contra `transform` de Tailwind.** Al escribir `scale`,
   GSAP reescribe el `transform` ENTERO con lo que él conoce: un
   `-translate-x-1/2` puesto por clase desaparece en el primer frame. Y si el
   centrado se pasa a `xPercent/yPercent`, un `gsap.set` posterior (el de cada
   refresh) deja **huérfano** al `quickSetter` creado antes — sus escrituras van
   a una caché de transform que ya no es la del elemento, y la escala se queda
   en 1 para siempre. La salida: centrar por `margin` negativo y dejar el
   `transform` entero en manos de una sola cosa.
2. **`quickSetter("scale")` no escribe nada** en esta versión, mientras que
   `quickSetter("scaleY")` —el del telón de A— sí funciona. No se investigó por
   qué: es una escritura por frame, y `gsap.set` la hace bien.

## Cada transición en su ruta, y con las secciones DE VERDAD

Cada ruta monta `OwnYourOwn` y el tríptico del stack completos, importados. Una
transición entre dos rectángulos de color es una transición entre dos
rectángulos de color: lo que hay que juzgar es cómo se siente llegar con las
cards todavía en la retina y salir con la columna ya en pantalla.

El precio es que cada ruta es pesada, y por eso hay una por variante y no las
cinco apiladas — mismo razonamiento que en `stack-labs`.

## Solo desktop

Como el resto de los labs: por debajo de `lg` o con `prefers-reduced-motion`,
cada transición cae a su estado final estático (el fondo negro, sin viaje). Es
la degradación correcta: lo que el gesto tenía para decir es el cambio de fondo,
y ese se entrega sin mover un píxel.
