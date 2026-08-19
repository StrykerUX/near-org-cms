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
        <Eyebrow className="text-gray-intermediate">Transitions · 12 mechanisms</Eyebrow>
        <h1 className="text-h1 max-w-[22ch]">From cream to black, twelve ways</h1>
        <p className="max-w-[62ch] text-body-lg text-gray-intermediate text-pretty">
          The cut between «Own Your Own» and «The NEAR Stack» is a change of
          background today and nothing else. Every variant solves that same jump
          with a different mechanism, and all of the second batch sit on the same
          piece: changing the transition of a cut is changing one component.
        </p>
        <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
          Every route mounts the TWO real sections, not mockups: what has to be
          judged is how it feels to arrive with the cards still in your eye and
          leave with the column already on screen.
        </p>
      </Container>

      <Container className="flex flex-col pb-8">
        {TRANSITIONS.filter((t) => t.current).map((t) => (
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

      {/* Las descartadas se conservan a la vista: un laboratorio que borra lo
          que no funcionó obliga a volver a proponerlo. */}
      <Container className="flex flex-col gap-4 pb-24 pt-12">
        <Eyebrow className="text-gray-intermediate">First batch · discarded</Eyebrow>
        <p className="max-w-[62ch] text-body-sm text-gray-intermediate text-pretty">
          Four of the five are the same idea —something black arrives and covers
          the screen— and none of them carries content or connects the two
          sections. They are here so nobody proposes them again.
        </p>
        <div className="flex flex-col">
          {TRANSITIONS.filter((t) => !t.current).map((t) => (
            <Link
              key={t.id}
              href={`/prototype/transition-labs/${t.id}`}
              className="group grid grid-cols-1 gap-x-8 gap-y-2 border-t border-rule py-5 last:border-b lg:grid-cols-[4rem_16rem_minmax(0,1fr)] lg:items-baseline"
            >
              <span className="text-body text-gray-intermediate">{t.index}</span>
              <span className="text-body underline-offset-4 group-hover:underline">{t.title}</span>
              <span className="text-body-sm text-gray-intermediate text-pretty">{t.pitch}</span>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
