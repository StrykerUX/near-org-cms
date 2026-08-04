#!/usr/bin/env node
// Genera lib/routes.generated.ts a partir de los `page.meta.ts` hermanos de
// cada `page.tsx` bajo app/. Node puro, cero dependencias, no parsea
// TypeScript — solo camina el filesystem y usa un regex mínimo para
// VALIDAR (no para extraer) el campo `route` de cada meta.
//
// Por qué no en runtime: SiteHeader.tsx es "use client" (no puede usar
// `fs`), y en Vercel un glob de `fs` sobre `app/` funcionaría en dev y
// devolvería vacío en producción — fallo silencioso, el peor tipo. Por eso
// esto es codegen en build-time a un archivo committeado (cache, no fuente
// de verdad — `predev`/`prebuild` lo regeneran siempre).
//
// Uso: node scripts/gen-routes.mjs [--check]

import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = path.join(ROOT, "app");
const OUTPUT = path.join(ROOT, "lib", "routes.generated.ts");
const SKIP_DIRS = new Set(["api", "admin", "node_modules", ".next"]);
const CHECK_ONLY = process.argv.includes("--check");

/** @returns {string[]} rutas absolutas de directorios bajo APP_DIR, incluyendo APP_DIR mismo */
function walk(dir, acc = []) {
  acc.push(dir);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (dir === APP_DIR && SKIP_DIRS.has(entry.name)) continue;
    walk(path.join(dir, entry.name), acc);
  }
  return acc;
}

/** "(site)/blog/[slug]" -> { route: "/blog/[slug]", isDynamic: true } */
function deriveRoute(dirAbs) {
  const rel = path.relative(APP_DIR, dirAbs); // "" para app/ mismo
  const segments = rel === "" ? [] : rel.split(path.sep);
  const isDynamic = segments.some((s) => s.includes("["));
  const kept = segments.filter((s) => !/^\(.*\)$/.test(s)); // descarta grupos de ruta
  const route = kept.length === 0 ? "/" : `/${kept.join("/")}`;
  return { route, isDynamic };
}

const fatalErrors = [];
const warnings = [];
const routes = []; // { route, file, importPath }

for (const dirAbs of walk(APP_DIR)) {
  const pagePath = path.join(dirAbs, "page.tsx");
  const metaPath = path.join(dirAbs, "page.meta.ts");
  const hasPage = existsSync(pagePath);
  const hasMeta = existsSync(metaPath);
  if (!hasPage && !hasMeta) continue;

  const { route, isDynamic } = deriveRoute(dirAbs);
  const relMetaFromRoot = path.relative(ROOT, metaPath);

  if (!hasPage && hasMeta) {
    fatalErrors.push(`page.meta.ts huérfano, sin page.tsx hermano: ${relMetaFromRoot}`);
    continue;
  }
  if (isDynamic) {
    if (hasMeta) {
      fatalErrors.push(
        `Ruta dinámica con page.meta.ts (prohibido — su SEO va en generateMetadata, ` +
          `necesita DB): ${relMetaFromRoot}`
      );
    }
    continue; // dinámica sin meta: correcto, nada que hacer
  }
  if (!hasMeta) {
    warnings.push(`page.tsx sin page.meta.ts (no aparecerá en nav/sitemap): ${path.relative(ROOT, pagePath)}`);
    continue;
  }

  // Validar (no extraer) que el `route` declarado adentro coincide con el
  // derivado del filesystem — evita que el manifiesto final (que siempre usa
  // la ruta derivada, ver abajo) diverja en silencio de lo que alguien
  // escribió a mano en el archivo.
  const source = readFileSync(metaPath, "utf8");
  const match = source.match(/route:\s*["'`]([^"'`]+)["'`]/);
  if (!match) {
    fatalErrors.push(`${relMetaFromRoot}: no se encontró un campo "route: ..." — es obligatorio.`);
  } else if (match[1] !== route) {
    fatalErrors.push(
      `${relMetaFromRoot}: route declarado ("${match[1]}") no coincide con la ruta real ("${route}"). ` +
        `Corrige el archivo — la ruta la determina la ubicación de page.tsx, no lo que se escriba aquí.`
    );
  }

  routes.push({
    route,
    file: path.relative(ROOT, metaPath),
    // Alias @/app/... en vez de relativo — evita ambigüedad con los
    // paréntesis literales de los grupos de ruta en especificadores de
    // módulo relativos.
    importSpecifier: `@/${path.relative(ROOT, metaPath).replace(/\.ts$/, "")}`,
  });
}

if (fatalErrors.length > 0) {
  console.error("\n✗ gen-routes: errores fatales\n");
  for (const err of fatalErrors) console.error(`  - ${err}`);
  console.error("");
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn("\n⚠ gen-routes: advertencias (no bloquean)\n");
  for (const warn of warnings) console.warn(`  - ${warn}`);
  console.warn("");
}

routes.sort((a, b) => a.route.localeCompare(b.route));

const imports = routes.map((r, i) => `import m${i} from "${r.importSpecifier}";`).join("\n");
const entries = routes
  .map((r, i) => `  { ...m${i}, route: "${r.route}", file: "${r.file}" },`)
  .join("\n");

const output = `// AUTO-GENERADO por scripts/gen-routes.mjs — NO EDITAR A MANO.
// Este archivo es un cache committeado, no la fuente de verdad — se
// regenera en cada \`predev\`/\`prebuild\`. Para agregar una página, crea su
// \`page.meta.ts\` y corre \`pnpm gen:routes\`.
import type { RouteEntry } from "@/lib/page-meta";
${imports}

export const ROUTES: RouteEntry[] = [
${entries}
];
`;

if (CHECK_ONLY) {
  const current = existsSync(OUTPUT) ? readFileSync(OUTPUT, "utf8") : null;
  if (current !== output) {
    console.error(`✗ ${path.relative(ROOT, OUTPUT)} está desactualizado. Corre \`pnpm gen:routes\`.`);
    process.exit(1);
  }
  console.log(`✓ ${path.relative(ROOT, OUTPUT)} está al día.`);
  process.exit(0);
}

// Escritura idempotente: si el contenido es idéntico, no reescribir — evita
// invalidar el watcher de Next en dev por un touch sin cambios reales.
const current = existsSync(OUTPUT) ? readFileSync(OUTPUT, "utf8") : null;
if (current !== output) {
  writeFileSync(OUTPUT, output);
  console.log(`✓ ${path.relative(ROOT, OUTPUT)} regenerado (${routes.length} rutas).`);
} else {
  console.log(`✓ ${path.relative(ROOT, OUTPUT)} ya estaba al día (${routes.length} rutas).`);
}
