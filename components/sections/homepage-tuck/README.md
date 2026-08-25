# `homepage-tuck` — el hero que se recoge

Montado en `/prototype/homepage-c` y en su duplicado `/prototype/homepage-d`. Rige el contrato general de
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

## Las otras secciones de la carpeta

La carpeta empezó siendo el hero y ya no lo es. Las que siguieron nacieron para
esta ruta —o para su duplicado, `homepage-d`— y se montan solo ahí, aunque no
tengan nada que ver con el recogido.

### `ProofLedger` — las seis pruebas como un balance

Reemplaza a `homepage-shared/ProofDatum` (el eje horizontal con seis fichas
alternadas) **solo en esta ruta**; aquella sigue montada en `homepage-b`.

Seis asientos separados por un punteado. Cada uno pone la cifra a la izquierda
—numeral en sans con su signo pegado, y debajo la palabra en serif itálica— y
el argumento a la derecha, encabezado por una píldora. Cuatro cosas que conviene
saber antes de tocarla:

- **El eje es la sección.** Las seis cifras terminan sobre una misma vertical
  invisible al 49% del bloque. No hay línea dibujada ahí y no hace falta: seis
  renglones que terminan en el mismo punto la crean, y eso es lo que convierte
  seis datos sueltos en una serie.
- **Todo mide en `cqw`** contra un `@container` propio. El artboard fija
  proporciones, no píxeles, y en `vw` se rompen justo cuando el `Container` topa
  en su `max-width`.
- **Dos ScrollTriggers por renglón**, y son dos porque los límites no caen en el
  mismo punto del scroll: uno reproduce en `top 88%`, el otro rebobina en
  `top bottom`. Con el rebobinado colgado del primero, el bloque se apagaba a la
  vista de quien subía.
- **El numeral es lo único que no se parte en letras.** El contador reescribe
  `textContent` en cada cuadro y eso borraría los spans de SplitText.

Las dos pruebas sin cifra —«Quantum-ready», «Confidential»— entran a la MISMA
lista y no cierran aparte: en un asiento de dos columnas una palabra puede
ocupar el lugar de un número sin fingir que lo es. Va a la mitad de la escala
del numeral, y esa mitad se declara en `em` para que las dos se muevan juntas.

### `ProofRoster` — las mismas seis, como índice de capacidades

Montada solo en `/prototype/homepage-d`, que es `homepage-c` con esta sección en
lugar de `ProofLedger` y **todo lo demás idéntico**. Esa igualdad es lo que hace
útil la comparación: cualquier diferencia entre las dos rutas es de esta
sección, por construcción.

Sobre crema, seis renglones: «Built to» + el verbo en serif grande (Last, Scale,
Connect, Reach, Resist, Privacy) y el cuerpo a la derecha. **La cifra no se ve**
— aparece al pasar por encima, colgada del borde derecho de la palabra.

- **El verbo sale de partir el `eyebrow` por su último espacio.** No hay un campo
  nuevo ni una segunda lista de seis palabras que se desincronice con la primera.
- **El verbo va en Kepler ITÁLICA del master Display** (`serif-roster`), no en
  la romana Subhead de `text-h1-serif`. A 74px el Subhead tiene el trazo grueso
  de una serif de texto; el Display está cortado para astas finas y contraste
  alto. La itálica es la face real, no una romana inclinada. Kepler entra al
  repo con un solo peso por master, así que no hay un corte Light que pedir: lo
  que hace ligera a esta itálica es el contraste del dibujo.
- **La cifra en hover va en sans y a cuerpo de `h3`** — es lo segundo más grande
  del renglón. No es un pie de la palabra: es la prueba de lo que la palabra
  afirma. Y **no existe sin mouse**, así que abajo de `lg` se muestra siempre y
  en flujo; el cuerpo de la derecha, que dice el mismo dato en palabras, no se
  esconde nunca.
- **Va en crema y no en el negro de su referencia.** El stack cierra su caja
  negra sobre el papel justo encima y en negro ese gesto se queda sin fondo; y
  esta ruta se mide contra `homepage-c`, así que cambiar el tono a la vez que la
  estructura habría dejado dos variables moviéndose juntas.

### `TestimonialDeck` — lo que otros dicen, en un mazo que avanza

El único tramo oscuro del final de la página, y va después del newsletter porque
es el cambio de **voz**: hasta ahí NEAR habla de sí misma.

**La idea es que el mazo ES el índice.** La card de adelante y la cita gigante
de la izquierda son la misma persona; avanza el mazo y cambia la cita. Un mazo
en perspectiva al lado de una cita fija es decoración —tres rectángulos en
diagonal—; un mazo donde lo que está adelante es lo que se está leyendo
convierte a las cards de atrás en testimonios esperando turno.

- **Las posiciones van en anchos de card, no en píxeles**, y GSAP las aplica con
  `xPercent`/`yPercent`. El abanico se reacomoda solo al cambiar el ancho de la
  card: no hay `resize` que escuchar. `transform-origin: top left` es lo que
  hace legibles esos números — con el origen en la esquina, el `scale` no mueve
  el punto que la posición declara.
- **La card que deja el frente no viaja hasta el fondo**: sale hacia el lector,
  se apaga, se teletransporta y vuelve a encenderse atrás. Interpolar esa
  distancia se lee como una card que se escapó, no como una que se fue al fondo.
- **El `style` inicial de cada card no puede depender del estado de React.** Es
  el abanico para cuando no hay JS, y sale de `i` y no del slot vivo: React solo
  reescribe las propiedades de `style` que cambiaron, y un `transform` que
  cambia con el índice se lo pisa a GSAP a mitad del tween.
- **⚠️ Las citas no están verificadas.** Dos son reconstrucciones de fragmentos
  tapados en el artboard y un cargo dice literalmente "Company xxx". Son cuatro
  personas reales: leer la cabecera de `testimonialDeckContent.ts` antes de
  sacar esto de `/prototype`.
