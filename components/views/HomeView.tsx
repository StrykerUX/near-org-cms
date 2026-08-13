import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

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

export default function HomeView({ pages }: HomeViewProps) {
  return (
    <main className="py-12 lg:py-16">
      <Container>
        <h1 className="sr-only">Design system in progress</h1>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((page) => (
            <li key={page.href} className="flex">
              <Link
                href={page.href}
                className={`group flex w-full flex-col gap-3 rounded-xl border p-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  page.featured
                    ? "border-foreground/25 bg-card hover:bg-muted"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <Eyebrow>{page.kind}</Eyebrow>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <h2
                  className={`text-foreground text-pretty ${
                    page.featured ? "text-h3" : "text-h4"
                  }`}
                >
                  {page.label}
                </h2>

                <p className="text-body-sm text-muted-foreground text-pretty">
                  {page.description}
                </p>

                {/* `mt-auto` y no un `justify-between` en la card: la ruta se
                    ancla abajo aunque las descripciones tengan distinto largo,
                    que es lo que mantiene la grilla legible por filas.
                    `aria-hidden` porque para un lector de pantalla la ruta ya
                    la anuncia el propio link — leerla en voz alta carácter por
                    carácter solo alarga cada elemento de la lista. */}
                <span
                  aria-hidden
                  className="mt-auto pt-3 font-mono text-caption text-muted-foreground"
                >
                  {page.href}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
