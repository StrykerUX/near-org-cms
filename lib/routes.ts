import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes.generated";
import { SITE_URL } from "@/lib/site-config";

// `false` no es "nullish" — el operador `?.` no protege contra él (solo
// contra null/undefined), así que hay que descartarlo explícitamente antes
// de leer cualquier campo del objeto.
function sitemapObject(sitemap: (typeof ROUTES)[number]["sitemap"]) {
  return sitemap && typeof sitemap === "object" ? sitemap : undefined;
}

// ── Acá vivían `headerNav()` y `footerNav()` ────────────────────────────────
//
// Las dos se fueron con el chrome que las consumía. `SiteHeader` dejó de
// derivar su menú del manifiesto cuando pasó a llevar su propia copy (cuatro
// menús con iconos y descripciones, transcritos del sitemap), y `SiteFooter`
// hizo lo mismo al reemplazar al footer gris: su jerarquía son cuatro columnas
// con sub-grupos, y eso no es expresable sobre una lista plana de rutas.
//
// Consecuencia a tener presente: **una página nueva ya no aparece sola en el
// nav**. Sigue entrando automáticamente al sitemap (`sitemapEntries`), que es
// lo que lee `app/sitemap.ts`, pero para que se vea en el menú hay que sumarla
// a mano a `GROUPS` en `components/site/SiteFooter.tsx` y/o al header.
//
// El campo `nav` de `PageMeta` queda entonces con un solo consumidor —
// `app/(site)/page.tsx`, que lo usa para el índice del repo en cards, con su
// propio filtro inline. `nav.header` y `nav.footer` ya no los lee nadie.

export function sitemapEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.filter((r) => r.sitemap !== false).map((r) => ({
    url: `${SITE_URL}${r.route}`,
    lastModified: now,
    changeFrequency: sitemapObject(r.sitemap)?.changeFrequency ?? "monthly",
    priority: sitemapObject(r.sitemap)?.priority ?? 0.5,
  }));
}

export function noindexPaths(): string[] {
  return ROUTES.filter((r) => r.robots === "noindex").map((r) => r.route);
}
