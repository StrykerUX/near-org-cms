# `proof-alt/` — tres estructuras para las seis pruebas

Alimenta **cuatro rutas**: `/prototype/proof-alt` (el lab, las tres seguidas) y
`/prototype/homepage-proof/{datum,index,columns}` (las tres dentro de la
homepage entera). No la importa ninguna página real, y eso es el punto.

## De dónde viene

El `ProofStepper` de `/prototype/homepage-ab7` gasta **325svh** —cinco pasos de
45svh más un viewport pegado— para entregar cinco datos.

Van tres rondas, y las dos primeras están borradas a propósito:

| Ronda | Qué eran | Por qué se cayeron | Commit |
|---|---|---|---|
| 1ª | Diez versiones que barrían el espacio de soluciones (Solari, dial, carril horizontal, plotter, cartas hojeables…) | Siete de las diez escondían cinco de las seis pruebas detrás de un gesto | `b145ca6` |
| 2ª | Tres sobre una composición asimétrica común (entrada en diagonal, capa WebGL, escalonado por scroll) | Descartadas en bloque | `b566b04` |

Las tres actuales nacieron como **bocetos en un canvas de diseño** y se
eligieron ahí antes de escribir una línea de código. Es la razón de que las tres
sean estructuras y no efectos: lo que se comparó fueron composiciones, no
mecanismos.

## Las reglas, que ya no se discuten

1. **Las seis cifras visibles a la vez, desde el primer frame.** Nada se revela
   al pasar el puntero. El hover puede añadir, nunca descubrir. Es lo que mató
   a la primera ronda entera.
2. **Light mode.** La sección entra después del negro de NEAR Stack y entrega
   al stone de la newsletter: el blanco puro (`bg-background`) es el corte más
   limpio que tiene la página en ese punto.
3. **El cuerpo completo de las seis**, sin recortar.
4. **Una pantalla de alto y cero recorrido extra.** Ninguna alarga la página.
5. **Un plan propio por debajo de 1024px**, no una degradación automática — ver
   abajo.

## Las tres

| | Versión | Qué es | Cuándo gana |
|---|---|---|---|
| **B** | `ProofDatum` | Un eje cruza el ancho y las seis pruebas cuelgan de él, alternando arriba y abajo | Cuando la sección tiene que **estorbar poco**: es la única sin `min-h-svh`, mide lo que mide su contenido |
| **C** | `ProofIndex` | Seis renglones de un documento: número, rótulo, cifra, cuerpo, con una regla entre cada uno | Cuando las seis cifras tienen que **compararse**: es la única en la que están alineadas entre sí |
| **D** | `ProofColumns` | Seis columnas del alto de la pantalla, cifras escritas en vertical, cuerpos al pie | Cuando la sección tiene que **impresionar**: se lee como una pieza antes de leer una palabra |

Ninguna es la mejor en abstracto. La pregunta que las separa es si estas seis
pruebas son una tabla que se consulta (C), un dato de paso (B) o un golpe visual
(D).

### Decisiones medidas, no elegidas

**C — la cifra va en `h2` y no en `h1`.** Seis filas tienen que entrar en una
pantalla; con la cifra a escala de h1 la fila mide ~180px y las seis se comen
1080px sin contar el encabezado, o sea que en cualquier portátil hay que
scrollear para ver la sexta prueba — justo lo que esta sección viene a evitar.

**C — la columna del rótulo mide 13rem.** "Built to connect" y "Built to
privacy" partían en dos líneas a 11rem, y una fila con el rótulo en dos líneas
descoloca su línea de base: se pierde lo único que esta versión aporta.

**B — sin `min-h-svh`.** Forzarla a una pantalla dejaba medio viewport en blanco
alrededor de un eje de 350px: la versión que existe para estorbar poco,
ocupando lo mismo que las que no.

