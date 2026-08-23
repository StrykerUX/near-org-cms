# `about` — las tres propuestas para `/about`

El contrato general de [`../README.md`](../README.md) aplica. Acá va solo lo
específico de esta página.

> **Nota de idioma.** Los comentarios de esta carpeta están en **inglés**, igual
> que [`../chain`](../chain/README.md) y [`../quantum`](../quantum/README.md).
> Los README de carpeta siguen en español.

**Las palabras no se deciden acá.** Vienen del deck y viven en
[`aboutContent.ts`](./aboutContent.ts). Los titulares siguen en el JSX por el
motivo que da el README padre: llevan `<Accent>`, y pasarlos a datos exige
elegir un esquema para "texto con un tramo acentuado", que es una decisión del
modelo de contenido y no un refactor.

No se agregó ni una línea de copy. Hubo un lugar donde el layout pedía una
bajada que el deck no tiene —debajo del *eyebrow* del cierre de B— y se dejó
vacío a propósito: una frase escrita para tapar un hueco de composición es copy
que existe porque el diseño la necesitaba, no porque la página tuviera algo más
que decir. El comentario está en `b/ClosingCoda.tsx`.

## Los años son datos, no prosa

Es la decisión que sostiene a las tres variantes y está explicada largo en la
cabecera de `aboutContent.ts`. En resumen: el deck trae ocho capítulos titulados
con las fechas metidas adentro de las oraciones. Esta es **la única página del
sitio donde el orden es información** —el arco va de dos personas esperando
modelos a los modelos llegando— así que el año se sacó de la prosa y se hizo un
campo (`year`, `yearLabel`). Cada layout lo puede poner de marcador sin que
ninguno tenga que parsear un párrafo.

`marker` es el capítulo reducido a la línea que un raíl o un índice pueden
cargar. No es un resumen del cuerpo: es el mismo golpe dicho una vez y corto. La
variante C es la que lo gasta en su columna principal.

Los dos rangos (`2018 — 2020`, y el capítulo fundacional) están sin emprolijar a
propósito. Redondear cualquiera de los dos a un año inventaría una fecha que la
fuente no afirma.

## La forma de la historia, que es lo que las tres tienen que dejar legible

Empieza con dos personas que querían que la IA escribiera código, se topan con
un problema de pagos, construyen una blockchain «que iban a tardar seis meses», y
ocho años después los modelos que necesitaban por fin existen — y la red que
construyeron mientras esperaban resulta ser la que esos modelos necesitan.

**Es un círculo, no una línea.** Las tres preguntas de `QUESTIONS` son el
estribillo que lo cierra: son las preguntas del principio y vuelven al final.
Cada variante las trata distinto y ahí es donde más se diferencian entre sí.

## Las tres

| | Carpeta | La apuesta |
|---|---|---|
| **A · Spine** | `a/` | Un aparato de lectura: raíl de años a la izquierda, prosa a la medida en el medio, notas al margen a la derecha. Un solo fondo para toda la historia. |
| **B · Chapters** | `b/` | Un libro: cada era abre a pantalla completa con su año enorme, y el fondo cambia con el arco. Sin raíl. |
| **C · Index** | `c/` | Un registro: índice real con anclas, y dos columnas sostenidas —año + `marker` a la izquierda, prosa a la derecha— para quien vino a buscar un dato. |

### A · Spine

`AboutHero` · `ChapterSpine` · `ClosingRefrain`

El raíl es un `<nav>` de anclas, no un adorno: dice dónde estás **y** te lleva a
otro lado. Es `position: sticky` de CSS; el ScrollTrigger por capítulo solo LEE
qué índice está cruzando el 55% del viewport. Nada de `pin`.

**Un solo mecanismo marca el capítulo en curso, y es el filete.** Los candidatos
eran color, peso, sangría y largo del filete; usar dos a la vez es lo que hace
que un marcador se lea como diseño en vez de como información. El filete del año
activo corre todo el ancho del raíl y los otros siete quedan en un tick corto.
Nada más cambia. El color sí se usa, pero para otro trabajo —hover y foco de
teclado—, y esa separación es deliberada: el puntero del lector se lleva el
color, la posición de lectura se lleva el largo. `aria-current` se escribe desde
el mismo lugar, así que el estado no viaja solo en una propiedad visual.

El estado de reposo del filete está en CSS (`scale-x-[0.18]`) y el tween solo se
mueve desde ahí: sin JS el raíl queda con ocho ticks cortos, no con ocho filetes
enteros ni con ninguno.

**En móvil el raíl desaparece y cada capítulo lleva su año.** La otra opción era
una cinta horizontal pegada arriba, descartada por dos motivos. El header del
sitio ya es `fixed`, así que una segunda franja pegada en 375px gasta un tercio
del viewport en chrome antes de la primera palabra; y el trabajo real del raíl es
«dónde estoy entre ocho», que es una pregunta que nadie se hace cuando en
pantalla entra un capítulo por vez.

