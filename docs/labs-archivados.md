# Laboratorios archivados

Este repo tuvo, hasta la limpieza de 2026-08-21, **nueve homepages en paralelo**
y **siete laboratorios de secciones** — 53 rutas de prototipo contra 24 reales.
Al elegirse `homepage-update` (antes `homepage-ab10`) como la línea de diseño
viva, todo lo demás se archivó.

**Nada se perdió.** Está completo, con su historia, en el tag **`v-pre-limpieza`**
y en la rama `Respaldo`, las dos en `origin`.

Este documento existe porque git no resuelve el problema real. Recuperar un
archivo es un comando; el problema es **acordarse de que ese efecto existió**.
Esta es esa lista.

## Cómo rescatar

Cada fila trae su comando. Traen la carpeta al árbol actual, sin cambiar de rama:

```bash
git checkout v-pre-limpieza -- <rutas>
```

Después hay que volver a montarlo: crear la ruta en `app/prototype/<nombre>/`
(`page.tsx` + `page.meta.ts`, y `layout.tsx` con `PrototypeMotionProvider` si la
pieza mide contra el viewport), y correr `pnpm gen:routes`.

Para solo mirar sin traer nada:

```bash
git show v-pre-limpieza:components/sections/hero-alt/GlassHero.tsx
git checkout v-pre-limpieza          # el árbol entero, en detached HEAD
git switch -                         # volver
```

---

## Laboratorios de efectos

| Lab | Qué era | Piezas | Rescatar con |
|---|---|---|---|
| **hero-alt** | Seis versiones del hero de la homepage con la misma copy: `Glass` (refracción WebGL), `Flow` (campo de flujo GLSL), `Cutout` (video recortado por tipografía), `Aperture`, `Lattice`, `Shatter`. Cada una con su variante de barras. | 17 comp · 1 ruta | `git checkout v-pre-limpieza -- components/sections/hero-alt components/views/HeroAltView.tsx app/prototype/hero-alt` |
| **transition-labs** | Doce cortes entre secciones: `ascii`, `chapter`, `column`, `counter`, `fold`, `halftone`, `lattice`, `melt`, `mosaic`, `sidestep`, `slats`, `wipe`. Cada uno con ruta propia y un shell común. | 14 comp · 13 rutas | `git checkout v-pre-limpieza -- components/sections/transition-labs components/views/TransitionLabIndexView.tsx app/prototype/transition-labs` |
| **newsletter-labs** | Catorce versiones de la banda «NEAR belongs to you», misma copy en todas. Cuatro estrenan formas de campo que `ShineField` no cubre; las seis últimas agregan movimiento. | 17 comp · 1 ruta | `git checkout v-pre-limpieza -- components/sections/newsletter-labs components/views/NewsletterLabView.tsx app/prototype/newsletter-labs` |
| **mural-labs** | Mural de imágenes en dos modos: `scroll` (avanza con la página) y `triggered` (se dispara al entrar). Depende de `footer-labs/footerScene` — rescatar los dos juntos. | 17 comp · 3 rutas | `git checkout v-pre-limpieza -- components/sections/mural-labs components/sections/footer-labs components/views/mural-lab app/prototype/mural-lab` |
| **stack-labs** | Ocho layouts para la sección del NEAR Stack sobre el mismo ensamble isométrico: `anchors` (el que ganó y hoy vive en `homepage-update`), `axis`, `bleed`, `blueprint`, `broadsheet`, `dolly`, `traveling`, `triptych`. Importaba el ensamble de `home-ab7`. | 11 comp · 9 rutas | `git checkout v-pre-limpieza -- components/sections/stack-labs components/sections/home-ab7 components/views/StackLabIndexView.tsx app/prototype/stack-labs` |
| **proof-alt** | Tres estructuras para la sección de pruebas: `ProofDatum` (el que ganó), `ProofIndex`, `ProofColumns`. Las tres, dentro de la homepage entera, en `/prototype/homepage-proof/*`. | 4 comp · 1 ruta | `git checkout v-pre-limpieza -- components/sections/proof-alt components/views/ProofAltView.tsx app/prototype/proof-alt` |
| **footer-labs** | Dos pruebas sobre el footer REAL vía prop `variant`: `veil` (el logo se hunde bajo un velo) y `compact` (sin headline, ocho columnas iguales). | 1 comp · 3 rutas | `git checkout v-pre-limpieza -- components/sections/footer-labs components/views/footer-labs app/prototype/footer-labs` |
| **hover-lab** | Variantes de hover para CTAs y links de footer, con dos versiones WebGL (`gl/`). Sin carpeta en `sections/`: todo vive en la view. | — · 1 ruta | `git checkout v-pre-limpieza -- components/views/hover-lab app/prototype/hover-lab` |

