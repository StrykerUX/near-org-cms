import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import type { ProofSpec } from "@/components/sections/proof-alt/proofAltContent";

// El separador que abre cada versión del laboratorio.
//
// Hermano de `hero-alt/AltDivider` y con el mismo motivo: a mitad de scroll,
// con el encabezado de la página fuera de cuadro, tiene que seguir siendo obvio
// qué versión estás mirando. Acá el problema es todavía peor que en el lab de
// heroes — las diez dicen las MISMAS seis cifras, así que sin rótulo se
// confunden entre sí a los treinta segundos.
//
// Lo que se le agregó respecto de aquel: `travel`. En este lab la pregunta que
// se está haciendo es "cuánto scroll cuesta", así que el recorrido de cada
// versión es un dato de primera clase y va al lado del título, no escondido en
// la descripción.
//
// `--ink-slate` y no `--ink` ni `--cream`: los dos son fondos que las versiones
// usan, y un separador del mismo color que la escena que abre no separa nada.
export type ProofDividerProps = {
  spec: ProofSpec;
};

export default function ProofDivider({ spec }: ProofDividerProps) {
  return (
    <section
      id={spec.id}
      // `scroll-mt` para que el ancla no deje el rótulo debajo del header fijo.
      className="scroll-mt-[var(--site-header-block)] bg-ink-slate text-cream"
    >
      <Container className="flex flex-col gap-6 py-12 md:py-16">
        <div className="flex items-baseline gap-5">
          {/* El número va en el rol decorativo grande: es lo único que se lee
              de reojo pasando rápido, que es como se pasa por un separador. */}
          <span className="text-h1 text-near-green-accent">{spec.index}</span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-h2">{spec.title}</h2>
            <Eyebrow className="text-cream/50">{spec.stack}</Eyebrow>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <div className="flex flex-col gap-1.5">
            <dt className="text-caption-mono text-near-green-accent">recorrido</dt>
            <dd className="text-body-sm text-cream/70">{spec.travel}</dd>
          </div>
          <div className="flex flex-col gap-1.5">
            <dt className="text-caption-mono text-near-green-accent">qué mirar</dt>
            <dd className="text-body-sm text-cream/70 text-pretty">{spec.pitch}</dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
