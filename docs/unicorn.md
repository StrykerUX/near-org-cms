# Unicorn Studio

Los covers de `components/sections/LatestUpdates.tsx` y el panel derecho de
`/prototype/flow-compare` los pinta una escena hecha en
[Unicorn Studio](https://unicorn.studio).

## Dónde vive la escena

```
public/unicorn-scene.json          ← el export tal cual sale de Unicorn Studio
public/unicorn-scene-green.json    ← generadas por scripts/unicorn-scenes.mjs
public/unicorn-scene-blue.json
public/unicorn/gradient-1.jpg      ← las imágenes, self-hosteadas
public/unicorn/gradient-2.jpg
```

**Todo eso está commiteado**, y es una decisión deliberada de quien tiene la
licencia. El export contiene los shaders compilados de Unicorn con este header:

```
Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial
License. Unauthorized copying, redistribution, or use in competing products is
prohibited.
```

Este repo es público, así que quedan a la vista. La contrapartida de la decisión
es que el efecto **funciona en el deploy**: sin los JSON en el repo, Railway
construye sin ellos y los covers caen al gradiente CSS.

La alternativa que no requiere nada de eso es publicar el proyecto en Unicorn
Studio y usar su embed id en vez del archivo — ahí el SDK trae la escena de sus
servidores en runtime:

```tsx
<UnicornScene projectId="ABC123" … />   // en vez de jsonFilePath
```

En `LatestUpdates.tsx` es cambiar el campo `scene` de cada post. A cambio, la
home pasa a depender de su CDN en cada carga.

### Las imágenes se sirven desde acá, no desde su CDN

`scripts/unicorn-scenes.mjs` reapunta el `src` de la capa `image` a
`/unicorn/*.jpg`. Son assets del proyecto —los subió quien diseñó la escena—, y
servirlos nosotros saca un tercero del camino crítico de render de la home. Si
el CDN de Unicorn está lento o caído, con el `src` original el cover se quedaba
en el gradiente CSS.

## Poner las escenas en su lugar

```bash
# 1. Exportá la escena desde Unicorn Studio y dejala acá:
#    public/unicorn-scene.json
# 2. Generá las variantes de color y reapuntá las imágenes:
node scripts/unicorn-scenes.mjs
```

## Por qué hace falta una escena por color

La escena **no expone ninguna variable**: sus únicos uniforms son
`uArtboardResolution` y `uAspectRatio`. Todo el color sale del JPG de la capa
`image`, que apunta al CDN de Unicorn. No hay forma de recolorearla desde
afuera.

Por eso `scripts/unicorn-scenes.mjs` genera una copia por variante cambiando
únicamente el `src` de esa capa. No toca ni un shader.

Hay dos imágenes para este proyecto — `gradient-1.jpg` (verde, promedio rgb
141,195,155) y `gradient-2.jpg` (azul, 155,199,230); `gradient-3` en adelante
daba 404 en su CDN. Por eso las cards 1 y 3 comparten el verde, igual que
compartían paleta cuando el material era procedural.

## El SDK

Viene dentro de `unicornstudio-react`, un wrapper **de la comunidad** (MIT) que
empaqueta el runtime propietario de Unicorn. No es oficial; lo aclara su propio
README.

Es la única vía que funciona con esta escena: el CDN suelto de Unicorn
(`cdn.unicorn.studio/vX/unicornStudio.umd.js`) llega hasta **v1.4.2**, y este
export es formato **2.2.8**. La versión del paquete de npm coincide exactamente
con la del JSON.

## Qué hace la escena, capa por capa

| # | Capa | Qué aporta |
|---|---|---|
| 1 | `gradient` | Devuelve negro. Capa vacía. |
| 2 | `image` | El JPG, en cover sobre el artboard. **De acá sale todo el color.** |
| 3 | `flowField` | 8 iteraciones que empujan el UV según ruido Perlin 3D. Sigue al mouse: su parámetro de radio está en 1.0, lo que anula la componente de distancia y deja al puntero actuando solo como origen del muestreo. |
| 4 | `blur` | Gaussiano separable de 36 taps, **4 pases** con downsample a 0.25 y 0.5, más debanding con dither PCG en el último. |
| 5 | `blinds` | Divide en ~8 franjas, rota ~90° y aplica **aberración cromática** en 8 pasos. Es de donde sale el fleco de color en los bordes. |

## El costo

Cada `<UnicornScene>` monta su propio runtime con su rAF. Tres covers son tres
escenas de 5 capas con un blur de 4 pases y sus framebuffers — bastante más que
el material propio que reemplazaron, que era un solo pase sin FBOs enganchado al
`gsap.ticker` compartido.

Por eso van con `lazyLoad`: sin eso se pagan las tres antes de que la sección
esté cerca del viewport.

El bundle del SDK son ~880KB. En `/prototype/flow-compare` quedaba aislado en su
propio chunk; desde que `LatestUpdates` lo usa, también lo carga
`/prototype/homepage`.

## Lo que se perdió al cambiar

El material propio (`components/primitives/motion/flowField.ts`, todavía en uso
en la página de comparación) tenía un hover **por card**: el puntero abría la
amplitud del flujo solo en la card de abajo, tweeneado con GSAP. La escena de
Unicorn tiene su propio tracking de mouse, global y sin gancho de intensidad, así
que ese comportamiento no sobrevive tal cual.
