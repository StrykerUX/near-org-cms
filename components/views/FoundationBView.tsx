import InstrumentHero from "@/components/sections/foundation/b/InstrumentHero";
import MandateBays from "@/components/sections/foundation/b/MandateBays";
import DevolutionMeter from "@/components/sections/foundation/b/DevolutionMeter";
import CustodyCutaway from "@/components/sections/foundation/b/CustodyCutaway";
import CouncilRegister from "@/components/sections/foundation/b/CouncilRegister";
import OperationsScene from "@/components/sections/foundation/b/OperationsScene";
import EcosystemRegister from "@/components/sections/foundation/b/EcosystemRegister";
import InstrumentClose from "@/components/sections/foundation/b/InstrumentClose";

// Variant B — «instrument». The Foundation as a piece of apparatus with a
// public reading.
//
// ── The ground plan is one object, read four times ─────────────────────────
// A page that says its transparency is structural rather than chosen is, quite
// literally, describing a box with instrumentation on it: you can see what
// goes in, what is held, and what comes out. So the layout gives the reader
// that box and then reads it — closed on the nameplate, gauged against a
// setpoint under the mission, cut open under the Stiftung, and divided across
// three acts under the operations scene. The geometry of all four lives in
// `b/apparatus.ts`, which is what keeps them one object instead of four
// drawings of boxes.
//
// ── Dark from the first pixel to the last ─────────────────────────────────
// No cut to cream anywhere. The other two variants spend a change of ground as
// punctuation; this one cannot, because its unit is the panel and a panel only
// reads as a lit object if the room around it stays dark. What punctuates
// instead is the panel itself: every section is one, except the two that must
// not be — the operations scene, which is a panel that MOVES, and the close,
// which has no case at all.
//
// ── `data-nav-dark` on the main and not per section ───────────────────────
// The site header inverts over anything carrying that attribute, and it reads
// the DOM rather than a section list, so one element spanning the whole page
// is exactly right here — and it is one trigger instead of eight.
export default function FoundationBView() {
  return (
    <main data-nav-dark className="flex flex-col bg-ink">
      <InstrumentHero />
      <MandateBays />
      <DevolutionMeter />
      <CustodyCutaway />
      <CouncilRegister />
      <OperationsScene />
      <EcosystemRegister />
      <InstrumentClose />
    </main>
  );
}
