import HubHero from "@/components/sections/community/a/HubHero";
import HubStats from "@/components/sections/community/a/HubStats";
import HubEvents from "@/components/sections/community/a/HubEvents";
import LegionBand from "@/components/sections/community/a/LegionBand";
import HubChannels from "@/components/sections/community/a/HubChannels";
import HubInvolvement from "@/components/sections/community/a/HubInvolvement";
import HubFaq from "@/components/sections/community/a/HubFaq";
import HubClose from "@/components/sections/community/a/HubClose";
import { SAMPLE_EVENTS } from "@/components/sections/community/communityContent";
import { citiesFromEvents } from "@/components/sections/community/cityField";

// Composition of /prototype/community-a — "Hub", the canonical directory.
//
// The order is the deck's, unmodified, because this variant's job is to be the
// reference the other two are read against: `b/` keeps the order and changes the
// texture, `c/` keeps the texture and moves the Legion to the top. Change the
// order here and both comparisons lose their control.
//
// The progression of ground is what carries the emphasis: cream, cream, cream,
// INK, cream, WHITE, cream, cream. The ink band is the Legion and it is the only
// dark cut on the page — a second one costs it its whole effect (see the note in
// `LegionBand`). The white one is the routing block, the page's one lift, and it
// is where a reader who scrolled this far without clicking anything is finally
// given four explicit doors.
//
// `SAMPLE_EVENTS` is passed in from here rather than imported by the section,
// because it is the one piece of this page that is live data: the section takes
// `readonly CommunityEvent[]`, so wiring the Luma calendar means changing this
// line and `page.tsx`, and nothing inside `a/`.
//
// The cities are derived here and passed down, rather than each section
// deriving its own: the city field under the stats and the events list below it
// are then reading the same calendar by construction, and cannot disagree about
// which places it names.
//
// The header and footer are NOT here: `app/prototype/layout.tsx` mounts both.
export default function CommunityAView() {
  const cities = citiesFromEvents(SAMPLE_EVENTS);

  return (
    <main className="flex flex-col bg-cream">
      <HubHero />
      <HubStats cities={cities} />
      <HubEvents events={SAMPLE_EVENTS} />
      <LegionBand />
      <HubChannels />
      <HubInvolvement />
      <HubFaq />
      <HubClose />
    </main>
  );
}
