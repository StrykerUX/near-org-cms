#!/usr/bin/env node
// Onboarding de una sola vez para diseñadores: copia la plantilla de
// permisos a SU PROPIO .claude/settings.local.json (gitignorado, nunca se
// sube) — mismo patrón que ya usa este proyecto para .env.local
// (cp .env.example .env.local).
//
// Por qué no viene en .claude/settings.json (committeado): ese archivo se
// auto-carga para CUALQUIERA que abra este repo con Claude Code, incluido
// el ingeniero. Poner el deny/hook ahí restringiría también las sesiones
// del ingeniero, para siempre, sin forma de desactivarlo desde dentro de
// Claude Code (deny nunca se puede levantar desde la misma herramienta que
// lo aplica). Con este paso manual, cada diseñador activa la restricción en
// su propia máquina; el ingeniero simplemente no corre este script.
//
// Uso: node scripts/setup-designer.mjs

import { existsSync, copyFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = path.join(ROOT, ".claude", "settings.designer.example.json");
const TARGET = path.join(ROOT, ".claude", "settings.local.json");

if (!existsSync(TEMPLATE)) {
  console.error(`✗ No se encontró ${path.relative(ROOT, TEMPLATE)}. ¿Corriste esto desde la raíz del repo?`);
  process.exit(1);
}

if (existsSync(TARGET)) {
  console.error(
    `✗ Ya existe ${path.relative(ROOT, TARGET)}. Este script no lo sobreescribe — ` +
      `si querés aplicar la plantilla igual, borralo primero o mergeá el contenido a mano.`
  );
  process.exit(1);
}

copyFileSync(TEMPLATE, TARGET);

const content = JSON.parse(readFileSync(TARGET, "utf8"));
const denyCount = content.permissions?.deny?.length ?? 0;

console.log(`✓ Copiado a ${path.relative(ROOT, TARGET)} (${denyCount} reglas de deny + hook PreToolUse activo).`);
console.log("→ Reiniciá tu sesión de Claude Code para que tome efecto.");
console.log(
  "→ Podés tocar: components/primitives/**, components/sections/**, components/views/**, " +
    "app/**/page.meta.ts y public/**. Para páginas nuevas usá /new-page en vez de crear archivos en app/."
);
