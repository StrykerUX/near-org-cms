import Appendix from "@/components/sections/protocol-labs/a/Appendix";
import Assembly from "@/components/sections/protocol-labs/a/Assembly";
import Deployment from "@/components/sections/protocol-labs/a/Deployment";
import DevRuntime from "@/components/sections/protocol-labs/a/DevRuntime";
import MachineClose from "@/components/sections/protocol-labs/a/MachineClose";
import MuralScale from "@/components/sections/protocol-labs/combo-labs/MuralScale";
import StairScale from "@/components/sections/protocol-labs/combo-labs/StairScale";
import HeroField from "@/components/sections/protocol-labs/opening-labs/HeroField";
import HeroSpectrum from "@/components/sections/protocol-labs/opening-labs/HeroSpectrum";
import LayerflowPair, {
  LayersHero,
} from "@/components/sections/protocol-labs/combo-labs/LayerflowPair";

// La página Protocol entera, con OTRAS secciones 2 y 3 — /prototype/protocol-combo/…
//
// ── Qué se está comparando ─────────────────────────────────────────────────
//
// Los heroes que sobrevivieron a los laboratorios llegaron con sus secciones 2 y
// 3 heredadas de la variante que los trajo, no elegidas. Cada ruta de acá monta
// uno de ellos con una propuesta propia para esas dos secciones.
//
// ── Por qué la página entera y no las tres secciones solas ────────────────
//
// Porque el riesgo de estas propuestas no está en cómo se ven: está en qué le
// hacen al ACTO. El acto —el bloque oscuro de seis pantallas con la pieza
// pegada— es el centro de la página, y tres secciones que le comen el rango o le
// roban el contraste lo dejan sin efecto. Eso no se ve en una captura de las
// tres primeras pantallas; se ve al llegar.
//
// Por lo mismo va el resto (developers, ecosistema, apéndice, cierre): el ritmo
// claro · claro · OSCURO · claro · claro · claro · OSCURO es lo que estas
// propuestas pueden romper, y sólo se juzga completo.
//
// ── Las rutas se llaman por la PROPUESTA, no por el hero ──────────────────
//
// `stair`, `layerflow` y `mural`, y no `c`, `c-layers` y `e`. Aquellas letras
// venían de la apertura que había traído cada hero —C · Spectrum, E · Field— y
// dejaron de significar nada en cuanto los combos empezaron a proponer
// estructuras propias: nadie recuerda cuál era la E, y el nombre de la ruta era
// justamente el lugar donde esa memoria hacía falta.
//
// ── Quedan tres de siete ───────────────────────────────────────────────────
//
// Se descartaron **Ledger** (h4 · Cut con las cifras y las propiedades como
// nueve filas de un registro), **Sustained** (h2 · Count con una columna pegada
// y las cifras desarrolladas en vez de repetidas), **Haze** (el hero claro con
// una superficie de luz difusa, sin estructura) y **Board** (g · Field claro con
// todo en un tablero de celdas asimétricas).
//
// Con ellos se fueron sus superficies: `KeyRotationField` —el campo de
// caracteres que reescribía su alfabeto en una sola pasada, y que respondía al
// puntero— y `gl/haze.ts`. Están en el historial de git.
//
// ── Qué se hereda de cada hero y qué se decide acá ────────────────────────
//
// Los heroes se IMPORTAN, no se copian: son la misma pieza que muestran sus
// rutas de origen, así que si uno se ajusta allá, acá se ajusta solo. Las
// propuestas de secciones 2 y 3 viven en `combo-labs/` y no existen en ningún
// otro lado.

export type ComboId = "stair" | "layerflow" | "mural";

const COMBOS: Record<ComboId, { hero: () => React.ReactNode; scale: () => React.ReactNode }> = {
  stair: { hero: HeroSpectrum, scale: StairScale },
  // La clara: mismo layout y misma página detrás que `stair`, con otra
  // superficie y sin escalera — su hero ya trae las cifras asomando. Ver
  // `LayerflowPair`.
  layerflow: { hero: LayersHero, scale: LayerflowPair },
  mural: { hero: HeroField, scale: MuralScale },
};

export default function ProtocolComboLabView({ id }: { id: ComboId }) {
  const { hero: HeroSection, scale: ScaleSections } = COMBOS[id];

  return (
    <main>
      <HeroSection />
      <ScaleSections />
      <Assembly />
      <DevRuntime />
      <Deployment />
      <Appendix />
      <MachineClose />
    </main>
  );
}
