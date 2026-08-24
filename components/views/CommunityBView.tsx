import BoardHero from "@/components/sections/community/b/BoardHero";
import BoardTicker from "@/components/sections/community/b/BoardTicker";
import BoardEvents from "@/components/sections/community/b/BoardEvents";
import BoardLegion from "@/components/sections/community/b/BoardLegion";
import BoardChannels from "@/components/sections/community/b/BoardChannels";
import BoardInvolvement from "@/components/sections/community/b/BoardInvolvement";
import BoardFaq from "@/components/sections/community/b/BoardFaq";
import BoardClose from "@/components/sections/community/b/BoardClose";
import { SAMPLE_EVENTS } from "@/components/sections/community/communityContent";

// Composition of /prototype/community-b — "Board", the departures timetable.
//
// Same order as `a/` and the deck: this variant's experiment is the TEXTURE, not
// the sequence, and holding the order fixed is what makes the two comparable.
// `c/` is the one that moves the Legion.
//
// Ground: cream from top to bottom, with exactly one break. Everything is a row
// on a `bg-rule` hairline — hero CTAs, events, channels, ways in, FAQ, close —
// and `BoardLegion` is the single block that is not, on the page's one use of
// white. The whole variant rests on that: if a second section ever stops being a
// row, or the Legion becomes one, there is nothing left here that `a/` does not
// already do better.
//
// The events feed is passed from here rather than imported by the section: it is
// the one piece of live data on the page, and `BoardEvents` takes
// `readonly CommunityEvent[]`, so wiring the Luma calendar is a change to this
// line and to `page.tsx`.
//
// The header and footer are NOT here: `app/prototype/layout.tsx` mounts both.
export default function CommunityBView() {
  return (
    <main className="flex flex-col bg-cream">
      <BoardHero />
      <BoardTicker />
      <BoardEvents events={SAMPLE_EVENTS} />
      <BoardLegion />
      <BoardChannels />
      <BoardInvolvement />
      <BoardFaq />
      <BoardClose />
    </main>
  );
}
