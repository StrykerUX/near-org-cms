import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { LABS, type FooterLabSpec } from "@/components/sections/footer-labs/footerLabContent";

// El índice del lab: seis rutas, agrupadas por la única distinción que
// estructura la comparación.
//
// Takeover / no takeover no es una etiqueta de estilo: decide si el footer se
// apropia del viewport tapando la última sección, o si convive con la página.
// Son dos respuestas distintas a la misma pregunta, y mezclarlas en una lista
// plana de seis hace que se comparen entre sí cosas que no compiten.

function LabRow({ spec }: { spec: FooterLabSpec }) {
  return (
    <li>
      <Link
        href={`/prototype/footer-labs/${spec.slug}`}
        className="group grid gap-x-8 gap-y-3 border-t border-rule py-8 transition-colors hover:bg-stone/25 sm:grid-cols-[auto_14rem_1fr]"
      >
        <span className="text-caption text-gray-intermediate">{spec.index}</span>
        <span className="text-h3 group-hover:underline">{spec.title}</span>
        <span>
          <span className="text-caption uppercase text-gray-intermediate">{spec.technique}</span>
          <span className="text-body-sm mt-2 block max-w-[70ch] text-muted-foreground">
            {spec.bet}
          </span>
        </span>
      </Link>
    </li>
  );
}

export default function FooterLabIndexView() {
  const takeover = LABS.filter((l) => l.takeover);
  const inline = LABS.filter((l) => !l.takeover);

  return (
    <main className="bg-cream text-foreground">
      <Container as="header" className="pt-[calc(var(--site-header-block)+3rem)] pb-16">
        <Eyebrow className="text-gray-intermediate">Footer lab · 6 alternativas</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[18ch]">Seis maneras de terminar la página</h1>
        <p className="text-body-lg mt-6 max-w-[64ch] text-muted-foreground">
          Seis alternativas al footer de producción, una por ruta. La información
          es la misma en todas —el mismo titular, los mismos cinco grupos de
          links, el mismo copyright— y también el layout: lo que cambia es el
          mecanismo con que llegan. Cada página lleva el mismo relleno dummy
          encima para que el footer se juzgue después de scrollear una página
          entera, que es como se ve de verdad.
        </p>
        <p className="text-body-sm mt-4 max-w-[64ch] text-gray-intermediate">
          Desktop primero: las seis resuelven su idea en ≥1024px con movimiento
          habilitado. En mobile y con <code>prefers-reduced-motion</code> las
          seis caen al mismo footer estático, a propósito.
        </p>
      </Container>

      <Container as="section" className="pb-24">
        <h2 className="text-h4">Takeover — se apropian del viewport</h2>
        <p className="text-body-sm mt-2 max-w-[70ch] text-muted-foreground">
          Las tres tapan la última sección de la página, como el footer de
          producción. Cambia por completo cómo llegan.
        </p>
        <ul className="mt-8 border-b border-rule">
          {takeover.map((spec) => (
            <LabRow key={spec.id} spec={spec} />
          ))}
        </ul>
      </Container>

      <Container as="section" className="pb-32">
        <h2 className="text-h4">Sin takeover — conviven con la página</h2>
        <p className="text-body-sm mt-2 max-w-[70ch] text-muted-foreground">
          Ninguna tapa nada: ocupan su propio espacio, se descubren por debajo o
          se ganan su recorrido de scroll.
        </p>
        <ul className="mt-8 border-b border-rule">
          {inline.map((spec) => (
            <LabRow key={spec.id} spec={spec} />
          ))}
        </ul>
      </Container>
    </main>
  );
}
