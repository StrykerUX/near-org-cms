import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import type { AltSpec } from "@/components/sections/hero-alt/heroAltContent";

// El separador que abre cada versión del laboratorio.
//
// Mismo razonamiento que `home-exploration/LabDivider`, y por eso se parece:
// a mitad de scroll, con el encabezado ya fuera de cuadro, tiene que seguir
// siendo obvio qué versión estás mirando. Acá el problema es peor que allá —
// cinco heroes seguidos se parecen entre sí mucho más que cinco transiciones de
// píxel, porque los cinco dicen la misma frase.
//
// Es `--ink-slate` y no `--ink` ni `--cream`: los dos son colores que las
// versiones usan de fondo, y un separador del mismo color que la escena que
// abre no separa nada. El slate no aparece en ninguna de las cinco.
//
// El `id` lo consume el índice de la página con anclas.
export type AltDividerProps = {
  spec: AltSpec;
};

export default function AltDivider({ spec }: AltDividerProps) {
  return (
    <section
      id={spec.id}
      // `scroll-mt` para que el ancla no deje el rótulo debajo del header fijo.
      className="scroll-mt-[var(--site-header-block)] bg-ink-slate text-cream"
    >
      <Container className="flex flex-col gap-6 py-14 md:py-20">
        <div className="flex items-baseline gap-5">
          {/* El número va en el rol decorativo grande: es lo único que se lee
              de reojo pasando rápido, que es como se pasa por un separador. */}
          <span className="text-h1 text-near-green-accent">{spec.index}</span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-h2">{spec.title}</h2>
            <Eyebrow className="text-cream/50">{spec.stack}</Eyebrow>
          </div>
        </div>

        {/* Las dos líneas dicen qué mirar en cada mitad del par. Sin esto, la
            diferencia entre dos versiones se nota pero no se sabe nombrar, que
            es lo que hace imposible elegir. */}
        <dl className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <dt className="text-caption-mono text-near-green-accent">hero</dt>
            <dd className="text-body-sm text-cream/70 text-pretty">{spec.hero}</dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="text-caption-mono text-near-green-accent">2nd section</dt>
            <dd className="text-body-sm text-cream/70 text-pretty">{spec.second}</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
