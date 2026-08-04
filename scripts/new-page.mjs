#!/usr/bin/env node
// Scaffolder de páginas nuevas. Cierra el círculo de la frontera: denegar la
// escritura de `app/**/page.tsx` (Fase 6) deja al diseñador sin forma de
// crear una página si no existe otra vía — este script la crea sin que el
// diseñador escriba nada dentro de `app/` a mano, y sin depender del
// ingeniero para cada página nueva.
//
// Uso: node scripts/new-page.mjs <slug> "<Título>"
// Ejemplo: node scripts/new-page.mjs pricing "Pricing"
//
// Genera, bajo app/(site)/<slug>/:
//   - page.tsx        (6 líneas, ingeniero — pero ya escrito, no hace falta tocarlo)
//   - page.meta.ts     (diseñador — editable después)
// Y bajo components/views/:
//   - <Slug>View.tsx  (diseñador — acá se compone la página real)
//
// Al terminar, regenera el manifiesto de rutas automáticamente.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const [, , slugArg, titleArg] = process.argv;

if (!slugArg || !titleArg) {
  console.error("Uso: node scripts/new-page.mjs <slug> \"<Título>\"");
  console.error('Ejemplo: node scripts/new-page.mjs pricing "Pricing"');
  process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(slugArg)) {
  console.error(
    `✗ Slug inválido: "${slugArg}". Solo minúsculas, números y guiones, empezando con una letra (ej: "pricing", "about-us").`
  );
  process.exit(1);
}

const RESERVED = new Set(["api", "admin", "blog", "brand", "prototype", "downloads", "preview"]);
if (RESERVED.has(slugArg)) {
  console.error(`✗ "${slugArg}" es una ruta reservada del sistema. Elegí otro nombre.`);
  process.exit(1);
}

const pageDir = path.join(ROOT, "app", "(site)", slugArg);
if (existsSync(pageDir)) {
  console.error(`✗ Ya existe app/(site)/${slugArg}/ — elegí otro slug o borrá esa carpeta primero.`);
  process.exit(1);
}

// "my-cool-page" -> "MyCoolPage"
const pascalName = slugArg
  .split("-")
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join("");
const viewName = `${pascalName}View`;
const viewPath = path.join(ROOT, "components", "views", `${viewName}.tsx`);

if (existsSync(viewPath)) {
  console.error(`✗ Ya existe components/views/${viewName}.tsx — elegí otro slug.`);
  process.exit(1);
}

const title = titleArg;

mkdirSync(pageDir, { recursive: true });

writeFileSync(
  path.join(pageDir, "page.meta.ts"),
  `import type { PageMeta } from "@/lib/page-meta";

const meta = {
  route: "/${slugArg}",
  title: "${title}",
  description: "TODO: escribí una descripción real antes de publicar.",
  nav: { header: false, footer: false, label: "${title}", order: 999 },
  sitemap: { changeFrequency: "monthly", priority: 0.5 },
} satisfies PageMeta;

export default meta;
`
);

writeFileSync(
  path.join(pageDir, "page.tsx"),
  `import type { Metadata } from "next";
import { toMetadata } from "@/lib/seo";
import ${viewName} from "@/components/views/${viewName}";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

export default function ${pascalName}Page() {
  return <${viewName} />;
}
`
);

writeFileSync(
  viewPath,
  `export default function ${viewName}() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-eyebrow uppercase text-muted-foreground">Página nueva</p>
      <h1 className="text-h3 font-medium">${title}</h1>
      <p className="text-body-sm text-muted-foreground max-w-md">
        Componé esta página con secciones de @/components/sections/*.
      </p>
    </main>
  );
}
`
);

console.log(`✓ Creado app/(site)/${slugArg}/page.tsx`);
console.log(`✓ Creado app/(site)/${slugArg}/page.meta.ts`);
console.log(`✓ Creado components/views/${viewName}.tsx`);

try {
  execFileSync("node", [path.join(ROOT, "scripts", "gen-routes.mjs")], { cwd: ROOT, stdio: "inherit" });
} catch {
  console.error("⚠ No se pudo regenerar el manifiesto automáticamente — corré `pnpm gen:routes` a mano.");
}

console.log(`\n→ /${slugArg} listo. Componé components/views/${viewName}.tsx con secciones de components/sections/.`);
