# `home-exploration/` — laboratorio de transiciones de píxel

Alimenta **una sola ruta**: `/prototype/homepage-exploration`. No la importa
ninguna página real, y eso es el punto.

## Qué se está probando

Un bloque de transición de **píxel art grande** para intercalar antes y/o después
de secciones del sitio. Cuatro patrones, uno al lado del otro, sobre las mismas
20 × 5 celdas y el mismo recorrido de scroll — para que lo único que cambie entre
pruebas sea el patrón.

| # | Patrón | Qué decide el turno de cada píxel | Se lee como |
|---|---|---|---|
| 01 | `dissolve` | Ruido sembrado, sin dirección | Disolve clásico, granulado |
| 02 | `sweep` | Diagonal + jitter | Barrido con el borde escalonado |
| 03 | `stair` | Fracción de columna, cascada por velocidad | La escalera del sitio, pixelada |
| 04 | `scatter` | Peso vertical + ruido, con deriva de entrada | Píxeles que caen a su celda |
| 05 | `sweep` en `enter` + `exit` | — | La banda que se **abre y se cierra** |

La 05 no es un quinto patrón: es la demo de que dos transiciones pueden encerrar
una sección. Reusa `sweep` justamente para que no se confunda con una variante.

## Los archivos

| Archivo | Qué es |
|---|---|
| `pixelGrid.ts` | Módulo **puro**: la retícula, los cuatro relojes, la normalización de umbrales. Cero DOM |
| `PixelTransition.tsx` | El pintado y el enganche al scroll. `"use client"` |
| `SpecimenBand.tsx` | Sección de relleno, para ver cada transición **entre** dos secciones |

## Cómo se usa

```tsx
<section>…</section>
<PixelTransition pattern="sweep" from="var(--cream)" to="var(--ink)" />
<section>…</section>
```

`from` continúa el color de la sección de **arriba**, `to` anticipa el de
**abajo**. Si no coinciden con los colores vecinos, la juntura se ve como una
franja — es el único error de uso posible.

Para que una sección se lea como una banda que se abre y se cierra: la de arriba
en `enter`, la de abajo en `exit`, y **en la de `exit` los colores van al revés**
(el `from` es el color que viene, los píxeles son el que se retira). Si además
las dos son `stair`, van con `peak` **opuesto** o la banda parece inclinada en vez
de simétrica.

## Lo que NO tiene, y es deliberado

- **Sin idle.** `ZigguratDivider` deja las columnas respirando 4px en loop. Acá no:
  con 100 celdas, un idle son 100 tweens en repeat por bloque y cinco bloques en
  la página. Si un patrón gana y el idle se quiere, va con **un** tween sobre la
  retícula entera, no uno por celda.
- **Sin prop de retícula.** 20 × 5 fijo, mismo criterio que la altura única de
  `ZigguratDivider`: mientras fue una prop, dos pruebas quedaron con píxeles de
  tamaños distintos y dejaron de ser comparables — que es lo único que esta página
  existe para hacer.
- **Sin `pin: true`.** Ni acá ni en ningún lado del repo; el razonamiento largo
  está en `components/sections/README.md`.

## Camino de promoción

Esto está en `sections/` y no en `primitives/` a propósito: es el mismo recorrido
que hizo `StairTransition`, que salió del laboratorio de `/prototype/descent` y
recién después subió a primitivo.

Cuando un patrón gane:

1. Mover a `components/primitives/PixelTransition.tsx` **con solo el patrón que
   ganó** — los otros tres se van, el historial de git los guarda.
2. Mover `pixelGrid.ts` a `components/primitives/motion/`, al lado de
   `stairCascade.ts`.
3. Declarar en `components/sections/README.md` la convivencia con
   `StairTransition` y `ZigguratDivider`, o retirar el que quede redundante. Hoy
   ya son **dos** primitivos que resuelven la transición entre secciones; que
   queden tres sin decir cuál usa quién es cómo aparecieron las cuatro copias del
   footer.
4. Borrar esta carpeta y la ruta.

## Contrato de `components/sections/`

Se cumple igual que el resto de la carpeta (ver
[`../README.md`](../README.md)): sin `async`, sin fetch, sin `@/lib/*`, props
serializables, y tipografía **solo con tokens de la escala** — lo verifica
`pnpm lint:typography`.
