import Link from "next/link";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { TRANSITIONS } from "@/components/sections/transition-labs/transitionLabContent";

// El índice del laboratorio de transiciones: cinco maneras de pasar del cream
// de «Own Your Own» al negro de «The NEAR Stack».
//
// Lista y no previews, por lo mismo que el lab del stack: una miniatura de una
// transición no es una transición —lo que se juzga es cómo se siente el viaje,
// y eso solo existe scrolleándolo— y montar las cinco acá sería montar cinco
// veces las dos secciones.
export default function TransitionLabIndexView() {
  return (
    <main className="flex min-h-svh flex-col bg-cream text-ink">
      <Container as="header" className="flex flex-col gap-6 py-20 md:py-28">
        <Eyebrow className="text-gray-intermediate">Transiciones · 5 mecanismos</Eyebrow>
        <h1 className="text-h1 max-w-[22ch]">Del cream al negro, cinco maneras</h1>
        <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
          El corte entre «Own Your Own» y «The NEAR Stack» es hoy un cambio de
          fondo y nada más. Las cinco variantes resuelven ese mismo salto con
          mecanismos distintos: un telón, una contraforma tipográfica, un campo
          de caracteres, una nube de partículas y la propia columna del stack
          subiendo.
        </p>
        <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
          Cada ruta monta las DOS secciones de verdad, no maquetas: lo que hay
          que juzgar es cómo se siente llegar con las cards todavía en la retina
          y salir con la columna ya en pantalla.
        </p>
      </Container>

      <Container className="flex flex-col pb-24">
        {TRANSITIONS.map((t) => (
          <Link
            key={t.id}
            href={`/prototype/transition-labs/${t.id}`}
            className="group grid grid-cols-1 gap-x-8 gap-y-3 border-t border-rule py-8 last:border-b lg:grid-cols-[4rem_16rem_minmax(0,1fr)] lg:items-baseline"
          >
            <span className="text-h3 text-green-ink">{t.index}</span>
            <span className="text-h3 underline-offset-4 group-hover:underline">{t.title}</span>
            <span className="flex flex-col gap-2">
              <span className="text-body-sm text-gray-intermediate text-pretty">{t.pitch}</span>
              <span className="text-caption-mono text-gray-intermediate">
                {t.cost} · {t.stack}
              </span>
            </span>
          </Link>
        ))}
      </Container>
    </main>
  );
}
