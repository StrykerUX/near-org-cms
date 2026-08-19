# `footer-labs/` — seis maneras de terminar la página

Alimenta **siete rutas**: `/prototype/footer-labs` (el índice) y una por
versión. No las importa ninguna página real, y eso es el punto.

## Qué se está probando

El footer de producción (`components/site/SiteFooter.tsx`) es un **takeover**:
a ~100px del fondo del documento tira del scroll hasta el borde y un wipe negro
de un viewport de alto sube tapando la última sección. Funciona, y es la única
respuesta que el sitio probó.

Estas seis son alternativas a esa respuesta. **La información es idéntica en
las seis** —el mismo titular, los mismos cuatro grupos de links, el mismo
legal, todo en [`footerLabContent.ts`](./footerLabContent.ts)— y lo que cambia
es el **layout y el mecanismo**. Si la copy también cambiara, la comparación
mediría dos cosas a la vez.

| # | Versión | Familia | Técnica | La apuesta |
|---|---|---|---|---|
| 01 | `Sheet` | takeover | hoja apoyada, el logo cede | Un objeto con esquinas que sube y se apoya sobre la página oscurecida |
| 02 | `Glyph` | takeover | `mask-image` del wordmark | El logo **es** la transición: se atraviesa por dentro y del otro lado está otra vez |
| 03 | `Ascend` | takeover | el wipe de producción, sin tirón | El original sin secuestrar el scroll y sin cortarse |
| 04 | `Reveal` | en flujo | `position: fixed`, sin scrub | El footer ya estaba abajo; la página se corre y lo descubre |
| 05 | `Kinetic` | en flujo | clip-path + máscaras, `once` | Se construye de abajo hacia arriba: fondo, wordmark, contenido |
| 06 | `Stack` | en flujo | `position: sticky`, timeline propia | Se pega al viewport y la escena corre sola en tres tiempos |

Hubo dos más —`Shutter` (obturador de siete lamas) y `Fold` (tapa abisagrada en
3D)— que se borraron al elegir. Están en el historial de git si hacen falta.

## La distinción que estructura el lab

**Takeover / en flujo** no es una etiqueta de estilo. Decide si el footer se
apropia del viewport tapando la última sección de la página, o si convive con
ella. Son dos respuestas distintas a la misma pregunta y por eso el índice las
separa: en una lista plana de seis se terminan comparando cosas que no
compiten.

## Una ruta por versión, y no las seis apiladas

`/prototype/hero-alt` apila sus seis heroes en una página. Acá no se puede, y
la razón no es de encuadre: **cinco de los seis mecanismos se disparan contra
el fondo del documento** —tres tapan el viewport, uno vive en `position: fixed`
detrás de la página— y solo hay un fondo del documento. Apiladas, la primera se
comería a las otras cinco.

Cada ruta lleva el mismo relleno dummy encima ([`LabFiller`](./LabFiller.tsx),
~2000px) para que el footer se juzgue **después de scrollear una página
entera**, que es la única condición en que se ve de verdad.

## El layout de los links, uno solo

`Resources` y `About` no son listas planas como `Products`: tienen
sub-secciones (Build / Learn / Connect, Fundamentals / Ecosystem), y apiladas
cada una cuesta su label **más** sus links. Con el layout de producción,
`Resources` mide doce renglones contra los cuatro de `Products` — así que el
alto de todo el bloque lo fija la columna más desbalanceada, y ese alto es la
causa de que el footer no entre en pantallas bajas.

El lab probó seis repartos distintos, uno por footer, y ganó éste: **el
sub-label en su propia columna a la izquierda y sus links en línea a la
derecha**, un renglón por sub-sección. `Resources` baja de doce renglones a
cuatro y los labels forman una vertical que se lee como índice. Los otros cinco
se borraron — mantener cinco layouts vivos para que ninguno se use es deuda, no
opciones.

Dos columnas de grupos y no cinco: las líneas de links son largas, y con cinco
tracks angostos "Chain Abstraction" y "NEAR Foundation" se parten en dos
renglones, que es volver a gastar el alto que se venía de ahorrar.

