import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

// Índice del repo mientras el diseño real no existe. Su trabajo es que alguien
// que abre `/` entienda QUÉ hay construido sin abrir seis pestañas, así que
// cada card muestra la `description` del `page.meta.ts` — un dato que ya
// existía y que la lista de links anterior no mostraba.
export type HomeViewPage = {
  href: string;
  label: string;
  description: string;
  kind: string;
};

export type HomeViewProps = {
  pages: HomeViewPage[];
};

export default function HomeView({ pages }: HomeViewProps) {
  return (
    <main className="py-20 lg:py-32">
      <Container className="flex flex-col gap-14 lg:gap-20">
        <header className="flex max-w-3xl flex-col gap-6">
          <Eyebrow>Draft</Eyebrow>
          <h1 className="text-h1 text-foreground text-pretty">
            Design system <Accent display>in progress</Accent>
          </h1>
          <p className="text-body-lg text-muted-foreground text-pretty">
            Todo lo que hay construido en el repo, con su estado real. Las
            páginas de prototipo llevan copy hardcodeada y no salen en el
            sitemap; el blog es lo único conectado al CMS.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <li key={page.href} className="flex">
              <Link
                href={page.href}
                className="group flex w-full flex-col gap-3 rounded-xl border border-border bg-background p-6 transition-colors hover:bg-muted"
              >
                <div className="flex items-start justify-between gap-4">
                  <Eyebrow>{page.kind}</Eyebrow>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <h2 className="text-h4 text-foreground text-pretty">{page.label}</h2>

                <p className="text-body-sm text-muted-foreground text-pretty">
                  {page.description}
                </p>

                {/* `mt-auto` y no un `justify-between` en la card: la ruta se
                    ancla abajo aunque las descripciones tengan distinto largo,
                    que es lo que mantiene la grilla legible por filas. */}
                <span className="mt-auto pt-3 font-mono text-caption text-muted-foreground">
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
