import NetHero from "@/components/sections/community/b/NetHero";
import NetState from "@/components/sections/community/b/NetState";
import NetSchedule from "@/components/sections/community/b/NetSchedule";
import NetLegion from "@/components/sections/community/b/NetLegion";
import NetChannels from "@/components/sections/community/b/NetChannels";
import NetDoors from "@/components/sections/community/b/NetDoors";
import NetFaq from "@/components/sections/community/b/NetFaq";
import NetClose from "@/components/sections/community/b/NetClose";
import { SAMPLE_EVENTS } from "@/components/sections/community/communityContent";
import { citiesFromEvents } from "@/components/sections/community/cityField";

// Composition of /prototype/community-b — "Instrument": the community as a
// network that is already running.
//
// The order is the deck's, unchanged from A: hero, figures, events, the Legion,
// channels, ways in, questions, close. That is deliberate — B and A differ in
// the UNIT of composition and in nothing else, so any difference the client sees
// between them is attributable to the treatment. C is the variant that moves
// things.
//
// ── One dark page, one attribute ──────────────────────────────────────────
// `data-nav-dark` lives here rather than on each section. The site header reads
// every `[data-nav-dark]` in the document and builds one ScrollTrigger per
// match; eight sections of a page that is ink from top to bottom would be eight
// triggers answering the same question. One on `main` covers the whole page and
// is torn down with it.
//
// ── The rhythm: panel, panel, no panel, panel ─────────────────────────────
// Every section here is a bordered object inset from the page — except the
// Legion, which has no walls and runs to both edges of the viewport. That is the
// page's one emphasis and it works because it is the only one, exactly the way
// A's single ink band works on cream. A second unpanelled section costs this one
// its whole effect.
//
// `SAMPLE_EVENTS` is passed from here rather than imported by the section: it is
// the one piece of this page that is live data, so wiring the Luma calendar
// means changing this line and `page.tsx` and nothing inside `b/`.
//
// The cities are derived here too, because the field lives in the state panel
// and the schedule lives in the next section — two sections reading one feed
// cannot be allowed to disagree about which places it names.
//
// The header and footer are NOT here: `app/prototype/layout.tsx` mounts both.
export default function CommunityBView() {
  const cities = citiesFromEvents(SAMPLE_EVENTS);

  return (
    <main data-nav-dark className="flex flex-col bg-ink">
      <NetHero />
      <NetState cities={cities} />
      <NetSchedule events={SAMPLE_EVENTS} />
      <NetLegion />
      <NetChannels />
      <NetDoors />
      <NetFaq />
      <NetClose />
    </main>
  );
}
