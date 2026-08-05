// Frontera de zonas — la ÚNICA config bloqueante del repo (ver
// eslint.config.mjs para el lint completo, que es advisory por ahora).
// Deliberadamente NO spreadea eslint-config-next: linterar
// packages/cms-core con reglas de estilo saldría rojo con decenas de
// findings el día 1, y si el gate de frontera y el ruido de estilo van en
// el mismo check, el equipo aprende a ignorar el check. Por eso no hereda
// nada — declara su propio parser/resolver mínimo.
//
// Corre con: pnpm lint:zones (= eslint . --config eslint.config.zones.mjs
// --no-config-lookup --max-warnings=0)
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

// Zona diseñadores: componentes. `page.meta.ts` NO va aquí — tiene su
// propia regla más abajo, exclusiva a "import type ... from @/lib/page-meta",
// que ya lo cubre por completo (incluyendo cms-core, sin necesidad de
// repetir esa restricción y sin el conflicto de bloquear @/lib/* entero
// cuando ese es justo el único import que un page.meta.ts necesita).
const DESIGNER_ZONE = [
  "components/primitives/**/*.{ts,tsx}",
  "components/sections/**/*.{ts,tsx}",
  "components/views/**/*.{ts,tsx}",
];

const CORE_MSG =
  "Frontera de zona: los archivos de la zona diseñadores no pueden importar el núcleo del CMS. " +
  "Usá @/components/ui/* para primitivas, y recibí datos ya resueltos por props desde un page.tsx/lib/queries " +
  "(ver components/sections/README.md). Si necesitás algo nuevo del núcleo, pídeselo al ingeniero — no lo importes acá.";

const SERVER_MSG =
  "Frontera de zona: nada de runtime de servidor, base de datos, ni auth en la zona diseñadores.";

const META_MSG =
  "page.meta.ts solo puede `import type { PageMeta } from \"@/lib/page-meta\"` — nada más. " +
  "Lo consume SiteHeader.tsx (\"use client\"); cualquier otro import puede reventar el bundle de cliente.";

export default defineConfig([
  {
    name: "near/designer-zone-boundary",
    files: DESIGNER_ZONE,
    plugins: { import: importPlugin },
    languageOptions: {
      parser: tseslint.parser,
    },
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        typescript: { alwaysTryTypes: true, project: path.join(ROOT, "tsconfig.json") },
      },
    },
    rules: {
      // Regla principal: compara la RUTA RESUELTA en disco. `from` es una
      // ruta de directorio (no un glob) → usa containsPath() internamente,
      // así que atrapa alias (@near/cms-core/*, @cms/*), rutas relativas de
      // escape (../../packages/cms-core/lib/prisma) y CUALQUIER forma de
      // llegar a ese directorio. No cubre import()/require() dinámico —
      // por eso las reglas de abajo.
      "import/no-restricted-paths": [
        "error",
        {
          basePath: ROOT,
          zones: [
            { target: DESIGNER_ZONE, from: "packages/cms-core", message: CORE_MSG },
            { target: DESIGNER_ZONE, from: "lib", message: SERVER_MSG },
          ],
        },
      ],

      // Red de seguridad a nivel de especificador: paquetes externos (no
      // resuelven a una ruta del repo, la regla de arriba no los ve) y el
      // caso en que el resolver de import/ falle silenciosamente.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "next/server", message: SERVER_MSG },
            { name: "next/headers", message: SERVER_MSG },
            { name: "next/navigation", message: SERVER_MSG },
            { name: "next/cache", message: SERVER_MSG },
            { name: "@prisma/client", message: SERVER_MSG },
            { name: ".prisma/client", message: SERVER_MSG },
            { name: "next-auth", message: SERVER_MSG },
          ],
          // `group` es gitignore-style (paquete `ignore`). NO usar `!` para
          // excepciones — verificado que no re-incluye subrutas.
          patterns: [
            { group: ["@near/cms-core", "@near/cms-core/**", "@cms", "@cms/**"], message: CORE_MSG },
            { group: ["@prisma/client/**", ".prisma/client/**", "next-auth/**"], message: SERVER_MSG },
          ],
        },
      ],

      // Tapa import() dinámico, que no-restricted-imports NO visita (solo
      // recorre ImportDeclaration/ExportDeclaration/TSImportEquals).
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportExpression > Literal[value=/cms-core|packages.cms-core/]",
          message: CORE_MSG,
        },
        {
          selector: "CallExpression[callee.name='require'] > Literal[value=/cms-core/]",
          message: CORE_MSG,
        },
      ],
    },
  },

  // page.meta.ts: nada de imports salvo `import type { PageMeta } from
  // "@/lib/page-meta"`. no-restricted-imports no soporta "permite 1,
  // prohíbe el resto" — se resuelve con no-restricted-syntax, que sí puede
  // negar por atributo del nodo (`importKind`, `source.value`).
  {
    name: "near/page-meta-only-type-import-allowed",
    files: ["app/**/page.meta.ts"],
    languageOptions: { parser: tseslint.parser },
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "ImportDeclaration:not([importKind='type'])", message: META_MSG },
        {
          selector: "ImportDeclaration[importKind='type']:not([source.value='@/lib/page-meta'])",
          message: META_MSG,
        },
      ],
    },
  },

  globalIgnores([
    "**/node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "*.tsbuildinfo",
    ".vercel/**",
    "front-near-pages/**",
    "public/**",
  ]),
]);
