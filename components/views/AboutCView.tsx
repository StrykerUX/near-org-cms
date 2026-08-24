import IndexHero from "@/components/sections/about/c/IndexHero";
import ChapterIndex from "@/components/sections/about/c/ChapterIndex";
import ChapterLedger from "@/components/sections/about/c/ChapterLedger";
import ClosingAnswer from "@/components/sections/about/c/ClosingAnswer";

// Variant C · Index — /prototype/about-c.
//
// Four sections. Header and footer come from `app/prototype/layout.tsx`.
//
// The ground order is cream → white → cream → ink, and the white one is the
// index. That is the only place on the page where the reader is looking at
// apparatus instead of history, so it is the only place the ground lifts. If
// the index is ever moved or dropped, the white goes with it rather than being
// reassigned to a prose section — a page cannot have two exhales.
//
// The three questions bracket everything: stated small beside the hero, stated
// at heading scale after the last chapter. Between the two statements sit the
// eight chapters that answer them. That bracket is this variant's signature and
// the reason its hero is short — a full-screen hero would put a screen of
// nothing between the questions and the index that leads to their answers.
export default function AboutCView() {
  return (
    <main className="flex flex-col bg-cream">
      <IndexHero />
      <ChapterIndex />
      <ChapterLedger />
      <ClosingAnswer />
    </main>
  );
}
