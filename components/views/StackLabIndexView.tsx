import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { STACK_LAB_VARIANTS } from "@/components/sections/stack-labs/stackLabContent";

// El índice del laboratorio del NEAR Stack: ocho layouts para el MISMO arte.
//
// Es una lista y no un preview de cada variante a propósito: ocho miniaturas
// del mismo ensamble no distinguen nada —el arte es idéntico en las ocho— y
// además cargarlo cinco veces es exactamente lo que la separación en rutas
// existe para evitar.
export default function StackLabIndexView() {
  return (
    <main className="flex min-h-svh flex-col bg-cream text-ink">
      <Container as="header" className="flex flex-col gap-6 py-20 md:py-28">
        <Eyebrow className="text-gray-intermediate">Stack lab · 8 layouts</Eyebrow>
        <h1 className="text-h1 max-w-[22ch]">One assembly, eight ways to show it</h1>
        <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
          The NEAR Stack art never changes: same four layers, same column
          build-in, same hover, same copy. What changes is the scale it is shown
          at, where it is cropped, where the text lives and how much scroll it
          costs.
        </p>
        <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
          Every route brings a screen of air before and after, so the section is
          judged the way it is met on the page: arriving with scroll momentum,
          and with the cut against the light background on the way in and on the
          way out.
        </p>
      </Container>

      <Container className="flex flex-col pb-24">
        {STACK_LAB_VARIANTS.map((v) => (
          <Link
            key={v.id}
            href={`/prototype/stack-labs/${v.id}`}
            className="group grid grid-cols-1 gap-x-8 gap-y-3 border-t border-rule py-8 last:border-b lg:grid-cols-[4rem_16rem_minmax(0,1fr)] lg:items-baseline"
          >
            <span className="text-h3 text-green-ink">{v.index}</span>
            <span className="text-h3 underline-offset-4 group-hover:underline">{v.title}</span>
            <span className="flex flex-col gap-2">
              <span className="text-body-sm text-gray-intermediate text-pretty">{v.pitch}</span>
              <span className="text-caption-mono text-gray-intermediate">{v.travel}</span>
            </span>
          </Link>
        ))}
      </Container>
    </main>
  );
}
