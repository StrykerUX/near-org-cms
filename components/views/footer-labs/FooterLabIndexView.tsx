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
        <Eyebrow className="text-gray-intermediate">Footer lab · 6 alternatives</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[18ch]">Six ways to end the page</h1>
        <p className="text-body-lg mt-6 max-w-[64ch] text-muted-foreground">
          Six alternatives to the production footer, one per route. The
          information is the same in all of them —same headline, same five link
          groups, same copyright— and so is the layout: what changes is the
          mechanism they arrive by. Every page carries the same dummy filler
          above it so the footer is judged after scrolling a whole page, which is
          how it is really seen.
        </p>
        <p className="text-body-sm mt-4 max-w-[64ch] text-gray-intermediate">
          Desktop first: all six resolve their idea at ≥1024px with motion
          enabled. On mobile and with <code>prefers-reduced-motion</code> all six
          fall back to the same static footer, on purpose.
        </p>
      </Container>

      <Container as="section" className="pb-24">
        <h2 className="text-h4">Takeover — they claim the viewport</h2>
        <p className="text-body-sm mt-2 max-w-[70ch] text-muted-foreground">
          All three cover the last section of the page, like the production
          footer. What changes completely is how they arrive.
        </p>
        <ul className="mt-8 border-b border-rule">
          {takeover.map((spec) => (
            <LabRow key={spec.id} spec={spec} />
          ))}
        </ul>
      </Container>

      <Container as="section" className="pb-32">
        <h2 className="text-h4">No takeover — they live with the page</h2>
        <p className="text-body-sm mt-2 max-w-[70ch] text-muted-foreground">
          None of them covers anything: they take their own space, are uncovered
          from underneath, or earn their own scroll stretch.
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
