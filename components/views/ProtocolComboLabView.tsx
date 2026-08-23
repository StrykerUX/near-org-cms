import Appendix from "@/components/sections/protocol-labs/a/Appendix";
import Assembly from "@/components/sections/protocol-labs/a/Assembly";
import Deployment from "@/components/sections/protocol-labs/a/Deployment";
import DevRuntime from "@/components/sections/protocol-labs/a/DevRuntime";
import Hero from "@/components/sections/protocol-labs/a/Hero";
import MachineClose from "@/components/sections/protocol-labs/a/MachineClose";
import BoardScale from "@/components/sections/protocol-labs/combo-labs/BoardScale";
import LedgerScale from "@/components/sections/protocol-labs/combo-labs/LedgerScale";
import MuralScale from "@/components/sections/protocol-labs/combo-labs/MuralScale";
import StairScale from "@/components/sections/protocol-labs/combo-labs/StairScale";
import SustainedScale from "@/components/sections/protocol-labs/combo-labs/SustainedScale";
import HeroCountRotating from "@/components/sections/protocol-labs/combo-labs/HeroCountRotating";
import HeroField from "@/components/sections/protocol-labs/opening-labs/HeroField";
import HeroFieldLight from "@/components/sections/protocol-labs/opening-labs/HeroFieldLight";
import HeroSpectrum from "@/components/sections/protocol-labs/opening-labs/HeroSpectrum";
import SpectrumLightPair, {
  HazeHero,
  LayersHero,
} from "@/components/sections/protocol-labs/combo-labs/SpectrumLightPair";

// La página Protocol entera, con OTRAS secciones 2 y 3 — /prototype/protocol-combo/…
//
// ── Qué se está comparando ─────────────────────────────────────────────────
//
// Cinco heroes sobrevivieron a los laboratorios: H4 · Cut (el de la página),
// H2 · Count, y los tres de las aperturas —Spectrum, Field y Field claro—. Lo
// que NO se decidió nunca es qué va debajo: las secciones 2 y 3 (las seis cifras
// y «Built for AI scale») venían heredadas de la variante que las trajo, no
// elegidas.
//
// Cada ruta de acá monta uno de esos cinco heroes con una propuesta NUEVA para
// esas dos secciones. Cinco propuestas, una por hero, y ninguna repite la
// estructura de otra: registro, columna pegada, escalera, mural y tablero.
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
// ── Qué se hereda de cada hero y qué se decide acá ────────────────────────
//
// Los heroes se IMPORTAN, no se copian: son la misma pieza que muestran sus
// rutas de origen, así que si uno se ajusta allá, acá se ajusta solo. Las cinco
// propuestas de secciones 2 y 3, en cambio, viven en `combo-labs/` y no existen
// en ningún otro lado.
//
// Nota sobre H2: su hero trae las seis cifras adentro, contando. Su propuesta
// (`SustainedScale`) es la única que no vuelve a mostrarlas como franja — las
// desarrolla. Repetir la misma tabla dos pantallas después le quitaría al
// marcador del hero justamente lo que la variante apuesta.
//
// H2 es además el primero con FONDO: `combo-labs/KeyRotationField`, un campo de
// caracteres donde cada tantos segundos un frente cruza en una sola pasada y
// reescribe todo el alfabeto — menos las cuentas, que quedan idénticas. Es la
// sección 8 dicha con la única herramienta que tiene un fondo: «accounts are
// decoupled from cryptography, so upgrading takes a single key rotation».
//
// Hubo antes un intento con la superficie de resharding —un plano partiéndose en
// diez shards, latiendo al block time— y se descartó: sobre crema, las regiones
// con relleno y el tramado del shard privado quedaban sucios detrás de un
// titular y de un marcador de cifras. Está en el historial de git. La lección que
// vale para la próxima: en este hero el fondo tiene que ser tipografía, no
// formas — hay ya dos elementos fuertes peleando por la pantalla.
//
// Los otros cuatro heroes siguen sin fondo a propósito: es lo que deja ver si el
// fondo suma o si el hero se defendía solo.

export type ComboId = "h4" | "h2" | "c" | "c-light" | "c-layers" | "e" | "g";

const COMBOS: Record<ComboId, { hero: () => React.ReactNode; scale: () => React.ReactNode }> = {
  h4: { hero: Hero, scale: LedgerScale },
  h2: { hero: HeroCountRotating, scale: SustainedScale },
  c: { hero: HeroSpectrum, scale: StairScale },
  // Las dos claras: mismo layout y misma escalera que `c`, y una sola variable
  // distinta entre ellas — la superficie. Ver `SpectrumLightPair`.
  "c-light": { hero: HazeHero, scale: SpectrumLightPair },
  "c-layers": { hero: LayersHero, scale: SpectrumLightPair },
  e: { hero: HeroField, scale: MuralScale },
  g: { hero: HeroFieldLight, scale: BoardScale },
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
