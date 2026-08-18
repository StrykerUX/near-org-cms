# `proof-alt/` — diez versiones de la sección de pruebas

Alimenta **una sola ruta**: `/prototype/proof-alt`. No la importa ninguna
página real, y eso es el punto.

## De dónde viene

De un problema concreto: el `ProofStepper` de `/prototype/homepage-ab7` gasta
**325svh** de recorrido —cinco pasos de 45svh más un viewport pegado— para
entregar cinco datos, y el lector pasa dos pantallas y media de rueda sin que
la página avance.

Las diez versiones atacan eso. **Nueve caben en 100svh o 150svh.** La única que
consume recorrido de verdad es la 05, y está para tener contra qué medir el
ahorro: sin una versión cara, "esta es barata" no significa nada.

## Los datos NO son los del stepper

El stepper de ab7 monta `PROOF_STEPS` (cinco pasos: 1M+ wallets, $20B settled,
100% uptime, 0 quantum exposure, TEE). Este laboratorio monta **otros seis
datos**, los de la grilla 3×2 del rediseño, y viven en
[`proofAltContent.ts`](./proofAltContent.ts):

| | cifra | rótulo |
|---|---|---|
| 01 | 100% uptime | Built to last |
| 02 | 1 Million TPS | Built to scale |
| 03 | $24+ Billion | Built to connect |
| 04 | 30+ Blockchains | Built to reach |
| 05 | Quantum-ready | Built to resist |
| 06 | Confidential | Built to privacy |

Las diez versiones montan **exactamente los mismos seis**. Si cada una trajera
su copy, la comparación mediría dos cosas a la vez.

### Dos detalles del modelo de datos que conviene no "arreglar"

**La cifra viene partida en `value` + `accent`, y el corte es óptico.** En dos
de los seis cae a mitad de palabra (`Confi` + `dential`). Sale de la
referencia: lo que la grilla hace es teñir el final del renglón, no separar
dato de unidad. Renombrarlos a `number`/`unit` prometería una semántica que
estos datos no tienen.

**`count` es `null` en dos de los seis.** "Quantum-ready" y "Confidential" no
son números y no se les inventa uno para que las seis se comporten igual. Cada
versión que quiera contadores tiene que decidir a mano qué hace con esas dos —
y esa decisión es parte de lo que se está evaluando. La 01 las revela con
máscara; la 04 no cuenta nada.

## Las diez

| # | Versión | Técnica | Recorrido | La apuesta |
|---|---|---|---|---|
| 01 | `LedgerGrid` | CSS + GSAP | 100svh | La grilla de la referencia tal cual. Las reglas se trazan, los dígitos aterrizan girando. **Es la línea base**: si una versión con shader no gana contra esto, no vale lo que cuesta |
| 02 | `TickerTape` | DOM + GSAP | 100svh | Cinta infinita que **no avanza con el reloj**: avanza con la velocidad del scroll y desacelera sola. El hover la frena y abre el cuerpo |
| 03 | `SolariBoard` | DOM + GSAP | 100svh | Tablero de estación: una cifra a la vez, lamas girando. Cambia la pregunta — ¿son una TABLA o seis TITULARES? |
| 04 | `DialRings` | SVG animado | 100svh | Seis anillos y una aguja. Lo conduce el **ángulo del puntero**, así que se recorre en el sitio |
| 05 | `RailScroller` | DOM + GSAP · sticky | **200svh** | El scroll vertical se vuelve recorrido horizontal. El caro, a propósito |
| 06 | `PlotterTrace` | Canvas 2D | 100svh | Registrador de aguja: a la izquierda el papel está escrito, a la derecha todavía no. El puntero **escribe** la traza |
| 07 | `PrismField` | WebGL2 · shader propio | 100svh | La misma grilla sobre un campo de interferencia: las celdas se enteran unas de otras |
| 08 | `DeckStack` | DOM + GSAP · drag | 100svh | Cartas que se hojean. El scroll no participa |
| 09 | `BentoMosaic` | CSS grid + GSAP | 100svh | Se anima **la grilla**, no los elementos: la celda apuntada se lleva el espacio de las otras |
| 10 | `VersoParagraph` | SplitText + GSAP · sticky | 150svh | Las cifras entran como prosa y se van archivando a la derecha. La única con sintaxis |

