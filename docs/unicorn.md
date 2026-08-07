# Unicorn Studio

Los covers de `components/sections/LatestUpdates.tsx` y el panel derecho de
`/prototype/flow-compare` los pinta una escena hecha en
[Unicorn Studio](https://unicorn.studio).

## Lo primero: sin los JSON no se ve

Las escenas viven en `public/unicorn-scene*.json` y están **gitignoradas**. El
export de Unicorn contiene sus shaders compilados, y su licencia prohíbe
redistribuirlos:

```
Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial
License. Unauthorized copying, redistribution, or use in competing products is
prohibited.
```

Consecuencia práctica, y hay que tenerla presente: **en un clon del repo o en un
deploy esos covers caen al gradiente CSS**, porque los JSON no están. Funciona
en la máquina de quien tenga el export.

### Cómo hacer que funcione fuera de esta máquina

Publicando el proyecto en Unicorn Studio y usando su embed id en vez del
archivo. Ahí el SDK trae la escena de sus servidores en runtime y no hace falta
que nada de ellos esté en el repo:

```tsx
<UnicornScene projectId="ABC123" … />   // en vez de jsonFilePath
```

En `LatestUpdates.tsx` es cambiar el campo `scene` de cada post. Es el único
camino limpio para producción.

## Poner las escenas en su lugar

```bash
# 1. Exportá la escena desde Unicorn Studio y dejala acá:
#    public/unicorn-scene.json
# 2. Generá las variantes de color:
node scripts/unicorn-scenes.mjs
```

## Por qué hace falta una escena por color

La escena **no expone ninguna variable**: sus únicos uniforms son
`uArtboardResolution` y `uAspectRatio`. Todo el color sale del JPG de la capa
`image`, que apunta al CDN de Unicorn. No hay forma de recolorearla desde
afuera.

Por eso `scripts/unicorn-scenes.mjs` genera una copia por variante cambiando
únicamente el `src` de esa capa. No toca ni un shader.

Hoy existen dos imágenes en su CDN para este proyecto — `gradient-1.jpg`
(verde, promedio rgb 141,195,155) y `gradient-2.jpg` (azul, 155,199,230);
`gradient-3` en adelante da 404. Por eso las cards 1 y 3 comparten el verde,
igual que compartían paleta cuando el material era procedural.

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
