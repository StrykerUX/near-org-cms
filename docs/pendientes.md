# Pendientes

Hilos abiertos que no están bloqueando nada pero que se van a perder si no
quedan escritos. Los pendientes específicos de un tema viven en su propio doc
(`fonts.md`, `unicorn.md`); acá van los que no tienen casa y el índice de los
que sí.

---

## Borde de las cards de `LatestUpdates` — decisión abierta

**Estado:** diagnosticado, sin implementar. Falta elegir alcance.

Comparadas contra el prototipo, las cards no calzan. **La diferencia no es un
número, es estructural**, y por eso ajustar radios sueltos no va a cerrarla del
todo.

### Cómo está armado hoy

Dos rectángulos redondeados independientes, apilados:

```tsx
// components/sections/LatestUpdates.tsx
<article className="rounded-[1.75rem] p-2.5 bg-white">   // 28px, padding 10px
  <div className="absolute inset-2.5 rounded-[1.4rem]">  // el cover, 22.4px
  <div className="absolute left-2.5 top-2.5 w-[60%] rounded-tl-[1.4rem] rounded-br-[1.4rem] bg-white">
```

La "L" es un efecto secundario de que el bloque blanco tape al cover. Cada
esquina es una decisión suelta y **nada garantiza que el blanco mantenga ancho
constante ni que los radios se correspondan entre sí**.

En el prototipo el blanco es *una sola forma continua* que traza la L, y
**ningún cambio de dirección es un ángulo recto**. Eso es lo que le da el
aspecto de pieza única en lugar de dos cajas superpuestas.

### Los dos defectos medibles

1. **Radios no concéntricos.** Card 28px con padding 10px → el radio interno
   debería ser 28 − 10 = **18px**, y es 22.4px. Para que un marco de ancho
   constante se vea de ancho constante, el radio interno tiene que ser el
   externo menos el padding. Con 22.4 el cover se curva de más y el blanco se
   ve más grueso en las esquinas que en los tramos rectos.
2. **Al bloque blanco le faltan esquinas.** Solo declara `rounded-tl` y
   `rounded-br`. Donde su borde inferior se encuentra con el marco izquierdo de
   la card queda un **ángulo recto duro**; en el prototipo ese punto está
   redondeado.

### Los tres niveles de arreglo

| Nivel | Qué es | Costo | Límite |
|---|---|---|---|
| **1** | Corregir los números: radio interno a 18px y agregar el radio que falta | Tailwind puro, minutos | Siguen siendo dos formas apiladas: si cambia el padding hay que reajustar todo a mano otra vez |
| **2** | La L como **una sola** `clip-path: path()` o máscara SVG, con todos los radios derivados de una fuente | Necesita recalcular el path en resize (`ResizeObserver`, patrón que ya se usa en esta página) | — |
| **3** | Si el prototipo usa *corner smoothing* de Figma | Solo se resuelve dibujando la silueta | `border-radius` no puede reproducirlo: es un cuarto de elipse contra una superquádrica, y la diferencia se nota justo en radios grandes como estos |

El nivel 2 es el único que da ancho de blanco constante **por construcción**, y
el único que permite que la esquina cóncava del recodo tenga un radio propio,
distinto del convexo.

### Lo que falta saber

- **¿El prototipo tiene corner smoothing?** Mirando la captura parecen radios
  normales, pero es lo único que no se puede determinar desde una imagen. Se
  sabe abriendo el archivo de Figma.
- **¿Se ajustan también las proporciones?** En el prototipo el bloque blanco
  ocupa ~50% del ancho y su base cae a ~48% de la altura. El nuestro es
  `w-[60%]` con altura definida por el contenido, así que se mueve si cambia el
  copy. Fijarlo calza con la referencia pero rompe con títulos más largos —
  conviene revisarlo cuando haya copy real en vez de lorem ipsum.

---

## Otros hilos abiertos

**El blur de la reimplementación del flow field.** El efecto de referencia tiene
un gaussiano separable de 4 pases con downsample a 0.25 y 0.5. No se implementó
a propósito: ahí existe porque su fuente es un JPG con detalle real, y la base
procedural sale suave por construcción. Agregarlo significaría meter FBOs y
ping-pong en algo que hoy es un solo pase sin framebuffers. Revisable si al
compararlos en `/prototype/flow-compare` se nota que falta suavidad.

**Geist se precarga en todas las páginas públicas.** Son 68KB por página para
una fuente que solo usa el admin: `GeistSans.variable` está en el `<html>` del
layout raíz. Es más peso que cualquier face individual de Montreal. Moverlo al
layout de admin lo resolvería, pero puede romper el estilado del admin.

**El `--text-serif--optical-scale` con las condensed.** El 1.18 compensa la
x-height de Kepler contra Montreal, y la x-height no cambió al pasar a los
masters condensed — pero el ancho bajó 24%, y ese token compensa altura, no
ancho. Si los `<Accent>` embebidos en headings sans se leen subdimensionados, se
sube ese token y se mueven los 13 acentos a la vez. Falta mirarlo con calma en
el navegador.

---

## Pendientes que viven en su propio doc

- **[`fonts.md`](./fonts.md#pendientes)** — `--font-mono` cae en la fuente del
  sistema pese a usarse en ~25 lugares; `public/fonts/pp-neue-montreal*` publica
  ~9MB de los que el build usa 4 archivos; la familia no trae documento de
  licencia.
- **[`unicorn.md`](./unicorn.md)** — la escena depende de que los JSON estén
  commiteados (decisión tomada, con su contrapartida escrita); el hover por card
  que se perdió al reemplazar el material propio; el costo de tres runtimes con
  su rAF y los ~880KB del SDK.
- **[`fase0-divergencias-blog.md`](./fase0-divergencias-blog.md)** — las
  divergencias visuales entre las tres páginas de blog.
