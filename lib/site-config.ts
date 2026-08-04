// Centraliza dos valores que hoy viven hardcodeados en 3 archivos distintos
// (app/sitemap.ts, app/robots.ts, app/(site)/blog/page.tsx) con el mismo
// valor literal en cada uno — y el repo ya es un fork para un proyecto
// distinto de near.ai. Se deja el valor ACTUAL a propósito (cero cambio de
// SEO en esta fase); cambiarlo aquí, en un solo lugar, cuando se decida la
// marca definitiva del nuevo proyecto.
export const SITE_URL = "https://near.ai";

// Sufijo aplicado por lib/seo.ts a cada <title>. También el valor actual
// (" — NEAR AI"), sin cambios de comportamiento.
export const BRAND_TITLE_SUFFIX = " — NEAR AI";

// og:site_name — hoy solo blog/page.tsx lo declaraba; lib/seo.ts lo aplica a
// todas las páginas del manifiesto por igual.
export const BRAND_NAME = "NEAR AI";
