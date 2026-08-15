// Lint completo — ADVISORY por ahora (ver package.json: el job de CI lo
// corre con `continue-on-error: true`). Linterá también packages/cms-core
// con reglas de estilo (react-hooks, @typescript-eslint/no-explicit-any,
// etc.) y saldrá rojo con hallazgos preexistentes — es esperado, no un bug
// de esta config.
//
// El único bloque que sí bloquea el build es la regla de `page.meta.ts` más
// abajo: la corre `pnpm run lint:page-meta` desde `prebuild` (ver
// package.json). Existe porque el manifiesto de rutas —que agrega todos los
// `page.meta.ts`— lo consume chrome compartido, y basta con que UN consumidor
// sea `"use client"` para que cualquier import de servidor colado en un meta
// termine en el bundle de cliente y reviente con un error confuso, en vez de
// con un error de lint claro.
//
// Hoy el único consumidor es `SiteFooter`, que es un componente de servidor, así
// que el peligro está latente y no activo. La regla se queda igual: es barata, y
// el día que el footer se rediseñe con estado —o que el header vuelva a leer el
// manifiesto— vuelve a ser lo único que separa de ese error.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const META_MSG =
  "page.meta.ts solo puede `import type { PageMeta } from \"@/lib/page-meta\"` — nada más. " +
  "Lo agrega el manifiesto de rutas, que consume chrome compartido; cualquier otro import puede reventar el bundle de cliente.";

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