El ancho del bloque va **declarado** (`--links`) y no en `auto`. Con `auto` los
links piden todo lo que sus líneas pueden usar y el titular se queda con el
resto, que lo partía en cuatro renglones (`Where / money / actually / moves.`).
Fijándolo, lo que sobra es del titular — que es al revés y es lo correcto,
porque en las versiones con coreografía el titular llega primero y es lo único
en pantalla cuando llega.

### Los links legales son un grupo más

`Privacy`, `Terms of Use` y `Cookie Policy` ya no son una línea de letra chica al
pie: son el grupo **`Terms and Policies`**, con el mismo tratamiento que
`Products` o `Stack`. Son páginas del sitio como cualquier otra, y como grupo se
encuentran donde uno busca links — entre los links.

Al pie queda solo el copyright, en la esquina inferior derecha. Es la única
línea del footer que no es un destino, y por eso puede irse al borde e incluso
montarse encima del wordmark.

## Los dos hovers

Los links llevan dos efectos, alternados por grupo
(ver `DEFAULT_EFFECTS` en [`hoverEffects.tsx`](./hoverEffects.tsx)). Salen de
`/prototype/hover-lab` y están **portados, no importados**: una sección no puede
importar de una view, y allá cada variante es un componente de demo con su
propia lista de links de ejemplo, no una pieza reutilizable. El CSS de los
originales vive en `hoverLab.css`; acá el equivalente son utilidades Tailwind,
así que estos links no dependen de que nadie cargue otra hoja de estilos.

| Origen | Nombre | Qué hace |
|---|---|---|
| 15 | Char stagger | SplitText: sube en `power3.out`, vuelve en `elastic`. La ida y la vuelta con curvas distintas es lo que una transición CSS no puede expresar |
| 18 | Inertial indicator | Un chip que persigue al link y se **estira** en proporción al salto. Una transición no sabe cuánto va a viajar, así que no puede deformarse por ello |

Se probaron cuatro. Los otros dos —`05 · Brand ramp`, que barría el verde de
marca por el texto con `background-clip`, y `21 · Eased scramble`, que revolvía
las letras— se quitaron: los cuatro juntos hacían que el bloque de links
pareciera un muestrario y no un footer. Siguen en `/prototype/hover-lab`, que es
donde viven las alternativas.

**El 18 vino adaptado.** En el hover-lab recorre una columna vertical y solo se
mueve en Y. Acá los links de una sub-sección corren en línea, así que el chip
persigue en X y en Y y el estiramiento se aplica sobre el eje del salto
(`scaleX` dentro de una fila, `scaleY` al cambiar de renglón). Sin eso se veía
perpendicular al movimiento, que es al revés de lo que hace la inercia.

## El recorrido de `02 · Glyph`

Es el único de los seis con cuatro tiempos, y el orden importa:

1. El lector llega al fondo y el wordmark aparece a ancho completo, como en
   cualquiera de las otras cinco. No pasa nada más.
2. Cuando el logo está **entero a la vista**, empieza a crecer. El disparo es
   `start: "bottom bottom"` sobre el bloque del wordmark: su borde inferior
   tocando el de la pantalla es, exactamente, el primer frame en que se ve
   completo.

   Disparaba antes, a mitad de logo, y el efecto perdía su premisa: lo que crece
   tiene que ser algo que el lector ya reconoció como el wordmark. Con medio
   logo asomando todavía no lo es —es una fila de formas cortadas— así que no se
   leía como "el logo se agranda" sino como una mancha que aparece.
3. Crece **sesgado hacia abajo** hasta que un solo trazo cubre el viewport, y
   llegan el titular y los links.
4. Y en el fondo del footer vuelve a aparecer el wordmark, ahora en blanco. Se
   sale por donde se entró.

**El sesgo se consigue animando el anclaje.** Con la máscara fija al borde
inferior (`mask-position: 18% 100%`) crece solo hacia arriba; fija al superior,
solo hacia abajo, y la mitad de arriba del viewport se queda sin cubrir hasta
que entra el negro sólido — un salto visible. El anclaje arranca en 100%, donde
coincide al píxel con el wordmark en pantalla (que es lo que hace que el
crecimiento parezca salir del logo real), y llega a 25%: tres cuartos del glifo
crecen hacia abajo y uno hacia arriba.

