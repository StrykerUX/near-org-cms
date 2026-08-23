# `components/sections/`

Librería de secciones de marketing reusables — leer esto antes de tocar
cualquier archivo aquí.

## Contrato

1. `export default function` + un `type XProps` exportado con el mismo nombre
   base (`PostCard.tsx` exporta `PostCardProps`).
2. **Prohibido**: `async`, `await`, fetch de datos, `prisma`, `process.env`.
   Toda sección recibe sus datos ya resueltos por props.
3. **Imports permitidos** (allowlist, no denylist): `react`, `next/link`,
   `next/image`, `lucide-react`, `clsx`, `@/components/primitives/*`,
   `@/components/sections/*`. Secciones animadas también pueden importar
   `gsap` y `@/components/primitives/motion/*` — precedente: `CompanyGrid.tsx`
   (marquee), formalizado después en el toolkit de
   `@/components/primitives/motion/`. Una sección animada es `"use client"`; el
   resto se queda como server component.
4. **Prohibido importar**: `@near/cms-core/*`, `@cms/*`, `@prisma/client`,
   `next/headers`, `next/navigation`, `next/cache`, `@/lib/*`, `@/app/*`,
   `@/components/site/*` (chrome compartido — se compone desde afuera, ver
   el prop `nav` de `PageHero` como ejemplo).
5. **Props serializables**: nunca `Date` (usar `dateLabel: string` ya
   formateado, ver `components/sections/types.ts`), nunca funciones (una
   sección puede volverse client component algún día), nunca `unknown`/`any`.
6. **Fallbacks los aplica quien llama a la sección**, no la sección misma
   (ej. `coverImage` debe llegar ya con el fallback de imagen aplicado).
7. **Máximo 4 props de variante** por sección (no cuenta el dato principal
   ni los slots de contenido tipo `children`/`nav`). Si hace falta más, son
   dos componentes, no una sección con 8 booleanos.
8. `tsconfig.json` tiene `noUnusedLocals`/`noUnusedParameters` en `true` — una
   prop declarada y no usada rompe el build. Es intencional, no un bug.
9. **Tipografía: solo tokens de la escala.** Prohibido definir a mano tamaño
   (`text-[18px]`, `style={{fontSize}}`), peso (`font-medium`), interlineado
   (`leading-*`) o tracking (`tracking-*`). Los tokens `--text-*` de
   `app/globals.css` ya traen los cuatro por nivel, así que un `font-medium`
   al lado de un `text-h2` no se ve mal hoy pero anula el token el día que el
   DS cambie. Si al rol le falta un token, **se agrega al DS** — así nació
   `--text-label` (botones y links) y así se resolvió la serif, que necesitaba
   deshacer el tracking negativo y el weight medio de la escala sans en cada
   heading (`text-h2-serif`, `accent-serif`, `accent-display`). Lo verifica
   `pnpm lint:typography`, que corre en `prebuild` y en CI. Para una excepción
   deliberada: `/* ds-exempt: <razón> */` en la línea de arriba.

## Cómo verificar que no rompiste el contrato

No hay chequeo automático — revisá a mano contra la lista de arriba antes de
dar por terminado un cambio.

## Inventario

