# `proof-labs/` — ocho dividers para la juntura hero → contenido

Laboratorio de las seis cifras de la página Protocol. **Las ocho son dividers**:
van entre el hero y el resto, no son secciones.

- `/prototype/protocol-proof` — las ocho apiladas, para comparar qué hace cada
  una con los datos.
- `/prototype/protocol-proof/p1` … `p8` — cada una **entre el hero real y la
  sección real que sigue**, que es la única forma de juzgar una juntura.

## El rol impone tres cosas, y no son de la variante

`DividerBand` las fija para las ocho, porque un divider que mide el doble que
otro no se está comparando: se está haciendo notar.

| | Qué | Por qué |
|---|---|---|
| **Alto** | `py-8` / `py-10`, sin `min-h` | Un divider mide lo que mide su contenido; en cuanto pide una fracción del viewport vuelve a ser una sección |
| **Bordes** | Uno arriba y uno abajo | Son lo que lo vuelve juntura: el de arriba cierra el hero, el de abajo abre lo que sigue |
| **Sin titular** | Ninguna lleva encabezado | Un divider con título es una sección |

Lo único que decide cada variante es qué hace con las seis cifras adentro.

## El contenido en cuestión

```
100%      Uptime          5+ years on mainnet
1M+       TPS             Publicly verifiable
600ms     Block time
1.2s      Finality
10        Shards          Plus a private shard
<$0.002   Avg transaction fee
```

Seis datos **heterogéneos**: tres miden tiempo, dos miden tamaño, uno mide
precio. Escalas incomparables entre sí, así que no hay gráfico honesto que los
ponga juntos. Tres traen una línea de contexto y tres no.

Y tienen un problema que ninguna cantidad de layout resuelve sola: **fuera de
quien trabaja en infraestructura, ninguno significa nada.** "1M+ TPS" no dice si
es mucho; "600ms" no dice si es rápido. Cuatro de las ocho variantes atacan eso,
no la composición.

## Las ocho

| | Qué pregunta | Movimiento propio |
|---|---|---|
| **P1 · Hierarchy** | ¿Las seis pesan lo mismo? El uptime a escala de titular, las otras cinco de respaldo | — |
| **P2 · Benchmark** | Una línea que traduce cada cifra para quien no es de infra | — |
| **P3 · Grouped** | ¿Son seis cosas o tres? Speed · Scale · Record, dos cifras cada uno | — |
| **P4 · Ticker** | ¿La prueba tiene que leerse, o alcanza con que se vea viva? | Cinta en loop |
| **P5 · Sentence** | ¿Y si en vez de escanearse se leyera? Las seis dentro de una oración | — |
| **P6 · Live** | ¿Por qué son estáticas si tres se consultan al RPC público? | Latido del indicador |
| **P7 · Axis** | La homepage ya resolvió esto. ¿Lo repetimos? | Traza del eje al entrar |
| **P8 · Figures** | ¿Por qué es lo único de la página que no habla en cubos? | — |

## Las ocho cuentan

Todas llevan count-up con GSAP, desde `../countUp.ts`. El hook resuelve las tres
cosas que hacen que el recurso no se vea barato:

1. **El formato se conserva entero.** `<$0.002` cuenta como `<$0.000 → <$0.002`,
   nunca como `0 → 0.002`. Prefijo, sufijo y decimales salen del valor final.
2. **El ancho queda reservado** antes de empezar, medido tras
   `document.fonts.ready`. Sin eso, `600ms` arranca en `0ms` y la caja crece de
   tres a cinco caracteres mientras cuenta, arrastrando lo que tenga al lado.
3. **El valor final está en el HTML**, no en JavaScript. El contador lo pisa en el
   primer frame si va a correr; sin JS, con `prefers-reduced-motion` o si el
   bundle falla, la cifra ya está bien.

Arrancan al entrar en viewport, no al montar — salvo lo que vive sobre la línea
de flotación (`immediate: true`, que hoy usa sólo el hero `H2Count`). Una franja
a mitad de página que cuenta al montar ya terminó cuando el lector llega.

**Dos casos donde el contador pelea con la variante**, y quedaron anotados en sus
archivos:

- **P4 (Ticker).** Un número que cuenta dentro de una cinta que se desplaza es
  doblemente difícil de leer. Se dejó en 0.9s —la mitad que el resto— para que
  termine antes de que la cinta avance un tercio. Si marea, la conclusión no es
  afinar la duración: es que la variante y el contador quieren cosas distintas.
