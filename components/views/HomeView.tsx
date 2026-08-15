"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useState } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import {
  UnicornScene,
  UNICORN_COVERS,
  type UnicornCover,
  useIdlePreload,
  useMouseOnlyOnHover,
} from "@/components/primitives/motion/unicornScene";

// Índice del repo mientras el diseño real no existe: solo las cards, sin
// encabezado ni copy de relleno. Cada card muestra la `description` de su
// `page.meta.ts`.
//
// El `<h1>` sigue existiendo como `sr-only`. No es un resto del diseño
// anterior: una página sin encabezado deja los `<h2>` de las cards colgando de
// ningún nivel, y un lector de pantalla que salta por headings —o el modo
// esquema del navegador— aterriza en una lista sin contexto. Sacarlo de la
// vista es una decisión visual; sacarlo del árbol de accesibilidad sería otra
// cosa, y no es la que se pidió.
export type HomeViewPage = {
  href: string;
  label: string;
  description: string;
  kind: string;
  featured: boolean;
};

export type HomeViewProps = {
  pages: HomeViewPage[];
};

// Los covers de las cards destacadas: las MISMAS tres escenas de Unicorn Studio
// que usa `sections/LatestUpdates.tsx`, no copias ni variantes.
//
// Son tres y las destacadas son cuatro, así que la cuarta repite la primera
// (`% COVERS.length`). Agregar una escena no es cambiar un color: cada JSON es un
// export propio con sus shaders, generado desde `assets/unicorn/` — ver el
// comentario de `UNICORN_COVERS` en el toolkit.
//
// El orden pone verde y verde en las posiciones 1 y 4, que no son vecinas en la
// grilla de 4 columnas.
const COVERS = [UNICORN_COVERS.green, UNICORN_COVERS.blue, UNICORN_COVERS.red] as const;

/**
 * Card destacada, con el lenguaje visual del `PostCard` de
 * `sections/LatestUpdates.tsx`: card blanca, cover a sangre y un panel blanco
 * muescado en la esquina superior izquierda que recorta el cover en "L".
 *
 * Es una reconstrucción y no un import: aquel `PostCard` es inseparable de sus
 * escenas de Unicorn (monta el SDK, gatea el mouse por hover, coordina cuándo
 * inicializarlas) y de su `POSTS` hardcodeado. Lo que se comparte acá es la
 * forma, no el comportamiento — extraer un primitivo común obligaría a que la
 * versión con WebGL pasara por él, que es justo la parte que no se comparte.
 * Si el cover llega a animarse también acá, ESE es el momento de extraerlo.
 */
