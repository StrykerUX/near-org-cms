# `closing-labs` — el cierre de la home, cinco veces

**Laboratorio.** Alimenta cuatro rutas de comparación y **ninguna página real lo
importa**. Si una dirección gana, se COPIA a la carpeta que la reciba y la de
acá se borra — la regla está en el [README del catálogo](../README.md).

## Qué compara

Las cuatro últimas secciones de `/prototype/homepage-c`, cada una en cinco
versiones:

| Sección | Hoy es | Ruta de comparación |
|---|---|---|
| Las seis pruebas | `homepage-tuck/ProofLedger` | `/prototype/closing-labs-numbers` |
| Los testimonios | `homepage-tuck/TestimonialDeck` | `/prototype/closing-labs-voices` |
| Get into NEAR | `homepage-tuck/GetIntoNear` | `/prototype/closing-labs-gateway` |
| NEAR in the news | `homepage-shared/UpdatesList` | `/prototype/closing-labs-press` |

## La estructura: una dirección, cuatro secciones

```
closing-labs/
  directions.ts   ← las cinco direcciones, descritas una vez
  shared.tsx      ← los devices que se repiten en las referencias
  pressContent.ts ← la copy de prensa (las otras tres la sacan de homepage-tuck/)
  grid/ reveal/ card/ night/ slab/
                  ← una carpeta por DIRECCIÓN, con las cuatro secciones adentro
```

**La unidad es la dirección, no la sección**, y eso es una decisión y no una
convención de carpetas. `grid/Numbers` y `grid/Press` comparten retícula,
tipografía y tono; `grid/Numbers` y `night/Numbers` no comparten nada salvo el
texto. Ordenado por sección —`numbers/a`, `numbers/b`…— cada carpeta tendría
cinco archivos sin nada en común y las cinco direcciones no se podrían ver como
familias, que es justo lo que hay que juzgar: si `card` aguanta las cuatro
secciones o solo se luce en una.

**La copy es la misma en las cinco**, y sale de los módulos que ya existen
(`homepage-tuck/proofLedgerContent`, `testimonialDeckContent`,
`getIntoNearContent`) más `pressContent.ts`, que es nuevo porque esa copy vivía
hardcodeada dentro de `UpdatesList`. Es la misma razón que en `foundation/`,
`about/` y compañía: con la copy compartida, **toda** diferencia entre las cinco
versiones es de layout, por construcción. Con cinco copias del texto, la primera
corrección de redacción entra en una y la comparación deja de medir nada.

## Las cinco direcciones

| | Dirección | De dónde | La idea |
|---|---|---|---|
| **01** | `grid` | armory.framer.ai | Retícula visible a sangre, mono para todo rótulo, cero esquinas redondeadas. Nada flota: todo ocupa una celda. |
| **02** | `reveal` | alura · spartan · armory | Sin cajas. Papel, texto, y una plica numerada al margen. El párrafo se enciende palabra por palabra con el scroll. |
| **03** | `card` | alura.framer.website | Fichas blancas sobre gris, numeral fantasma cortado por el borde, cuatro marcas de registro. Las puertas son un acordeón horizontal. |
| **04** | `night` | dreammotion.framer.website | Negro. Cards de un punto más claro, píldora de rótulo con punto verde, titular en serif a dos tonos. |
| **05** | `slab` | spartanai.framer.website | Cada sección es una losa de canto blando sobre el suelo de la página, alternando oscura y clara. Adentro, tablas con filetes. |

## Lo que de verdad se está probando

Las cuatro referencias comparten cuatro devices, y las cinco direcciones son
cinco formas de repartirlos. Están en `shared.tsx` y conviene conocerlos antes
de tocar cualquier archivo:

- **El contador que arranca en cero** con el ancho final ya reservado. Las dos
  referencias que cuentan lo hacen así, y el ledger vivo ya tenía resuelto el
  relleno (`formatLedgerValue`) — faltaba el tween.
- **El texto que se enciende palabra por palabra**, atado al scroll y no a una
  entrada. Es el device más repetido de las cuatro. `reveal` lo convierte en su
  identidad entera; las otras cuatro no lo usan.
- **El glifo rayado** y **las marcas de esquina**, que son rótulos que no
  significan nada a propósito.

Y una pregunta atraviesa las cinco: **qué le pasa a la rampa verde**. Es lo
único con color de las cuatro secciones y cada dirección la resuelve distinto —
filete de 1px en `grid`, relleno de la letra en `reveal`, barra de estado en
`card`, luz desenfocada en `night`, y la píldora del artboard tal cual en
`slab`, que es la única que tiene dónde apoyarla. Comparar las cinco páginas de
`gateway` una al lado de la otra es la parte más útil del laboratorio.

## Antes de sacar cualquiera de esto de `/prototype`

⚠️ **Las citas no están verificadas** — dos son reconstrucciones de fragmentos
tapados en el artboard y un cargo dice literalmente «Company xxx». Son cuatro
personas reales: leer la cabecera de `homepage-tuck/testimonialDeckContent.ts`.

⚠️ **Los tres titulares de prensa son relleno de maqueta** — el artboard repite
la misma frase tres veces, y el `blurb` que `night/Press` despliega está escrito
para la maqueta. Todo marcado `TODO(copy)` en `pressContent.ts`.
