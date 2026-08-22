import Hero from "@/components/sections/protocol-labs/a/Hero";
import ScaleClaim from "@/components/sections/protocol-labs/a/ScaleClaim";
import P1Hierarchy from "@/components/sections/protocol-labs/proof-labs/P1Hierarchy";
import P2Benchmark from "@/components/sections/protocol-labs/proof-labs/P2Benchmark";
import P3Grouped from "@/components/sections/protocol-labs/proof-labs/P3Grouped";
import P4Ticker from "@/components/sections/protocol-labs/proof-labs/P4Ticker";
import P5Sentence from "@/components/sections/protocol-labs/proof-labs/P5Sentence";
import P6Live from "@/components/sections/protocol-labs/proof-labs/P6Live";
import P7Axis from "@/components/sections/protocol-labs/proof-labs/P7Axis";
import P8Figures from "@/components/sections/protocol-labs/proof-labs/P8Figures";

// Un divider EN CONTEXTO — /prototype/protocol-proof/p1 … p8
//
// ── Por qué cada uno tiene su ruta ────────────────────────────────────────
//
// Un divider no existe solo: es la juntura entre dos cosas, y lo único que hay
// que juzgar es si cierra el hero y abre lo que sigue. Apilados —como estaban
// cuando eran secciones— las ocho bandas se comparan entre sí, que es la
// comparación equivocada: la que importa es cada banda contra sus dos vecinos.
//
// Así que acá va el hero REAL de la página y la sección REAL que le sigue, con la
// variante en el medio. Lo que se ve es exactamente lo que se vería en
// `/prototype/protocol-a` si esa variante ganara.
//
// El índice de `/prototype/protocol-proof` sigue mostrándolas apiladas, pero para
// otra cosa: comparar de un vistazo qué hace cada una con los seis datos. Para
// decidir, esta ruta.
//
// ── `ScaleClaim` va con `proof={false}` ────────────────────────────────────
//
// Las seis cifras ya están en el divider. Su franja interna existe para el caso
// en que NO haya divider, y encendida las duplicaría en dos bloques consecutivos.

export type ProofLabId = "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "p8";

// El tipo de retorno es `ReactNode` y no `ReactElement`: P1 devuelve `null` si no
// encuentra su cifra principal, que es la guarda correcta para un componente que
// busca un id en el contenido.
const VARIANTS: Record<ProofLabId, () => React.ReactNode> = {
  p1: P1Hierarchy,
  p2: P2Benchmark,
  p3: P3Grouped,
  p4: P4Ticker,
  p5: P5Sentence,
  p6: P6Live,
  p7: P7Axis,
  p8: P8Figures,
};

export default function ProtocolProofLabView({ id }: { id: ProofLabId }) {
  const Divider = VARIANTS[id];

  return (
    <main>
      <Hero />
      <Divider />
      <ScaleClaim proof={false} />
    </main>
  );
}
