# `components/sections/lab/`

El laboratorio del **descenso del hero**: doce rutas bajo `/prototype/descent` que
prueban formas distintas de resolver el mismo problema, más los componentes que
comparten.

No es una familia de secciones de marketing como `home-v2/` o `quantum/`. Es un
sandbox: nada de acá se importa desde `app/(site)`, todas las rutas son `noindex` con
`nav: false` y `sitemap: false`, y ninguna toca producción. Cuando un approach gane, lo
que se lleva a `home-v2/` es el mecanismo, no estos archivos.

## Por qué existe

El objetivo es que la escalera de `QuantumBars` empiece a destiempo, para que la barra
gris plana del arranque no exista. Se intentó dos veces directamente sobre
`homepage-v2` y se rompió algo distinto cada vez: primero el statement quedó ilegible
sobre el gris, después se abrió una franja de página en la juntura.

El problema no era el efecto, era iterar sobre la geometría más frágil del repo
(`marginTop: -u*1.5 - 2px`, el core a `u*1.5`) con un ciclo de feedback de minutos y sin
forma de ver el defecto en el momento en que aparece. El precedente del repo para esto
es `/prototype/flow-compare`, que ya era un sandbox A/B con la misma justificación.

## El hallazgo que ordena todo lo demás

Los approaches `a`–`e` fallaron por la MISMA razón, y no se vio hasta el quinto: todos
animan el TAMAÑO de las piezas. Animar el tamaño obliga a pasar por estados en los que
la silueta todavía no existe — el bloque uniforme es la pieza más grande y la que cubre
la juntura, así que crece primero, y mientras crece **es un rectángulo**.

La banda gris plana nunca fue un problema de timing: es el estado intermedio inevitable
de escalar un rectángulo. Todo lo que vino después parte de ahí, y por eso las rutas se
dividen en dos generaciones.

## Las rutas

### Referencias

| Ruta | Qué es |
|---|---|
| `real` | `HeroVideo` + `QuantumBars` de producción, sin modificar, con el HUD encima. El "antes". |
| `lab` | La maqueta con el ritmo lineal de hoy (póster estático, sin vídeo). La base contra la que se comparan los approaches. |

### Primera generación — animan el tamaño (todas fallan, quedan como registro)

| Ruta | Qué probaba |
|---|---|
| `a` | El hero se retiene con un transform de compensación; el bloque gris queda exento de la curva. |
| `b` | Hero y escalera en un mismo track sticky, para que la juntura no pueda separarse. |
| `c` | El hero no se traslada nunca: el ritmo lo da solo su contenido interno. Riesgo geométrico cero. |
| `d` | Escalera por turnos de los bordes al centro, con la imagen del hero estirada por debajo. |
| `e` | Igual que `d`, pero con el hero pegado mientras la figura se dibuja. |
| `f` | La figura nace completa y NO se anima: el scroll la descubre. Se implementa quitando código. |
| `g` | La figura nace completa y cada columna sube a su sitio en turnos. |

`f` y `g` ya parten de la figura completa, así que no tienen el defecto estructural —
pero se quedaron cortos por otras razones, anotadas en sus docblocks.

### Segunda generación — parten de fusionar las tres piezas en una

Las tres piezas por columna de `QuantumBars` (escalón, bloque uniforme, escalón
espejado) nunca fueron la figura: como `offset + height = 1.5` siempre, su unión es
exactamente un bloque de `u·offset` a `bottom: u·offset`. Eran una descomposición para
poder animarlas por separado, y esa descomposición era el problema. Ver `stairOffsets()`
en [`labStairGeometry.ts`](./labStairGeometry.ts).

| Ruta | Qué es | Estado |
|---|---|---|
| `zocalo` | Misma reja y geometría que producción; los escalones arrancan todos en 0 con la misma ease, así la silueta es proporcionada en todo instante. No elimina el zócalo, lo vuelve subordinado. | Vivo |
| `talla` | La reja está completa y quieta; lo que se anima es el recorte escalonado de la imagen del hero, que se retira para descubrirla. | Vivo |
| `paneles` | Un panel gris por columna con `scaleY`, pintando por ENCIMA del hero como en producción. | Vivo — el más avanzado |

## Los dos mecanismos de pintado, y por qué `paneles` va ganando

`talla` y `paneles` producen la misma figura de dos formas opuestas, y la comparación
es el punto:

- **`talla`** apila el hero en `z-[3]` y le recorta la imagen con un `clip-path`. El gris
  está quieto. Trae una invariante fuerte: el borde de la imagen nunca sube por encima
  de donde empieza el gris de esa columna, así que la franja crema de la juntura se
  vuelve imposible por construcción.
- **`paneles`** deja las barras en `z-[2]` como producción y escala paneles grises por
  encima del hero.

`paneles` retira cuatro problemas que `talla` no puede:

1. **Las capas.** El gris tapa la copy del hero al subir, como en producción. En `talla`
   el hero tiene que ir encima para que su recorte funcione, y ahí la copy solo puede
   terminar cortada o montada sobre el gris. No hay tercera opción dentro de ese
   apilado: es un defecto estructural del mecanismo, no un bug.
2. **La invariante del crema**, que deja de hacer falta: el gris ES el borde.
3. **El paint.** Un `clip-path` animado no va al compositor; siete `scaleY` sí.
4. **El acoplamiento** de números entre el hero y las barras.

