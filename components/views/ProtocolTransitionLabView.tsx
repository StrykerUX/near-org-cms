import Hero from "@/components/sections/protocol-labs/a/Hero";
import ScaleClaim from "@/components/sections/protocol-labs/a/ScaleClaim";
import T1Fold from "@/components/sections/protocol-labs/transition-labs/T1Fold";
import T2Aperture from "@/components/sections/protocol-labs/transition-labs/T2Aperture";
import T3Seam from "@/components/sections/protocol-labs/transition-labs/T3Seam";
import T4Handoff from "@/components/sections/protocol-labs/transition-labs/T4Handoff";
import T5Fan from "@/components/sections/protocol-labs/transition-labs/T5Fan";
import T6Split from "@/components/sections/protocol-labs/transition-labs/T6Split";
import T7Bridge from "@/components/sections/protocol-labs/transition-labs/T7Bridge";
import T8Grid from "@/components/sections/protocol-labs/transition-labs/T8Grid";
import T9Descent from "@/components/sections/protocol-labs/transition-labs/T9Descent";
import T10Curtain from "@/components/sections/protocol-labs/transition-labs/T10Curtain";
import T11Mural from "@/components/sections/protocol-labs/transition-labs/T11Mural";
import T12Genesis from "@/components/sections/protocol-labs/transition-labs/T12Genesis";

// Una transición EN CONTEXTO — /prototype/protocol-transitions/t1 … t12
//
// Hero real arriba, sección real abajo. Es lo único que permite juzgar una
// transición: no cómo se ve, sino si entrega el lector de una cosa a la otra.
//
// `ScaleClaim` va con `proof={false}` porque las seis cifras ya están en la
// transición; encendida las duplicaría en dos bloques consecutivos.

export type TransitionId =
  | "t1" | "t2" | "t3" | "t4" | "t5" | "t6"
  | "t7" | "t8" | "t9" | "t10" | "t11" | "t12";

const VARIANTS: Record<TransitionId, () => React.ReactNode> = {
  t1: T1Fold,
  t2: T2Aperture,
  t3: T3Seam,
  t4: T4Handoff,
  t5: T5Fan,
  t6: T6Split,
  t7: T7Bridge,
  t8: T8Grid,
  t9: T9Descent,
  t10: T10Curtain,
  t11: T11Mural,
  t12: T12Genesis,
};

export default function ProtocolTransitionLabView({ id }: { id: TransitionId }) {
  const Transition = VARIANTS[id];

  return (
    <main>
      <Hero />
      <Transition />
      <ScaleClaim proof={false} />
    </main>
  );
}