## Las tres comparaciones que el lab existe para responder

1. **01 vs 07 vs 09** — la misma grilla 3×2 tres veces: quieta, con un shader
   detrás, y con el layout animado. Aísla exactamente cuánto aporta cada capa
   de mecanismo sobre la misma estructura.
2. **04 vs 05** — recorrer en el sitio (ángulo del puntero) contra recorrer
   scrolleando. Mismo contenido, la diferencia entera es quién gasta el
   recorrido.
3. **03 y 08 vs todas** — una cifra a la vez contra las seis a la vez. La 08
   además pide un gesto: **nadie está obligado a tocarla**, y quien pasa
   scrolleando ve una de seis. Eso es un riesgo real, no un detalle.

## Reglas del repo que estas diez cumplen

- **Sección pegada = `position: sticky`, nunca `pin: true`.** Las dos con track
  (05 y 10) declaran su alto en CSS y su ScrollTrigger solo LEE el progreso. El
  razonamiento largo está en [`../README.md`](../README.md).
- **El atributo de escena lo escribe el efecto, nunca el JSX.** Las siete que
  encienden un layout superpuesto usan `enableScene`. Declarado también en el
  markup, el primer re-render lo devolvería a "off" y el layout se desarmaría
  sin dar ningún error.
- **Tipografía: solo tokens de la escala.** Verificado con `pnpm
  lint:typography`.
- **Canvas** (06 y 07): buffer con `deviceRatio()`, `onViewportToggle` para no
  dibujar fuera de vista, y `gsap.ticker` — nunca un `requestAnimationFrame`
  propio.
- **Nada de estado de React para lo que anima.** Cuatro versiones (03, 04, 06,
  08) manejan su índice activo dentro del efecto: con `useState`, cada paso
  re-renderizaría la sección y `useMotionScope` reconstruiría la escena entera.
  La 02 sí usa estado, y solo para el párrafo que cambia de CONTENIDO.

## Degradación

Las diez se leen enteras sin JS y con `prefers-reduced-motion`. No es un
adorno: es lo que hace que el layout superpuesto viva en un atributo y no en
una clase.

| | sin JS / reduced-motion |
|---|---|
| 01 | la grilla completa, sin trazado ni giro |
| 02 | la cinta quieta en su posición inicial; el hover sigue abriendo cuerpos |
| 03 | las seis fichas apiladas en flujo normal, tablero en blanco |
| 04 | los anillos dibujados y la primera ficha; la lista de seis botones sigue funcionando |
| 05 | los seis paneles en columna, sin carril |
| 06 | el papel escrito ENTERO y quieto, primera ficha abierta |
| 07 | un frame del campo en reposo (o el fondo sólido sin WebGL2) |
| 08 | las seis cartas desplegadas en columna |
| 09 | la grilla en reposo con los seis cuerpos visibles |
| 10 | el párrafo entero y la columna completa, a la vez |

## Si una versión gana

Se copia a `components/sections/home-ab7/` (o a la carpeta de la homepage que
la reciba) y se monta ahí, reemplazando a `ProofStepper`. **No se importa desde
`proof-alt/`**: esta carpeta es un laboratorio y su contenido puede cambiar o
borrarse sin aviso — una página real que dependiera de ella la congelaría.

Al hacerlo hay que decidir dos cosas que el lab deja abiertas a propósito:

1. **Los datos.** Acá viven en `proofAltContent.ts`; en la homepage tienen que
   salir de la carpeta de esa página (`homeAb7Content.ts` o su equivalente).
2. **`ProofStepper` y sus cinco datos viejos.** Los seis de acá NO son los
   cinco de allá. Reemplazar la sección es también reemplazar el contenido, y
   eso es una decisión de la página, no del componente.
