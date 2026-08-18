import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import ProofDivider from "@/components/sections/proof-alt/ProofDivider";
import { PROOF_ALTS } from "@/components/sections/proof-alt/proofAltContent";

import LedgerGrid from "@/components/sections/proof-alt/LedgerGrid";
import TickerTape from "@/components/sections/proof-alt/TickerTape";
import SolariBoard from "@/components/sections/proof-alt/SolariBoard";
import DialRings from "@/components/sections/proof-alt/DialRings";
import RailScroller from "@/components/sections/proof-alt/RailScroller";
import PlotterTrace from "@/components/sections/proof-alt/PlotterTrace";
import PrismField from "@/components/sections/proof-alt/PrismField";
import DeckStack from "@/components/sections/proof-alt/DeckStack";
import BentoMosaic from "@/components/sections/proof-alt/BentoMosaic";
import VersoParagraph from "@/components/sections/proof-alt/VersoParagraph";

// Diez versiones de UNA sección: las seis pruebas de la homepage.
//
// El origen es concreto: el `ProofStepper` de `/prototype/homepage-ab7` gasta
// 325svh de recorrido (cinco pasos de 45svh más un viewport) para entregar
// cinco datos, y ese es el problema que las diez atacan. Nueve de las diez
// caben en 100svh o 150svh; la única que gasta scroll de verdad es la 05, y
// está para tener contra qué medir el ahorro.
//
// ── Los diez componentes están escritos a mano y no salen de un .map() ──────
//
// Con un array de pares esto serían seis líneas, y la correspondencia entre
// cada divider y su versión quedaría implícita en el orden de dos arrays. Este
// archivo existe para que esa correspondencia se lea de un tirón. Es el mismo
// criterio de `HeroAltView` y de `HomepageExplorationView`, y por el mismo
// motivo.
//
// ── Apilarlas tiene un costo que conviene tener presente al mirar ───────────
//
// Diez secciones seguidas que dicen las MISMAS seis cifras cansan mucho antes
// que diez secciones distintas: a la cuarta, el lector ya se sabe los datos y
// juzga solo el gesto. Eso favorece a las versiones vistosas y perjudica a la
// 01, que es la que probablemente gane en una página real, donde estas cifras
// se ven UNA vez y rodeadas de otro contenido.
//
// Para juzgar una en frío hay que montarla sola. Las diez son independientes:
// no se importan entre sí, no comparten estado y cada una trae su propio fondo.

export default function ProofAltView() {
  return (
    <main className="flex flex-col bg-cream">
      <Container as="header" className="py-20 md:py-28">
        <Eyebrow className="opacity-50">Proof lab · 10 versiones</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[20ch]">Seis pruebas, diez maneras</h1>
        <p className="text-body-lg mt-6 max-w-[62ch] opacity-70">
          La sección de pruebas de la homepage, diez veces, con las mismas seis
          cifras en todas. Lo que cambia es la estructura, el gesto y sobre todo
          el RECORRIDO: nueve de las diez caben en una pantalla o pantalla y
          media, contra los 325svh que gasta hoy el stepper de ab7. Cada versión
          abre con su ficha: cuánto scroll consume y qué mirar.
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {PROOF_ALTS.map((alt) => (
            <a
              key={alt.id}
              href={`#${alt.id}`}
              className="text-label underline underline-offset-4"
            >
              {alt.index} {alt.title}
            </a>
          ))}
        </nav>
      </Container>

      {/* ── 01 · Ledger — la grilla de referencia, sin recorrido ──────────── */}
      <ProofDivider spec={PROOF_ALTS[0]} />
      <LedgerGrid />

      {/* ── 02 · Ticker — la cinta acelera con la velocidad del scroll ────── */}
      <ProofDivider spec={PROOF_ALTS[1]} />
      <TickerTape />

      {/* ── 03 · Solari — una cifra a la vez, lamas girando ───────────────── */}
      <ProofDivider spec={PROOF_ALTS[2]} />
      <SolariBoard />

      {/* ── 04 · Dial — seis anillos, el ángulo del puntero elige ─────────── */}
      <ProofDivider spec={PROOF_ALTS[3]} />
      <DialRings />

      {/* ── 05 · Rail — el único con recorrido, y horizontal ──────────────── */}
      <ProofDivider spec={PROOF_ALTS[4]} />
      <RailScroller />

      {/* ── 06 · Plotter — canvas 2D: la aguja escribe el papel ───────────── */}
      <ProofDivider spec={PROOF_ALTS[5]} />
      <PlotterTrace />

      {/* ── 07 · Prism — WebGL2: las celdas interfieren entre sí ──────────── */}
      <ProofDivider spec={PROOF_ALTS[6]} />
      <PrismField />

      {/* ── 08 · Deck — cartas hojeables, el scroll no participa ──────────── */}
      <ProofDivider spec={PROOF_ALTS[7]} />
      <DeckStack />

      {/* ── 09 · Bento — se anima la grilla, no los elementos ─────────────── */}
      <ProofDivider spec={PROOF_ALTS[8]} />
      <BentoMosaic />

      {/* ── 10 · Verso — la prosa se vacía, la columna se llena ───────────── */}
      <ProofDivider spec={PROOF_ALTS[9]} />
      <VersoParagraph />
    </main>
  );
}
