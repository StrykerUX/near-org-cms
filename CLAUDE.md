# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

`near-org-cms` es un fork interno de [`near-ai-web`](https://github.com/nearai/near-ai-web) (repo original, sin relación de remoto con este). Se duplicó el 2026-07-29 conservando el historial completo de git.

**Objetivo del fork:** mantener el núcleo (`packages/cms-core`: auth, Prisma, API routes, lógica de admin) intacto y reemplazar el frontend (`app/(site)`, `components/`) por uno nuevo para un proyecto distinto. No hacer merge/push cruzado con `near-ai-web` — son proyectos separados a partir de aquí.

## Trabajo en paralelo: git worktrees

Este repo se trabaja con **varios worktrees a la vez**, uno por sesión de
Claude, cada uno en su propia rama `tweaks/<nombre>`. Comparten el mismo `.git`
y la misma base de datos Postgres, así que hay cinco reglas que no son
preferencias:

**1. Nunca `git checkout main`.** Ramificá desde él —
`git checkout -b tweaks/<nombre> main`— y dejalo libre para que cualquier
sesión pueda mergear cuando le toque. Git además lo impide si otro worktree ya
lo tiene tomado: `git worktree list` muestra qué rama ocupa cada carpeta, y
`git branch` marca con `+` las que están tomadas fuera de la actual. Si tenés
que mergear a main, hacelo y **volvé a tu rama al terminar**.

**2. Nada de `prisma:migrate` ni `prisma:seed`.** La base es compartida: una
migración desde un worktree se la come el resto sin avisar.

**3. No toques archivos fuera de tu carpeta.** Los otros worktrees son otras
sesiones trabajando ahora mismo.

**4. Cada worktree, su puerto.** El principal usa el 3001 (`pnpm dev`); los
demás arrancan con `pnpm exec next dev --port <otro>`. Dos servidores en el
mismo puerto se pisan en silencio.

**5. `lib/routes.generated.ts` va a dar conflicto en casi todo merge**, porque
es un cache commiteado que las dos ramas regeneran con rutas distintas. Se
resuelve **siempre** con `pnpm gen:routes` y **nunca a mano**: el comando
produce la unión de las rutas de ambas. Después, `pnpm routes:check` confirma
que quedó al día.

### Dos cosas que muerden

**Turbopack se queda con las rutas borradas.** Si borrás una carpeta de
`app/**` con el dev server corriendo, sigue en su grafo y tira
`Module not found: Can't resolve './page.meta'` sobre un archivo que ya no
existe. Se arregla reiniciando el server (y, si insiste, borrando
`.next/dev/types`). Lo mismo con `tsc`: los tipos de ruta generados quedan
stale y reportan errores de rutas fantasma.

**Antes de commitear, `pnpm build` completo**, no solo `typecheck`. El
`prebuild` corre `gen:routes`, `lint:page-meta` y `lint:typography`, que es
donde saltan los problemas que el typecheck no ve.

## Project Structure

This is a **pnpm workspace** with a standalone Next.js app at the root and a shared CMS package.

```
/
├── app/                   ← near-ai Next.js app (App Router)
│   ├── (site)/            — Public pages (home, blog, etc.)
│   ├── admin/             — 1-line re-exports → cms-core/pages/admin/
│   ├── api/               — 1-line re-exports → cms-core/routes/api/
│   └── ...                — feed.xml, sitemap, robots, preview
│
├── components/            — App-local components
├── proxy.ts               — Auth protection for /admin/* (Next.js 16 middleware)
│
└── packages/
    └── cms-core/          ← Shared CMS engine (@near/cms-core)
        ├── components/admin/  — Admin UI (BlockEditor, sidebar, etc.)
        ├── components/ui/     — shadcn/ui primitives
        ├── lib/               — auth, prisma, email, utils, tiptap-renderer
        ├── pages/admin/       — Admin page implementations
        ├── routes/api/        — API route handlers
        ├── prisma/            — Schema + migrations
        ├── styles/            — admin.css (TipTap + dark mode editor styles)
        └── types/             — next-auth.d.ts type extensions
```

## Quick Commands

```bash
# Dev (from repo root)
pnpm dev                    # near-ai.localhost:3001

# With portless
portless run next dev

# Build
pnpm build

# Database (Prisma lives in cms-core)
pnpm --filter @near/cms-core run prisma:migrate  # create/apply migrations
pnpm --filter @near/cms-core run prisma:seed     # seed demo users
pnpm --filter @near/cms-core run prisma:studio   # Prisma Studio
```

**Dev credentials:** `admin@example.com` / `password`

## Key Technologies

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Workspace | pnpm workspaces (standalone app + cms-core package) |
| Styling | Tailwind CSS v4 + shadcn/ui (new-york style) |
| Database | PostgreSQL + Prisma ORM (schema in `packages/cms-core/prisma/`) |
| Auth | NextAuth.js v5 (JWT + Credentials) |
| Editor | TipTap v3 (block-based, slash commands, drag handles) |
| Media | Cloudflare R2 via `@aws-sdk/client-s3` |
| Email | Resend (`packages/cms-core/lib/email.ts`) |

## Environment Variables

`.env.local` lives at the repo root:

```bash
DATABASE_URL=           NEXTAUTH_URL=           AUTH_SECRET=
S3_ENDPOINT=            S3_REGION=auto          S3_BUCKET=
S3_ACCESS_KEY_ID=       S3_SECRET_ACCESS_KEY=   R2_PUBLIC_URL=
RESEND_API_KEY=
SITEPING_API_KEY=       REVIEW_ACCESS_SECRET=
```

Las dos últimas son de los comentarios de revisión (ver `docs/siteping.md`). Si
faltan, la herramienta de feedback se degrada pero el sitio y el resto del admin
siguen funcionando.


## Important Patterns

**Route protection** — `proxy.ts` at the root guards `/admin/*` via `req.auth`. API routes call `await auth()` and return 401 if no session. (Note: previously `middleware.ts`, renamed to `proxy.ts` in Next.js 16.)

**Database** — Always use the singleton from cms-core: `import { prisma } from '@near/cms-core/lib/prisma'`

**Imports in apps** — Use `@near/cms-core/*` for shared code, `@/*` for app-local code:
```typescript
import { auth } from "@near/cms-core/lib/auth";           // shared
import { prisma } from "@near/cms-core/lib/prisma";        // shared
import { renderBlocks } from "@near/cms-core/lib/tiptap-renderer"; // shared
import MyComponent from "@/components/site/MyComponent";   // app-local
```

**Imports in cms-core** — Use `@cms/*` alias (maps to cms-core root):
```typescript
import { prisma } from "@cms/lib/prisma";
import { auth } from "@cms/lib/auth";
```

**Styling** — Public site: plain Tailwind light mode. Admin: dark mode via `.dark` class applied by `AdminThemeProvider`. Use semantic tokens (`bg-background`, `text-foreground`, etc.). Shared admin styles in `packages/cms-core/styles/admin.css`.

**Tailwind @source** — `app/globals.css` must include `@source` pointing to cms-core so Tailwind scans shared components:
```css
@source "../packages/cms-core/components/**/*.tsx";
@source "../packages/cms-core/pages/**/*.tsx";
@source "../packages/cms-core/routes/**/*.tsx";
```

**Editor** — TipTap stores content as JSON. `packages/cms-core/components/admin/editor/BlockEditor.tsx` handles editing. `packages/cms-core/lib/tiptap-renderer.tsx` renders on public site (accepts `ImageComponent` and `CarouselComponent` via dependency injection).

**ISR** — Blog index and post pages revalidate every 60s. On publish/update, `revalidatePath()` triggers immediately.

**Re-export pattern** — Admin pages and API routes are 1-line re-exports into cms-core:
```typescript
// app/admin/dashboard/page.tsx
export { default } from "@near/cms-core/pages/admin/dashboard/page";

// app/api/posts/route.ts
export { GET, POST } from "@near/cms-core/routes/api/posts/route";
```

## Database Schema (key models)

**User** — id, email, password (bcrypt), name, role (ADMIN|EDITOR|VIEWER)

**Post** — id, title, slug, content (JSON/TipTap), excerpt, coverImage, heroBgColor, heroBgImage, status (DRAFT|PUBLISHED|ARCHIVED), seoTitle, seoDesc, ogImage, previewToken, previewPassword, lockedBy/lockedAt (90s edit lock), authorId, publishedAt

**Media** — id, url, filename, mimeType, size, alt

**Category / Tag** — id, name, slug

**AuditLog** — userId, userEmail, action, entityType, entityId, entityTitle

## Auth & Roles

JWT strategy, 30-day sessions. Roles: **ADMIN** (full access) · **EDITOR** (own posts + all reads) · **VIEWER** (own posts read-only).

**Comentarios de revisión** — el equipo comenta sobre el sitio con anotaciones
ancladas al DOM, vía un link de `/admin/feedback`. Montado sobre SitePing
autohospedado. El endpoint público está cerrado por cookie firmada y la API key
nunca llega al navegador: **antes de tocar `app/api/siteping/`,
`app/api/admin/siteping/` o `lib/review-access.ts`, leer `docs/siteping.md`** —
las tres piezas se sostienen entre sí.

## Incomplete Features

- **Page Management** — DB model exists, admin UI is a stub
- **Notification emails** — Only password reset email exists

## Frontend de marketing: cómo está organizado

El frontend público (`app/(site)`, `app/prototype`) sigue una separación en
capas entre composición y datos:

| Capa | Qué va ahí |
|---|---|
| `components/primitives/` | Bloques atómicos (`Accent`, `Button`, `Eyebrow`, `Container`, …) |
| `components/sections/` | Secciones de marketing reusables — ver `components/sections/README.md` para el catálogo y el contrato |
| `components/views/` | La composición de cada página real (qué secciones, en qué orden, con qué copy) |
| `app/**/page.meta.ts` | Metadata de cada página (title, description, nav, sitemap) |
| `app/**/page.tsx` | Fetch de datos (`lib/queries/*`), `revalidate`, `notFound()` — nada de JSX de layout |

Los `views` reciben props planas y serializables (sin `Date`, sin funciones —
ver `components/sections/types.ts`), así que se pueden razonar o previsualizar
sin tocar la base de datos. El fetching vive en `page.tsx`/`lib/queries/*`,
nunca en un `view` o una `section`.

**Manifiesto de rutas:** cada página con `page.meta.ts` entra automáticamente
al **sitemap**. Al crear o editar uno, correr `pnpm gen:routes` —
`lib/routes.generated.ts` es un cache commiteado, no la fuente de verdad
(`predev`/`prebuild` lo regeneran solos).

Al **nav no entra sola**: ni el header ni el footer leen el manifiesto, los dos
llevan su propia copy transcrita del sitemap doc (jerarquía de columnas y
sub-grupos, que una lista plana de rutas no puede expresar). Una página nueva
que deba verse en el menú se agrega a mano a `GROUPS` en
`components/site/SiteFooter.tsx` y/o a `SiteHeader`.

**Única regla que el build hace cumplir:** `page.meta.ts` solo puede
`import type { PageMeta } from "@/lib/page-meta"` — nada más. Un import de
servidor colado ahí llega al bundle de cliente por cualquier consumidor
`"use client"` del manifiesto, y revienta con un error de bundle confuso.
Se verifica con `pnpm lint:page-meta` (corre en `prebuild` y en CI).

**Header y footer del sitio:** hay UNO de cada uno —
`components/site/SiteHeader.tsx` y `components/site/SiteFooter.tsx` — y los
montan los tres layouts del frontend: `app/(site)/layout.tsx`,
`app/(motion)/layout.tsx` y `app/prototype/layout.tsx`. **Ninguna página ni
view los importa**; son chrome, no secciones (por eso viven en
`components/site/` y no en `components/sections/`, cuyo contrato además les
prohibiría importar `@/lib/*`). En el CMS/admin no van.

El header es `fixed`, así que las páginas que no quieran que su contenido le
pase por debajo despejan con `pt-[var(--site-header-block)]`; las de
`/prototype` animadas no lo hacen a propósito.

El footer es el del takeover (wipe negro + wordmark con bote, GSAP). En mobile
y con `prefers-reduced-motion` cae solo a una versión estática en cream. Como
vive en el layout y no se remonta al navegar, su ScrollTrigger se reconstruye
con `pathname` y se re-mide con un `ResizeObserver` propio — el detalle está
comentado en el archivo, junto con por qué usa `st.refresh()` de la instancia y
nunca el `ScrollTrigger.refresh()` global (congela Lenis).

**Sistema de color: cuatro colores, tres capas, y el hex vive en UNA.**
`app/globals.css` tiene `capa 0 · primitivos` (`--green-500` `--cream-100`
`--gray-300` `--dark-900` — los únicos hex del sistema), `capa 1 · semánticos`
(`--sem-*`: los ocho roles del archivo de Figma, con sus destinos **tal cual**) y
`capa 2 · alias legacy` (`--ink`, `--cream`, `--rule`… — los ~1900 usos que ya
están escritos; los 21 caen sobre los ocho roles y ninguno tiene valor propio).
**Cambiar la paleta es mover un valor en la capa 0.**

En código nuevo van las utilidades semánticas: `bg-surface`, `bg-surface-alt`,
`bg-surface-dark`, `text-content`, `text-content-muted`, `bg-brand`,
`text-on-brand`, `border-line`.

**El sistema se adoptó literal, y eso tiene consecuencias que hay que conocer
antes de "arreglar" algo que parece un bug:**

- **Hay un solo verde.** Los cinco verdes con roles distintos, el teal, los dos
  amarillos del sweep y las tres paradas de la rampa del CTA son todos
  `--green-500`. Los gradientes de la rampa se ven planos: es la paleta, no un
  error. `CTA_RAMP` en `motionColors.ts` sigue siendo una tupla de tres para no
  romper a sus consumidores.
- **No hay blanco.** `background-primary` y `background-secondary` son el mismo
  crema, así que las cards no se despegan de la página por color — solo por su
  borde.
- **Tres pares quedan por debajo del piso de WCAG**, porque así los define el
  archivo: `text-secondary` sobre claro y `border-default` sobre claro a 1.19:1,
  y `text-on-brand` sobre el verde a 1.64:1. El de más superficie es el primero
  (228 usos de copy subordinada). Si se corrigen, se corrigen en la capa 1.

Tres cosas que muerden:

- La capa 1 usa el prefijo `--sem-` y no `--color-`. `--color-` es el namespace
  de Tailwind: un semántico declarado ahí colisiona con la clave del `@theme`
  que lo consume (`--color-surface-dark: var(--color-surface-dark)` es una
  referencia circular, no un alias).
- **Dos tokens del `@theme` que comparten prefijo pueden hacer que Tailwind emita
  el corto y descarte el largo en silencio** (ya pasó con `--text-poster`). Al
  agregar una clave nueva, verificarla contra el CSS emitido —
  `grep '\.tu-clase{' .next/static/chunks/*.css` tras un build— y no contra la
  intuición.
- Los colores que ANIMA GSAP o que dibuja un canvas/WebGL siguen siendo
  literales: `var()` no resuelve como destino de un tween ni dentro de un
  contexto 2D. Espejan la capa 0 a mano; los compartidos viven en
  `components/primitives/motion/motionColors.ts`.

**Fuera del sistema, a propósito:** el admin del CMS (corre en `.dark` sobre los
tokens de shadcn), `stackArt.generated.tsx` (ilustración de marca exportada, con
gradientes de varias paradas que son arte y no superficie) y `--destructive`,
que conserva su rojo porque la paleta no tiene color de error.

La referencia completa —muestras, ratios medidos, qué colapsó en qué y qué costó—
se renderiza en **`/design-system/color`**.

**Una sola línea de diseño viva.** Hasta el 2026-08-21 el repo tenía nueve
homepages en paralelo y siete laboratorios de secciones. Se archivaron todos:
queda `components/sections/homepage-a/` (montada en
`/prototype/homepage-a` y en la home real), más las dos exploraciones vivas
—`/prototype/homepage-b` y `-c`, que comparten `homepage-shared/`,
`homepage-fold/` y `homepage-tuck/`— y las tres páginas reales — `protocol/`,
`chain/` y `quantum/`, que se importan entre sí y no son laboratorios.

Lo archivado está completo en el tag `v-pre-limpieza` y en la rama `Respaldo`;
**`docs/labs-archivados.md`** dice qué era cada lab y el comando para traerlo de
vuelta. Antes de dar por perdido un efecto (transiciones, murales, shaders de
hero, las catorce bandas de newsletter), mirá ahí.

**Cuatro páginas nuevas, con tres layouts cada una.** `/about`, `/economics`,
`/community` y `/near-foundation` dejaron de ser `StubView` el 2026-08-23:
montan su variante A y se mudaron de `(site)` a `(motion)` porque usan
ScrollTrigger (el porqué está en `app/(motion)/layout.tsx`). Las tres propuestas
de cada una viven en `/prototype/<page>-a|b|c` y **comparten un único módulo de
copy** (`components/sections/<page>/<page>Content.ts`), que es lo que hace que
toda diferencia entre A, B y C sea de layout y nunca de redacción. Elegir otra
propuesta es cambiar el import de una línea en el `page.tsx` real. El detalle
del patrón está en `components/sections/README.md`.

**Página nueva:** la skill `/new-page <slug> "<Título>"` (o
`node scripts/new-page.mjs <slug> "<Título>"` a mano) es un atajo — genera
`page.tsx`/`page.meta.ts`/View coherentes y regenera el manifiesto en un paso.
No es obligatorio, pero evita tener que acordarse de los 3 archivos.

**Iteración visual (ajustes de diseño, animación, layout):** durante una
ronda de ajustes rápidos sobre una sección/vista ya existente (ej. comparando
contra una captura de referencia), no correr `pnpm build`, `pnpm typecheck`
ni lint entre cada cambio — solo edita, y dejá que el usuario mire el
resultado en `pnpm dev`. Corré esas verificaciones recién antes de un commit,
o si el propio usuario lo pide explícitamente. El feedback loop de este tipo
de trabajo es visual, no de compilación.

## Contexto del proyecto (Regenta/Aura)

Al iniciar una sesión en este repo, ANTES de explorar archivos corre `/aura near.org` —
trae resumen, arquitectura, estructura, decisiones y estado en ~1-2k tokens.
Tras cada tarea larga: `/aura checkpoint`. Al terminar la sesión: `/aura close`.

---

*Last updated: 2026-08-27 — sistema de color adoptado literal del archivo de Figma: 4 primitivos, 8 semánticos y todo el color del sitio migrado a ellos. Referencia en `/design-system/color`.*
