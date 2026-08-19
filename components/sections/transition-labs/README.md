# `transition-labs/` — doce maneras de pasar del cream al negro

Alimenta **trece rutas**: `/prototype/transition-labs` (el índice) y una por
transición. No las importa ninguna página real, y eso es el punto.

## Qué se está probando

El corte entre **«Own Your Own»** (cream) y **«The NEAR Stack»** (ink). Hoy es
un cambio de `background-color` y nada más: la sección de arriba termina, la de
abajo empieza, y entre las dos no pasa nada.

## Segunda tanda (F–L) — las vigentes

| | Variante | Coste neto | Técnica | La apuesta |
|---|---|---|---|---|
| **F** | `CutSlats` | 60svh | CSS + GSAP | Doce lamas al **ángulo real del isométrico** (30.79°). La geometría del corte es la del objeto al que lleva |
| **G** | `CutFold` | 70svh | CSS 3D | La página se **pliega** hacia atrás y detrás estaba el negro |
| **H** | `CutMosaic` | 60svh | Canvas 2D | La pantalla no se cubre: se **reemplaza por partes**, en orden de ruido determinista |
| **I** | `CutHalftone` | 80svh | Canvas 2D | La página **se imprime**: trama de medio tono a 45°, los puntos engordan hasta tocarse |
| **J** | `CutMelt` | 80svh | Canvas 2D | La tinta **inunda** desde abajo con un frente de dedos y bahías. El único donde el negro tiene materia |
| **K** | `CutChapter` | 90svh | CSS + GSAP | El **rótulo del capítulo** en medio del cambio de fondo. El corte como estructura, no como efecto |
| **L** | `CutSidestep` | 100svh | CSS + GSAP | La sección siguiente **entra por el lado**. Una vez por página o deja de significar |

## Primera tanda (A–E) — descartadas

Se conservan a la vista: un laboratorio que borra lo que no funcionó obliga a
volver a proponerlo. El diagnóstico, corto: **cuatro de las cinco son la misma
idea** —algo negro llega y cubre la pantalla—, ninguna lleva contenido y ninguna
conecta las dos secciones. `TransWipe`, `TransCounter`, `TransAscii`,
`TransLattice`, `TransColumn`.

## `SectionCut` — la pieza que comparten todas las nuevas

La primera tanda repetía en cinco archivos el mismo andamiaje: el mismo `-mt`,
el mismo sticky, el mismo ScrollTrigger, la misma degradación. `SectionCut` se
queda con todo eso y cada variante solo aporta el **dibujo**:

```tsx
<SectionCut travel="160svh" settle={0.85} draw={draw}>…</SectionCut>
```

- **El solape.** `-mt-[100svh]` + `z-[2]`: el tramo empieza una pantalla ANTES
  de donde terminaría la sección anterior, así que el gesto ocurre encima de
  ella y no sobre un rectángulo vacío. Por eso el coste de la tabla es NETO.
- **`settle`.** Con qué fracción del recorrido el dibujo está terminado. Nunca
  1: el último tramo queda ya en el estado final, para llegar a la sección
  siguiente con el corte hecho y no viéndolo cerrar en el último píxel.
- **`draw(p)` cuelga del SCROLL, no de un ticker.** Ninguna de estas
  transiciones tiene vida propia, así que un ticker sería repintar lo mismo 60
  veces por segundo. Las de canvas se dibujan enteras dentro de `draw`, y un
  `ResizeObserver` las repinta con el último progreso.
- **Sin motion**, el corte se entrega HECHO.

Cambiar la transición de un corte es cambiar un componente.

## Dos trampas de GSAP que costaron encontrarse

Salieron en la primera tanda y valen para cualquier escena nueva:

1. **`transform` de GSAP contra `transform` de Tailwind.** Al escribir `scale`,
   GSAP reescribe el `transform` ENTERO con lo que él conoce: un
   `-translate-x-1/2` puesto por clase desaparece en el primer frame. Y si el
   centrado se pasa a `xPercent/yPercent`, un `gsap.set` posterior deja
   **huérfano** al `quickSetter` creado antes — sus escrituras van a una caché
   que ya no es la del elemento. La salida: centrar por `margin` negativo y
   dejar el `transform` en manos de una sola cosa.
2. **`quickSetter("scale")` no escribe nada** en esta versión, mientras que
   `quickSetter("scaleY")` sí. No se investigó por qué: es una escritura por
   frame y `gsap.set` la hace bien.

## Una tercera, del ruido

`CutMelt` sampleaba el hash directamente por columna y el frente salía con
dientes de 3px — una forma de onda de audio, no un líquido. Un hash da valores
independientes para posiciones vecinas; el ruido de verdad **interpola** entre
los nodos de una retícula. Está resuelto ahí con un `vnoise` de tres octavas, y
es el mismo error que espera a cualquiera que use el helper `noise` de
`SectionCut` como si fuera ruido continuo.

## Cada transición en su ruta, y con las secciones DE VERDAD

Cada ruta monta `OwnYourOwn` y el tríptico del stack completos, importados. Una
transición entre dos rectángulos de color es una transición entre dos
rectángulos de color: lo que hay que juzgar es cómo se siente llegar con las
cards todavía en la retina y salir con la columna ya en pantalla.

## Solo desktop

Como el resto de los labs: por debajo de `lg` o con `prefers-reduced-motion`,
cada transición cae a su estado final estático. Lo que el gesto tenía para decir
es el cambio de fondo, y ese se entrega sin mover un píxel.
