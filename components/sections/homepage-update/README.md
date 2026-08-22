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

### `Hero` + `AgentEconomy` — una secuencia, dos componentes (2026-08-22)

La salida del hero y la entrada del statement son **un solo gesto** contado por
dos componentes, y el reloj que los sincroniza vive en
[`heroSequence.ts`](./heroSequence.ts).

**Qué pasa, en orden:**

```
antes del gesto   hero tapando la pantalla. El stage del statement YA está
                  pegado detrás, con el icono centrado y quieto.
primer scroll     el scroll se CONGELA y arranca la secuencia.
0.0 → 0.9s        el borde inferior del hero se come el hero; la copy se
                  descuelga y crece a 1.35.
0.45 → 1.55s      el icono viaja desde el centro hasta su sitio junto al texto.
1.15 → ~2.2s      el texto entra línea por línea.
fin               el scroll se devuelve, con el statement terminado en cuadro.
```

**Las decisiones que no son obvias, y por qué:**

- **El hero no cuesta scroll.** `margin-bottom: -100svh` lo saca del flujo y deja
  a `AgentEconomy` empezando en el mismo punto del documento, ya a pantalla
  completa en el scroll 0. Sin eso, el statement arrancaría una pantalla más
  abajo y el icono estaría *entrando en cuadro* mientras el hero se abre, en vez
  de esperarlo ya centrado. Además, con el scroll congelado durante la secuencia,
  un hero que costara scroll dejaría la página trabada con él todavía en su
  lugar. El margen se escribe con `style.setProperty` y no con `gsap.set`: GSAP
  normaliza unidades y `svh` no está entre las que conoce.
- **`AgentEconomy` NO es sticky, y lo fue.** Mientras la coreografía se
  scrubbeaba, el stage vivía en `sticky top-0` dentro de un track más alto para
  quedarse quieto mientras el scroll la avanzaba. Con la secuencia corriendo con
  el scroll congelado el sticky no aporta nada —nada se mueve durante la
  animación— y lo único que quedaba de él era su recorrido: media pantalla de
  scroll, después del statement, donde la página no subía y la sección siguiente
  no llegaba. Hoy la sección mide una pantalla exacta y sube como cualquier otra.
- **La secuencia no se scrubbea.** Fueron cuatro ScrollTriggers con `scrub` hasta
  que quedó claro que el pedido era otro: el lector la DISPARA y no la maneja. Un
  scrub le entrega la velocidad al dedo, y la velocidad del dedo depende del
  dispositivo — el mismo cierre salía a tirones en un trackpad y de golpe en una
  rueda con detentes.
- **El disparo es `Observer`, no `ScrollTrigger`.** Lo que dispara es el gesto,
  no una posición: con el scroll congelado la página no se mueve, así que no hay
  posición que cruzar. Esto vale también para la vuelta — ver abajo.
- **Es un scroll-jack de ~2.2s**, vía `lenis.stop()`. No `overflow: hidden` en el
  body: Lenis escribe `scrollTop` cada frame y taparle el overflow por debajo lo
  deja escribiendo contra un contenedor que ya no scrollea, con un salto al
  soltar. `SEQUENCE_DURATION` se calcula desde los beats y no se escribe a mano.
- **El icono se pinta GRANDE y se escala hacia abajo.** Al revés se ve pixelado
  aunque la fuente sea un SVG: `transform: scale()` rasteriza el elemento a su
  tamaño de layout y estira ese bitmap, y con `will-change: transform` la capa ni
  siquiera se re-rasteriza. Por eso el tamaño grande vive en CSS (`--icon-big`) y
  no en JS: tiene que estar aplicado antes del primer paint.
- **Son dos nodos de icono.** `data-agent-slot` es el del flujo (1.07em, apoyado
  en la baseline, lo único que se ve sin JS o con `prefers-reduced-motion`) y
  `data-agent-icon` es el que viaja. El grande aterriza exactamente encima del
  chico apagado, así que no hay swap ni frame de corte.

**Dos bugs que costaron y conviene no reintroducir:**

- *"Se puede volver al hero, pero después de un delay"* — eran los 2.2s de scroll
  congelado. El `ScrollTrigger` de la vuelta no podía cubrirlo por definición: la
  posición no cambia mientras el scroll está parado. Lo resuelve el `onUp` del
  mismo `Observer`, que ve el evento nativo aunque Lenis esté quieto.
- *Scroll lateral* — la copy del hero escala a 1.35 y un `Container` de 1780px
  escalado desborda el viewport. El hero no tenía `overflow-hidden`, a propósito,
  desde cuando el `<video>` sobresalía por abajo. Ese video ya no existe y el
  corte lo hace el `clip-path`, así que el recorte volvió sin costo.

**Lo que además cambió en el statement respecto del card negro:** el acento pasó
de dos tramos en itálica serif a uno solo en el mismo sans, verde y bold (por eso
`AGENT_ECONOMY` tiene dos tramos y no cuatro), y `GlyphField` —el canvas de
caracteres— **quedó sin usar**: hoy no lo importa nadie. Se dejó en la carpeta a
propósito; si el campo no vuelve, se borra.

El arte del icono vive en `public/prototype/homepage-update/near-icon.svg`.

