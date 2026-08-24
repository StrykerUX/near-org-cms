import DossierHero from "@/components/sections/foundation/b/DossierHero";
import DossierPillars from "@/components/sections/foundation/b/DossierPillars";
import DevolutionBreak from "@/components/sections/foundation/b/DevolutionBreak";
import StiftungInstrument from "@/components/sections/foundation/b/StiftungInstrument";
import CouncilClause from "@/components/sections/foundation/b/CouncilClause";
import OperationsClauses from "@/components/sections/foundation/b/OperationsClauses";
import EcosystemAnnex from "@/components/sections/foundation/b/EcosystemAnnex";
import DossierClose from "@/components/sections/foundation/b/DossierClose";

// Variant B — «Stiftung dossier». The page as the instrument it describes.
//
// Every block except two sits on `Clause`, which owns the rail and the ruling:
// that is what makes the measure hold from the letterhead to the signature. The
// two exceptions are deliberate and are the whole shape of the page —
// `DevolutionBreak`, which has no rail and is on white, and `DossierClose`,
// which keeps the measure but draws it in white because the cream hairline does
// not exist on ink.
//
// If a section is added, it goes on `Clause`. The break has to stay the only
// one: two exceptions are a rhythm, a rhythm is a format, and then the page has
// a loud register instead of a document with one escape.
export default function FoundationBView() {
  return (
    <main className="flex flex-col bg-cream">
      <DossierHero />
      <DossierPillars />
      <DevolutionBreak />
      <StiftungInstrument />
      <CouncilClause />
      <OperationsClauses />
      <EcosystemAnnex />
      <DossierClose />
    </main>
  );
}
