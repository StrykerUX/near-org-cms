import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

// Índice del repo mientras el diseño real no existe.
//
// ── Por qué listas y no cards ────────────────────────────────────────────────
//
// Hasta acá cada página era una card —cuatro de ellas con escena WebGL de
// Unicorn Studio— en una grilla de 4 columnas. Con 33 páginas eso son 33 cajas
// con título, descripción y ruta: la página se volvió más larga que cualquiera
// de las que indexa, y encontrar una ruta exigía barrer texto.
//
// Ahora son tres listas en dos columnas, una por grupo, y cada fila lleva el
// título, un resumen de ~5 palabras y la ruta. El resumen es el `blurb` del
// page.meta.ts y NO la `description`: esa es una frase completa para buscadores,
// y en un índice de 33 entradas es justamente el texto que hay que saltear.
//
// Muchas filas llevan además un estado —`empty` si la página todavía renderiza
// `StubView`, `not in nav` si ningún menú la enlaza—, que es la información que
// un sitemap no da y por la que alguien abre esta página.
//
// Se fueron con las cards las escenas de Unicorn. El toolkit
// (`primitives/motion/unicornScene`) NO quedó muerto: `sections/LatestUpdates`
// lo sigue usando con las mismas tres escenas, que es de donde salieron.
//
// Efecto lateral bueno: esta view ya no necesita estado, así que dejó de ser
// `"use client"`. El SDK de Unicorn y sus tres JSON salen del bundle de `/`.
//
// El `<h1>` sigue siendo `sr-only`, y ahora además hace falta de verdad: los
// `<h2>` de los tres grupos cuelgan de él, y sin ese nivel un lector de
// pantalla que salta por headings aterriza en tres listas sin contexto.
/** Una variante dentro de un laboratorio: solo nombre corto y ruta. */
export type HomeViewVariant = {
  href: string;
  label: string;
};

export type HomeViewLink = {
  href: string;
  label: string;
  // Resumen de ~5 palabras, del `blurb` del page.meta.ts. No es la
  // `description`: esa es una frase para buscadores y acá hay 33 filas, así que
  // lo que sirve es una etiqueta que se lee sin frenar el barrido.
  blurb?: string;
  // Las galerías de public/ son HTML autocontenido, no rutas de Next: van con
  // <a> y no con <Link>, que intentaría navegarlas por el router.
  external?: boolean;
  // La página existe y se buildea, pero ni el header ni el footer la enlazan.
  // Es el dato accionable del índice: lo que hay que conectar al nav.
  unlinked?: boolean;
  // La página todavía renderiza `StubView` — existe para que el menú tenga a
  // dónde apuntar, y nada más. Lo deriva el generador del manifiesto leyendo el
  // page.tsx, no se declara a mano.
  empty?: boolean;
  // Las variantes de un laboratorio. Cuando las hay, la fila deja de ser una
  // página suelta y pasa a ser el ÍNDICE de un conjunto: se dibuja con su
  // cuenta y con las variantes debajo.
  //
  // Es la distinción que el índice no hacía y que hacía falta: una fila de
  // `/prototype/stack-labs/bleed` y una de `/prototype/homepage-ab7` se veían
  // igual, y no son lo mismo — la primera es un diseño DENTRO de una
  // exploración, la segunda es una página que se puede enseñar.
  variants?: HomeViewVariant[];
};

export type HomeViewGroup = {
  id: string;
  title: string;
  note: string;
  links: HomeViewLink[];
  /**
   * `list` (por defecto) — dos columnas de filas, para páginas sueltas.
   * `tree` — una sola columna, porque cada fila arrastra su tira de variantes
   * y a dos columnas esas tiras chocan con la ruta de la columna vecina.
   */
  layout?: "list" | "tree";
};

export type HomeViewProps = {
  groups: HomeViewGroup[];
};

/**
 * Una fila del índice: título a la izquierda, ruta a la derecha.
 *
 * `grid-cols-[1fr_auto]` y no flex con `justify-between`: con flex, un título
 * largo empuja la ruta fuera de su eje y las rutas dejan de alinearse entre
 * filas. Con la columna `auto` la ruta manda su propio ancho y el título se
 * queda con lo que sobra — que es lo que hace que la segunda columna se lea
 * como columna.
 *
 * El borde punteado es el mismo de `sections/UpdatesList`: acá también es una
 * lista de filas enlazables sobre crema, y darle un tratamiento propio serían
 * dos lenguajes para la misma cosa.
 */
// Los dos estados que el índice reporta. Nunca van `aria-hidden`: son la única
// diferencia real entre una fila y sus vecinas, y la razón por la que alguien
// mira esta lista y no el sitemap.
//
// `empty` es un hecho derivado del código (el page.tsx renderiza `StubView`);
// `not in nav` sale de una lista a mano en page.tsx. Se ven igual porque para
// quien lee son lo mismo: trabajo pendiente.
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 rounded-full border border-rule px-2 py-0.5 text-caption-mono text-gray-intermediate">
      {children}
    </span>
  );
}

