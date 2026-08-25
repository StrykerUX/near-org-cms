import type { Metadata } from "next";
import HomeView, {
  type HomeViewGroup,
  type HomeViewLink,
  type HomeViewVariant,
} from "@/components/views/HomeView";
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
// ── Prototipo suelto vs laboratorio ─────────────────────────────────────────
//
// Un `/prototype/*` de un solo segmento es una PÁGINA: se abre y se enseña.
// Uno de dos segmentos es un DISEÑO DENTRO de otra cosa — una variante de un
// laboratorio— y no se enseña solo, se compara contra sus hermanas.
//
// El índice las trataba igual, y con 49 rutas de prototipo eso significaba
// abrir `/prototype/stack-labs/bleed` creyendo que era una página terminada.
// Ahora las variantes cuelgan de la fila de su laboratorio.
const isVariant = (route: string) => route.split("/").length === 4;
const parentOf = (route: string) => route.split("/").slice(0, 3).join("/");

function groupOf(route: string, nav: (typeof ROUTES)[number]["nav"]) {
  if (route === "/design-system") return "rules" as const;
  if (route.startsWith("/prototype")) return "demo" as const;
  // Una página futura con `nav: false` fuera de /prototype cae acá y no en
  // "reales", que es lo correcto: declaró no pertenecer a la navegación.
  if (nav === false) return "demo" as const;
  return "site" as const;
}

// ── Familias de propuestas ──────────────────────────────────────────────────
//
// Seis páginas tienen varias propuestas conviviendo, y hasta ahora el índice las
// listaba planas: doce filas seguidas donde «las tres opciones de About» había
// que ir a buscarlas leyendo. Ahora cada familia es UNA fila con su tira.
//
// El mecanismo ya existía —lo usan los laboratorios— pero pedía que las
// variantes fueran rutas de cuatro segmentos colgando de un padre que existe.
// Estas son de tres (`/prototype/about-a`) y no tienen padre: no hay
// `/prototype/about`. Así que la familia es SINTÉTICA: la fila no lleva a
// ningún lado propio, lleva a su primera variante.
//
// El nombre de cada familia va a mano y no derivado del slug, por el mismo
// motivo que `FEATURED` de más abajo: «chain-ab-propuesta» no se convierte en
// «Chain Abstraction» con ninguna regla, y forzar una regla que funcione para
// seis casos y falle en el séptimo es peor que siete líneas.
const FAMILIES: Record<string, string> = {
  about: "About",
  community: "Community",
  economics: "Economics",
  foundation: "Foundation",
  homepage: "Homepage",
  protocol: "Protocol",
  solutions: "Solutions",
  "chain-ab-propuesta": "Chain Abstraction",
};

// `/prototype/about-a` → `about`. Solo rutas de TRES segmentos terminadas en
// una letra suelta: `/prototype/protocol-combo/mural` no matchea (cuatro
// segmentos, y ya cuelga de su laboratorio), y `/prototype/quantum-security-h2`
// tampoco (`h2` no es una letra suelta), que es lo correcto — son dos heroes de
// una misma página, no dos propuestas de página entera.
const familyOf = (route: string): string | null => {
  const parts = route.split("/");
  if (parts.length !== 3) return null;
  const m = parts[2].match(/^(.+)-([a-z])$/);
  if (!m) return null;
  return m[1] in FAMILIES ? m[1] : null;
};

// El nombre corto de una variante, para la píldora: el título completo repite
// el de la familia («About A · Editorial») y a tres píldoras por fila eso es
// tres veces la misma palabra.
//
// Se arma desde el nombre de la familia y no con una lista de prefijos: los
// títulos no comparten uno limpio —«Protocol · A — Datasheet» y «Protocol B —
// Spectrum» difieren en el separador— así que se corta por el nombre y se
// limpia lo que quede colgando adelante.
const shortLabel = (title: string, family: string) =>
  title.replace(family, "").replace(/^[\s·—–-]+/, "").trim() || title;

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
// Vacío tras la limpieza: las seis rutas que destacaba (hero-alt y las cinco
// homepages viejas) se archivaron. `homepage-a` no va acá — con una sola
// línea de diseño viva, "destacada" no distingue nada.
const FEATURED: string[] = [];

