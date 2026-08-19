import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { LABS, type FooterLabSpec } from "@/components/sections/footer-labs/footerLabContent";

// El índice del lab. Antes eran seis footers alternativos agrupados por si
// tapaban el viewport o no; ahora son dos variantes del footer que ya está en
// producción, así que esa distinción desapareció con ellos — las dos son el
// mismo takeover.
//
// Lo que se compara ya no es el mecanismo de entrada, que está decidido, sino
// qué cede cuando el footer no entra: en 01 el logo se hunde bajo la propia
// superficie del footer, en 02 se achica el contenido para que el logo crezca.

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
  return (
    <main className="bg-cream text-foreground">
      <Container as="header" className="pt-[calc(var(--site-header-block)+3rem)] pb-16">
        <Eyebrow className="text-gray-intermediate">Footer lab · 2 tests</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[18ch]">Two ways to end the page</h1>
        <p className="text-body-lg mt-6 max-w-[64ch] text-muted-foreground">
          Both routes mount the production footer itself, passing it a variant —
          not a copy of it. So what you are looking at is the real thing with one
          change, and it cannot drift away from what ships. Every page carries
          the same dummy filler above it, so the footer is judged after scrolling
          a whole page, which is how it is really seen.
        </p>
        <p className="text-body-sm mt-4 max-w-[64ch] text-gray-intermediate">
          Desktop first: the takeover resolves at ≥1024px with motion enabled.
          Below that, and with <code>prefers-reduced-motion</code>, both fall
          back to the static footer — dark, with its own entrance.
        </p>
      </Container>

      <Container as="section" className="pb-32">
        <h2 className="text-h4">What gives way when the footer does not fit</h2>
        <p className="text-body-sm mt-2 max-w-[70ch] text-muted-foreground">
          The wordmark is a quarter of the viewport&apos;s WIDTH in height, so on a
          wide, short screen the panel and the logo cannot both be whole. These
          are two answers to that.
        </p>
        <ul className="mt-8 border-b border-rule">
          {LABS.map((spec) => (
            <LabRow key={spec.id} spec={spec} />
          ))}
        </ul>
      </Container>
    </main>
  );
}