**B — el eje cae centrado sin que nadie lo coloque.** Las filas son
`1fr 1px 1fr`, así que las dos mitades se igualan a la ficha más alta. Si un
cuerpo crece, las dos crecen y el eje sigue centrado; un alto fijo se habría
roto en el primer cambio de copy.

**D — solo la cifra gira, nunca el cuerpo.** Un texto de tres líneas en vertical
no se lee, se descifra. La cifra son dos o tres palabras conocidas y aguanta el
giro.

## Por debajo de 1024px

No es una degradación automática: cada una tiene un plan, y lo resuelve **CSS
solo**, sin JS. Un cambio de layout que dependiera del bundle dejaría la sección
rota mientras carga.

| | En móvil |
|---|---|
| B | **El eje gira.** La línea pasa a vertical, corre por la izquierda (es el `border-l` del contenedor) y las seis fichas cuelgan de ella en orden. Se conserva la idea con la única geometría que cabe |
| C | Cada fila se apila: rótulo, cifra, cuerpo. Es la que menos cambia |
| D | **La cifra vuelve a acostarse.** Seis columnas a 375px son seis tiras de 60px y una cifra vertical ahí es ilegible; la sección cae a seis bloques apilados con regla. Se pierde el gesto y se conserva el contenido, que es el orden correcto |

**Sin verificar visualmente**: el layout móvil está escrito y revisado en
código, pero no se pudo mirar en un viewport estrecho de verdad. Merece una
pasada con la ventana angosta antes de dar por buena ninguna.

## Las tres demos: composición, no fork

`/prototype/homepage-proof/{datum,index,columns}` montan la homepage de ab7
entera con esta sección en el sitio del `ProofStepper`.

**Las nueve secciones que no cambian se importan de `home-ab7/` tal cual. No se
copió ni un archivo.** Es la diferencia con `home-ab6/` → `home-ab7/`, que sí
son forks de carpeta: quince archivos duplicados, entre ellos `NearStackV2`
(47KB), `QuantumBars` (33KB) y `OwnYourOwn` (32KB). El README de ab7 escribe el
precio — *un arreglo real en `home-ab6/` no llega solo acá*— y tres demos más
por esa vía serían cinco copias de cada sección divergiendo en silencio.

> **La regla, para la próxima demo:** si una demo necesita cambiar una sección
> compartida, a esa sección le falta una **prop**, no una copia. Forkear la
> carpeta es la última opción, no la primera.

Las tres rutas comparten un solo `layout.tsx` (por eso viven bajo la misma
carpeta) y una sola view, `HomepageProofDemoView`, con una prop. Tres views
idénticas salvo una línea divergirían en el primer ajuste al orden de las
secciones, y entonces las demos dejarían de ser comparables — su único motivo de
existir.

## Lab y demos responden preguntas distintas

| | Qué contesta |
|---|---|
| `/prototype/proof-alt` | Cómo es la **estructura**, aislada, sin que el resto de la página opine |
| `/prototype/homepage-proof/*` | Cómo **convive**: el corte contra el negro del NEAR Stack, el peso frente al hero, el scroll total |

Ninguna sustituye a la otra: una sección puede ganar aislada y perder rodeada,
que es exactamente lo que le pasó al stepper que esto viene a reemplazar.

## Si una versión gana

Se copia a `components/sections/home-ab7/` y se monta ahí reemplazando a
`ProofStepper`. **No se importa desde `proof-alt/`**: esta carpeta es un
laboratorio y su contenido puede cambiar o borrarse sin aviso — ya pasó dos
veces.

Dos cosas que el lab deja abiertas a propósito:

1. **Los datos.** Acá viven en `proofAltContent.ts`; en la homepage tienen que
   salir de `homeAb7Content.ts`.
2. **Los cinco datos viejos.** `PROOF_STEPS` tiene otras cifras (1M+ wallets,
   $20B settled, 0 quantum exposure…). Reemplazar la sección es también
   reemplazar el contenido, y eso es una decisión de la página.
