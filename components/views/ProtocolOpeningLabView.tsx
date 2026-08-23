import Assembly from "@/components/sections/protocol-labs/a/Assembly";
import OpeningC from "@/components/sections/protocol-labs/opening-labs/OpeningC";
import OpeningE from "@/components/sections/protocol-labs/opening-labs/OpeningE";
import OpeningG from "@/components/sections/protocol-labs/opening-labs/OpeningG";

// Una apertura EN CONTEXTO — /prototype/protocol-opening/c, /e, /g
//
// ── Qué se monta debajo, y por qué justo eso ──────────────────────────────
//
// Cada apertura son tres secciones (hero + cifras + "Built for AI scale") y
// abajo va el ACTO — el bloque oscuro de seis pantallas con la pieza pegada.
//
// No es decorado: es el riesgo principal de las que abren en oscuro. C y E
// abren oscuras, y el acto ya era el único bloque oscuro largo de la página. Si
// la apertura le come el rango, se ve acá y en ningún otro lado. Montar la
// apertura sola contestaría "¿se ve bien?", que no es la pregunta.
//
// Para G —la clara— el acto de abajo contesta lo contrario y es igual de útil: si
// abrir en crema hace que el acto recupere el peso que tenía, eso es un
// argumento a su favor que ninguna captura del hero puede dar.
//
// El resto de la página (developers, ecosistema, apéndice, cierre) no se monta:
// no aporta a esta decisión y multiplicaría una página ya pesada —cada ruta trae
// un canvas propio.
//
// ── Quedaron tres de siete ─────────────────────────────────────────────────
//
// El lab abrió con A · Lattice, B · Shards, C · Spectrum, D · Stack, E · Field,
// F · Horizon y G · Field claro. Sobreviven C, E y G; las otras cuatro y sus
// shaders (`gl/lattice`, `gl/voronoi`, `gl/horizon`) se borraron. La única
// pieza compartida que se llevaban puesta era `ScaleSection`, que vivía dentro
// de `OpeningA` y ahora tiene archivo propio.

export type OpeningId = "c" | "e" | "g";

const OPENINGS: Record<OpeningId, () => React.ReactNode> = {
  c: OpeningC,
  e: OpeningE,
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
