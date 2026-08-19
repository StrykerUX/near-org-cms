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
| **F** | `CutSlats` | 20svh | CSS + GSAP | Doce lamas al **ángulo real del isométrico** (30.79°) que se retiran escalonadas |
| **G** | `CutFold` | 20svh | CSS 3D | La página se **pliega** hacia atrás y detrás estaba la sección siguiente |
| **H** | `CutMosaic` | 20svh | Canvas 2D | La pantalla se **reemplaza por partes**, de abajo hacia arriba, en orden de ruido determinista |
| **I** | `CutHalftone` | 20svh | Canvas 2D | La página **se imprime**: trama de medio tono a 45°, los puntos engordan hasta abrirla entera |
| **J** | `CutMelt` | 20svh | Canvas 2D | La siguiente **inunda** desde el pie con un frente de dedos y bahías |
| **K** | `CutChapter` | 90svh | CSS + GSAP | El **rótulo del capítulo**. El corte como estructura, no como efecto |
| **L** | `CutSidestep` | 30svh | CSS + GSAP | La sección siguiente **entra por el lado**. Una vez por página o deja de significar |

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

- **Revelar, no tapar.** Cada variante pinta un VELO del color de la sección que
  sale y lo va borrando; debajo hay un piso del color de destino y, sobre el
  final, la sección siguiente de verdad. La primera versión pintaba negro encima
  y la sección llegaba después: eso dejaba una cola de ~24svh de pantalla negra
  sin nada, que era lo que hacía sentir larguísimo un corte de 60svh.
- **Los dos solapes.** `-mt-[100svh]` hacia atrás (el gesto ocurre encima de la
  sección anterior, no sobre un rectángulo vacío) y `lead` hacia adelante por
  `margin-bottom` negativo (la siguiente entra por debajo durante el gesto). El
  coste NETO es `travel − 100svh − lead`.
- **El presupuesto.** Decorativo (nada que leer) → 20svh netos. Con contenido
  (un rótulo, un dato) → hasta 90svh. `CutChapter` es el único que gasta el
  grande, y lo gasta en una pausa para que el rótulo se lea.
- **`settle`.** Con qué fracción del recorrido el dibujo está terminado. Ahora
  por defecto 1: con el modelo de revelar, cerrar antes ERA la cola muerta.
- **`draw(p)` cuelga del SCROLL, no de un ticker.** Ninguna de estas
  transiciones tiene vida propia, así que un ticker sería repintar lo mismo 60
  veces por segundo. Las de canvas se dibujan enteras dentro de `draw`, y un
  `ResizeObserver` las repinta con el último progreso.
- **Sin motion**, el corte se entrega HECHO.

Cambiar la transición de un corte es cambiar un componente.

## Tres trampas de CSS/layout que costaron encontrarse

1. **El piso tapaba el velo.** El piso es `absolute` y los velos de canvas eran
   cajas en flujo: en el orden de pintado de CSS, un elemento posicionado va por
   encima de TODO el contenido en flujo del mismo contexto, así que el color de
   destino se comía la transición desde el primer frame. Los `children` van
   envueltos en un contenedor posicionado para que mande el orden del DOM.
2. **El `z-index` de la sección que sale.** `OwnYourOwn` trae `z-[1]` propio y
   ganaba a la sección entrante en la zona de solape, aunque esta venga después
   en el DOM: por los agujeros del velo se veía la sección equivocada. Quien
   monte un corte tiene que darle a la de abajo un índice al menos igual.
3. **El velo opaco recortaba la sección de arriba.** Al pasar al modelo de
   revelar, el velo pasó a ser opaco desde el primer frame — y mientras el
   tramo ENTRA en pantalla, con el progreso todavía en 0 y el sticky sin
   pegarse, su caja tapa la parte baja del viewport. Como es del mismo color
   que el fondo, no se ve un panel: se ve la sección anterior cortada a media
   card por una línea horizontal. El escenario entero (velo + piso) aparece
   ahora en el primer 5% del gesto y no antes; el fundido es invisible (cream
   sobre cream) y lo que arregla es que antes de empezar no haya nada pintado.
4. **El coste cero se probó y no sirve.** Con `travel` 140 el neto es 0svh, pero
   el gesto queda en 40svh —tres golpes de rueda— y no da tiempo a verlo. El
   recorrido es `travel − 100svh`, así que alargarlo cuesta scroll uno a uno.

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