El raíl, la prosa y las notas son **hermanos de una sola grilla** con filas
declaradas a mano (`ROW_START`), no un raíl al lado de una sub-grilla de
capítulos. Es lo que hace que una nota caiga en las columnas 10-12 **de la
grilla de la página** y no en las 10-12 de una sub-grilla cuyos gutters ya no
coinciden con nada.

### B · Chapters

`CoverHero` · `ChapterSpread` ×8 · `ClosingCoda`

**El orden de fondos ES el argumento, y vive en `AboutBView`.** `ChapterSpread`
sabe ponerse un tono; no sabe cuál le toca. La secuencia es
`cream ×4 · ink ×2 · slate · white`, y el porqué de cada tramo está comentado en
la view. Lo que hay que proteger si alguna vez se rebalancea: el corte
`white → ink` entre el capítulo 2026 y la coda es el borde más duro de la
página y es lo único que separa al estribillo de ser una sección más.

El `note` es un **epígrafe de cierre**, no un intercalado. El brief pedía
intercalarlo en la prosa, y no se puede: de los dos capítulos que tienen nota, el
primero tiene **un solo párrafo**. Ponerla al final en los dos casos mantiene el
recurso idéntico, que es lo que lo hace leerse como recurso y no como accidente
de longitud.

La serif itálica se la lleva la **etiqueta** de la nota, no su cuerpo. «Attention
Is All You Need» y «The loop closes» ya son la frase que el capítulo venía
ganando; el mismo tratamiento sobre cuatro oraciones de explicación sería un
párrafo en itálica, que es otra cosa y peor. Kepler sigue siendo acento.

El año usa `text-display lg:text-mural`. `Container` mantiene 60px de padding a
cualquier ancho, así que en 375px el *query container* mide 255px, `10.2cqw` cae
por debajo del piso del propio clamp y el mural sale a 40px — un h2 disfrazado.
Los dos son tokens de la escala; es una elección responsive entre ellos, no un
override local.

### C · Index

`IndexHero` · `ChapterIndex` · `ChapterLedger` · `ClosingAnswer`

La afirmación del layout es comprobable: **leé solo la columna izquierda, de
arriba abajo, y tenés la historia entera en ocho líneas.** Para eso existe
`marker` en el content module, y esta es la variante que le da su columna
principal.

**La columna izquierda es sticky, y eso es la promesa de las dos columnas.** Sin
eso, un lector cuatro párrafos adentro de 2024 tiene el año y el marcador fuera
de pantalla, y el layout se volvió en silencio una sola columna con una etiqueta
arriba. El sticky la mantiene a la vista exactamente lo que dura su propia prosa
y la suelta en el capítulo siguiente: el encabezado de una fila de registro,
comportándose como tal.

El índice usa `<a href="#id">` pelado, no `<Link>`: son enlaces de fragmento
dentro del documento, no navegaciones, y la regla del repo sobre `<Link>` es
para cruzar rutas. **`scroll-behavior: smooth` está deliberadamente apagado**:
la ruta monta Lenis, que maneja el scroll por su cuenta, y una animación nativa
corriendo al mismo tiempo le pelea. El salto es instantáneo y aterriza bien
porque cada capítulo lleva `scroll-mt-[var(--site-header-block)]` para el header
fijo.

Las tres preguntas aparecen **dos veces** —chicas al lado del hero, a escala de
heading después del último capítulo— con la misma numeración mono. Es la firma
de la variante. Si se edita una instancia hay que mover la otra: media rima es
una sobra.

## Qué se descartó

**La línea de tiempo de puntitos.** Es el dibujo obvio para ocho capítulos
fechados y no está en ninguna de las tres, por un motivo concreto y no por
gusto: una timeline de nodos le da a los ocho capítulos el mismo peso visual y
la misma forma, así que una página cuyo argumento entero es que la historia
**se dobla** —investigación, desvío, infraestructura, regreso— se renderiza como
ocho cuentas idénticas. Encima gasta una columna en un adorno que no carga ni
una palabra.

En A esa columna la ocupan los años, que además son anclas. En C la ocupan los
marcadores, que son la historia en ocho líneas. En C el argumento es todavía más
fuerte: el borde izquierdo es lo único que un lector que escanea llega a leer, y
el adorno es la cosa más cara que podría ir ahí.

**Las cajas con borde para agrupar capítulos.** Doctrina de la casa; el
razonamiento largo está en el comentario «Why not cards» de
[`../chain/WhyItMatters.tsx`](../chain/WhyItMatters.tsx). Acá separa el filete,
en las tres variantes.

**Una escena pegada con el año animándose.** Se descartó antes de escribirla: el
recurso ya está gastado en `chain/CapabilityStack` y `quantum/ThreatSequence`, y
esta página tiene ocho capítulos, no cuatro tiempos. Ocho escenas pegadas son
dieciséis pantallas de scroll para leer prosa.

## Reusado, no copiado

Las tres variantes importan `CtaPill` de [`../quantum`](../quantum/README.md),
igual que `chain` y `protocol`. El link secundario del cierre es interno
(`/blockchain`) y va con `next/link`, no con la pill: la pill siempre renderiza
un `<a>` pelado, y dos pills juntas además dejarían al par sin jerarquía.