| Sección | Usada por | Origen |
|---|---|---|
| `PageHero` | `BlogIndexView`, `BlogCategoryView`, `BlogTagView` | `docs/fase0-divergencias-blog.md` #1, #1b, #2, #3 |
| `PostCard` (vía `PostGrid`) | idem | `docs/fase0-divergencias-blog.md` #4, #5, #6 |
| `PostGrid` | idem | — |
| `Pagination` | idem | — |
| `EmptyState` | idem | `docs/fase0-divergencias-blog.md` #7 |
| `SearchField` | `BlogIndexView` | — |
| `FilterPills` | `BlogIndexView` | — |
| `CompanyGrid`, `ProductStage`, `CustomerStory` | `PrototypeLandingView` | `/prototype` — la landing de marketing, no un índice |
| `LatestUpdates`, `UpdatesList` | `HomepageUpdateView` | Nacieron para el draft de landing animada de `/prototype/homepage`, retirado. Sobrevivieron a la limpieza porque la homepage viva las sigue montando. |
| `homepage-update/*` | `HomepageUpdateView` | `/prototype/homepage-update` — **la línea de diseño viva**. Única superviviente de nueve homepages; ver `docs/labs-archivados.md` para las ocho archivadas. Tiene su propio [README](./homepage-update/README.md). |
| `quantum/*` | `QuantumSecurityView` | `/quantum-security` — **página real**. Tiene su propio [README](./quantum/README.md) (en inglés, ver la nota de idioma ahí). |
| `chain/*` | `ChainAbstractionView` | `/chain-abstraction` — **página real**. Tiene su propio [README](./chain/README.md) (en inglés, misma nota que `quantum`). Reusa `quantum/CtaPill` tal cual. |
| `protocol/*` | `ProtocolView` | `/blockchain` — **página real**. Reusa `quantum/CtaPill` y `quantum/ArrowCircle`. |
| `protocol-labs/a/*` | `ProtocolLabAView` | `/prototype/protocol-a` — la estructura elegida para la página de Protocol, salida de comparar cuatro. Tiene su propio [README](./protocol-labs/README.md) |
| `protocol-labs/hero-labs/*` | `ProtocolHeroLabView` | `/prototype/protocol-heroes/h1…h8` — **laboratorio**: ocho variantes de la primera pantalla. Tiene su propio [README](./protocol-labs/hero-labs/README.md). Importa `shardField` de `protocol/`; **ninguna página real lo importa** |
| `quantum-security-heroes/*` | `QuantumSecurityH2View`, `QuantumSecurityH3View` | `/prototype/quantum-security-h2` (+ `-h3`) — **laboratorio**: dos heroes para `/quantum-security`, cada uno con el acomodo de un hero de `protocol-labs/hero-labs/` (h2/h3) y su propio fondo ASCII. El resto de cada página reusa `quantum-security-copy/*` sin modificar. Tiene su propio [README](./quantum-security-heroes/README.md) |
| `protocol-labs/opening-labs/*` | `ProtocolOpeningsIndexView`, `ProtocolOpeningLabView` | `/prototype/protocol-opening` (+ `/a…f`) — **laboratorio**: seis aperturas completas con superficie propia (4 shaders WebGL, 1 SVG, 1 canvas). Tiene su propio [README](./protocol-labs/opening-labs/README.md) |
| `protocol-labs/transition-labs/*` | `ProtocolTransitionsIndexView`, `ProtocolTransitionLabView` | `/prototype/protocol-transitions` (+ `/t1…t12` en contexto) — **laboratorio**: doce secciones de transición para la juntura hero → contenido, agrupadas por altura. Tiene su propio [README](./protocol-labs/transition-labs/README.md); su copy propuesta vive aparte de la transcripción del doc |

Las tres carpetas de páginas reales (`quantum`, `chain`, `protocol`) se importan
entre sí: `chain` y `protocol` sacan `CtaPill` y `ArrowCircle` de `quantum`. No
son laboratorios y no se tocan a la ligera.

## Laboratorios

Hay tres vivos, todos bajo `protocol-labs/`: `hero-labs/` (ocho primeras
pantallas, decidida), `transition-labs/` (doce transiciones hero → contenido, sin
decidir) y `opening-labs/` (seis aperturas completas con superficie, sin
decidir — es el que está en curso). La regla que gobierna a cualquiera: **un laboratorio
alimenta una ruta de comparación, ninguna página real lo importa, y si una
versión gana se COPIA** a la carpeta de la página que la reciba — no se importa
desde ahí.

`protocol-labs/a/` ya NO es un laboratorio: es la estructura elegida, esperando
que se decida su hero.