## Efectos WebGL sueltos

| Lab | Qué era | Rescatar con |
|---|---|---|
| **hero-ab9-gl** | Tres shaders de follaje en motion blur, con panel de calibración en vivo: **A · stretch** (1 muestra/px, el que se eligió y hoy vive en `sections/homepage-update/gl/foliage.ts`), **B · sweep** (blur direccional, 13 taps), **C · zoom** (blur radial desde el centro de fuga). Los tres comparten ruido, paleta y degradé. | `git checkout v-pre-limpieza -- components/views/hero-ab9-gl app/prototype/hero-ab9-gl` |
| **hero-burst** | Degradé de cinco paradas indexado por un campo de distancia distorsionado, con ondas viajando hacia afuera y espejo de suelo. | `git checkout v-pre-limpieza -- components/views/hero-burst app/prototype/hero-burst` |

## Prototipos de sección

| Lab | Qué era | Rescatar con |
|---|---|---|
| **carousel-sections** | Los dos carruseles con loop infinito de 3 copias, drag por Observer y snap por redondeo. **Los dos sobrevivieron**: hoy son `CustomerStories` y `PressCarousel` de `homepage-update`. Solo se archiva el lab. | `git checkout v-pre-limpieza -- components/sections/carousel-sections components/views/carousel-sections app/prototype/carousel-sections` |
| **scroll-sections** | Roadmap en dos modos, vertical y horizontal con rail deslizante. | `git checkout v-pre-limpieza -- components/views/scroll-sections app/prototype/scroll-sections` |
| **header-nav** | Tres versiones del megamenú lado a lado: `Original` (snapshot congelado del header previo), `Mock` y `MockV2` (la que se portó al header real). | `git checkout v-pre-limpieza -- components/views/header-nav app/prototype/header-nav` |
| **ex1 / ex2 / ex3** | Tres drafts de página completa que combinaban piezas de varios labs: fondo (`ExBgVideo`/`ExBgField`/`ExBgAscii`) + un layout de stack + una estructura de proof + una banda de newsletter. | `git checkout v-pre-limpieza -- components/sections/ex components/views/ExDraftView.tsx app/prototype/ex1 app/prototype/ex2 app/prototype/ex3` |

## Homepages archivadas

Ocho iteraciones, cada una fork de la anterior. `homepage-update` desciende de
esta línea: **v2 → v4 → ab6 → ab7 → ab9 → ab10**.

| Ruta | Carpeta | Qué la distinguía |
|---|---|---|
| `/prototype/homepage-v2` | `home-v2` | Port del rebuild recibido como paquete de design canvas. El origen de la línea. |
| `/prototype/homepage-v4` | `home-v4` | Fork de v2. |
| `/prototype/homepage-v5` | *(reusa `home-v4`)* | v4 cambiando `NearStack` por `NearStackV2`. Sin carpeta propia. |
| `/prototype/homepage-ab6` | `home-ab6` | Fork de v4. |
| `/prototype/homepage-ab7` | `home-ab7` | Fork de ab6. **El nodo más reusado**: `stack-labs`, `transition-labs`, `proof-alt` y los tres `ex` importaban de acá. |
| `/prototype/homepage-ab9` | `home-ab9` | Fork de ab7 sin `QuantumBars`. |
| `/prototype/homepage-exploration` | `home-exploration` | Lab de transiciones de píxel entre secciones. |
| `/prototype/homepage-proof/{datum,index,columns}` | *(composición)* | Las tres variantes de proof dentro de la homepage entera. Composiciones, no forks: reusaban `home-ab7` sin copiar un archivo. |

Rescatar una:

```bash
git checkout v-pre-limpieza -- components/sections/home-ab7 components/views/HomepageAb7View.tsx app/prototype/homepage-ab7
```

## Galerías estáticas de exploración visual

Nueve galerías HTML autocontenidas —sin Next, sin build: `index.html` + sus
imágenes— que vivían en `public/prototype/` y estaban enlazadas desde el índice
del repo. Eran contact sheets de exploración: se abrían para elegir una
dirección visual, no formaban parte del sitio.

**Pesaban 548 MB entre las nueve**, el 90% de `public/prototype/`.

