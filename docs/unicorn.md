# Unicorn Studio

> **Nota (2026-08-21).** Este documento menciona rutas de `/prototype/` que ya
> no existen: se archivaron en la limpieza que dejó `homepage-update` como única
> línea viva. El registro se conserva tal cual porque describe mediciones y
> decisiones de su momento. Para ver qué era cada ruta y cómo recuperarla:
> `docs/labs-archivados.md`.

Los covers de `components/sections/LatestUpdates.tsx` los pintan escenas hechas
en [Unicorn Studio](https://unicorn.studio). Son tres, una por color.

## Dónde viven las escenas

```
assets/unicorn/near-gradient-1_scene.json           ← los exports tal cual salen
assets/unicorn/near-gradient-blue_scene.json          de Unicorn Studio
assets/unicorn/near-gradient-red-orange_scene.json

public/unicorn-scene-green.json    ← generadas por scripts/unicorn-scenes.mjs
public/unicorn-scene-blue.json
public/unicorn-scene-red.json
public/unicorn/gradient-1.jpg      ← las imágenes, self-hosteadas
public/unicorn/gradient-2.jpg
public/unicorn/gradient-3_v2.jpg
```

Los exports viven fuera de `public/` porque son la fuente que el script consume,
no algo que el sitio sirva: lo que se publica es solo lo generado.

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
# 1. Exportá la escena desde Unicorn Studio y dejala en assets/unicorn/,
#    con el nombre que espera SCENES en el script.
# 2. Reapuntá las imágenes y escribí las escenas a public/:
node scripts/unicorn-scenes.mjs
```

El script falla con un mensaje concreto si le falta un export o el JPG que ese
export referencia; si no, el cover se cae al gradiente CSS sin decir por qué.

## Por qué hace falta una escena por color

Por dos motivos, y el segundo es el que sorprende.

**La escena no expone ninguna variable.** Sus únicos uniforms son
`uArtboardResolution` y `uAspectRatio`. Todo el color sale del JPG de la capa
`image`. No hay forma de recolorearla desde afuera.

**Y los tres exports no son la misma escena con distinta imagen.** Cada uno
trae sus propios shaders compilados:

| | verde | azul | rojo |
|---|---|---|---|
| `spread` del flow field | 0.24 | 0.22 | 0.20 |
| mezcla final del flow field | 0.50 | 0.55 | 0.55 |
| aberración cromática en `blinds` | **sí** | no | no |

Esa última fila se ve: el fleco de color en los bordes de las franjas aparece
solo en la card verde. Por eso el script no deriva variantes de un export base
—aplanaría los tres ajustes en el del elegido— y se limita a reapuntar el `src`
de la capa `image` de cada export. No toca ni un shader.

Las tres imágenes del proyecto son `gradient-1.jpg` (verde, promedio rgb
141,195,155), `gradient-2.jpg` (azul, 155,199,230) y `gradient-3_v2.jpg`
(rojo/naranja). La tercera durante un tiempo no existió —`gradient-3.jpg` daba
404 en su CDN— y por eso las cards 1 y 3 compartieron el verde hasta que
apareció bajo el nombre con sufijo `_v2`.

## El SDK

Viene dentro de `unicornstudio-react`, un wrapper **de la comunidad** (MIT) que
empaqueta el runtime propietario de Unicorn. No es oficial; lo aclara su propio
README.

Es la única vía que funciona con estas escenas: el CDN suelto de Unicorn
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
| 5 | `blinds` | Divide en ~8 franjas y rota ~90°. En la escena verde además aplica **aberración cromática** en 8 pasos — el fleco de color en los bordes de las franjas. La azul y la roja no la tienen. |

## El costo

Cada `<UnicornScene>` monta su propio runtime con su rAF. Tres covers son tres
escenas de 5 capas con un blur de 4 pases y sus framebuffers — bastante más que
el material propio que reemplazaron, que era un solo pase sin FBOs enganchado al
`gsap.ticker` compartido.

Por eso van con `lazyLoad`: sin eso se pagan las tres antes de que la sección
esté cerca del viewport.

El bundle del SDK son ~880KB, y lo carga toda página que monte `LatestUpdates`
— hoy `/prototype/homepage-v2`.

## Lo que se perdió al cambiar

El material propio que reemplazó (`components/primitives/motion/flowField.ts`,
borrado junto con la página de comparación que lo mostraba) tenía un hover **por
card**: el puntero abría la amplitud del flujo solo en la card de abajo,
tweeneado con GSAP. La escena de Unicorn tiene su propio tracking de mouse,
global y sin gancho de intensidad, así que ese comportamiento no sobrevive tal
cual. El material vive en el historial de git si alguna vez se quiere volver.
