# `hero-labs/` — ocho primeras pantallas para Protocol

Laboratorio de la sección 1. Índice en `/prototype/protocol-heroes`; cada
variante en `/prototype/protocol-heroes/h1` … `h8`.

## Qué se compara

No "cuál se ve mejor". Tres decisiones, que cada variante toma distinto:

1. **Dónde vive la evidencia** — las seis cifras dentro del hero o después.
2. **Qué se agranda** — la afirmación, la categoría, la cifra o el índice.
3. **Si la pantalla se mueve**, y sobre qué.

| | Prueba | Se agranda | Movimiento |
|---|---|---|---|
| **H1 · Ledger** | Dentro, en columna | La afirmación | **Ninguno** — ni entrada |
| **H2 · Count** | Dentro, marcador a sangre | La afirmación | Las cifras cuentan |
| **H3 · Threshold** | **Fuera** — barra pegada bajo el nav | La afirmación | El hero se despide con el scroll |
| **H4 · Cut** | **Fuera** — banda asomando por el corte | La afirmación | Ninguno |
| **H5 · Index** | **Fuera** — banda | El índice de la página | El cubo se enciende al recorrer |
| **H6 · Field** | Dentro, a los costados | La afirmación | El campo de shards, continuo |
| **H7 · Mural** | **Fuera** — banda | **La categoría** | Ninguno |
| **H8 · Terminal** | Dentro, status line | La afirmación | El sheen del titular |

Cuatro dentro y cuatro fuera; cinco con movimiento propio y tres sin. H1 es el
único sin **ninguna** animación, ni siquiera de entrada — y por eso es un server
component, que es la prueba de que la decisión es real y no una intención.

## Cada variante se ve en contexto

Sola, y seguida de lo que va abajo en la página real: su banda de cifras si las
saca del hero, y después `ScaleClaim`. El laboratorio de heroes anterior del repo
(`hero-alt`, archivado) apilaba seis heroes en una página y por eso no dejaba
juzgar lo único que importa acá — **la juntura**. Un hero apilado siempre tiene
otro hero debajo, que es lo único que nunca va a tener en producción.

La composición la arma `components/views/ProtocolHeroLabView.tsx` desde un `id`
plano. Ocho views idénticas salvo dos líneas es lo que produce que siete queden
sin actualizar.

## `ProofBand`

La franja cuando vive fuera del hero, en dos modos:

- `band` — banda normal, inmediatamente después (H4, H5, H7).
- `sticky` — pegada bajo el header durante un tramo (H3). La evidencia deja de
  ser un momento y pasa a ser una referencia disponible mientras se lee.

`sticky` es el que hay que mirar con cuidado: come alto útil y convive con un nav
que ya es fijo. Se suelta a los 70svh a propósito. Si estorba igual, la respuesta
es `band` — afinar el umbral no arregla un patrón que no cabe.

## Lo que se reusa y de dónde

| | De dónde | Por qué no se copió |
|---|---|---|
| `shardField` (H6) | `sections/protocol/` — la página publicada | 215 líneas de canvas ya medidas, con su `destroy`. La dependencia va del lab hacia la página real, que es la dirección aceptable; lo que el README padre prohíbe es la inversa |
| `[data-q-sheen]` (H6, H8) | `app/globals.css` | Es la rampa que ya viaja por los titulares de quantum y blockchain |
| `ColumnRule` (H1, H8) | `protocol-labs/a/` | La retícula de doce columnas es la textura de la página elegida |
| `CtaPill`, `ArrowCircle` | `sections/quantum/` | Igual que el resto del sitio |
| `isoKit` (H5) | `protocol-labs/` | Un solo eje isométrico para todo el laboratorio |

## Estado

Prototipos, **sin ver en navegador**. Lo que hay que verificar antes de elegir:

- **H4** — el corte es un porcentaje (78svh), así que lo que asoma de la banda no
  es lo mismo en un portátil que en un monitor. Si tiene que asomar siempre por
  su primera línea, hay que medir contra el alto de la banda, y eso ya es JS.
- **H6** — si el campo con textura se come seis datos chicos. El velo de crema
  está calibrado para el titular, no para ellos.
- **H8** — si gana, hay que rehacer el ritmo de la página entera: con el hero en
  negro, el acto oscuro deja de ser una irrupción.
- **H2** — que el contador no cambie de ancho mientras corre. El formato conserva
  prefijo, sufijo y decimales justamente para eso, pero hay que verlo.
- Todas — a 390, 1024 y 1920, y con `prefers-reduced-motion`.
