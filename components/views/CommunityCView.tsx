import RallyHero from "@/components/sections/community/c/RallyHero";
import RallyLegion from "@/components/sections/community/c/RallyLegion";
import RallyPlaces from "@/components/sections/community/c/RallyPlaces";
import RallyEvents from "@/components/sections/community/c/RallyEvents";
import RallyChannels from "@/components/sections/community/c/RallyChannels";
import RallyDoors from "@/components/sections/community/c/RallyDoors";
import RallyFaq from "@/components/sections/community/c/RallyFaq";
import RallyClose from "@/components/sections/community/c/RallyClose";
import { SAMPLE_EVENTS } from "@/components/sections/community/communityContent";
import { citiesFromEvents } from "@/components/sections/community/cityField";

// Composition of /prototype/community-c — "Stage": the community as inhabited
// ground.
//
// ── The one deliberate departure from the deck's order ────────────────────
// The Legion goes SECOND, right against the hero, with nothing between them.
// A and B both keep the deck's order (hero, figures, calendar, Legion) so that
// the treatments can be compared without a second variable; this one changes
// exactly one thing and proposes that the Legion is the page's thesis rather
// than its fourth block. What it costs is written in `RallyLegion`, and it is
// the question the variant exists to ask.
//
// ── The progression of ground ─────────────────────────────────────────────
// surface · cream · cream+surface · tint · cream · tint · WHITE · cream.
//
// The two tinted blocks are the two that hold cards, which is what `tint` is
// for — cards vanish on pure white. The white is spent once, on the FAQ, which
// is the block with the least in it: white is the page's breath and it goes
// where the eye needs to rest, not where the page wants applause.
//
// The two shader bands are the same terrain at two calibrations (`c/ground.ts`):
// the hero needs wide plateaus to set a display headline on, the map band needs
// to look surveyed. One place, seen twice.
//
// `SAMPLE_EVENTS` comes from here rather than being imported by the section: it
// is the one piece of this page that is live data, so wiring the Luma calendar
// means changing this line and `page.tsx` and nothing inside `c/`.
//
// The cities are derived here too — the map is in one section and the calendar
// in the next, and two sections reading one feed cannot be allowed to disagree
// about which places it names.
//
// The header and footer are NOT here: `app/prototype/layout.tsx` mounts both.
export default function CommunityCView() {
  const cities = citiesFromEvents(SAMPLE_EVENTS);

  return (
    <main className="flex flex-col bg-cream">
      <RallyHero />
      <RallyLegion />
      <RallyPlaces cities={cities} />
      <RallyEvents events={SAMPLE_EVENTS} />
      <RallyChannels />
      <RallyDoors />
      <RallyFaq />
      <RallyClose />
    </main>
  );
}
