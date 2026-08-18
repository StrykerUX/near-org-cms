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
// Ahora son tres listas en dos columnas, una por grupo, con SOLO el título y la
// ruta. Las `description` de cada `page.meta.ts` no se pintan: en un índice de
// 33 entradas la descripción es justamente el texto que hay que saltear. Siguen
// llegando en el manifiesto para quien las necesite.
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
export type HomeViewLink = {
  href: string;
  label: string;
  // Las galerías de public/ son HTML autocontenido, no rutas de Next: van con
  // <a> y no con <Link>, que intentaría navegarlas por el router.
  external?: boolean;
  // La página existe y se buildea, pero ni el header ni el footer la enlazan.
  // Es el dato accionable del índice: lo que hay que conectar al nav.
  unlinked?: boolean;
};

export type HomeViewGroup = {
  id: string;
  title: string;
  note: string;
  links: HomeViewLink[];
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
function Row({ link }: { link: HomeViewLink }) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate text-body">{link.label}</span>
        {link.unlinked && (
          // No es decorativo y por eso no va `aria-hidden`: es la única
          // diferencia real entre esta fila y sus vecinas.
          <span className="shrink-0 rounded-full border border-rule px-2 py-0.5 text-caption-mono text-gray-intermediate">
            not in nav
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
                <span
                  aria-hidden
                  className="text-caption-mono text-gray-intermediate"
                >
                  {group.links.length}
                </span>
              </div>
              <Eyebrow className="text-gray-intermediate">{group.note}</Eyebrow>
            </div>

            {/* Dos columnas que fluyen POR FILAS (grid), no por columnas
                (`columns-2`): con multi-column los bordes punteados de las dos
                mitades caen a alturas distintas y la lista deja de leerse como
                una tabla. El `gap-x` es grande a propósito — es lo único que
                separa la ruta de una columna del título de la siguiente. */}
            <ul className="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
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
