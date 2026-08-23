# `hero-labs/` — la alternativa viva para la primera pantalla de Protocol

Laboratorio de la sección 1. Índice en `/prototype/protocol-heroes`; la variante
que queda, en `/prototype/protocol-heroes/h2`.

## Eran ocho, quedan dos — y por caminos distintos

- **H4 · Cut** ganó y está copiada en `../a/Hero.tsx`. Desde ahí no se mueve con
  este laboratorio, y su copia del lab se borró: tener dos archivos que dicen ser
  el mismo hero es la forma más barata de que uno quede desactualizado sin que
  nadie se entere. Se ve en `/prototype/protocol-a`.
- **H2 · Count** se conservó como la alternativa viva.

Las otras seis —**H1 · Ledger**, **H3 · Threshold**, **H5 · Index**,
**H6 · Field**, **H7 · Mural**, **H8 · Terminal**— y la `ProofBand` que tres de
ellas usaban se borraron. Están completas en el historial de git, en el commit
anterior a esta limpieza: `git log --diff-filter=D -- components/sections/protocol-labs/hero-labs`.

Vale la pena saber qué se fue antes de rehacer algo parecido:

- **H3** llevaba la franja de cifras **pegada** bajo el header durante 70svh: la
  evidencia dejaba de ser un momento y pasaba a ser una referencia disponible
  mientras se lee. Era el único patrón que resolvía eso, y el que más riesgo
  tenía de estorbar sobre un nav que ya es fijo.
- **H5** ponía en el lugar de las cifras el **índice de la página**: las seis
  capacidades, enlazadas. La única que admitía que la página es larga.
- **H7** agrandaba la **categoría** («agent economy») en vez de la afirmación —
  la única que se jugaba a otra pelea.
- **H8** era el único hero oscuro, con las cifras como lecturas de un sistema
  encendido. Si alguna vez se retoma, arrastra rehacer el ritmo de la página: con
  el hero en negro, el acto oscuro deja de ser una irrupción.

## Dos cosas cambiaron al llevar H4 a la página

Conviene saberlas antes de comparar `/prototype/protocol-a` con lo que este
README describía antes:

1. **El hero pasó a altura completa.** La página se quedó con la composición de
   H4 —titular a la izquierda, cifras fuera— pero sin el corte que le daba
   nombre. Se ganó presencia y consistencia con los heroes del resto del sitio;
   se perdió la única variante que resolvía el paso al contenido sin un elemento
   extra. La versión con el corte a 78svh ya no vive en ningún archivo: está en
   el historial.
2. **La franja no es una sección aparte**: abre `ScaleClaim` con `proof="top"`,
   porque la evidencia tiene que llegar antes que la explicación.

## Qué propone H2

| | Prueba | Se agranda | Movimiento |
|---|---|---|---|
| **H2 · Count** | Dentro, marcador a sangre en el borde inferior | La afirmación | Las cifras cuentan al entrar |

Pone el movimiento sobre el **argumento** y no sobre la decoración: lo que se
anima son los seis datos, no el titular ni un adorno. Con
`prefers-reduced-motion` las cifras salen directamente en su valor final.

## Se ve en contexto

Sola y seguida de `ScaleClaim`, la sección real que va abajo en la página. El
laboratorio de heroes anterior del repo (`hero-alt`, archivado) apilaba seis
heroes en una página y por eso no dejaba juzgar lo único que importa acá — **la
juntura**. Un hero apilado siempre tiene otro hero debajo, que es lo único que
nunca va a tener en producción.

La composición la arma `components/views/ProtocolHeroLabView.tsx`. Ya no recibe
un `id`: con una sola variante, el `Record` de ocho entradas era un despachador
de una línea.

`ScaleClaim` va con `proof={false}` porque H2 lleva las seis cifras **dentro**
del hero, y repetirlas abajo rompería la lectura que la variante propone.

## Lo que reusa y de dónde

| | De dónde | Por qué no se copió |
|---|---|---|
| `countUp.ts` | `protocol-labs/` | El contador que conserva formato y bloquea el ancho antes de correr; lo comparten las aperturas |
| `CtaPill`, `ArrowCircle` | `sections/quantum/` | Igual que el resto del sitio |

## Estado

Prototipo. Lo que falta verificar en navegador:

- **Que el contador no cambie de ancho mientras corre.** El formato conserva
  prefijo, sufijo y decimales justamente para eso, y el ancho se mide después de
  `document.fonts.ready`, pero hay que verlo.
- A 390, 1024 y 1920, y con `prefers-reduced-motion`.
