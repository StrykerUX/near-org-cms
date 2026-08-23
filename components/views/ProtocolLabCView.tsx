import Appendix from "@/components/sections/protocol-labs/Appendix";
import Assembly from "@/components/sections/protocol-labs/Assembly";
import Deployment from "@/components/sections/protocol-labs/Deployment";
import DevRuntime from "@/components/sections/protocol-labs/DevRuntime";
import MachineClose from "@/components/sections/protocol-labs/MachineClose";
import ProofRow from "@/components/sections/protocol-labs/ProofRow";
import ScaleClaim from "@/components/sections/protocol-labs/ScaleClaim";
import HeroField from "@/components/sections/protocol-labs/heroes/HeroField";
import { GridOverlay } from "@/components/primitives/Grid";

// Protocol C — la página entera, abierta por Field. /prototype/protocol-c
//
// ── Las tres alternativas de la página ────────────────────────────────────
//
//   A  /prototype/protocol-a   Layerflow — capas que fluyen, y el hero se recoge
//   B  /prototype/protocol-b   Spectrum  — bandas verticales, shader
//   C  /prototype/protocol-c   Field     — campo de caracteres, canvas
//
// Las tres montan LAS MISMAS siete secciones. Lo único que cambia entre ellas es
// el hero, y eso es deliberado: es lo que hace que compararlas mida la apertura
// y no otra cosa.
//
// ── De dónde sale ésta ────────────────────────────────────────────────────
//
// La apertura Field vivía en `/prototype/protocol-opening/`, donde se montaba
// como un fragmento: su hero y el acto oscuro debajo, y nada más. Alcanzaba para
// lo que aquel laboratorio comparaba —si la apertura le come el rango al acto—,
// y no para más: una apertura no se juzga entera hasta ver qué le hace al resto
// de la página.
//
// ── El hero se IMPORTA, no se copia ───────────────────────────────────────
//
// Al revés de lo que hizo `a/Hero.tsx`, que sí copió el suyo. La diferencia es
// que aquél ya está elegido y no puede moverse cuando alguien toque un
// laboratorio; éstas son dos candidatas que siguen compitiendo, y mientras
// compiten tienen que ser la MISMA pieza que muestra su ruta de origen. Dos
// copias divergiendo durante la comparación es el peor momento posible para
// divergir.
//
// El día que una gane, se copia a `a/` y esta ruta desaparece con el resto del
// laboratorio.
export default function ProtocolLabCView() {
  return (
    <>
      <main>
        <HeroField />
        <ProofRow />
        <ScaleClaim />
        <Assembly />
        <DevRuntime />
        <Deployment />
        <Appendix />
        <MachineClose />
      </main>
      <GridOverlay />
    </>
  );
}