Lo que `paneles` NO retira: el excedente de vídeo (`drop`), que sigue costando su ~12%
de reencuadre.

## Los dos relojes

Un "reloj" es una función pura que devuelve la `y` en pantalla del borde superior de
cada uno de los cuatro anillos (las 7 columnas son 4 anillos espejados). Los dos viven
en [`labStairGeometry.ts`](./labStairGeometry.ts) y se eligen con `?flow=`:

| Reloj | Quién lo usa | Movimiento |
|---|---|---|
| `carveEdges` | `talla` siempre; `paneles` con `?flow=carve` | Los cuatro anillos a la misma velocidad, escalonados solo por el arranque, y un `Math.max(0, y)` que los detiene contra el borde. |
| `cascadeEdges` | `paneles` por defecto | Velocidad de entrada graduada de afuera hacia adentro; los interiores aceleran a mitad de camino; aterrizaje amortiguado. |

`carveEdges` está compartido a propósito entre las dos rutas: si estuviera duplicado,
cualquier diferencia visible entre ellas podría ser del mecanismo de pintado o de una
deriva entre dos copias, y no habría forma de saber cuál.

`cascadeEdges` nació porque el final de `carveEdges` es un choque: cada anillo llega al
borde a ~2.5× la velocidad del scroll y para en un frame. Eso no lo arregla una curva —
la curva reparte el recorrido en el tiempo, pero el frenazo lo produce el clamp, que es
discontinuo en velocidad por definición. Las tres garantías de `cascadeEdges` (cobertura
total al final, monotonía, y `g' > 0`) están demostradas en su docblock, no calibradas.

## El HUD

`?debug` en cualquier ruta enciende [`DescentDebug`](./DescentDebug.tsx). Sus campos y
—más importante— el error de método que motivó cada uno están documentados en el
docblock de cabecera de ese archivo. Resumen:

| Campo | Qué mide | Criterio |
|---|---|---|
| `gap` | Píxeles entre el fondo de la imagen del hero y el borde superior del gris | 0 o negativo. Positivo = franja crema visible |
| `stair` / `flat` | Alto de la zona con relieve contra el de la zona de ancho completo | `stair > flat` o se lee como barra |
| `edges` | Las cuatro `y` en crudo, del exterior al centro | Es el único que describe el PERFIL: los saltos y el aterrizaje |

Dos avisos para no perseguir fantasmas: con `cascadeEdges` la alarma `BARRA` se enciende
por diseño en el último tercio (al converger, la figura *es* una barra, y solo tiene
sentido leerla antes de `p ≈ 0.6`); y `gap` mide la juntura hero↔gris, que ese approach
no toca.

## Los archivos

**Compuestos por ruta** (uno por approach, es lo que monta el `page.tsx`):
`DescentStage` (`a`, `b`, `c`, `lab`), `DescentStairs` (`d`–`g`), `DescentReal`,
`DescentZocalo`, `DescentTalla`, `DescentPaneles`.

**Piezas compartidas:**

| Archivo | Qué es |
|---|---|
| [`labStairGeometry.ts`](./labStairGeometry.ts) | La geometría de la escalera y los dos relojes. El módulo central. |
| [`LabHeroCarve.tsx`](./LabHeroCarve.tsx) | El hero con recorte opcional (`carve`). Lo comparten `talla` y `paneles` a propósito. |
| [`LabBarsStatic.tsx`](./LabBarsStatic.tsx) | La reja quieta del tallado. |
| [`LabBarsPanels.tsx`](./LabBarsPanels.tsx) | Los siete paneles con `scaleY`. Es donde se elige el reloj. |
| [`LabBarsProportional.tsx`](./LabBarsProportional.tsx) | Las barras del approach del zócalo. |
| [`LabStatement.tsx`](./LabStatement.tsx) | El bloque de texto que sigue a la juntura. |
| [`labTextSweep.ts`](./labTextSweep.ts) | El barrido de color del statement. |
| [`descentCurves.ts`](./descentCurves.ts) | Las curvas de la primera generación, con sus medidas. |
| [`DescentDebug.tsx`](./DescentDebug.tsx) | El HUD. |

## Ganó `paneles`, y ya está en producción

El mecanismo se portó a `home-v2/`: la forma de la escalera y el reloj de la cascada
viven en [`home-v2/stairGeometry.ts`](../home-v2/stairGeometry.ts) y los consume
`QuantumBars`. Este módulo los reexporta para que las rutas del lab sigan funcionando
sin cambiar de import.

Dos consecuencias que conviene tener presentes al usar el laboratorio ahora:

- **`real` y `zocalo` ya no muestran "el antes".** Importan `HeroVideo` y `QuantumBars`
  de producción, así que desde el puerto muestran el después. El mecanismo viejo —tres
  piezas por columna, velocidad única, frenazo contra el borde— solo existe en el
  historial de git. Está anotado como cola en
  [`docs/pendientes.md`](../../../docs/pendientes.md).
- **`paneles` sigue usando `drop = 0.5`** por su defecto heredado de `CARVE`, mientras
  que producción usa `0`. Es a propósito: `/talla` necesita el excedente de verdad y las
  dos rutas comparten hero. Para ver lo que hace producción, `?drop=0`.

Lo que queda vivo acá es la comparación entre mecanismos de PINTADO (`talla` contra
`paneles`), que sigue siendo la pregunta abierta si alguna vez hay que revisar el coste
de paint del `clip-path`.
