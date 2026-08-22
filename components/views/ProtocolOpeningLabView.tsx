import Assembly from "@/components/sections/protocol-labs/a/Assembly";
import OpeningA from "@/components/sections/protocol-labs/opening-labs/OpeningA";
import OpeningB from "@/components/sections/protocol-labs/opening-labs/OpeningB";
import OpeningC from "@/components/sections/protocol-labs/opening-labs/OpeningC";
import OpeningD from "@/components/sections/protocol-labs/opening-labs/OpeningD";
import OpeningE from "@/components/sections/protocol-labs/opening-labs/OpeningE";
import OpeningF from "@/components/sections/protocol-labs/opening-labs/OpeningF";
import OpeningG from "@/components/sections/protocol-labs/opening-labs/OpeningG";

// Una apertura EN CONTEXTO — /prototype/protocol-opening/a … f
//
// ── Qué se monta debajo, y por qué justo eso ──────────────────────────────
//
// Cada apertura son tres secciones (hero + cifras + "Built for AI scale") y
// abajo va el ACTO — el bloque oscuro de seis pantallas con la pieza pegada.
//
// No es decorado: es el riesgo principal de casi todas. Cinco de las siete
// aperturas abren en oscuro, y el acto ya era el único bloque oscuro largo de la
// página. Si la apertura le come el rango, se ve acá y en ningún otro lado.
// Montar la apertura sola contestaría "¿se ve bien?", que no es la pregunta.
//
// Para G —la clara— el acto de abajo contesta lo contrario y es igual de útil: si
// abrir en crema hace que el acto recupere el peso que tenía, eso es un
// argumento a su favor que ninguna captura del hero puede dar.
//
// El resto de la página (developers, ecosistema, apéndice, cierre) no se monta:
// no aporta a esta decisión y multiplicaría por seis una página ya pesada —cada
// ruta trae un canvas WebGL propio.

export type OpeningId = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const OPENINGS: Record<OpeningId, () => React.ReactNode> = {
  a: OpeningA,
  b: OpeningB,
  c: OpeningC,
  d: OpeningD,
  e: OpeningE,
  f: OpeningF,
  g: OpeningG,
};

export default function ProtocolOpeningLabView({ id }: { id: OpeningId }) {
  const Opening = OPENINGS[id];

  return (
    <main>
      <Opening />
      <Assembly />
    </main>
  );
}
