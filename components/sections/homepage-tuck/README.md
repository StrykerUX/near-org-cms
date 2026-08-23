# `homepage-tuck` — el hero que se recoge

Montado en `/prototype/homepage-k`. Rige el contrato general de
[`../README.md`](../README.md).

## Qué es

El hero pasa de ocupar la pantalla entera a quedar guardado en una tarjeta de
esquinas blandas, y de ahí la página sigue. **Sin iconos, sin palabras que se
transformen, sin nada que reemplace a nada.**

Es la comparación directa contra el pliegue de `homepage-fold` (rutas f–i), que
comprime el paisaje hasta meterlo dentro de la tipografía y hace DESAPARECER el
hero. Acá no desaparece: se encoge, le salen bordes, y se queda como una pieza
más de la página. Si el pliegue resulta demasiado, esto es lo que queda cuando
se le saca el truco y solo se conserva el cambio de encuadre.

## Lo único que hay que saber del código

**Es `clip-path`, no `transform`.** Un `scale` encogería el CONTENIDO: el
paisaje se vería alejado, como si la cámara retrocediera. Lo que se quiere es lo
contrario — que el encuadre se cierre pero lo que hay dentro siga a su tamaño,
como una ventana que se achica sobre una vista que no se mueve. `inset()` hace
eso, es interpolable de punta a punta (incluido su `round`) y no toca el layout,
así que el canvas de `HeroFoliage` nunca re-mide.

El titular sí se achica, pero con su propio tween y bastante menos que la caja
(10% contra 22%): acompaña el gesto sin quedar minúsculo. A la par se leería
como un zoom-out del conjunto, que es justo lo que el `clip-path` viene a
evitar.

## El mismo gesto, dos veces y al revés

La ruta usa el recogido **dos veces, en direcciones opuestas**:

| Sección | Qué hace |
|---|---|
| El hero (`HeroTuck`) | ocupa la pantalla entera y se **guarda** en una caja |
| El stack (`StackAnchors frame`) | llega **dentro** de una caja y se **abre** a pantalla entera |

Ninguno de los dos usa iconos, palabras que se transformen ni cortinas: lo único
que se mueve es el encuadre. Y por eso el stack no lleva ni cortina ni obertura
en ninguna de sus dos puntas — el gesto ES la transición.

El stack conserva todo lo demás igual que en la línea viva: su propio
encabezado, sus seis paradas y su pie.

**Dos detalles del modo `frame` de `StackAnchors`:** los dos tramos de la caja
(abrir y cerrar) caen FUERA del rango que el ensamble usa para sus paradas —
ocurren mientras la sección entra y sale, no mientras está plantada—, así que no
le roban un solo píxel al recorrido del arte. Y el pie de gobernanza/economía
pasa a montarse siempre DENTRO de la escena: su montaje de afuera es una sección
hermana con `bg-ink` a sangre, que fuera del recorte aparece como una banda
negra pegada bajo la caja.
