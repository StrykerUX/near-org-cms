# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

`near-org-cms` es un fork interno de [`near-ai-web`](https://github.com/nearai/near-ai-web) (repo original, sin relación de remoto con este). Se duplicó el 2026-07-29 conservando el historial completo de git.

**Objetivo del fork:** mantener el núcleo (`packages/cms-core`: auth, Prisma, API routes, lógica de admin) intacto y reemplazar el frontend (`app/(site)`, `components/`) por uno nuevo para un proyecto distinto. No hacer merge/push cruzado con `near-ai-web` — son proyectos separados a partir de aquí.

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
AIRTABLE_API_KEY=       AIRTABLE_BASE_ID=       AIRTABLE_ECOSYSTEM_TABLE=
```


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

## Incomplete Features

- **Page Management** — DB model exists, admin UI is a stub
- **Notification emails** — Only password reset email exists

## Contexto del proyecto (Regenta/Aura)

Al iniciar una sesión en este repo, ANTES de explorar archivos corre `/aura near-ai-web` —
trae resumen, arquitectura, estructura, decisiones y estado en ~1-2k tokens.
Tras cada tarea larga: `/aura checkpoint`. Al terminar la sesión: `/aura close`.

---

*Last updated: Phase 5 (Standalone near-ai — single app at root + cms-core shared package)*
