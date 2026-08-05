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
| `NavPill`, `HeroBanner`, `QuantumRevealHeading`, `ProofStats`, `VideoStory`, `StackShowcase`, `FeatureCards`, `ClosingCta`, `TestimonialCards`, `LatestUpdates`, `OutroWordmark` | `PrototypeHomepageView` | `/prototype/homepage` — draft de landing animada, sin datos reales. `CustomerStory` se reusa tal cual. |

`lib/queries/*` alimenta cada `page.tsx`, que le pasa props planas al `view`
correspondiente, que compone estas secciones.

## Toolkit de animación

`components/primitives/motion/` — hooks compartidos para secciones animadas
(`useGsapContext`, `useScrollReveal`, `pauseOffscreen`, registro de plugins y
tokens de motion). Documentado en detalle en cada archivo; ver `HeroBanner.tsx`
o `FeatureCards.tsx` para dos formas de uso (timeline propia vs. reveal
genérico por `data-reveal`).
