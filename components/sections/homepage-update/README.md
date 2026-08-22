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

### `ProofDatum` — la entrada pasa a ser por renglón (2026-08-22)

Salió el eyebrow "Built to": las seis fichas ya empiezan con esas mismas dos
palabras. Con él se fue el `flex flex-col gap-10` del `Container`, que separaba
dos hijos y ahora tiene uno.

La entrada dejó de mover el `<article>` y mueve sus **renglones**. Animar la
ficha entera desplazaba también su tallo —que ya tiene su propio tween— y sobre
todo movía una caja: se leía como un panel entrando. Por renglón se lee como un
dato que se escribe.

Hay dos escalonados anidados y la diferencia entre ellos es el punto: `0.07`
dentro de la ficha (las tres piezas son *una* ficha) y `0.18` entre fichas, que
tiene que ser claramente mayor o las seis se funden en una cortina.

El ease de los renglones es `expo.out` y no el `EASE_OUT` del timeline
(`power3.out`): `expo` gasta más de la mitad del recorrido en el primer 20% del
tiempo y el resto es cola, que es el gesto pedido — salir disparado y frenar
largo. Va con `duration: 1.2` porque en 0.7s el tramo lento no se llega a ver. El
eje y los tallos conservan `power3.out`, que es lo correcto para una línea que se
traza.

Dos cosas que el cambio arrastró:

- **`data-line` va en el JSX**, no un selector estructural (`article > p`). Ese
  selector se rompe solo el día que alguien agregue un cuarto párrafo o envuelva
  alguno en un div, y lo hace en silencio: la animación sigue corriendo con una
  pieza de menos.
- **El `clearProps` del cleanup pasó de `cards` a `lines`.** La que queda con
  estilos inline es cada `<p>`; limpiar los `<article>` dejaría seis fichas en
  `opacity: 0` para siempre, y en dev eso pasa en cada mount por StrictMode.

### El cierre de la página: orden, prensa y newsletter (2026-08-22)

**Orden.** `BelongsNewsletter` bajó de estar entre `ProofDatum` y las historias
de clientes —partiendo en dos el tramo de prueba social— a cerrarlo, justo antes
del blog:

```
… ProofDatum → CustomerStories → PressCarousel → BelongsNewsletter
→ LatestUpdates → UpdatesList
```

`Hero` y `AgentEconomy` **no** son intercambiables con el resto: están solapados
por diseño y comparten la secuencia del primer gesto. Cualquier cosa metida entre
los dos rompe el efecto. Queda anotado en el propio `HomepageUpdateView`.

**`PressCarousel`.** Salió el `<h2>` "Blockchain quantum security in the news", y
con él el espaciador que lo separaba del carrusel y el import de `Accent`. El
`aria-label` de la sección se queda: sin titular visible es la **única** etiqueta
que la nombra para quien navega por landmarks.

**`BelongsNewsletter` — de banda a card.** Era `bg-stone` de borde a borde del
viewport, con el wordmark "near" como primera línea de "belongs to you". Ahora es
una caja de ancho contenido con el glifo de marca arriba y "Join our Newsletter".

Tres cosas que el cambio se llevó, y por qué:

- **El wordmark como titular.** Vivía dentro del `<h2>` porque era parte de la
  frase — su `alt` aportaba la palabra que faltaba. El titular nuevo se lee solo,
  así que el glifo de arriba es marca y no oración: `aria-hidden`, fuera del
  heading. Usa `near-squircle.svg` y no `near-icon.svg`, que es la N sola.
- **`bg-stone`.** `#d8d6d0` es el gris de una banda a ancho completo; en una card
  sobre crema se lee sucio, porque ahora hay un borde contra el que compararlo.
  `--card-surface: #e2e1de` queda a mitad de camino entre `--cream` y `--stone`:
  más contraste que el `--card-tint` de `OwnYourOwn`, menos peso que la banda.
- **El corte duro contra las vecinas**, deliberado mientras fuera banda. Con
  card, lo que separa es el aire.

Sobre el espaciado interno: `mb-9` bajo el icono contra `mt-1` sobre el párrafo.
La asimetría es el punto — el titular tiene aire heredado por abajo (el line-box
reserva las descendentes, que "Join our Newsletter" casi no usa) y nada por
arriba, porque la caja de una imagen termina donde termina el dibujo.

