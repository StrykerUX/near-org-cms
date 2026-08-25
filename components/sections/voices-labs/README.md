# `voices-labs` — cuatro alternativas al mazo de testimonios

**Laboratorio.** Alimenta `/prototype/voices-labs` y **ninguna página real lo
importa**. Si una gana, se COPIA a `homepage-tuck/` y la de acá se borra — la
regla está en el [README del catálogo](../README.md).

Es el único lab del repo que monta la sección VIVA junto a las propuestas, y
está explicado en `components/views/VoicesLabsView.tsx`: acá no se elige entre
cuatro opciones nuevas, se decide si alguna es mejor que lo que ya está montado.

## Las cuatro, y qué le pide cada una a la página

| | | La idea | El costo |
|---|---|---|---|
| **01** | `Ribbon` | Cards del mismo tamaño cruzando la pantalla a sangre, con la empresa arriba a la izquierda y una sola card de color. No hay voz principal: lo que la sección dice es «hay más de las que entran». | Se pierde la cita grande, que hoy es el único momento tipográfico del final de la página. |
| **02** | `Switchboard` | El índice del mazo hecho legible: cuatro nombres a la izquierda, la cita grande a la derecha, el lector elige. | Se pierde el movimiento. Quien no interactúe se lleva una cita de cuatro. |
| **03** | `Stage` | Una voz por pantalla, a tamaño de titular, sin nada más en el cuadro. Nadie se saltea ninguna. | Cuatro pantallas de scroll para ochenta palabras. |
| **04** | `Marks` | La empresa como objeto principal y la cita como epígrafe. Cuatro pruebas en una banda de una pantalla. | La cita se achica hasta dejar de leerse de corrido: pasa a consultarse, como el pie de una foto. |

Las cuatro columnas de esa tabla están escritas también en la cabecera de cada
archivo, con el razonamiento largo. **La pregunta que las ordena es una sola:
si estas citas son el ARGUMENTO del cierre de la página, `Stage` es la
respuesta y `Marks` la peor; si son RESPALDO, es exactamente al revés.** Eso no
lo decide el diseño.

## De dónde vienen

`Ribbon` es la referencia nueva —la cinta de cards con logotipo, comilla grande
y una card verde— llevada al vocabulario del sitio. Las otras tres salen de lo
que quedó aprendido en [`closing-labs/`](../closing-labs/README.md): el riel
nativo con snap, la escena pegada movida por scroll, la banda sobre filetes a
sangre.

Lo que ninguna versión anterior tenía y la referencia trajo es **la empresa
dentro del cuadro**. `Ribbon` y `Marks` la usan como objeto; `Switchboard` la
usa como subtítulo del índice; `Stage` no la usa — a tamaño de titular, la
firma sobra.

## Los datos

Las palabras salen de `homepage-tuck/testimonialDeckContent.ts`, sin copiar:
una sola fuente para las cuatro versiones, la sección viva y las cinco de
`closing-labs/`. Es lo único que hace honesta la comparación.

Lo que agrega este lab está en `voicesLabContent.ts` y no son palabras: qué
empresa firma cada voz y de qué color va su card. Están acá y no allá porque la
sección viva no los usa, y el `Record` está tipado contra los ids reales — un
rename allá no compila acá en vez de dejar una card sin empresa en silencio.

## Antes de sacar cualquiera de esto de `/prototype`

⚠️ **Las citas no están verificadas.** Dos son reconstrucciones de fragmentos
tapados en el artboard y un cargo dice literalmente «Company xxx». Son cuatro
personas reales: leer la cabecera de `testimonialDeckContent.ts`.

⚠️ **Ninguna de las cuatro empresas tiene logotipo en el repo.**
`public/logos/` tiene abound, brave, ledger, venice y zodl — las de
`CUSTOMER_STORIES`, no las de estas personas. `Ribbon` y `Marks` componen el
nombre de la empresa en la serif del sitio, que dice el nombre correcto pero
**no es la marca de nadie**. TODO(asset): pedir los logotipos de DoubleZero,
Bitwise y Helius. El de Swihart falta antes: no se sabe la empresa.

⚠️ **El verde diagonal de la card destacada está muestreado de una captura**, no
tomado de la paleta. TODO(design) en `voicesLabContent.ts`.
