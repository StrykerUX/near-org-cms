import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes.generated";
import { SITE_URL } from "@/lib/site-config";

type NavLink = { href: string; label: string };

// `false` no es "nullish" — el operador `?.` no protege contra él (solo
// contra null/undefined), así que hay que descartarlo explícitamente antes
// de leer cualquier campo del objeto.
function navObject(nav: (typeof ROUTES)[number]["nav"]) {
  return nav && typeof nav === "object" ? nav : undefined;
}

function sitemapObject(sitemap: (typeof ROUTES)[number]["sitemap"]) {
  return sitemap && typeof sitemap === "object" ? sitemap : undefined;
}

function navLinks(slot: "header" | "footer"): NavLink[] {
  return ROUTES.filter((r) => r.nav !== false && navObject(r.nav)?.[slot] !== false)
    .sort((a, b) => {
      const orderDiff = (navObject(a.nav)?.order ?? 999) - (navObject(b.nav)?.order ?? 999);
      return orderDiff || a.route.localeCompare(b.route);
    })
    .map((r) => ({ href: r.route, label: navObject(r.nav)?.label ?? r.title }));
}

export function headerNav(): NavLink[] {
  return navLinks("header");
}

export function footerNav(): NavLink[] {
  return navLinks("footer");
}

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
