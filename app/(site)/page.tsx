import type { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { ROUTES } from "@/lib/routes.generated";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Derivado del manifiesto (Fase 4) — antes era un array a mano que no incluía
// /blog. El propósito de esta página es listar todo lo que existe mientras
// el diseño real no está definido, así que derivarla del filesystem es una
// mejora deliberada, no solo un refactor: agregar una página nueva ahora
// aparece aquí sola, sin editar este archivo.
//
// La categoría sale de la ruta y no de un campo nuevo en `PageMeta`: hoy es
// una función de dónde vive el archivo, y agregar un campo obligaría a
// llenarlo en cada `page.meta.ts` para repetir lo que la ruta ya dice.
function kindOf(route: string) {
  if (route.startsWith("/prototype")) return "Prototype";
  if (route === "/design-system") return "Design system";
  return "Site";
}

// Las páginas que son el trabajo en curso. Van primero y con más peso visual;
// el resto es referencia. Es una lista a mano a propósito: "cuál importa ahora"
// es una decisión editorial que cambia sola con el proyecto, y no se puede
// derivar de la ruta ni del `page.meta.ts`.
//
// El orden acá ES el orden en pantalla — `homepage-v4` primero porque es donde
// está el rediseño activo, y `homepage-v2` justo detrás porque es su referencia
// (v4 nació como fork suyo: se miran de a pares).
const FEATURED = [
  "/prototype/homepage-v4",
  "/prototype/homepage-v2",
  "/blockchain",
  "/quantum-security",
];

const PAGES = ROUTES.filter((r) => r.route !== "/")
  .map((r) => ({
    href: r.route,
    label: (r.nav !== false && r.nav?.label) || r.title,
    description: r.description,
    kind: kindOf(r.route),
    featured: FEATURED.includes(r.route),
  }))
  .sort((a, b) => {
    const rank = (href: string) => {
      const i = FEATURED.indexOf(href);
      return i === -1 ? FEATURED.length : i;
    };
    return rank(a.href) - rank(b.href);
  });

export default function HomePage() {
  return <HomeView pages={PAGES} />;
}