function Row({ link }: { link: HomeViewLink }) {
  const inner = (
    <>
      {/* La columna izquierda es a su vez dos líneas: título con sus badges
          arriba, resumen abajo. El baseline del grid cae en la primera, que es
          lo que mantiene la ruta alineada con el título y no con el resumen. */}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-body">{link.label}</span>
          {link.variants && <Badge>{link.variants.length} variants</Badge>}
          {link.empty && <Badge>empty</Badge>}
          {link.unlinked && <Badge>not in nav</Badge>}
        </span>
        {link.blurb && (
          <span className="truncate text-body-sm text-gray-intermediate">
            {link.blurb}
          </span>
        )}
      </span>

      {/* `aria-hidden` en la ruta: el link ya la anuncia como destino, y leerla
          en voz alta carácter por carácter solo alarga cada elemento. */}
      <span
        aria-hidden
        className="flex shrink-0 items-center gap-2 text-caption-mono text-gray-intermediate transition-colors duration-200 group-hover:text-ink"
      >
        {link.href}
        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </span>
    </>
  );

  const className =
    "group grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-dotted border-border py-3 text-ink transition-colors duration-200 hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

  return (
    <li>
      {link.external ? (
        <a href={link.href} className={className}>
          {inner}
        </a>
      ) : (
        <Link href={link.href} className={className}>
          {inner}
        </Link>
      )}

      {/* La tira de variantes. Va FUERA del enlace del padre —un <a> dentro de
          otro <a> no es HTML válido y el navegador lo desarma— y sangrada, que
          es lo único que hace falta para que se lea como subordinada.

          Píldoras y no filas: una variante no necesita resumen ni ruta a la
          vista, solo su nombre corto. Diez filas completas por laboratorio
          devolverían el índice al problema que tenía. */}
      {link.variants && link.variants.length > 0 && (
        <ul className="flex flex-wrap gap-x-1.5 gap-y-1 border-b border-dotted border-border py-2 pl-5">
          {link.variants.map((v) => (
            <li key={v.href}>
              <Link
                href={v.href}
                className="block rounded-full border border-rule px-2.5 py-0.5 text-caption-mono text-gray-intermediate transition-colors duration-200 hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {v.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// El `pt` del <main> despeja el header flotante (`--site-header-block`) y le
// suma el aire que la página ya tenía. Va explícito y no como `py-*` + `pt-*`:
// dos utilidades que pisan la misma propiedad se resuelven por el orden con que
// Tailwind las emite, no por el orden en que se escriben en el atributo.
//
// `flex-1` es lo que hace que el crema llegue hasta el footer cuando la lista
// es corta: el <body> del layout raíz es `min-h-full flex flex-col`, así que
// sin esto el fondo termina donde termina el contenido y queda una banda blanca.
export default function HomeView({ groups }: HomeViewProps) {
  return (
    <main className="flex-1 bg-cream pt-[calc(var(--site-header-block)+3rem)] pb-16 lg:pb-24">
      <Container className="flex flex-col gap-16 lg:gap-20">
        <h1 className="sr-only">Page index</h1>

        {groups.map((group) => (
          <section key={group.id} className="flex flex-col gap-6">
            {/* El encabezado ocupa el ancho completo y no una de las dos
                columnas: es el rótulo del grupo entero, y metido en la columna
                izquierda se leería como la primera fila de la lista. */}
            <div className="flex flex-col gap-2 border-b border-ink pb-4">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-h3">{group.title}</h2>
                {/* La cuenta suma las variantes: un grupo de 5 laboratorios con
                    40 diseños adentro no son 5 páginas, y el número del
                    encabezado es lo primero que se mira para calibrar. */}
                <span
                  aria-hidden
                  className="text-caption-mono text-gray-intermediate"
                >
                  {group.links.reduce(
                    (n, l) => n + 1 + (l.variants?.length ?? 0),
                    0
                  )}
                </span>
              </div>
              <Eyebrow className="text-gray-intermediate">{group.note}</Eyebrow>
            </div>

            {/* Dos columnas que fluyen POR FILAS (grid), no por columnas
                (`columns-2`): con multi-column los bordes punteados de las dos
                mitades caen a alturas distintas y la lista deja de leerse como
                una tabla. El `gap-x` es grande a propósito — es lo único que
                separa la ruta de una columna del título de la siguiente. */}
            <ul
              className={
                group.layout === "tree"
                  ? "grid grid-cols-1"
                  : "grid grid-cols-1 gap-x-16 sm:grid-cols-2"
              }
            >
              {group.links.map((link) => (
                <Row key={link.href} link={link} />
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </main>
  );
}
