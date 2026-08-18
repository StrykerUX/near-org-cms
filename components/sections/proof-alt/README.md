# `proof-alt/` — tres versiones de la sección de pruebas

Alimenta **una sola ruta**: `/prototype/proof-alt`. No la importa ninguna
página real, y eso es el punto.

## De dónde viene

El `ProofStepper` de `/prototype/homepage-ab7` gasta **325svh** —cinco pasos de
45svh más un viewport pegado— para entregar cinco datos, y el lector pasa dos
pantallas y media de rueda sin que la página avance.

**Hubo una primera ronda de diez versiones** (tablero Solari, dial, carril
horizontal, plotter en canvas, cartas hojeables…). Está en el commit `b145ca6`
y se borró a propósito: siete de las diez escondían cinco de las seis pruebas
detrás de un gesto. Una sección de homepage tiene que entregar las seis sin que
nadie toque nada, y ese requisito mató a la mayoría del catálogo de golpe.

## Las reglas, que ya no se discuten

Las tres versiones que quedan cumplen todas:

1. **Las seis cifras visibles a la vez, desde el primer frame.** Nada se revela
   al pasar el puntero. El hover puede añadir, nunca descubrir.
2. **Light mode.** La sección entra después del negro de NEAR Stack y entrega
   al stone de la newsletter: el blanco puro (`bg-background`) es el corte más
   limpio que tiene la página en ese punto.
3. **El cuerpo completo de las seis**, sin recortar. Los datos siguen
   argumentando; no se convierten en un cartel.
4. **100svh de alto y cero recorrido extra**, incluida la que va por scroll.

## La composición es una sola

`ProofComposition.tsx` — seis bloques (rótulo · cifra · regla · cuerpo)
repartidos en doce columnas **sin alinearse entre sí**, y dos de las seis a
escala de `h1` contra las otras cuatro a `h2`.

Es un solo componente y no tres copias por el mismo motivo que los "motores" de
`hero-alt`: lo que se compara entre las versiones es el MECANISMO. Con tres
markups parecidos, la comparación mediría también las diferencias de
maquetación que se colaran sin querer.

Dos decisiones que viven ahí y conviene no deshacer:

- **Por qué asimétrica.** Una grilla 3×2 regular se lee como tabla: el ojo la
  barre en zeta, encuentra seis datos equivalentes y sigue. Que las cifras
  arranquen a distinta altura y midan distinto obliga a recorrerla y dice cuál
  importa más.
- **El layout es un mapa literal de clases**, nunca un template string:
  Tailwind v4 no detecta clases construidas en tiempo de ejecución y las purga.
  Todas llevan prefijo `lg:` — por debajo de 1024px la composición es una
  columna, y eso no es una degradación: en un móvil no hay doce columnas que
  repartir.

## Las tres

| # | Versión | Técnica | De dónde sale el movimiento |
|---|---|---|---|
| 01 | `CadenceStack` | DOM + GSAP | De la **entrada**: un frente en diagonal revela los seis bloques al aparecer en cuadro, y después la sección no se mueve nunca más |
| 02 | `HaloField` | WebGL2 · shader propio | De una **capa de fondo**: curvas de nivel en gris casi blanco que derivan muy despacio. Es la 01 más esa capa, y nada más |
| 03 | `StaircaseDrift` | DOM + GSAP · scroll | Del **scroll**: los seis bloques van escalonados mientras la sección entra y se enderezan justo cuando queda centrada |

La 01 y la 02 comparten la entrada (`diagonalReveal.ts`), no una parecida: la
02 es la 01 con una capa encima, y lo que se compara entre ellas es esa capa.

### Detalles que cuestan de descubrir

**01 — el orden de entrada es la diagonal, no el DOM.** Los bloques se ordenan
por `left + top × 1.6` de su caja, medido dentro del efecto. Con el orden del
DOM, el bloque de arriba a la derecha entra antes que el que tiene a su
izquierda y el frente se ve roto. El peso extra en `top` evita que en un
monitor muy ancho la diferencia horizontal domine y el frente salga vertical.

**02 — el fondo no puede pedir atención, y eso es un número.** Las líneas van a
`#ECEAE4` sobre blanco: ~4% de contraste, y el campo se desvanece contra el
borde superior e inferior para que el blanco de la sección y el de la página
sean el mismo blanco. La deriva es de 0.014 unidades por segundo — si se ve
moverse, está mal calibrado. Lo que aporta no es movimiento, es profundidad: un
blanco liso de 100svh entre una sección negra y una gris se lee como un hueco.

**02 — el shader es el único GLSL ES 3.00 del repo.** Las curvas de nivel
necesitan `fwidth()` para tener ancho constante en píxeles, y en ES 1.00 eso
vive tras `GL_OES_standard_derivatives`, una extensión de WebGL1 que en un
contexto WebGL2 **no existe**. El detalle completo está en la cabecera de
`shaders/haloField.ts`, con el mensaje de error exacto.

**02 — el canvas se esconde en cualquier fallo.** El contexto se pide con
`alpha: false`, así que un canvas montado y sin pintar es un rectángulo NEGRO a
pantalla completa. Escondiéndolo, lo que queda es el `bg-background` de la
sección, o sea exactamente la versión 01: **la degradación de la 02 es la otra
propuesta**, lo cual dice bastante sobre cuánto aporta la capa.

**03 — cómo va por scroll sin costar scroll.** El recorrido no es un track: es
el paso natural de la sección por el viewport (`top bottom` → `bottom top`,
solo lectura, sin `pin` y sin altura declarada). Un pin o un track de 200svh
insertan altura y obligan a gastar rueda sin avanzar, que es la queja que abrió
todo esto. El desfase de cada bloque vale su máximo cuando la sección entra,
cero cuando queda centrada, y el máximo con el signo cambiado cuando sale: la
composición está escalonada mientras pasa y se endereza justo cuando se lee.

## Degradación

| | sin JS / reduced-motion |
|---|---|
| 01 | la composición completa y quieta. Los `from()` de GSAP son lo único que la escondía |
| 02 | igual, más un frame del campo quieto (o blanco liso sin WebGL2) |
| 03 | igual, sin desfase ni trazado — en móvil tampoco hay escalera que resolver |

Ninguna esconde nada en ningún punto de su recorrido. Es la consecuencia
directa de la regla 1, y es lo que hace que las tres sirvan para una homepage.

## Si una versión gana

Se copia a `components/sections/home-ab7/` y se monta ahí reemplazando a
`ProofStepper`. **No se importa desde `proof-alt/`**: esta carpeta es un
laboratorio y su contenido puede cambiar o borrarse sin aviso — ya pasó una vez
con las diez de la primera ronda.

Al hacerlo hay que decidir dos cosas que el lab deja abiertas a propósito:

1. **Los datos.** Acá viven en `proofAltContent.ts`; en la homepage tienen que
   salir de la carpeta de esa página (`homeAb7Content.ts`).
2. **Los cinco datos viejos.** `PROOF_STEPS` tiene otras cifras (1M+ wallets,
   $20B settled, 0 quantum exposure…). Reemplazar la sección es también
   reemplazar el contenido, y eso es una decisión de la página.