// Las galerías de imágenes de public/ no pueden derivarse del manifiesto: son
// HTML autocontenidos (viewers con sus propios assets), no páginas de Next con
// page.meta.ts. Entran a mano, con el index.html explícito en el href porque
// public/ no resuelve directorios, y van al final de "demo" — que es lo que
// son.
//
// Para revisarla:
//
//     for d in public/prototype/*/; do [ -f "$d/index.html" ] && basename $d; done
//
// De esa cuenta salían nueve y el índice enlazaba tres: seis galerías existían,
// se buildeaban y no había forma de llegar a ellas desde ningún sitio.
// Vacío tras la limpieza: las nueve galerías HTML que listaba se archivaron —
// 548 MB de contact sheets de exploración visual, el 90% de public/prototype/.
// Qué había en cada una y cómo recuperarla: docs/labs-archivados.md.
//
// La constante se queda porque el mecanismo sigue siendo necesario: una galería
// estática de public/ no puede derivarse del manifiesto de rutas, que solo
// conoce páginas de Next.
const STATIC_GALLERIES: { href: string; label: string; blurb: string }[] = [];

// Laboratorios que NO tienen una ruta por variante: apilan sus versiones en una
// sola página. Son laboratorios igual —se entra a comparar, no a ver una página
// terminada— así que van con los otros, aunque no traigan tira de píldoras.
//
// Lista a mano porque no hay nada en el manifiesto que lo diga: una ruta de un
// segmento con seis diseños dentro se ve idéntica a una página normal.
const STACKED_LABS = [
  // De los cinco que había sobrevive uno: los otros cuatro (hero-alt,
  // newsletter-labs, proof-alt, hover-lab) se archivaron.
  "/prototype/components",
];

// `blurb` y `stub` viajan tal cual desde el manifiesto: el primero lo declara
// cada página en su meta, el segundo lo deriva el generador leyendo si el
// page.tsx renderiza `StubView`. Ninguno de los dos se decide acá — este
// archivo solo reparte y ordena.
// El índice no se lista a sí mismo. Antes el excluido era `/` porque el índice
// VIVÍA ahí; ahora `/` es la homepage del sitio y entra a la lista como una
// página más, que es lo que corresponde: es la primera que alguien quiere
// abrir.
const ALL = ROUTES.filter((r) => r.route !== "/dir");

// Las variantes, agrupadas por su laboratorio. Solo cuelgan si el padre EXISTE
// en el manifiesto: `/prototype/homepage-proof/*` son tres homepages completas
// sin ruta índice, y sin esta condición quedarían escondidas bajo un padre que
// nadie puede abrir.
// `Set<string>` explícito: las rutas del manifiesto están tipadas como
// `/${string}`, y un Set de ese tipo rechaza un `.has()` con un string común.
const PARENTS = new Set<string>(ALL.map((r) => r.route));

// Dónde está montada cada view: `AboutAView` → `/about`.
//
// `view` lo DERIVA el generador leyendo qué importa cada `page.tsx` (ver
// `lib/page-meta.ts`), así que esto no es una lista que alguien tenga que
// mantener — el día que se promueva otra variante cambiando ese import, la
// marca se mueve sola.
//
// Solo cuentan las rutas que NO son de prototipo: una variante montada en otra
// ruta de prototipo no está «en producción», está duplicada.
const LIVE_AT = new Map<string, string>();
for (const r of ROUTES) {
  if (!r.view || r.route.startsWith("/prototype")) continue;
  LIVE_AT.set(r.view, r.route);
}

const VARIANTS = new Map<string, HomeViewVariant[]>();

// Las variantes de un laboratorio: rutas de cuatro segmentos colgando de un
// padre que existe.
for (const r of ALL) {
  if (!r.route.startsWith("/prototype/") || !isVariant(r.route)) continue;
  const parent = parentOf(r.route);
  if (!PARENTS.has(parent)) continue;
  const list = VARIANTS.get(parent) ?? [];
  list.push({ href: r.route, label: shortLabel(r.title, "") });
  VARIANTS.set(parent, list);
}

// Las propuestas de una página: rutas de tres segmentos terminadas en letra.
// Su familia es sintética y se identifica con la clave `family:<slug>` para que
// no pueda chocar con una ruta real.
const FAMILY_ROWS = new Map<string, { label: string; first: string; blurb?: string }>();
for (const r of ALL) {
  const family = familyOf(r.route);
  if (!family) continue;
  const key = `family:${family}`;
  const name = FAMILIES[family];

  const list = VARIANTS.get(key) ?? [];
  list.push({
    href: r.route,
    label: shortLabel(r.title, name),
    live: r.view ? LIVE_AT.get(r.view) : undefined,
  });
  VARIANTS.set(key, list);

  // La fila de la familia lleva a su primera variante por orden alfabético, que
  // es la A. No es arbitrario: en las cuatro páginas del set la A es la que está
  // montada, así que el nombre de la familia abre lo que el sitio sirve hoy.
  const row = FAMILY_ROWS.get(key);
  if (!row || r.route < row.first) {
    FAMILY_ROWS.set(key, { label: name, first: r.route, blurb: row?.blurb ?? r.blurb });
  }
}

