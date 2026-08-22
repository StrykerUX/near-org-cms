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

### `AgentEconomy` — del card negro al statement sobre crema (2026-08-22)

El statement dejó de ser una caja negra flotando sobre el crema y pasó a ser
tipografía apoyada sobre el mismo crema que traen las secciones vecinas, con el
icono de NEAR abriendo la frase.

Lo que cambió, y por qué no es el mismo componente repintado:

- **Composición.** Antes: card `rounded-[32px]`, texto centrado, aire vertical
  en `%` del ancho para conservar la proporción de la caja. Ahora: sin caja ni
  fondo propio, el texto se alinea a la izquierda y el aire lo pone la sección.
- **Anclaje del icono.** Va por `items-baseline`, no por `items-start`: una
  imagen en flexbox no tiene baseline tipográfica, la suya es su borde inferior,
  que es justo donde la referencia lo apoya (sobresale por encima de la altura
  de mayúscula y baja hasta la baseline de la primera línea). Alinearlo por el
  top exigiría un `margin` negativo calculado contra las métricas de Montreal,
  que se desalinea solo el día que cambie la fuente.
- **Acentos.** Eran dos tramos en itálica serif (`the agent economy.` y
  `own your intelligence.`). Ahora es uno solo, en el mismo sans, verde y bold.
  Por eso `AGENT_ECONOMY` pasó de cuatro tramos (`lead`/`accentA`/`body`/
  `accentB`) a dos (`body`/`accent`).
- **Fondo.** `GlyphField` —el canvas de caracteres— salió de la composición y
  **quedó sin usar**: hoy no lo importa nadie. Se dejó en la carpeta a
  propósito, no por olvido; si el campo no vuelve, se borra.

El arte del icono vive en `public/prototype/homepage-update/near-icon.png`.

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

## Lo que NO se forkeó

`TestimonialMarquee`, `LatestUpdates` y `UpdatesList` siguen viniendo del
catálogo compartido de `sections/`, y el header y el footer los monta
`app/prototype/layout.tsx`. Si alguna diverge, se copia a `homepage-update/` en ese
momento — no antes.
