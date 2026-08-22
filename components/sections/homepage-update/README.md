# `homepage-update` — secciones de `/prototype/homepage-update`

**Clon exacto de `home-ab9/`**, byte a byte salvo los imports y nombres
propios (`ab9` → `ab10`). Es el punto de partida de la rama
`tweaks/layout-and-sticky-changes`. `home-ab9/` no se tocó: sigue siendo el
rollback de `/prototype/homepage-ab9`.

Rige el contrato general de [`../README.md`](../README.md).

## Lo heredado

Todo lo que pinta esta carpeta hoy es igual a `home-ab9/` — ver
[`../home-ab9/README.md`](../home-ab9/README.md) para el historial completo
(ab9 sobre ab7 sobre ab6). No se re-documenta acá a propósito: dos copias del
mismo texto divergen en silencio.

## Lo que esta rama cambia

Todavía nada — se documenta acá a medida que los cambios de layout y sticky
entren.

## Lo que NO se forkeó

`TestimonialMarquee`, `LatestUpdates` y `UpdatesList` siguen viniendo del
catálogo compartido de `sections/`, y el header y el footer los monta
`app/prototype/layout.tsx`. Si alguna diverge, se copia a `homepage-update/` en ese
momento — no antes.
