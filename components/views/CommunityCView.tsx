import RallyHero from "@/components/sections/community/c/RallyHero";
import RallyLegion from "@/components/sections/community/c/RallyLegion";
import RallyCities from "@/components/sections/community/c/RallyCities";
import RallyEvents from "@/components/sections/community/c/RallyEvents";
import RallyChannels from "@/components/sections/community/c/RallyChannels";
import RallyInvolvement from "@/components/sections/community/c/RallyInvolvement";
import RallyFaq from "@/components/sections/community/c/RallyFaq";
import RallyClose from "@/components/sections/community/c/RallyClose";
import { SAMPLE_EVENTS } from "@/components/sections/community/communityContent";
import { citiesFromEvents } from "@/components/sections/community/cityField";

// Composition of /prototype/community-c — "Rally", the people-first reading.
//
// ── The one deviation from the deck, and it is the whole variant ───────────
// The Legion is SECOND, not fourth. `a/` and `b/` keep the deck's order and
// experiment with treatment; this one keeps the treatment plain and moves the
// block. The argument is in `RallyLegion`, including what the move costs.
//
// Everything else follows from that. The opening runs long — hero and Legion
// share one uninterrupted field of cream with no rule or band between them — so
// the bottom of the page is deliberately quiet: a narrow FAQ and a close at `h1`
// rather than `text-statement`. Weight at the top, and nothing downstream
// competing with it.
//
// Ground: cream, cream, INK, cream, WHITE, cream, cream, cream. The ink band is
// `RallyCities` and it is doing structural work rather than decorative — it is
// what ENDS the opening, which otherwise runs straight into the events table.
// The white is the channels, which is where this variant spends its one lift,
// because unlike `a/` it has no dark Legion to spend it on.
//
// The cities are derived here and not in the section: the field, the strip and
// the events table then cannot disagree about which cities the calendar has.
// The dedupe lives in `citiesFromEvents` so all three layouts mean the same
// thing by "the cities on the calendar".
//
// The header and footer are NOT here: `app/prototype/layout.tsx` mounts both.
export default function CommunityCView() {
  const cities = citiesFromEvents(SAMPLE_EVENTS);

  return (
    <main className="flex flex-col bg-cream">
      <RallyHero />
      <RallyLegion />
      <RallyCities cities={cities} />
      <RallyEvents events={SAMPLE_EVENTS} />
      <RallyChannels />
      <RallyInvolvement />
      <RallyFaq />
      <RallyClose />
    </main>
  );
}