### `Hero` — sin subtítulo, titular en una línea (2026-08-22)

El párrafo de apoyo ("Move cross-chain, trade perps…") salió del hero, y con él
todo su rastro en la coreografía: el selector `[data-hero='sub']`, su
`gsap.set` inicial y su paso del timeline. Dejarlo apuntando a un array vacío
habría sido código muerto fingiendo coreografiar algo. Efecto lateral a tener
presente: el `tl.call()` que hace el `split.revert()` y enciende el gradiente
ahora corre al terminar la entrada de "world." y no cuando terminaba el
subtítulo — que es lo correcto, porque el titular es todo lo que queda.

`Own your world.` va en una sola línea (se fue el `<br />`); en móvil envuelve
solo, que a 8rem es la única salida.

Dos detalles de por qué el ajuste fino está donde está:

- **El titular sube con `pb-28 pt-14`, no con un `translate`.** El bloque está
  centrado con `justify-center` y GSAP anima la `y` de ESE mismo elemento en el
  parallax: un transform de Tailwind acá lo pisa el tween en el primer frame.
  El padding mueve la caja de centrado y el tween sigue midiendo desde ahí.
- **`text-display` vive en el `Container` y el `<h1>` lleva `text-[1.08em]`.**
  El `em` necesita un padre contra quien medir: en el mismo elemento resolvería
  contra el body y anularía el token. Así el titular escala DESDE la escala —
  `line-height` (unitless) y `letter-spacing` (em) heredan y se recomputan
  contra el tamaño nuevo.

### `OwnYourOwn` — el titular ya no se cruza con el encabezado (2026-08-22)

El titular gigante nacía a **150px** del borde del grid y el encabezado nace a
**0** midiendo hasta 21rem. Se solapaban en el flujo desde el primer frame, y
como comparten las columnas 7–9, el párrafo del encabezado y "Own Your Own" se
leían encima durante toda la entrada de la sección. `--own-title-floor` solo
cubría el tramo **pegado**; el tramo de antes no lo cubría nadie.

El arreglo son tres piezas que se sostienen entre sí:

- **`--own-head-block: 21rem`** — el alto reservado al encabezado deja de estar
  escrito dos veces. Gobierna el piso del título pegado *y* dónde nace en el
  flujo; si esos dos números se separan, vuelven a pisarse.
- **El título nace a `--own-head-block`**, justo debajo del encabezado.
- **`--own-card-lead` suma `--own-head-block`.** El lead es padding del grid y
  las cards cuelgan de él: sin la suma el título se les habría acercado 21rem y
  la escena empezaría con la primera card ya encima. Con la suma, la distancia
  título↔card sigue siendo los mismos 38svh y lo único que se mueve es dónde
  empieza todo.

Aparte, las cuatro cards comparten fondo. Data y Assets llevaban `bg-white/50`,
que sobre el crema compone ≈`#fafaf8` — más **claro** que el fondo, y por eso se
leían como manchas blancuzcas. Ahora las cuatro van `bg-card-tint/50` (≈`#efefec`,
un escalón por debajo). Como el tinte dejó de variar, salió de `CARD_LAYOUT` y
vive en el `<article>`: un campo por card que siempre vale lo mismo invita a que
alguien lo desempareje sin querer.

### `StackAnchors` — el pie de gobernanza y economía (2026-08-22)

Dos notas nuevas (`STACK_NOTES`) al pie de la escena. No viven en `STACK_PIECES`
ni tienen `StackKey`: las fichas de las esquinas nombran **piezas del ensamble** y
se encienden al pasar el puntero por su parte del arte, y estas dos no tienen
cubo que señalar.

Se montan en dos sitios según el alto de ventana, con el **mismo** componente:

- **≥ 900px** — dentro de la escena, como pie del sticky. Va `shrink-0`, así que
  lo que cede alto es el `flex-1` del medio: el ensamble deriva su ancho del alto
  del stage (`h-[80%]` + `w-auto`), se achica y sube solo, y las cuatro fichas se
  anclan contra esa misma caja y lo acompañan.
- **< 900px** — en una `<section>` **hermana**, debajo del gráfico.

Que la de abajo sea hermana y no un bloque más adentro no es estilo. El
ScrollTrigger de la escena usa `end: "bottom bottom"` y mide la sección entera:
cualquier alto agregado ahí estira el recorrido de las seis etapas del ensamble y
las separa entre sí. Y en modo track esa sección tiene alto **fijo**
(`--travel` + 100svh), así que un hijo después del sticky se le sale por abajo.

Los dos montajes se excluyen por `display` y no por opacidad ni visibilidad: un
`display: none` no lo lee ningún lector de pantalla, así que el contenido nunca se
anuncia dos veces aunque esté dos veces en el árbol. El umbral va como clase
literal en los dos lugares porque Tailwind no detecta clases dinámicas — si se
mueve, se mueve en ambos.

## Lo que NO se forkeó

`TestimonialMarquee`, `LatestUpdates` y `UpdatesList` siguen viniendo del
catálogo compartido de `sections/`, y el header y el footer los monta
`app/prototype/layout.tsx`. Si alguna diverge, se copia a `homepage-update/` en ese
momento — no antes.
