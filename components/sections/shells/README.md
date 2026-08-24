# `shells/` — los dos armazones de las variantes B y C

Cuatro páginas (`about`, `community`, `economics`, `foundation`) tienen tres
variantes cada una, y las letras significan lo mismo en las cuatro:

| | Qué es | De dónde sale |
|---|---|---|
| **A** | **Editorial.** Filete de 1px, fondo plano, sin cajas, tipografía primero. | La primera pasada. Su doctrina está en `chain/WhyItMatters.tsx`. |
| **B** | **Instrumento.** Página oscura, paneles con borde, arte isométrico, lecturas y riel de actos. | Este armazón, `shells/instrument/`. |
| **C** | **Escenario.** Superficies con shader, cards redondeadas, color, arte a sangre. | Este armazón, `shells/stage/`. |

## Por qué los armazones se comparten y el arte no

La decisión, tomada con el cliente, fue **sistema gráfico nuevo por página**: la
figura de economics no se parece a la de about, porque lo que cada una tiene que
decir no se parece. Pero si además cada página trajera su propio panel, su propia
card y su propio suelo, las cuatro B no se leerían como una familia y la
comparación entre A, B y C dejaría de medir un estilo — mediría cuatro estilos.

Así que el reparto es: **el armazón es compartido, el vocabulario gráfico es
propio**. Un panel oscuro con su etiqueta en la esquina y su riel de actos abajo
es el mismo objeto en las cuatro páginas; lo que pasa ADENTRO del panel no se
parece en ninguna.

## `instrument/` — el aparato

| Pieza | Para qué |
|---|---|
| `Panel` | El escenario oscuro con borde. Es lo que convierte el contenido en un objeto que se mira en vez de una superficie que se atraviesa leyendo. Retícula de puntos opcional, solo si adentro hay una figura que se mueve. |
| `Readout` | Una lectura: cifra en Kepler itálica, etiqueta en mono. `accent` enciende UNA por bloque — si se encienden todas, ninguna es el argumento. |
| `ActRail` | En qué paso está la escena y cuántos faltan. Presentacional a propósito: recibe `active` de quien conduce la timeline, así hay una sola fuente del paso en curso. |
| `Section` | Fondo oscuro, encabezado en dos columnas, ritmo vertical. |

## `stage/` — el escenario

| Pieza | Para qué |
|---|---|
| `Surface` | El suelo con shader, y el contenido encima (hermano del canvas, nunca hijo). |
| `contour.ts` | El shader: un terreno de curvas de nivel que deriva. |
| `Card` | Caja de arte sobre caja de texto. **Acá sí hay cajas**, y el porqué está en el archivo: la doctrina anti-card vale para una sección de argumento, no para una unidad que tiene figura. `ratio` y `flush` existen porque dos páginas construyeron su propia card local por el mismo motivo —un asset tiene su propia proporción y no quiere papel debajo—, y dos soluciones locales al mismo problema son un hueco del armazón. |
| `Section` | Fondo claro, tres tonos que no son intercambiables, más aire que el hermano oscuro. |

## Una sola superficie con shader para las cuatro páginas

El repo ya tiene dos y las dos están tomadas: el follaje que se comprime del hero
de la home, y las cintas (`layerflow`) y columnas (`spectrum`) de las aperturas
de protocol. Una tercera página con cintas sería la misma superficie con otro
color.

Las curvas de nivel aportan lo que ninguna de las otras dos tiene: **leen como
una medición**. Una cinta es atmósfera, una columna es actividad; un contorno es
un dato del terreno — y las cuatro páginas que lo usan hablan de terrenos que
alguien midió.

Y hay una razón de composición, que es la que decidió: un mapa de nivel tiene
**zonas planas**. Entre dos curvas hay una meseta de color liso donde un titular
se apoya sin competir con nada, que es lo que a un hero con shader se le suele
romper.

Cada página lo calibra con su paleta y su escala. Un terreno de colinas anchas y
verdes no se confunde con uno de crestas apretadas y frías.

## Los huecos que aparecieron al usarlos, y qué se hizo

Los armazones se escribieron antes que las ocho variantes, así que era esperable
que faltaran piezas. Aparecieron tres, y las tres tienen la misma forma: **dos
páginas resolviendo lo mismo por su cuenta**, que es la única señal fiable de que
el hueco es del armazón y no de la página.

| Hueco | Qué pasaba | Resuelto |
|---|---|---|
| La caja de arte de `Card` estaba fija en 4/3 y con papel blanco | Correcto para un dibujo; para una foto o una pieza de archivo recorta una proporción que es un hecho del asset | `ratio` y `flush` |
| `Figure` no tenía tono para una superficie con shader | El filete se lee como una curva de nivel perdida y el pie cae a ~3:1 sobre un fondo que además varía | `tone="surface"` |
| `InstrumentSection` / `StageSection` no aceptan `ref` ni `data-*` | El reveal tiene que colgar de un `div` envolvente | **Sin resolver.** Una sola página lo pidió, y el envoltorio no cuesta nada. Si una segunda lo necesita, ahí sí |

La tercera queda anotada a propósito: un hueco que una sola página siente no es
un hueco, es una preferencia.

## Lo que estos armazones NO hacen

- **No traen animación.** Un panel no se anima solo; lo hace la sección que lo
  monta, con el toolkit de `primitives/motion/`.
- **No leen el scroll.** `ActRail` recibe su `active`; `Surface` no sabe dónde
  está en la página.
- **No deciden el orden de la página.** Eso es la view.
