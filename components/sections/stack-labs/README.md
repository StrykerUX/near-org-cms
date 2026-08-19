# `stack-labs/` — ocho layouts para el mismo ensamble

Alimenta **nueve rutas**: `/prototype/stack-labs` (el índice) y una por variante.

Las cinco primeras (A–E) no las importa ninguna página real, y eso es el punto.
Las tres últimas (F, G, H) sí: cada una es la sección del stack de uno de los
tres drafts EX — `ExDraftView` las recibe por prop y las **importa de acá**, no
las copia (mismo criterio que `OwnYourOwn`).

## Qué se está probando, y qué NO

El arte del NEAR Stack —la columna y los tres anillos, con su build-in, su
build-up por capa y su hover— **funciona y no está en discusión**. Lo que falla
es el layout que lo rodea: el ensamble vive en una celda de la mitad izquierda a
media escala, el texto en cuatro pills a la derecha, y el 40% de la pantalla
vacío.

Las ocho variantes montan **el mismo arte y la misma copy**
(`home-ab7/nearStackContent.ts`, sin tocar). Lo único que cambia:

- a qué **escala** se muestra el ensamble y **dónde se corta**;
- **dónde vive el texto** respecto de él;
- cuánto **scroll** cuesta.

## Las ocho

| | Variante | Recorrido | La apuesta |
|---|---|---|---|
| **A** | `StackBleed` | 240svh | El ensamble se sale por el borde derecho y el inferior: no cabe, y por eso se lee grande. Las capas pasan de pills a renglones tipográficos |
| **B** | `StackBroadsheet` | **0** | Las cuatro capas completas a la vez, con los tres productos en línea. La sección es una página, no un acordeón |
| **C** | `StackAnchors` | 200svh | El texto vive PEGADO a su capa: cada ficha anclada a su pieza con un trazo. La posición del texto significa algo |
| **D** | `StackBlueprint` | **0** | El stack como plano: retícula, líneas guía, rótulos en mono. Todo anotado a la vez |
| **E** | `StackTraveling` | 380svh | Pantalla partida: el arte en plano cerrado sobre la capa activa. El arte no cambia — cambia desde dónde se mira |
| **F** | `StackAxis` | 260svh | El rótulo de la parada, a tamaño de póster y **acostado sobre el plano isométrico** del arte a sangre. Siete palabras, una por parada (`/prototype/ex1`) |
| **G** | `StackConcentric` | **0** | El layout ES el diagrama: el ensamble centrado y las capas en cuatro marcos concéntricos. Se navega con el puntero (`/prototype/ex2`) |
| **H** | `StackDolly` | 300svh | **A × E**: el arte a sangre y los renglones de A, más la cámara de E. Sin pantalla partida — el visor son los bordes de la ventana (`/prototype/ex3`) |

Contra los **320svh** del `NearStackV2` de ab7: tres variantes bajan a cero o
casi, tres recortan, y una (E) sube — a propósito, para tener el extremo caro
con el que comparar.

**F, G y H salieron después**, cuando A (Bleed) y E (Traveling) ya eran las dos
favoritas: H es explícitamente el cruce de esas dos, y F y G son las dos
direcciones que ninguna de las cinco había probado — la tipografía como parte
del objeto, y el layout como diagrama.

## Cómo está repartido el código

La decisión fue **una sección editable por separado cada una**, con el precio
asumido de que un ajuste de layout hay que hacerlo en todas. Eso se cumple:
cada `Stack*.tsx` trae su layout entero y ninguna sabe de las otras. (H copia de
A los renglones y de E los encuadres: es una mezcla de dos layouts, no una capa
compartida sobre ellos — el día que A cambie, H no cambia.)

Lo que **no** se copió una vez por variante, y por qué:

