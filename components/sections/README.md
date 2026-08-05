# `components/sections/`

Librería de secciones de marketing. Es la zona que los diseñadores componen —
leer esto antes de tocar cualquier archivo aquí.

## Contrato

1. `export default function` + un `type XProps` exportado con el mismo nombre
   base (`PostCard.tsx` exporta `PostCardProps`).
2. **Prohibido**: `async`, `await`, fetch de datos, `prisma`, `process.env`.
   Toda sección recibe sus datos ya resueltos por props.
3. **Imports permitidos** (allowlist, no denylist): `react`, `next/link`,
   `next/image`, `lucide-react`, `clsx`, `@/components/primitives/*`,
   `@/components/sections/*`.
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

`pnpm lint:zones` (Fase 5) lo hace cumplir por máquina. Hasta que esa fase
esté lista, revisa a mano contra la lista de arriba.

## Inventario

| Sección | Reemplaza | Origen |
|---|---|---|
| `PageHero` | hero oscuro ×3 en `blog/{page,category/[slug],tag/[tag]}.tsx` | `docs/fase0-divergencias-blog.md` #1, #1b, #2, #3 |
| `PostCard` | `<article>` ×3 | `docs/fase0-divergencias-blog.md` #4, #5, #6 |
| `PostGrid` | el grid `sm:grid-cols-2 lg:grid-cols-3` ×3 | — |
| `Pagination` | Previous/Next ×3 | — |
| `EmptyState` | bloque `✦` ×3 | `docs/fase0-divergencias-blog.md` #7 |
| `SearchField` | `<form method="GET">` de `blog/page.tsx` | — |
| `FilterPills` | pills de categoría de `blog/page.tsx` | — |

Ninguna de estas secciones está todavía conectada a una página real — eso es
trabajo de la Fase 3 (separar fetching de composición), que decide cómo
`lib/queries/*` alimenta a `components/views/*`, que a su vez compone estas
secciones.
