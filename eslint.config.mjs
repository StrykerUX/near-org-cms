// Lint completo — ADVISORY por ahora (ver package.json: el job de CI lo
// corre con `continue-on-error: true`). Linterá también packages/cms-core
// con reglas de estilo (react-hooks, @typescript-eslint/no-explicit-any,
// etc.) y saldrá rojo con hallazgos preexistentes el día 1 — es esperado,
// no un bug de esta config. El gate que sí bloquea es `pnpm lint:zones`
// (eslint.config.zones.mjs), que se corre por separado para no mezclar
// autoridad (frontera) con ruido (estilo).
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import zones from "./eslint.config.zones.mjs";

export default defineConfig([...nextVitals, ...nextTs, ...zones]);
