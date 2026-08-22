import ScaleClaim from "@/components/sections/protocol-labs/a/ScaleClaim";
import ProofBand from "@/components/sections/protocol-labs/hero-labs/ProofBand";
import H1Ledger from "@/components/sections/protocol-labs/hero-labs/H1Ledger";
import H2Count from "@/components/sections/protocol-labs/hero-labs/H2Count";
import H3Threshold from "@/components/sections/protocol-labs/hero-labs/H3Threshold";
import H4Cut from "@/components/sections/protocol-labs/hero-labs/H4Cut";
import H5Index from "@/components/sections/protocol-labs/hero-labs/H5Index";
import H6Field from "@/components/sections/protocol-labs/hero-labs/H6Field";
import H7Mural from "@/components/sections/protocol-labs/hero-labs/H7Mural";
import H8Terminal from "@/components/sections/protocol-labs/hero-labs/H8Terminal";

// Una variante de hero, EN CONTEXTO — /prototype/protocol-heroes/h1 … h8
//
// ── Por qué una ruta por variante y no las ocho apiladas ───────────────────
//
// El laboratorio de heroes anterior del repo (`hero-alt`, archivado) montaba seis
// heroes seguidos en una sola página. Sirve para comparar composiciones y falla
// justo en lo que hay que decidir acá: **la juntura**. Un hero no se juzga solo;
// se juzga por lo que pasa cuando termina — si la evidencia llega a tiempo, si el
// corte al contenido se siente, si el fondo siguiente pelea con el suyo. Apilados,
// cada hero tiene otro hero debajo, que es lo único que nunca va a tener en la
// página real.
//
// Por eso cada variante se ve sola y con lo que va abajo: su banda de cifras si
// las saca del hero, y después la sección real que la sigue en
// `/prototype/protocol-a`.
//
// ── El contrato de esta view ───────────────────────────────────────────────
//
// Recibe un `id` plano —el mismo que la ruta— y arma la composición. Es una view
// con dato serializable, no una view por variante: ocho archivos idénticos salvo
// dos líneas es exactamente lo que produce que siete queden desactualizados.

export type HeroLabId = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7" | "h8";

// Dónde viven las cifras en cada variante, y qué banda le corresponde. `null`
// significa que la variante las lleva DENTRO del hero y no monta banda.
const STAGE: Record<
  HeroLabId,
  { hero: () => React.ReactElement; band: "band" | "sticky" | null }
> = {
  h1: { hero: H1Ledger, band: null },
  h2: { hero: H2Count, band: null },
  h3: { hero: H3Threshold, band: "sticky" },
  h4: { hero: H4Cut, band: "band" },
  h5: { hero: H5Index, band: "band" },
  h6: { hero: H6Field, band: null },
  h7: { hero: H7Mural, band: "band" },
  h8: { hero: H8Terminal, band: null },
};

export default function ProtocolHeroLabView({ id }: { id: HeroLabId }) {
  const { hero: Hero, band } = STAGE[id];

  return (
    <main>
      <Hero />
      {band && <ProofBand mode={band} />}
      {/* La sección que sigue en la página real. Va acá y no como decorado: es
          contra ella que se mide si el hero cierra bien. `proof={false}` porque
          las cifras ya aparecieron —dentro del hero o en la banda— y repetirlas
          rompería la lectura que cada variante propone. */}
      <ScaleClaim proof={false} />
    </main>
  );
}