// Las variantes se ordenan por su nombre corto, que empieza por la letra o el
// número con el que el laboratorio las enumera: A, B, C… o 01, 02, 03. Ese es
// el orden en que se compararon, y el único que hace que la tira se lea como
// una serie y no como una bolsa.
for (const list of VARIANTS.values()) {
  list.sort((a, b) => a.label.localeCompare(b.label, "en"));
}

// Fuera de la lista plana las variantes que ya cuelgan de su laboratorio. El
// `isVariant` no es redundante: `parentOf` de una ruta de tres segmentos se
// devuelve a SÍ MISMA, así que sin él cada laboratorio se filtraba a sí mismo y
// los tres con variantes desaparecían del índice.
// Fuera de la lista plana las variantes que ya cuelgan de algo: las de un
// laboratorio (cuatro segmentos) y las de una familia de propuestas.
const ENTRIES = ALL.filter(
  (r) =>
    !(isVariant(r.route) && VARIANTS.has(parentOf(r.route))) && !familyOf(r.route)
).map((r) => ({
  group: groupOf(r.route, r.nav),
  isLab: VARIANTS.has(r.route) || STACKED_LABS.includes(r.route),
  link: {
    href: r.route,
    label: (r.nav !== false && r.nav?.label) || r.title,
    blurb: r.blurb,
    unlinked: UNLINKED.includes(r.route),
    empty: r.stub,
    variants: VARIANTS.get(r.route),
  } satisfies HomeViewLink,
}));

// Y adentro, una fila por familia. Van al grupo de prototipos porque eso es lo
// que son: páginas completas que se abren y se enseñan, no comparaciones de una
// decisión suelta como los laboratorios.
const FAMILY_ENTRIES = [...FAMILY_ROWS.entries()].map(([key, row]) => ({
  group: "demo" as const,
  isLab: false,
  link: {
    href: row.first,
    label: row.label,
    blurb: row.blurb,
    variants: VARIANTS.get(key),
  } satisfies HomeViewLink,
}));

const ALL_ENTRIES = [...ENTRIES, ...FAMILY_ENTRIES];

const pick = (group: string, lab?: boolean) =>
  ALL_ENTRIES.filter(
    (e) => e.group === group && (lab === undefined || e.isLab === lab)
  ).map((e) => e.link);

// Alfabético por etiqueta, que en una lista larga es lo único que hace que
// buscar una página sea buscar y no barrer. `localeCompare` y no `<`: el orden
// por code point manda los acentos al final.
const byLabel = (a: HomeViewLink, b: HomeViewLink) =>
  a.label.localeCompare(b.label, "en");

// En las páginas de prototipo el alfabético no sirve: lo que importa es la
// cadena de versiones, y `Homepage AB6 / AB7 / v2 / v4 / v5` ordenado por
// nombre las mezcla al azar respecto de cómo se derivan una de otra.
const byFeatured = (a: HomeViewLink, b: HomeViewLink) => {
  const rank = (href: string) => {
    const i = FEATURED.indexOf(href);
    return i === -1 ? FEATURED.length : i;
  };
  return rank(a.href) - rank(b.href) || byLabel(a, b);
};

// ── Los cinco grupos ────────────────────────────────────────────────────────
//
// El corte que faltaba está entre los dos del medio. Antes había un solo cajón
// —"Demos & prototypes"— con 49 rutas de prototipo mezcladas, y ahí adentro
// convivían la homepage que se le enseña a alguien y la variante C de un
// laboratorio de transiciones. Abrir la segunda creyendo que era la primera era
// cuestión de tiempo.
//
//   · Prototipos   — páginas completas. Se abren y se muestran.
//   · Laboratorios — comparaciones. Se entra a elegir entre variantes, y las
//                    variantes cuelgan de su índice.
//   · Galerías     — HTML autocontenido en public/, ni siquiera páginas de Next.
const GROUPS: HomeViewGroup[] = [
  {
    id: "site",
    title: "Site pages",
    note: "Real — linked from the header or the footer",
    links: pick("site").sort(byLabel),
  },
  {
    id: "prototypes",
    title: "Prototypes",
    note: "Full pages — open one and show it",
    links: pick("demo", false).sort(byFeatured),
  },
  {
    id: "labs",
    title: "Labs",
    note: "Comparisons — variants of one decision, not finished pages",
    layout: "tree",
    links: pick("demo", true).sort(byLabel),
  },
  {
    id: "galleries",
    title: "Galleries",
    note: "Self-contained HTML in public/ — contact sheets, not Next pages",
    links: STATIC_GALLERIES,
  },
  {
    id: "rules",
    title: "Rules",
    note: "Design system — tokens, scales and components",
    links: pick("rules").sort(byLabel),
  },
];

export default function DirectoryPage() {
  return <HomeView groups={GROUPS} />;
}
