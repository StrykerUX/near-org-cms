import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { STACK_LAB_VARIANTS } from "@/components/sections/stack-labs/stackLabContent";

// El índice del laboratorio del NEAR Stack: cinco layouts para el MISMO arte.
//
// Es una lista y no un preview de cada variante a propósito: cinco miniaturas
// del mismo ensamble no distinguen nada —el arte es idéntico en las cinco— y
// además cargarlo cinco veces es exactamente lo que la separación en rutas
// existe para evitar.
export default function StackLabIndexView() {
  return (
    <main className="flex min-h-svh flex-col bg-cream text-ink">
      <Container as="header" className="flex flex-col gap-6 py-20 md:py-28">
        <Eyebrow className="text-gray-intermediate">Stack lab · 5 layouts</Eyebrow>
        <h1 className="text-h1 max-w-[22ch]">Un mismo ensamble, cinco maneras de mostrarlo</h1>
        <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
          El arte del NEAR Stack no cambia en ninguna: mismas cuatro capas, mismo
          build-in de la columna, mismo hover, misma copy. Lo que cambia es la
          escala a la que se muestra, dónde se corta, dónde vive el texto y
          cuánto scroll cuesta.
        </p>
        <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
          Cada ruta trae una pantalla de aire antes y otra después, para que la
          sección se juzgue como se encuentra en la página: llegando con inercia
          de scroll, y con el corte contra el fondo claro a la entrada y a la
          salida.
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