| Galería | Qué contenía | Peso | Archivos |
|---|---|---|---|
| `moments` | Statement Moment — contact sheet de 30 | 185 MB | 152 |
| `hero-gallery` | Hero Lab «Own Your World» — 30 fondos de hero, 6 conceptos de texto | 177 MB | 64 |
| `hero-descent` | Hero Descent Remake — glass mountains | 124 MB | 23 |
| `hero-mark` | Hero Mark — 12 rellenos del mark | 26 MB | 13 |
| `chainsig` | Chain Signatures — 20 conceptos | 21 MB | 21 |
| `hero-gradient` | Hero Gradient — 8 candidatos de degradé (Higgsfield) | 12 MB | 10 |
| `spine-cards` | Spine Cards — 36 conceptos de card isométrica | 1 MB | 1 |
| `spine-motion` | Spine Motion — 18 conceptos animados | 1 MB | 1 |
| `spine-motion-v2` | Spine Motion v2 — la misma serie, glass & glow | 1 MB | 1 |

Rescatar una:

```bash
git checkout v-pre-limpieza -- public/prototype/moments
```

Y volver a enlazarla desde `app/(site)/page.tsx`, en `STATIC_GALLERIES`.

**Ojo con el peso.** Traer `moments` o `hero-gallery` de vuelta son ~180 MB en
el árbol de trabajo. Si solo querés mirar una imagen, no hace falta el checkout:

```bash
git show v-pre-limpieza:public/prototype/moments/img/moment-07.png > /tmp/m07.png
git ls-tree -r --name-only v-pre-limpieza public/prototype/hero-gallery   # ver qué hay
```

## La landing de `/prototype`

`/prototype` era una landing de marketing («Own your Assets / Intelligence /
Alpha»), no un índice — sus links eran todos `href="#"`. Se archivó junto con
las tres secciones que solo ella montaba: `CompanyGrid`, `ProductStage` y
`CustomerStory`.

```bash
git checkout v-pre-limpieza -- components/views/PrototypeLandingView.tsx \
  components/sections/CompanyGrid.tsx components/sections/ProductStage.tsx \
  components/sections/CustomerStory.tsx app/prototype/page.tsx app/prototype/page.meta.ts
```

El índice real del repo sigue siendo `app/(site)/page.tsx`, en la ruta `/`.

## Lo que NO se archivó

Sigue vivo en el árbol, sin necesidad de rescate:

- **`homepage-update`** — la línea elegida (`app/prototype/homepage-update`).
- **`/blog`**, **`/design-system`** y los 18 stubs de `app/(site)/`.
- **`/blockchain`**, **`/chain-abstraction`**, **`/quantum-security`** — páginas
  reales, con sus secciones `protocol/`, `chain/`, `quantum/`.
- **`/prototype`** (landing) y **`/prototype/components`** (showcase del DS).
- **`public/prototype/`**, ya solo lo que alguien usa: `v2/near-wordmark.svg` y
  `quantum/menu-tab-*.png` (los sacan el `SiteHeader` y el `SiteFooter` reales),
  `quantum/` y `protocol/` (páginas reales), y `v2/stories/` +
  `homepage-update/icon-*.webp` (la homepage viva).

---

## Rediseños descartados del homepage — B, C y D (2026-08-22)

Tres rediseños completos del homepage, montados en `/prototype/homepage-b`,
`-c` y `-d` sobre un laboratorio propio (`components/sections/homepage-labs/`)
que copiaba las secciones de `homepage-update` sin tocarla. Salieron de un audit
de UX/UI y **se rechazaron las tres el mismo día**, antes de commitearse.

**No están en `v-pre-limpieza` ni en `Respaldo`** — nunca entraron al historial.
Quedaron en un stash local, que es efímero y no viaja al remoto:

```bash
git stash list                     # buscar "homepage b/c/d descartadas"
git stash show -p stash@{0}        # mirar
git stash pop stash@{0}            # traer de vuelta al árbol
```

El valor de esta entrada no es el rescate: es **no volver a proponer esto**.

### Qué era cada una

| Ruta | Tesis | Sección propia |
|---|---|---|
| `homepage-b` | «Una sola revista» — todo en crema, el negro solo en el footer | Stack en capítulos verticales con rail pegado |
| `homepage-c` | «Dos actos» — claro/oscuro como estructura narrativa | Puentes de gradiente, stack por turnos, proof oscuro 2+4 |
| `homepage-d` | «El hilo verde» — un hilo vertical firma que ensarta la página | Espaciadores con el hilo scrubbed, stack con cuentas |

### Por qué no gustaron

**El rechazo de fondo, y vale para las tres:** eran *cambios* cuando lo que
falta es *ejecución*. Las tres reestructuraron el homepage —orden de secciones,
jerarquía tipográfica, fondos, composición— partiendo de que el problema era la
estructura. No lo era. Lo que se siente incoherente es el **motion**: las
animaciones, las microinteracciones y, sobre todo, cómo se ENTRA y se SALE de
las secciones. Mover muebles no lo arregla, y encima tira lo que ya funcionaba.