function FeaturedCard({
  page,
  cover,
  ready,
}: {
  page: HomeViewPage;
  cover: UnicornCover;
  ready: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const sceneRef = useMouseOnlyOnHover(hovered);

  return (
    <article
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group relative flex aspect-[7/6] w-full overflow-hidden rounded-[1.75rem] bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
    >
      {/* El gradiente va en el contenedor y la escena encima, así que si la
          escena no carga —o todavía no— lo que queda es el gradiente y no un
          rectángulo gris.

          El `absolute inset-0` de adentro no es decorativo: el runtime de
          Unicorn mide su contenedor para dimensionar el canvas, y con el canvas
          en flujo cada medición agranda la caja y la siguiente lee la caja ya
          crecida — la card se estira sin parar. Sacado del flujo, no puede
          empujar a su padre. */}
      <div
        aria-hidden
        className="absolute inset-2.5 overflow-hidden rounded-[1.4rem]"
        style={{ backgroundImage: cover.fallback }}
      >
        <div className="absolute inset-0">
          {ready && (
            <UnicornScene
              jsonFilePath={cover.scene}
              width="100%"
              height="100%"
              dpi={1.5}
              scale={1}
              fps={60}
              // `lazyLoad` NO es opcional acá, aunque estas cards estén sobre
              // el fold y no haya nada que diferir. No es solo un gate de
              // viewport: es lo que decide POR QUÉ CAMINO se inicializa la
              // escena. El SDK hace
              //
              //     !lazyLoad || isInView ? initializePlanes() : Mt(m)
              //
              // Sin la bandera, `initializePlanes()` corre sincrónicamente al
              // registrar, antes de que el canvas exista, y revienta con
              // "Cannot read properties of null (reading 'canvas')" adentro de
              // `setInitialElementPlaneUniforms`.
              //
              // Con la bandera nunca entra por ahí, ni siquiera estando en
              // pantalla: al registrar, el IntersectionObserver todavía no
              // disparó, así que `isInView` es false y cae en la cola de
              // prewarm — que es la que sí espera al canvas. Quitarla "porque
              // ya está visible" es exactamente el razonamiento que rompe esto.
              lazyLoad
              placeholderClassName="h-full w-full"
              sceneRef={sceneRef}
            />
          )}
        </div>
      </div>

      {/* Los radios están al revés de lo que parece: `tl` sigue la curva de la
          card, y `br` es la esquina que muerde el cover — sin ese radio el
          recorte se ve como un rectángulo pegado encima de la imagen.
          El panel es más ancho que el 60% del original porque acá la card ocupa
          un cuarto de la grilla y no un tercio: al 60% el título entraba en tres
          líneas. */}
      <div className="absolute left-2.5 top-2.5 flex w-[82%] flex-col gap-1 rounded-tl-[1.4rem] rounded-br-[1.4rem] bg-white p-4 pb-5 pr-6">
        <h2 className="text-h4 text-pretty">{page.label}</h2>
        {/* `line-clamp-2` y no el texto entero: las descripciones salen de cada
            `page.meta.ts` y no tienen largo acotado, así que sin el tope el
            panel crece hasta tapar el cover y la muesca desaparece. */}
        <p className="line-clamp-2 text-body-sm text-muted-foreground">
          {page.description}
        </p>

        {/* El CTA es solo visual: el link real es el que cubre la card entera,
            más abajo. Anidar un <a> acá dentro de ese otro sería HTML inválido.
            La ruta ocupa el lugar del "Read the full story" del original porque
            en un índice de rutas es la información que de verdad sirve. */}
        <span aria-hidden className="mt-6 flex items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-near-green-dark text-white transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </span>
          {/* `min-w-0` es lo que habilita el `truncate`: sin él este span es un
              ítem flex y su ancho mínimo es el del contenido, así que la ruta
              larga ensancharía el panel en vez de recortarse. */}
          <span className="min-w-0 truncate font-mono text-caption text-muted-foreground">
            {page.href}
          </span>
        </span>
      </div>

      {/* Toda la card es el link, como UN solo <a> que la cubre: así un lector
          de pantalla anuncia un destino por card en vez de varios, y el foco de
          teclado es una sola parada. El nombre accesible sale del sr-only y no
          de un aria-label, que los traductores automáticos ignoran. */}
      <Link
        href={page.href}
        className="absolute inset-0 z-10 rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-dark"
      >
        <span className="sr-only">
          {page.label} — {page.href}
        </span>
      </Link>
    </article>
  );
}

/**
 * Card de referencia: las páginas que no son el trabajo en curso.
 *
 * `w-full` es obligatorio, no cosmético: el `<li>` que la contiene es un
 * contenedor flex, así que sin ancho explícito la card se dimensiona al
 * CONTENIDO y cada una termina midiendo distinto según el largo de su título y
 * su ruta. La columna del grid sí es igual para todas —Tailwind emite
 * `repeat(4, minmax(0,1fr))`—; lo que no la llenaba era la card. La destacada
 * nunca lo sufrió porque su `<article>` ya lo llevaba.
 */
function PlainCard({ page }: { page: HomeViewPage }) {
  return (
    <Link
      href={page.href}
      className="group relative flex h-full w-full flex-col gap-3 rounded-2xl border border-rule bg-background p-6 text-ink transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-ink/35 hover:shadow-[0_14px_32px_-20px_rgba(16,16,16,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <div className="flex items-start justify-between gap-4">
        <Eyebrow className="text-gray-intermediate">{page.kind}</Eyebrow>
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-rule text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-cream"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <h2 className="text-h4 text-pretty">{page.label}</h2>

      <p className="text-body-sm text-gray-intermediate text-pretty">
        {page.description}
      </p>

      {/* `mt-auto` y no un `justify-between` en la card: la ruta se ancla abajo
          aunque las descripciones tengan distinto largo, que es lo que mantiene
          la grilla legible por filas. `aria-hidden` porque para un lector de
          pantalla la ruta ya la anuncia el propio link — leerla en voz alta
          carácter por carácter solo alarga cada elemento de la lista. */}
      <span
        aria-hidden
        className="mt-auto pt-4 font-mono text-caption text-gray-intermediate"
      >
        {page.href}
      </span>
    </Link>
  );
}

// El `pt` del <main> despeja el header flotante (`--site-header-block`) y le
// suma el aire que la página ya tenía. Va explícito y no como `py-*` + `pt-*`:
// dos utilidades que pisan la misma propiedad se resuelven por el orden con que
// Tailwind las emite, no por el orden en que se escriben en el atributo.
//
// `flex-1` es lo que hace que el crema llegue hasta el footer cuando hay pocas
// cards: el <body> del layout raíz es `min-h-full flex flex-col`, así que sin
// esto el fondo termina donde termina el contenido y queda una banda blanca.
export default function HomeView({ pages }: HomeViewProps) {
  // Un solo `ready` para las cuatro cards: el SDK inicializa las escenas DE UNA
  // EN UNA, así que encenderlas por separado no las paralelizaría — solo haría
  // cuatro `requestIdleCallback` para lo mismo.
  //
  // Sin el gate por scroll que sí tiene `LatestUpdates`: esa sección está al
  // fondo de una página larga, estas cards están arriba de todo. Acá la precarga
  // ociosa es la única vía, y si no corre —`saveData`, o un navegador sin
  // `requestIdleCallback`— las cards se quedan en su gradiente, que es
  // exactamente el resultado buscado en ese caso.
  const [ready, setReady] = useState(false);
  useIdlePreload(useCallback(() => setReady(true), []));

  // El cover se asigna contando SOLO entre las destacadas: con el índice de la
  // lista completa, agregar una página normal antes de una destacada le
  // cambiaría el color, que es un acoplamiento invisible desde `page.tsx`.
  const covers = new Map(
    pages
      .filter((p) => p.featured)
      .map((p, i) => [p.href, COVERS[i % COVERS.length]] as const)
  );

  return (
    <main className="flex-1 bg-cream pt-[calc(var(--site-header-block)+3rem)] pb-16 lg:pb-24">
      <Container>
        <h1 className="sr-only">Design system in progress</h1>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((page) => (
            <li key={page.href} className="flex">
              {page.featured ? (
                <FeaturedCard
                  page={page}
                  cover={covers.get(page.href) ?? COVERS[0]}
                  ready={ready}
                />
              ) : (
                <PlainCard page={page} />
              )}
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
