# `homepage-fold` — el hero que se pliega

Montado en `/prototype/homepage-b`. Rige el contrato general de
[`../README.md`](../README.md).

## Qué es

El paisaje del shader —hasta ahora el fondo a sangre del hero— se comprime hasta
caber en el mark de NEAR, que ocupa el lugar de la palabra «your»:

```
Own your world.   →   Own ⬡ world.
```

Tres tiempos, todos scrubbed y reversibles: la **compresión** (el mundo se
retira hacia el objeto y deja ver el crema), el **flip** (la palabra gira y se
va), y la **recomposición** (el hueco se contrae y la frase se cierra sobre él).

**No hay scroll-jack.** El hero de la línea viva congela el scroll ~2.2s para
contar su secuencia una sola vez; este gesto se maneja con el dedo y se puede
volver a mirar subiendo.

## Cómo está calibrado

| Ruta | Qué contiene al paisaje | Intercambio | Recorrido |
|---|---|---|---|
| `/prototype/homepage-b` | **Una caja** (`contain: "frame"`). El encuadre se cierra a un cuadrado de esquinas blandas con el follaje dentro, y el mark aparece encima en crema sólido. | `fade` — la palabra se desvanece, el objeto aparece. Nada rota. | 75svh, con `autoplay` |

`HeroFold` conserva las otras dos opciones aunque nadie las monte:
`contain: "mask"` recorta el follaje contra la silueta del mark —la N calada,
el crema por el hueco, sin caja— y `exchange: "flip"` hace girar la palabra
sobre su eje con un contra-giro del objeto. Las montaba `/prototype/homepage-f`,
borrada el 2026-08-23.

El intercambio y el recorrido van de la mano, y es lo que descartó a `flip`
acá: en un recorrido corto una rotación no llega a leerse como tal y solo se
percibe como un parpadeo. `mask` necesitaba los 130svh de `f` para sostenerse.

## La obertura del stack (`StackOverture`)

El título de «The NEAR Stack» llega **antes** que la sección, sobre crema, y el
negro lo alcanza ahí. Reemplaza a la cortina de bajada (`InkCurtain`), que
resolvía el corte haciendo subir un panel negro sobre una pantalla vacía —
correcto, pero el gesto no decía nada.

Rima con el hero por dos lados: el título **se queda quieto mientras el mundo
cambia debajo** (en el hero es el paisaje el que se retira y deja ver el crema),
y después **cambia de rol** — nace grande y solo en el centro, y termina siendo
el encabezado de la escena, igual que `your` dejó de ser una palabra para
volverse un objeto.

El texto no cambia de color: **se invierte por donde el negro ya pasó**. Son dos
copias del título superpuestas, la de arriba en crema y dentro del panel negro;
como el panel se recorta, su copia se recorta con él y la inversión sale sola en
el borde del recorte.

| Ruta | `mode` | Cómo llega el negro |
|---|---|---|
| `/prototype/homepage-b` | `bleed` | **Sube desde abajo** hasta llenar la pantalla. El filo cruza el título una vez y de lado a lado, que es lo que la inversión necesita para leerse. Misma dirección que el takeover del footer. |

Los otros dos modos siguen en el componente sin consumidor, los dos porque su
ruta se borró el 2026-08-23:

- `brush` — el negro lo traía el objeto del hero: el cuadro de `Own ⬡ world.`
  bajaba cruzando la pantalla y lo dejaba detrás, como un pincel. Ataba las dos
  secciones de forma literal. Lo montaba `/prototype/homepage-h`.
- `cut` — sin transición. El fondo se da vuelta en un frame, seco, como pasar la
  página de una revista. Va contra todo lo demás, que es suave. Lo montaba
  `/prototype/homepage-i`.

**El título que se encoge es el que se queda.** La obertura se solapa un
viewport con la sección siguiente (`-mb-[100svh]` + `z-10`), así que el relevo
ocurre en un solo frame y en la misma coordenada: la escena se pega exactamente
cuando la obertura se despega, y de ahí en más pinta encima. `StackAnchors`
recibe `headEntrance={false}` porque su encabezado ya está puesto donde la
obertura dejó el suyo — su entrada propia haría parpadear el relevo.

Tres detalles del solape que no son opcionales y que costaron un pase cada uno:
el `z-10` (sin él la escena se ve POR ENCIMA de la obertura durante todo el
tramo), el fondo declarado en el hijo pegado y no en la sección (si no, la
sección sigue pintando y tapa la escena aunque su contenido esté apagado), y el
apagado del hijo al despegarse (si no, su panel negro liso tapa el encabezado
del stack durante toda la salida).

## Qué se monta y qué no

De la cintura para abajo, las dos son **exactamente `homepage-shared`**: montan sus
secciones sin copiarlas, porque no son otra línea de diseño sino la misma con
otro hero. Un ajuste en cualquiera de esas secciones se ve en las tres, que es
lo que se quiere mientras se comparan entre sí.

Lo propio son dos archivos, y van juntos por necesidad:

- **`HeroFold.tsx`** — el pliegue. La prop `contain` decide la variante.
- **`StatementPlain.tsx`** — la frase del agent economy como sección normal.
  Hace falta porque `HeroFold` no dispara ninguna secuencia: el `AgentEconomy`
  de la línea viva espera un evento del hero (`heroSequence`) y sin él se queda
  invisible.

## Dos cosas del código que conviene no re-descubrir

**El paisaje es hijo del hueco.** Vive dentro del `<span>` que reemplaza a
«your», sacado de flujo y centrado sobre él, y el tween anima su ORIGEN (el
centro de la pantalla) en vez de su destino (cero). Colgarlo del hueco es lo que
hace que la recomposición del paso 3 no lo descoloque: cuando el titular se
recentra, el layout arrastra el objeto solo.

**La caja del paisaje no cambia nunca.** La compresión es un `transform`, que no
toca el layout, así que el canvas de `HeroFoliage` no re-mide ni re-renderiza.
Animar `width`/`height` dispararía su `ResizeObserver` en cada frame del scroll.

Con `prefers-reduced-motion` las dos sirven el **estado final** —`Own ⬡ world.`
ya armado— y no el inicial: un hero que promete un gesto que no llega es peor
que uno que no lo promete.
