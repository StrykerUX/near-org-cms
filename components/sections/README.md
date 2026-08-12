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
   (marquee), formalizado con el toolkit de `/prototype/homepage`. Una sección
   animada es `"use client"`; el resto se queda como server component.
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
| `CompanyGrid`, `ProductStage`, `CustomerStory` | `PrototypeLandingView` | `/prototype` |
| `NavPill`, `HeroBanner`, `QuantumRevealHeading`, `ProofStats`, `VideoStory`, `StackShowcase`, `FeatureCards`, `ClosingCta`, `TestimonialMarquee`, `LatestUpdates`, `UpdatesList`, `PrototypeFooter` | `PrototypeHomepageView` | `/prototype/homepage` — draft de landing animada, sin datos reales. `CustomerStory` se reusa tal cual. |
| `home-v2/*` | `HomepageV2View` | `/prototype/homepage-v2` — port del rebuild recibido como paquete de design canvas. Tiene su propio [README](./home-v2/README.md). Reusa `TestimonialMarquee`, `LatestUpdates`, `UpdatesList` y `PrototypeFooter` tal cual. |
| `quantum/*` | `QuantumSecurityView` | `/prototype/quantum-security` — port del rebuild de quantum-security, mismo origen de design canvas. Tiene su propio [README](./quantum/README.md) (en inglés, ver la nota de idioma ahí). Reusa `PrototypeFooter` tal cual. |

Cinco secciones usan **sección pegada**: `ProofStats`; en `home-v2/`,
`ProofStepper`, `NearStack` y `OwnYourOwn`; y en `quantum/`, `ThreatSequence`.
Todas con `position: sticky` de CSS
y un ScrollTrigger que solo LEE el progreso — nunca `pin: true`, que inserta un
pin-spacer en el documento y pelea con Lenis, con el `ResizeObserver` de
`PrototypeMotionProvider` y con StrictMode.

Consecuencia a recordar si alguien las edita: **ningún ancestro del elemento
pegado puede tener `overflow` distinto de `visible`**, o el sticky deja de
pegarse sin ningún error. (Sí puede tenerlo el elemento pegado en sí: es lo que
usa `NearStack` para esconder su banda de foundation bajo el fold.)

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
Documentado en detalle en cada archivo; ver `HeroBanner.tsx` o `FeatureCards.tsx`
para dos formas de uso (timeline propia vs. reveal genérico por `data-reveal`).

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
| Desorden que tiene que sobrevivir un rebuild | `createSeededRandom()` |
| Un color que va a animarse | Literal, nunca `var(--token)` — GSAP interpola colores, no declaraciones. Si lo animan dos escenas, va a `motionColors.ts` |

`useGsapContext` es la capa de abajo de todo eso (un `gsap.context()` con su
`revert()`, sobre `useGSAP` de `@gsap/react`). Una sección normal no debería
necesitar llamarlo directo.

**La regla del atributo de escena:** el interruptor `data-*` que enciende un
layout sticky lo escribe SOLO el efecto, vía `enableScene`. No se declara en el
JSX. Si está en los dos lados, el primer re-render lo devuelve a `"off"` y el
sticky se desarma sin dar ningún error — tres secciones lo tenían así.

`components/primitives/motion/flowField.ts` + `shaders/flowField.ts` — el
material de los covers de `LatestUpdates`: un campo de color suave arrastrado
por un flujo de ruido. Dos etapas y el orden importa: primero se deforma la
COORDENADA con un campo vectorial de ruido y recién después se evalúa el color
en la coordenada ya deformada. Al revés —deformar el color— daría un
desenfoque, no un flujo; lo que produce las vetas es que puntos vecinos
terminen leyendo zonas lejanas del campo. Cuatro piezas: base de dos focos con
falloff exponencial donde **cada foco aporta su propio color** (con una rampa
única sobre una intensidad escalar es imposible tener un color en una zona y
otro en otra), ocho iteraciones de empuje (una sola daría un desplazamiento
suave: es la iteración la que acumula el estirado), ruido gradiente 3D, y grano.

El ruido es 3D y no 2D porque el tiempo entra por la tercera dimensión: así el
campo evoluciona en vez de trasladarse. Y gradiente en vez de value porque ocho
iteraciones amplifican los artefactos alineados a ejes del value noise hasta
volverlos una grilla visible.

**Invariante que hay que respetar si alguien lo edita:** el tiempo no puede
entrar en ninguna coordenada que se use para muestrear color. La versión
anterior de este material (bandas) tenía un `+ uTime * 0.012` ahí, y como ese
término crece sin límite el cover se iba a gris plano a los ~90 segundos — un
bug que no se ve probando treinta segundos. Hoy el tiempo va solo al eje z del
ruido y a senos acotados, y `flow()` devuelve un uv clampeado a [0,1].

El puntero traslada el origen del ruido, no la intensidad, y su suscripción a
`pointer.ts` vive solo mientras hay hover. A diferencia de `glyphShine`, **no
tiene loop propio**: `render()` lo llama `gsap.ticker`, el mismo rAF que ya
mueve Lenis, así 3 covers animados no agregan 3 loops.

`components/primitives/motion/glyphShine.ts` + `shaders/glyphShine.ts` — WebGL2
crudo (cero dependencias nuevas): renderiza texto a una textura offscreen
para usarla como máscara alfa, así el brillo queda recortado exactamente a la
silueta de los glifos (no `background-clip:text`, que no sobrevive un split
por caracteres). La máscara además hornea el **orden de lectura** de cada
glifo en el canal G, para que el frente de luz avance letra por letra y no en
el eje X — si avanzara en X, en un heading que hace wrap iluminaría los
renglones en paralelo y se desincronizaría del stagger del DOM. Factory
imperativa (`setFront`/`setPointer`/`destroy`) llamada y destruida
por el `gsap.matchMedia()` de la sección que la usa (ver
`QuantumRevealHeading.tsx`), nunca un hook con su propio `useEffect` — evita
dos ciclos de vida desincronizables ante un cambio de `prefers-reduced-motion`
en vivo. `components/primitives/motion/pointer.ts` comparte un solo listener
global de mouse entre todas las instancias que lo necesiten.
