import LedgerHero from "@/components/sections/economics/b/LedgerHero";
import LedgerFacts from "@/components/sections/economics/b/LedgerFacts";
import LedgerFlow from "@/components/sections/economics/b/LedgerFlow";
import EmissionChart from "@/components/sections/economics/b/EmissionChart";
import LedgerEntries from "@/components/sections/economics/b/LedgerEntries";
import LedgerClose from "@/components/sections/economics/b/LedgerClose";

// Variant B of /economics — "Ledger".
//
// The header and the footer are NOT here: `app/prototype/layout.tsx` mounts
// both for every page in the group.
//
// Six sections and not five: the loop's third step —"the supply tightens"— is
// the one claim on the page that a sentence states and a picture proves, so it
// gets its own section (`EmissionChart`) immediately after the flow that raises
// it. That chart is the variant's signed gesture, and it is also the place
// where the page is most at risk of over-claiming, which is why the honesty
// lives in the data (`PROJECTION` in the content module) rather than in a
// caption.
//
// Ground: cream, cream, INK, cream, white, cream. The ink section is the
// flywheel, because that is the one passage where the page stops keeping a
// record and makes an argument. The white one is the two products — the page's
// only lift, and it lands on the only section that names things that exist.
export default function EconomicsBView() {
  return (
    <main className="flex flex-col bg-cream">
      <LedgerHero />
      <LedgerFacts />
      <LedgerFlow />
      <EmissionChart />
      <LedgerEntries />
      <LedgerClose />
    </main>
  );
}
