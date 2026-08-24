import InstrumentSection from "@/components/sections/shells/instrument/Section";
import Panel from "@/components/sections/shells/instrument/Panel";
import Figure from "@/components/primitives/Figure";
import LayerDiagram from "@/components/sections/governance/LayerDiagram";
import { LAYERS, RELATION } from "@/components/sections/governance/governanceContent";

// Las dos capas: el dibujo, y las dos descripciones textuales de su módulo de
// origen.
//
// El `source` de cada capa se imprime en mono. No es una nota interna que se
// coló: en una página compuesta a partir de otras dos, decir de dónde sale cada
// afirmación es lo que la hace verificable — y es coherente con lo único que
// esta página afirma sobre sí misma, que es que no inventó nada.
export default function GovernanceLayers() {
  return (
    <InstrumentSection
      eyebrow="The two layers"
      title="One decides. One is handing over."
      intro="They are not two levels of the same hierarchy. One is a mechanism that executes what gets voted; the other is an organization working to make itself unnecessary."
    >
      <Panel label="Layers" meta="Not a hierarchy" grid>
        <div className="px-6 pb-10 pt-20 lg:px-10 lg:pb-14 lg:pt-24">
          <Figure
            tone="dark"
            caption="The onchain layer is closed and its proposals cross a threshold. The Foundation's edge is dashed, and its functions leave the frame."
          >
            <LayerDiagram />
          </Figure>

          <div className="mt-16 grid-ds gap-y-10">
            {LAYERS.map((layer) => (
              <div key={layer.id} className="col-span-12 lg:col-span-5 lg:[&:nth-child(2)]:col-start-8">
                <div className="h-px w-full bg-white/12" aria-hidden="true" />
                <p className="mt-5 text-micro-mono text-white/35">
                  {layer.index} · {layer.source}
                </p>
                <h3 className="mt-5 text-h3-serif italic text-cream">{layer.title}</h3>
                <p className="mt-4 max-w-[44ch] text-body text-white/60 text-pretty">
                  {layer.body}
                </p>
                {layer.id === "foundation" ? (
                  <p className="mt-5 text-micro-mono uppercase text-white/35">
                    Council {RELATION.out} · Executive {RELATION.back}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </InstrumentSection>
  );
}