**Las dos copias del logo se turnan, no conviven.** En reposo solo existe el
wordmark real; la máscara está apagada y se enciende en 120ms mientras la otra
se apaga. No son idénticas —el real lleva el corte óptico que lo sienta sobre el
borde y una `mask-image` no puede aplicarlo— y con las dos encendidas se veía el
logo DOBLE, con una silueta corrida unos píxeles. Fue el defecto más visible que
tuvo esta versión.

## El problema de la altura, y las dos respuestas de 07 y 08

El footer de producción se corta. En un viewport bajo —un portátil de 13", una
ventana a media pantalla, un navegador con barras— el panel del takeover se
ancla al borde inferior, crece hacia arriba y el titular junto con las primeras
filas de links se salen por el borde superior. Arriba es el peor sitio donde
perder contenido: no hay forma de llegar a él, porque el takeover ocupa la
pantalla entera.

La causa que no se ve a simple vista: **el wordmark**. A ancho completo su alto
es el 26% del ancho de la página — 400px en un portátil y 870px en un monitor
de 3440. Cuanto más ancha la pantalla, más alto el logo y menos presupuesto
queda para el resto. Comprimir el texto y dejar el logo intacto es comprimir la
parte barata; fue el primer intento de `07` y se seguía cortando igual.

Las dos versiones nuevas responden distinto a propósito, para poder elegir:

| | `03 · Ascend` | `01 · Sheet` |
|---|---|---|
| Estrategia | **Achicar el logo** para que entre entero | **Recortar el logo**, el texto no se toca |
| Aire | Todo en `svh`, no en `rem` | Todo en `svh`, no en `rem` |
| Titular | Baja de token con media queries de ALTURA (`text-h1`→`h2`→`h3`) | Baja un token a partir de 820px |
| Wordmark | `w-[min(100%,calc(26svh*3.847))]` — nunca pasa de un cuarto de pantalla, en cualquier ancho | Ancho completo, tope 2000px. Se lleva el espacio que sobra y se sangra por abajo si no alcanza |
| Links | Las cuatro columnas de producción | Las cuatro columnas de producción |
| Si aun así no entra | El takeover no se monta y el footer se lee en flujo | No puede pasar: los bloques de texto son `shrink-0`, el único que cede es el logo |

El `3.847` de `Ascend` es la relación del asset (981÷255): dicho al revés, esa
expresión fija el ancho del logo a partir del alto que se le quiere dar.

`Sheet` no necesita ningún número: **`align-items: safe flex-end`** hace las dos
cosas sola. Cuando sobra espacio, `flex-end` sienta el logo contra el borde
inferior, igual que en las otras siete; cuando falta, la palabra clave `safe`
invierte la alineación a `start` en vez de desbordar hacia el borde que se
recorta primero, así el excedente sale por abajo. Sin `safe`, un hijo más alto
que su contenedor alineado al final desborda hacia ARRIBA y el recorte se
comería justo la parte del logo que lo hace reconocible.

Que el que ceda sea el logo y no el texto es la decisión de fondo: un wordmark
cortado por la base sigue siendo el wordmark —los hombros de la "n", la "e" y la
"a" ya lo identifican, y se lee como sangrado deliberado—; un titular cortado
por arriba se lee como un bug.

Las otras cuatro no llevan ninguno de los dos arreglos: el lab muestra el
contraste. Achicá la ventana a lo alto y comparalas contra `01` y `03`.

## Desktop primero

Decisión explícita del lab: las ocho resuelven su idea en **≥1024px con
`prefers-reduced-motion: no-preference`**, y por debajo de eso caen todas al
mismo [`FooterStaticFallback`](./FooterStaticFallback.tsx). Seis fallbacks
distintos serían seis diseños más que revisar sin que ninguno responda la
pregunta que el lab hace.

El swap lo hace CSS, con dos árboles complementarios:

```
FooterStaticFallback → lg:motion-safe:hidden
versión animada      → hidden lg:motion-safe:block
```

