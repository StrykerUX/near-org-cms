import LogHero from "@/components/sections/about/b/LogHero";
import StateSequence from "@/components/sections/about/b/StateSequence";
import ChapterLog from "@/components/sections/about/b/ChapterLog";
import ClosingLog from "@/components/sections/about/b/ClosingLog";

// About · B — the instrument.
//
// The history read as the run log of a system that has been up for eight years.
// One ground for the whole page — `bg-ink`, end to end — because an instrument
// does not change colour halfway through a reading. What changes instead is the
// unit of composition, which is what separates B from A: A alternates
// paragraphs, B alternates APPARATUS. A dashboard, a machine held to the
// viewport, a log, and a panel of open questions.
//
// ── The order, and why the machine comes before the log ───────────────────
//
// The obvious order is the chronological one: read the chapters, then show what
// they built. It is the wrong way round here. The eight entries are long, and a
// reader who meets them cold has no object to attach them to — which is exactly
// the failure this variant was written against, since that is what eight
// screens of prose already are in variant A. Putting the four-act machine first
// means the log is annotation on something the reader has already watched
// change, and every entry lands on a stratum they have seen appear.
//
// The refrain stays last in all three variants. It is the only structural thing
// the three share, and it should be: the questions only work as a refrain if
// they arrive after the eight chapters that answer them.
export default function AboutBView() {
  return (
    <main className="flex flex-col bg-ink">
      <LogHero />
      <StateSequence />
      <ChapterLog />
      <ClosingLog />
    </main>
  );
}
