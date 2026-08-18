import type { Metadata } from "next";
import HomeView, { type HomeViewGroup, type HomeViewLink } from "@/components/views/HomeView";
import { ROUTES } from "@/lib/routes.generated";
import { toMetadata } from "@/lib/seo";
import meta from "./page.meta";

export const metadata: Metadata = toMetadata(meta);

// Índice del repo, derivado del manifiesto: una página nueva aparece acá sola,
// sin editar este archivo.
//
// ── Los tres grupos ─────────────────────────────────────────────────────────
//
// El criterio es el campo `nav` del `page.meta.ts`, NO una lista a mano:
//
//   · `nav !== false`  → el sitio público. Son las páginas que el header y el
//     footer enlazan (o deberían: ver UNLINKED abajo).
//   · `nav: false`     → material interno. Se parte en dos por la ruta:
//     `/design-system` es la referencia de reglas, y todo lo demás —hoy, todo
//     `/prototype/*`— son demos.
//
// Que el reparto salga de `nav` y no de una transcripción del menú importa: ni
// `SiteHeader` ni `SiteFooter` leen el manifiesto (llevan su propia copy, con
// jerarquía de columnas que una lista plana no puede expresar), así que
// cualquier lista de rutas escrita acá a mano divergiría del menú real en el
// primer cambio. `nav` es lo que cada página DECLARA sobre sí misma, y eso sí
// vive en un solo lugar.
function groupOf(route: string, nav: (typeof ROUTES)[number]["nav"]) {
  if (route === "/design-system") return "rules" as const;
  if (route.startsWith("/prototype")) return "demo" as const;
  // Una página futura con `nav: false` fuera de /prototype cae acá y no en
  // "reales", que es lo correcto: declaró no pertenecer a la navegación.
  if (nav === false) return "demo" as const;
  return "site" as const;
}

// Páginas que EXISTEN y se buildean, pero que ningún menú enlaza todavía. Se
// marcan en la lista para que el índice diga qué falta conectar, en vez de
// esconderlas entre las que sí tienen entrada.
//
// Es una lista a mano y no hay forma de derivarla: los hrefs viven dentro de
// `SiteHeader.tsx` y `SiteFooter.tsx`, que son `"use client"`, y un valor
// importado desde un módulo cliente hacia un Server Component llega como
// referencia opaca, no como array.
//
// Para revisarla:
//
//     grep -o 'href: "/[^"]*"' components/site/SiteHeader.tsx components/site/SiteFooter.tsx
//
// y comparar contra las rutas con `nav !== false` del manifiesto.
const UNLINKED: string[] = [
  "/ai",
  "/confidential-intents",
  "/official-rules",
];

// El trabajo en curso, y el orden en que se mira. Es una lista a mano a
// propósito: "cuál importa ahora" es una decisión editorial que cambia sola con
// el proyecto, y no se puede derivar de la ruta ni del `page.meta.ts`.
//
// Ya no cambia el TRATAMIENTO de nada —desde que el índice son listas, todas
// las filas se ven igual—; solo el ORDEN dentro de "demo". Se lee como una
// cadena hacia atrás: primero `homepage-ab7`, que es el CRUCE de las dos
// exploraciones que venían avanzando por separado (base de ab6 + el clip del
// hero y el `NearStackV2` de v5); después sus dos padres, `homepage-ab6` y
// `homepage-v5`; después `homepage-v4`, de donde salieron los dos; y al final
// `homepage-v2` como referencia del fork original.
//
// Entre ab6 y v5 el orden NO es prioridad: siguen siendo trabajo al mismo nivel
// y cada una es el rollback de una mitad de ab7. Cuando ab7 se confirme, las
// dos bajan con v4.
const FEATURED = [
  "/prototype/homepage-ab7",
  "/prototype/homepage-ab6",
  "/prototype/homepage-v5",
  "/prototype/homepage-v4",
  "/prototype/homepage-v2",
];

// Las galerías de imágenes de public/ no pueden derivarse del manifiesto: son
// HTML autocontenidos (viewers con sus propios assets), no páginas de Next con
// page.meta.ts. Entran a mano, con el index.html explícito en el href porque
// public/ no resuelve directorios, y van al final de "demo" — que es lo que
// son.
const STATIC_GALLERIES: HomeViewLink[] = [
  {
    href: "/prototype/hero-gallery/index.html",
    label: "Hero Lab",
    blurb: "30 hero backgrounds, 6 text concepts",
    external: true,
  },
  {
    href: "/prototype/moments/index.html",
    label: "Statement Moments",
    blurb: "30 statement moments, contact sheet",
    external: true,
  },
  {
    href: "/prototype/spine-cards/index.html",
    label: "Spine Cards",
    blurb: "36 isometric card concepts",
    external: true,
  },
];

// `blurb` y `stub` viajan tal cual desde el manifiesto: el primero lo declara
// cada página en su meta, el segundo lo deriva el generador leyendo si el
// page.tsx renderiza `StubView`. Ninguno de los dos se decide acá — este
// archivo solo reparte y ordena.
const ENTRIES = ROUTES.filter((r) => r.route !== "/").map((r) => ({
  group: groupOf(r.route, r.nav),
  link: {
    href: r.route,
    label: (r.nav !== false && r.nav?.label) || r.title,
    blurb: r.blurb,
    unlinked: UNLINKED.includes(r.route),
    empty: r.stub,
  } satisfies HomeViewLink,
}));

const pick = (group: string) =>
  ENTRIES.filter((e) => e.group === group).map((e) => e.link);

// Alfabético por etiqueta, que en una lista de 22 es lo único que hace que
// buscar una página sea buscar y no barrer. `localeCompare` y no `<`: el orden
// por code point manda los acentos al final.
const byLabel = (a: HomeViewLink, b: HomeViewLink) =>
  a.label.localeCompare(b.label, "en");

// En "demo" el alfabético no sirve: lo que importa es la cadena de versiones,
// y `Homepage AB6 / AB7 / v2 / v4 / v5` ordenado por nombre las mezcla al
// azar respecto de cómo se derivan una de otra.
const byFeatured = (a: HomeViewLink, b: HomeViewLink) => {
  const rank = (href: string) => {
    const i = FEATURED.indexOf(href);
    return i === -1 ? FEATURED.length : i;
  };
  return rank(a.href) - rank(b.href) || byLabel(a, b);
};

const GROUPS: HomeViewGroup[] = [
  {
    id: "site",
    title: "Site pages",
    note: "Real — linked from the header or the footer",
    links: pick("site").sort(byLabel),
  },
  {
    id: "demo",
    title: "Demos & prototypes",
    note: "Versions, explorations and galleries — noindex",
    links: [...pick("demo").sort(byFeatured), ...STATIC_GALLERIES],
  },
  {
    id: "rules",
    title: "Rules",
    note: "Design system — tokens, scales and components",
    links: pick("rules").sort(byLabel),
  },
];

export default function HomePage() {
  return <HomeView groups={GROUPS} />;
}
