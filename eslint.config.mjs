// Lint completo — ADVISORY por ahora (ver package.json: el job de CI lo
// corre con `continue-on-error: true`). Linterá también packages/cms-core
// con reglas de estilo (react-hooks, @typescript-eslint/no-explicit-any,
// etc.) y saldrá rojo con hallazgos preexistentes — es esperado, no un bug
// de esta config.
//
// El único bloque que sí bloquea el build es la regla de `page.meta.ts` más
// abajo: la corre `pnpm run lint:page-meta` desde `prebuild` (ver
// package.json). Existe porque SiteHeader.tsx es "use client" y arrastra
// todo lo que un page.meta.ts importe al bundle de cliente — un import de
// servidor ahí revienta con un error de bundle confuso, en vez de un error
// de lint claro.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const META_MSG =
  "page.meta.ts solo puede `import type { PageMeta } from \"@/lib/page-meta\"` — nada más. " +
  "Lo consume SiteHeader.tsx (\"use client\"); cualquier otro import puede reventar el bundle de cliente.";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

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