Este README describía siete (`hero-alt`, `proof-alt`, `stack-labs`,
`transition-labs`, `newsletter-labs`, `mural-labs`, `footer-labs`) y ocho
homepages en paralelo. Se archivaron todos el 2026-08-21 al quedar
`homepage-update` como la única línea viva.

Están completos en el tag `v-pre-limpieza` y en la rama `Respaldo`, y
**`docs/labs-archivados.md`** dice qué era cada uno y cómo traerlo de vuelta.

## El footer NO está acá

`components/site/SiteFooter.tsx` — es chrome, lo montan los tres layouts del
frontend (`(site)`, `(motion)`, `prototype`) y **ninguna view lo importa**,
igual que `SiteHeader`.

Estuvo en esta carpeta y el resultado fue cuatro copias divergentes del mismo
archivo (`FooterV2`, `home-v2/FooterV2`, `home-v4/FooterV4`,
`PrototypeFooter`) más el footer gris que montaba `(site)`. Repartir chrome
como si fuera una sección es exactamente lo que produce eso. Además necesita
`@/lib/*` y `next/navigation`, que el contrato de arriba prohíbe.

## Sección pegada: `position: sticky`, nunca `pin: true`

Tres secciones usan **sección pegada**: en `home-v2/`, `ProofStepper` y
`OwnYourOwn`; y en `quantum/`, `ThreatSequence`. Todas con
`position: sticky` de CSS y un ScrollTrigger que solo LEE el progreso.

**Por qué, en largo** (esta es la copia canónica del razonamiento; vivía en
`ProofStats.tsx` hasta que esa sección se retiró con `/prototype/homepage`):
un pin de GSAP inserta un pin-spacer en el documento, lo que arrastra tres
problemas que `PrototypeMotionProvider` tendría que contener a mano —
`refresh()` mueve el scroll y congela Lenis, el spacer cambia `scrollHeight` y
realimenta el `ResizeObserver` del provider, y en StrictMode queda un spacer
fantasma (ver el comentario de `useGsapContext.ts`). Nada de eso hace falta: el
sticky lo hace el navegador de forma nativa, y ScrollTrigger queda reducido a
leer el progreso — sin pin, sin scrub, sin tocar el scroll. Como efecto lateral,
sin JS la sección sigue siendo legible.

Consecuencia a recordar si alguien las edita: **ningún ancestro del elemento
pegado puede tener `overflow` distinto de `visible`**, o el sticky deja de
pegarse sin ningún error. (Sí puede tenerlo el elemento pegado en sí.)

El patrón es siempre el mismo: un track cuya altura sale de CSS vars, un hijo
`sticky top-0 h-svh`, y un atributo `data-*` en la raíz que enciende el layout
superpuesto. El atributo y no un breakpoint a secas: con reduced-motion en
desktop, el contenido tiene que caer en flujo normal igual.

`lib/queries/*` alimenta cada `page.tsx`, que le pasa props planas al `view`
correspondiente, que compone estas secciones.

## Dónde vive la copy

`quantum/quantumContent.ts` y `home-v2/homeV2Content.ts` — los textos, listas y
URLs de esas dos páginas, fuera de los componentes. Módulos puros: strings y
arrays de objetos, sin JSX, sin `Date`, sin funciones. Mismo contrato que
`types.ts`, así que el día que vengan de la base de datos la forma no cambia.

El precedente es `home-v2/nearStackContent.ts`, que ya lo hacía así.

**Qué NO va ahí:**

| | Dónde va | Por qué |
|---|---|---|
| Geometría y timing (radios, umbrales de scroll, rampas de color) | Con la animación que los lee | Es mecanismo, no contenido |
| Clases de layout (en qué celda del grid cae una card) | En el componente | Es composición. Ver `CARD_LAYOUT` en `OwnYourOwn` |
| Los **titulares** | Todavía en el JSX | Llevan `<Accent>` y `<br />`, así que pasarlos a datos exige elegir un esquema para "texto con un tramo acentuado" — y esa es una decisión del modelo de contenido, no de un refactor. `ROADMAP_STAGES` (`when` + `whenAccent`) muestra la forma que funcionaría |