Que sean dos árboles y no un estado de React es lo que permite que cambiar la
preferencia de movimiento en vivo no necesite re-render — y que sin JS quede el
estático, que es la degradación correcta.

## Lo que las seis cumplen

- **Nunca `pin: true`.** El recorrido se declara en CSS y el ScrollTrigger solo
  lo lee. Razonamiento largo en [`../README.md`](../README.md) y en
  `primitives/motion/stickyScene.ts`.
- **Nadie tira del scroll.** El footer de producción, al cruzar su umbral, hace
  `gsap.to(scroller, { scrollTop: maxScroll })`: durante esos 450ms el scroll no
  es del lector. Ninguna de las seis hace eso. Las que tapan la pantalla
  arrancan cuando el lector llegó al fondo por su cuenta.
- **Ninguna usa `once`, y todas se deshacen al subir.** Tres entraban con
  `once`, con el argumento de que un footer que se re-anima cada vez que el
  lector sube dos líneas y vuelve a bajar es ruido. El argumento estaba bien
  pero la conclusión no: lo que hay que evitar es que se REPITA por un gesto
  mínimo —de eso se encargan el `start` y el `end` del trigger—, no que se pueda
  deshacer. Con `once`, quien vuelve hacia arriba se lleva un footer congelado
  en su estado final, y en las que tapan la pantalla, una página tapada que no
  se destapa.
- **La salida es más rápida que la entrada**, no la entrada al revés: corre a
  `EXIT_SPEED` (1.7, o sea ~60% del tiempo). Entrar es el gesto y vale la pena
  mirarlo; salir es una corrección — el lector ya decidió volver a lo suyo y lo
  que quiere es que el footer se quite de en medio.
- **El disparo es uno solo para las seis**: `enterExit()` en
  [`footerScene.ts`](./footerScene.ts). Ahí vive también el detalle de por qué
  `timeScale` se resetea en cada `play()` (sin eso, la segunda entrada hereda la
  velocidad de la salida anterior y el gesto se acelera solo cada vez que el
  lector sube y baja).

### El `z-index` de la hoja

`FooterLabShell` envuelve todo lo que va encima del footer en un bloque con
fondo propio y `z-10`. **No es decoración**: es lo que permite que `04 · Reveal`
monte su footer en `position: fixed` (`z-0`) detrás de la página. Sin ese
bloque, un footer fijo se pinta ENCIMA del texto en flujo —los elementos
posicionados van después del contenido en flujo en el orden de pintado— y no
alcanza con ponerlo antes en el DOM.

Las versiones que tapan van en `z-30`, igual que `SiteFooter` y por el mismo
motivo que su comentario explica.

### `mask-position` en `03 · Glyph`

El punto que se agranda tiene que caer sobre **trazo**, no sobre una
contraforma: al centro del wordmark le toca el hueco entre la "e" y la "a", y
ampliarlo abriría un agujero de página en medio del negro. `18%` cae dentro del
asta de la "n".

Que ese `18%` no rompa el estado de reposo es una propiedad de cómo CSS
resuelve `mask-position` en porcentaje —el offset es `(contenedor − imagen) × p`,
así que con la imagen al 100% del contenedor el offset es 0 sea cual sea el
porcentaje. El encuadre solo empieza a importar cuando la máscara ya creció.

### El `immediateRender` de `fromTo` en una escena escalonada

`06 · Stack` usaba `fromTo` dentro de su timeline y el estado inicial de las
cuatro columnas salía mal: a mitad de escena aparecían las tres últimas y
faltaba la primera — el stagger al revés.

`fromTo` aplica su "from" en el frame en que se CREA, no en el punto de la
timeline donde está colocado. Con varios escalonados sobre targets que además se
re-miden en el refresh del provider, quién pisa a quién depende del orden de
creación. La regla que salió de ahí, y que las versiones nuevas siguen:
**`gsap.set` para el estado inicial y `.to()` para los tweens.**

## El footer de producción no se monta acá

`PrototypeFooterSlot` excluye `/prototype/footer-labs` **por prefijo**. Si se
montara, habría dos footers peleándose por el mismo borde inferior y ganaría el
de producción, que va después en el DOM — tapando justo lo que la página existe
para mirar.