**El botón de `ShineField`** pasó de `bg-near-green-dark` con texto blanco al
gradiente de la marca con texto negro. Blanco sobre ese verde da ~2.1:1 y no pasa
AA ni para texto grande; negro sobre el gradiente da ~9:1 en su punto más oscuro.
Se tocó el primitivo directamente porque esta sección es su único consumidor.

### `CustomerStories` — el ancho pasa de la card a la celda (2026-08-22)

Refactor del modelo de layout del carrusel, motivado por dos bugs visuales que
tenían la misma raíz.

**Antes:** celda de ancho fijo, card al 62% de ella, alineada al borde interno
para que el 38% sobrante quedara escondido hacia el borde de pantalla. **Ahora:**
encoge la CELDA y flex corre a las vecinas. El hueco no existe, no está escondido
en otro lado.

**Los tres bugs, y por qué eran el mismo problema:**

1. *Hueco al saltar más de una card.* `isAfterActive` (de qué lado se pega la
   card) se calculaba en el render de React a partir de `index`, que solo se
   actualizaba en `settle()` — o sea al TERMINAR el tween, 1.75s después de que
   `paint()` ya había movido `data-active` en el DOM. Con saltos de 3+, las dos
   vecinas de la nueva activa se pegaban al borde equivocado y el hueco de ~384px
   aparecía a los dos lados.
2. *Hueco durante la transición.* Estructural: el borde de la card y el track
   viajan a distinta velocidad, así que a mitad de paso el hueco entra en cuadro
   y se abre hasta ~200px de crema.
3. *El subrayado del logo activo* se quedaba 1.75s en el logo viejo y saltaba al
   final. Mismo desfase `paint()` / `index`.

Encoger la celda mata el 1 y el 2 (ya no hay hueco ni `isAfterActive`), y mover
`setIndex` al INICIO del tween mata el 3.

**Lo que el refactor obligó a cambiar en el motor** (`useLoopCarousel.ts`):

- **`stepW` no existe más.** La fila dejó de ser uniforme, así que la distancia
  entre celdas ya no es constante. En su lugar hay geometría analítica:
  `xFor(pos, norm) = vw/2 − (leftOf(pos, norm) + activeW/2)`.
- **Se calcula, no se lee del DOM.** Durante el paso los anchos están cambiando,
  y un `offsetLeft` leído a mitad de vuelo daría un destino que se mueve solo.
- **Por qué la animación lineal coincide:** desarrollando el centro real de la
  celda entrante en función del progreso `q` sale `C ± (activeW − idleW)·q/2` —
  lineal en q. Animar `x` linealmente coincide EXACTAMENTE con el centro real en
  todo instante, siempre que los anchos interpolen con la misma curva y duración.
  De eso ya se encargaban `--step` y `--step-ease`.
- **`activesBefore()`, y no es un detalle.** `paint()` marca `data-active` en las
  TRES copias del loop —tiene que hacerlo, o el salto de `settle()` se vería— así
  que a la izquierda de la celda destino siempre hay al menos una celda a tamaño
  activo. Contarlas como encogidas corría la card destacada `activeW − idleW`
  (~384px) a la derecha, saliéndose del viewport.
- **`posFor()` prueba las tres cuentas.** `activesBefore` es escalonada, así que
  `pos` aparece a los dos lados de la ecuación y no se despeja de una. Con celdas
  uniformes (`PressCarousel`) el término se anula y acierta en la primera vuelta.
- **`measure()` apaga las transiciones para leer.** Medir a mitad de un paso
  devuelve anchos EN TRÁNSITO y calibra la fila contra un estado que no existe en
  reposo. Va inline y no por una clase del consumidor: un hook que depende de que
  su consumidor recuerde declarar una clase se rompe en silencio en el segundo.
- **Se fue el `paint()` por frame del drag.** Ahora `data-active` mueve el
  layout, así que repintarlo mientras el dedo arrastra reacomoda la fila entera y
  el contenido se escapa de debajo del dedo.

`PressCarousel` usa el mismo motor y no encoge nada, así que ahí
`activeW === idleW` y todo se reduce a la grilla uniforme de antes. Sin caso
especial.

## Lo que NO se forkeó

`TestimonialMarquee`, `LatestUpdates` y `UpdatesList` siguen viniendo del
catálogo compartido de `sections/`, y el header y el footer los monta
`app/prototype/layout.tsx`. Si alguna diverge, se copia a `homepage-update/` en ese
momento — no antes.