## Toolkit de animación

`components/primitives/motion/` — lo compartido por las secciones animadas.
Documentado en detalle en cada archivo; ver `home-v2/OwnYourOwn.tsx` o
`UpdatesList.tsx` para dos formas de uso (timeline propia vs. reveal genérico
con `useScrollReveal`).

**Por dónde empezar, según lo que hace la sección:**

| Necesidad | Qué usar |
|---|---|
| Fade + slide al entrar en viewport | `useScrollReveal()` — una línea, sin escribir un tween |
| Escena que anima en desktop y cae a flujo normal en móvil | `useMotionScope()` — te da `q`, `scope`, `motionOk`, `isDesktop` y el contexto |
| Solo depende de `prefers-reduced-motion` | `gsap.matchMedia()` con `MQ.motion` directo, **no** `useMotionScope` (declarar `isDesktop` hace que cruzar 1024px reconstruya la escena) |
| Sección pegada con recorrido propio | `enableScene()` + `trackTimeline()` de `stickyScene` |
| Escribir texto letra a letra | `staggerChars()` |
| Un `<video>` conducido por scroll | `createVideoScrub()` |
| Un canvas | `deviceRatio()` para el buffer, `onViewportToggle()` de `pauseOffscreen` para no dibujar fuera de vista, y colgarse de `gsap.ticker` — **nunca** un `requestAnimationFrame` propio |
| Algo que llega a un tope y hay que VERLO llegar | `softFloor()` — amortigua el último tramo con velocidad continua. `Math.max` corta la velocidad en el codo y eso es lo que se lee como golpe. No para clamps de seguridad, que nadie mira |
| Varios elementos sobre el mismo progreso con velocidades distintas | `hermiteRamp(entry, settle)` — se le piden las dos velocidades y devuelve la única cúbica que las cumple. Pedilas en **múltiplos de la del scroll**: un elemento en una página que scrollea ya va a 1× sin animarse |
| Desorden que tiene que sobrevivir un rebuild | `createSeededRandom()` |
| Un color que va a animarse | Literal, nunca `var(--token)` — GSAP interpola colores, no declaraciones. Si lo animan dos escenas, va a `motionColors.ts` |

`useGsapContext` es la capa de abajo de todo eso (un `gsap.context()` con su
`revert()`, sobre `useGSAP` de `@gsap/react`). Una sección normal no debería
necesitar llamarlo directo.

**La regla del atributo de escena:** el interruptor `data-*` que enciende un
layout sticky lo escribe SOLO el efecto, vía `enableScene`. No se declara en el
JSX. Si está en los dos lados, el primer re-render lo devuelve a `"off"` y el
sticky se desarma sin dar ningún error — tres secciones lo tenían así.

Los covers de `LatestUpdates` los pinta hoy una escena de Unicorn Studio, no un
material propio — ver [`docs/unicorn.md`](../../docs/unicorn.md).

`components/primitives/motion/glyphShine.ts` + `shaders/glyphShine.ts` — WebGL2
crudo (cero dependencias nuevas): renderiza texto a una textura offscreen
para usarla como máscara alfa, así el brillo queda recortado exactamente a la
silueta de los glifos (no `background-clip:text`, que no sobrevive un split
por caracteres). La máscara además hornea el **orden de lectura** de cada
glifo en el canal G, para que el frente de luz avance letra por letra y no en
el eje X — si avanzara en X, en un heading que hace wrap iluminaría los
renglones en paralelo y se desincronizaría del stagger del DOM. Factory
imperativa (`setFront`/`setPointer`/`destroy`) llamada y destruida
por el `gsap.matchMedia()` del componente que la usa (ver
`primitives/ShineField.tsx`), nunca un hook con su propio `useEffect` — evita
dos ciclos de vida desincronizables ante un cambio de `prefers-reduced-motion`
en vivo. `components/primitives/motion/pointer.ts` comparte un solo listener
global de mouse entre todas las instancias que lo necesiten.
