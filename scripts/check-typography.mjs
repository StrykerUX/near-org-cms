#!/usr/bin/env node
// Gate tipográfico: falla si una sección, vista o primitive define tamaño,
// peso, interlineado o tracking a mano en vez de usar la escala del DS.
//
// Existe porque el DS solo cumple su promesa —cambiar un token cambia el
// texto— si NADIE lo parchea localmente. Una clase `font-medium` al lado de un
// `text-h2` no se ve mal hoy (coincide con el weight del token), pero el día
// que el token cambie a 600 lo anula en silencio. Eso es lo que este script
// atrapa.
//
// Escape hatch: `/* ds-exempt: <razón> */` en la misma línea o en la anterior.
// La idea no es prohibir excepciones, es que cada una sea deliberada y tenga
// la razón escrita al lado.
//
// Mismo patrón que scripts/gen-routes.mjs y lint:page-meta — corre en prebuild
// y en CI, sin dependencias.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["components/sections", "components/views", "components/primitives"];

const RULES = [
  {
    // text-[18px] / text-[1.125rem] — tamaños absolutos fuera de la escala.
    // Los relativos (text-[0.5em]) NO entran: escalan con el token del padre.
    re: /\btext-\[[^\]]*(?:px|rem)\]/g,
    msg: "tamaño absoluto fuera de la escala — usá un token (text-h2, text-body-sm, …)",
  },
  {
    re: /\bleading-(?:none|tight|snug|normal|relaxed|loose|\d|\[)/g,
    msg: "el interlineado lo define el token de la escala (--text-*--line-height)",
  },
  {
    re: /\btracking-(?:tighter|tight|normal|wide|wider|widest|\[)/g,
    msg: "el tracking lo define el token de la escala (--text-*--letter-spacing)",
  },
  {
    re: /\bfont-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g,
    msg: "el peso lo define el token de la escala; si falta el rol, agregá un token (ej. --text-label)",
  },
  {
    re: /style=\{\{[^}]*fontSize/g,
    msg: "fontSize inline: nada del DS puede alcanzarlo — agregá un token (ej. --text-wordmark)",
  },
];

// Los archivos que el DS todavía no gobierna. NO es una lista de excepciones
// permitidas: es deuda declarada, y solo puede achicarse.
//
// Todos usan la escala vieja `--font-size-*` (ver el comentario en
// app/globals.css). Migrarlos CAMBIA el tamaño de sus headings, porque esa
// escala es más chica en todos los niveles, así que se hace aparte y con las
// páginas delante — no de arrastre.
const LEGACY = new Set([
  // Blog
  "components/sections/PageHero.tsx",
  "components/sections/PostCard.tsx",
  "components/sections/EmptyState.tsx",
  "components/views/HomeView.tsx",
  // /prototype y /prototype/components (la landing anterior al homepage)
  "components/sections/CompanyGrid.tsx",
  "components/sections/ProductStage.tsx",
  "components/views/PrototypeLandingView.tsx",
  "components/views/ComponentsShowcaseView.tsx",
]);

// Vacía los comentarios de una línea dejando su largo intacto, para no
// matchear dentro de ellos. Sin esto un comentario que EXPLICA por qué no hay
// que usar `font-medium` se reporta como si fuera un `font-medium`.
function stripComments(line, state) {
  let out = "";
  let i = 0;

  while (i < line.length) {
    if (state.inBlock) {
      const end = line.indexOf("*/", i);
      if (end === -1) return out; // el bloque sigue en la próxima línea
      state.inBlock = false;
      i = end + 2;
      continue;
    }

    const block = line.indexOf("/*", i);
    // `//` solo cuenta si no viene de un `:` — así `https://` no se corta.
    const lineComment = line.slice(i).search(/(^|[^:])\/\//);
    const lineAt = lineComment === -1 ? -1 : i + lineComment;

    if (block !== -1 && (lineAt === -1 || block < lineAt)) {
      out += line.slice(i, block);
      state.inBlock = true;
      i = block + 2;
      continue;
    }
    if (lineAt !== -1) {
      out += line.slice(i, lineAt + 1);
      return out;
    }
    out += line.slice(i);
    return out;
  }

  return out;
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const findings = [];

for (const root of ROOTS) {
  let files;
  try {
    files = walk(root);
  } catch {
    continue; // el directorio puede no existir
  }

  for (const file of files) {
    const rel = relative(process.cwd(), file);
    if (LEGACY.has(rel)) continue;

    const lines = readFileSync(file, "utf8").split("\n");
    const state = { inBlock: false };

    lines.forEach((raw, i) => {
      // stripComments SIEMPRE, incluso si la línea se va a saltar: es lo que
      // mantiene el estado del bloque /* */ sincronizado.
      const line = stripComments(raw, state);

      // Exención en la propia línea o en la anterior (se busca en el original:
      // el marcador vive justamente en un comentario).
      if (/ds-exempt/.test(raw) || (i > 0 && /ds-exempt/.test(lines[i - 1]))) return;

      for (const rule of RULES) {
        for (const match of line.matchAll(rule.re)) {
          findings.push({ file: rel, line: i + 1, found: match[0], msg: rule.msg });
        }
      }
    });
  }
}

if (findings.length === 0) {
  console.log("✓ tipografía: sin overrides del design system");
  process.exit(0);
}

console.error(`\n✗ tipografía: ${findings.length} override(s) del design system\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}`);
  console.error(`    ${f.found} — ${f.msg}`);
}
console.error(
  "\n  La escala vive en app/globals.css (tokens --text-*). Si al rol le falta un" +
    "\n  token, agregalo ahí en vez de parchear la clase acá; si la excepción es" +
    "\n  deliberada, dejá /* ds-exempt: <razón> */ en la línea de arriba.\n"
);
process.exit(1);