| Módulo | Qué es | Por qué compartido |
|---|---|---|
| `stackAssembly.tsx` | Las cuatro capas, sus sombras, el mark y las reglas de iluminación | Es **geometría medida** contra los exports de brand (las x salen de las máscaras horneadas). Ocho copias no dan ocho versiones para elegir: dan ocho sitios donde el mismo número puede estar mal |
| `useStackScene.ts` | Build-in de la columna, recorrido por paradas, hover por delegación, el tag al cursor | Es el gesto que **ya funciona y nadie pidió cambiar**. Copiado, "arreglá el hover" son ocho ediciones y el mismo bug puede esconderse ocho veces |
| `StackCursorTag.tsx` | El pill clavado al cursor | Idem |

**Si una variante necesita desviarse de la mecánica**, el camino es una opción
del hook (como `mode`) o copiar el hook para ESA variante — no editar el
compartido hasta que sirva a todas a medias.

El arte generado (`home-ab7/stackArt.generated.tsx`, ~287KB de paths) se importa,
nunca se duplica.

## Qué quedó fuera del arte

**Los cubos partidos.** En `NearStackV2`, el hover sobre la columna la parte en
sus seis cubos, cada uno un feature del protocolo, con su corredor de hover por
posición Y y su caja de texto. Es lo que más código arrastra y quedó fuera por
decisión del lab: si una variante gana, se le vuelve a enchufar.

Lo que sí conservan todas: el build-in de la columna, el build-up por capa,
el hover de capa y de producto de AI, las sombras y el mark.

## `mode: "track"` vs `"static"`

`track` (A, C, E, F, H) — la sección es un tramo alto con un viewport sticky adentro y
el progreso se reparte en una rebanada por parada. Es el mecanismo del original.

`static` (B, D, G) — la sección mide lo que mide y el ensamble está **completo desde
el principio**.

Detalle que costó encontrarse: el estado de `static` se setea al activar la
escena y **no** desde un `ScrollTrigger` con `onEnter`. `onEnter` no dispara
cuando la sección ya está dentro del rango al crearse el trigger —una recarga a
media página, una llegada por ancla, un viewport alto— y el resultado era una
sección que se quedaba con la columna sola y sin anillos, para siempre.

En ninguno de los dos modos hay `pin: true`. El razonamiento largo está en
[`../README.md`](../README.md).

## Cada variante en su ruta, y no las ocho apiladas

`hero-alt` apila sus seis versiones en una página; acá no. El ensamble son
~287KB de paths y cinco de las ocho montan además un track sticky propio: ocho
árboles de ese tamaño en una misma página se notan al scrollear, y lo que se
estaría midiendo entonces es la página, no la variante.

(F, G y H viven además montadas en su draft EX, que es su contexto real: la
ruta del lab es para compararlas contra A–E con el mismo relleno alrededor.)

Cada ruta trae **una pantalla de aire antes y otra después** (`StackLabShell`),
las dos claras: en la homepage la sección entra después de `OwnYourOwn` y
entrega a la de pruebas, así que el corte contra el negro —a la entrada y a la
salida— es parte de lo que hay que mirar.

## Solo desktop

Decisión explícita: todas resuelven su idea en **≥1024px con
`prefers-reduced-motion: no-preference`**. Por debajo de eso `useStackScene` no
activa la escena, el ensamble queda completo y en verde, y cada variante cae a
su propio flujo vertical — que **no está diseñado**, solo es correcto (G trae
una lista, las demás caen a su propio flujo). Ocho layouts móviles serían ocho
diseños más que revisar sin que ninguno responda la pregunta que el lab hace.

## Si una variante gana

Se lleva a `components/sections/home-ab7/` reemplazando a `NearStackV2`, y ahí
hay que decidir tres cosas que el lab deja abiertas:

1. **Los cubos partidos**: si vuelven, y cómo conviven con el layout elegido.
2. **El móvil**, que acá no está diseñado.
3. **Si el arte y la escena se promueven** a módulos compartidos de verdad
   (`stackAssembly` + `useStackScene` ya lo están dentro del lab) o se funden de
   nuevo en un componente único como hoy.