- **P6 (Live).** Cuenta una vez al entrar y se queda quieto. Eso es una animación
  de entrada («esto se está cargando»), no una simulación de lectura en vivo
  («esto está cambiando ahora») — que sería inventar un dato. El rótulo
  `sample · not connected` sigue en pantalla y el indicador late sin que ningún
  número lo acompañe.

En **P5** el ancho reservado no es opcional: las cifras van dentro de un párrafo
y sin él la oración entera tiembla en cada frame. En **P7** el contador usa su
propio umbral, más tardío que la escena, porque las fichas entran desde
`autoAlpha: 0` y un contador sincronizado correría mientras la cifra es
invisible. En **P8** cuentan las cifras pero **las figuras no se animan**: seis
micro-animaciones más seis contadores en el mismo bloque es la receta para que no
se lea ninguno de los doce.

Cada archivo lleva su tesis y —lo que importa más— **qué arriesga**. Resumen:

- **P1** puede dejar cinco cifras leyéndose como letra chica. Es el punto: si
  sobreviven al tamaño reducido, el reparto es correcto.
- **P2** es la que peor soportó la compresión, y hay que decirlo: su traducción
  existe para LEERSE, y a `text-micro-mono` en una fila de seis se lee como el pie
  de la cifra — o sea, el mismo lugar que ya ocupaba `note`. **Si al verla no se
  leen, la conclusión no es achicarlas más: es que esta idea no cabe en un
  divider** y necesita ser una sección propia más abajo.
- **P3** es la única que no tuvo que renunciar a nada para entrar en el alto.
  Ojo con eso al comparar: puede estar ganando por adecuación al formato y no por
  ser la mejor lectura de los datos.
- **P4** convierte el argumento en textura: un ticker se mira, no se lee. Y es la
  única que **cruza los dos bordes de la página**, así que rompe la alineación de
  columnas justo en el punto donde el hero se la pasa a la sección siguiente.
- **P5** sacrifica el escaneo, que es lo que las otras siete protegen.
- **P6** es la única oscura. El corte es el más marcado de las ocho, y el costo no
  se ve en la banda sino en la página: el acto y el cierre ya son negros y son
  escasos a propósito. Un tercer negro en la primera juntura les baja el rango.
  Además mete una dependencia externa y **necesita un fallback obligatorio** a
  los valores estáticos.
- **P7** puede leerse como repetición de la homepage en vez de como sistema. Es,
  eso sí, la que mejor encaja conceptualmente: su idea central ya era una línea
  que separa.
- **P8** puede empastarse. Las figuras bajaron a 56×40 para entrar en el alto, y
  ahí un cubo de arista 3px es una mancha. Es lo primero a mirar en pantalla.

## La copy propuesta está aparte

`proofLabsContent.ts` — las traducciones de P2, los grupos de P3 y la frase de
P5. **No está aprobada** y por eso no vive en `protocolContent.ts`, que es
transcripción del doc de sitemap y no lleva una palabra que el doc no diga.

Regla que se siguió al escribir las traducciones: **ninguna introduce un dato
nuevo.** Son reformulaciones o aritmética sobre la misma cifra — "mil
transacciones por dos dólares" *es* "<$0.002". Dos son comparaciones cualitativas
(el parpadeo, el datáfono) y están marcadas en el módulo con su alternativa
literal.

## P6 no está conectada, y lo dice en pantalla

El rótulo `sample · not connected` está en el componente, no en un comentario.
Un panel que aparenta datos en vivo sin estarlo es engañoso, y el prototipo
existe para discutir si vale la pena conectarlo — no para fingir que ya lo está.
El pulso que se ve es el indicador, no un número cambiando.

## Estado

Sin decidir y sin ver en navegador. Lo primero a mirar, **en las rutas en
contexto y no en el índice**:

- Si la banda **cierra el hero** o si se lee como una tercera sección corta.
- **P8** — a qué tamaño mínimo las figuras siguen siendo legibles.
- **P5** — si las dos lecturas (leer la frase / saltar de número en número)
  conviven, o si el párrafo mata el escaneo.
- **P2** — si la traducción todavía se lee a cuerpo de nota.
- **El contador en P4 y P5** — son los dos casos límite: cinta en movimiento y
  cifras dentro de un párrafo.
- Todas — a 390, 1024 y 1920, y con `prefers-reduced-motion`: ahí no se crea
  ningún contador y las seis cifras salen directamente en su valor final.