Punto por punto:

- **Los gradientes no aplican.** Los puentes de C —bandas de medio viewport en
  degradé crema→tinta para bajar al acto oscuro— se ven mal, sin vuelta. Un
  degradé entre dos fondos planos no es una transición: es un parche que hace
  evidente la costura que quiere tapar. Vale para todo el sitio, no solo para C:
  los duotonos que se habían metido en las cards del blog caen en lo mismo.
- **Sacarle el negro al stack no lo arregla (B).** Pasar «The NEAR Stack» a
  crema por capítulos elimina el corte, pero también el peso: la sección queda
  como una lista larga y el ensamble isométrico —cuyos trazos son claros, hechos
  para fondo tinta— casi no se lee. Si el stack se conserva, se conserva oscuro;
  lo que le falta es un **efecto transitorio** (GSAP) que justifique el cambio de
  mundo, no un cambio de paleta.
- **El hilo verde es un elemento más (D).** Agregar una firma vertical nueva
  para coser la página es sumar decoración encima del problema en vez de
  resolverlo. La cohesión tiene que salir de lo que ya está.
- **El statement perdió su evento.** Las tres sacaron el scroll-jack del hero
  (`Hero` + `AgentEconomy`) y pusieron la frase del agent economy como sección
  normal. Resuelve la objeción del audit —que se veía una vez y no se podía
  releer— pero deja el homepage sin ningún momento. Quitar no era la respuesta:
  faltaba con qué reemplazarlo.
- **La intro del hero seguía sin gustar.** Ninguna de las tres la tocó de
  verdad: heredaron el titular entrando por palabras. Sigue pendiente.

### Lo que sí quedó confirmado

Del audit sobrevive el inventario de lo que **no** desentona y no se toca: el
hero («Own your world.»), `OwnYourOwn`, `CustomerStories` y `PressCarousel`.
Y una corrección de copy detectada de paso: **"Built for privacy"**, que en
`homepageUpdateContent.ts` está como "Built to privacy" (pendiente de confirmar
contra el doc maestro de copy, que todavía no llegó).

---

## La transición de salida del stack (`SectionReveal`)

**Retirada el 2026-08-23.** Vivió en
`components/sections/homepage-fold/SectionReveal.tsx` y solo la montó
`/prototype/homepage-g`. Está entera en el commit `148cac6`; recuperarla es
`git show 148cac6:components/sections/homepage-fold/SectionReveal.tsx`.

Resolvía el problema de que `InkCurtain direction="up"` no puede revelar nada:
es un panel del color de LLEGADA, liso, sin contenido dentro. El velo de
`SectionReveal` era el negro del que se SALE y se abría desde abajo, con la
sección siguiente detrás.

Lo que dejó aprendido, por si el gesto vuelve:

- **Un velo que nace cerrado obliga a un tramo de un viewport entero.** Necesita
  un frame con la pantalla ocupada solo por el tramo —lo de arriba ya salió, lo
  de abajo todavía no asoma—, y eso se paga con un viewport de scroll en negro.
  La alternativa es nacer CALZADO, con el recorte ya puesto donde está el borde
  de la sección de abajo (`1 - alto del tramo / viewport`).
- **La curva tiene que ir RETRASADA.** Mientras el velo se abre, la sección de
  abajo sube linealmente con el scroll. Con una curva adelantada —`EASE.curtain`
  lo es mucho— el recorte nunca llega a tapar nada y no hay gesto que ver.
- **Cuánto retiene es cosa de la curva, no del tramo.** El velo solo puede
  ocultar lo que todavía no se descubrió.
- **El paso al contenido no puede colgar del velo.** La sección de abajo asoma
  medio viewport antes de que el velo pueda encenderse, y durante ese tramo se
  la ve vacía. Necesita trigger propio, atado a cuándo ASOMA.
- **Un velo de pantalla completa se come lo que quede arriba.** Se arregla
  levantando ese contenido por encima (`z-[3]` contra el `z-[2]` del velo), y
  hay que levantarlo TODO: con solo las notas del stack levantadas, la escena
  del stack desaparecía y las notas quedaban flotando en negro.

Nada de eso resultó ser el problema de fondo. Después de siete pasadas de
calibración el gesto seguía pidiendo elegir entre dos cosas incompatibles —que
la cortina cerrara pronto, y que se notara— así que se quitó junto con la idea
de tener una transición de salida. El stack termina y empieza la sección
siguiente, con el corte que da el borde entre los dos fondos.
