import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Surface from "@/components/sections/shells/stage/Surface";
import PlacesField from "@/components/sections/community/c/PlacesField";
import { GROUND, GROUND_MAP } from "@/components/sections/community/c/ground";
import { placeCities } from "@/components/sections/community/cityField";
import {
  CITIES,
  CITY_FIELD,
  STATS,
  STATS_NOTE,
} from "@/components/sections/community/communityContent";

export type RallyPlacesProps = {
  /** The calendar's cities, deduplicated in feed order. Derived by the view. */
  cities: readonly string[];
};

// §3 of the stage — the four figures, and then the ground they are about.
//
// ── The figures are set in the serif, and the labels are not ──────────────
// A sets them in the sans, as a register: head counts read as data and the mono
// label under each one marks them as such. This variant is the warm one, and it
// treats them as the page SAYING something — Kepler italic, the same voice the
// accents in the headlines are in. It is the loudest reasonable treatment of a
// number that is currently a placeholder, which is exactly why the provenance
// line underneath is not optional.
//
// ── `STATS_NOTE` is not decoration and it is not fine print ───────────────
// "4,000+ / Contributors" is unreadable as a claim: counted over what window,
// from which sources, as of when. The reader either believes it on faith or
// discounts it, and both are failures on a page whose job is to be trusted
// enough to act on. One caption answers all three questions. The bigger the
// figures are set, the more that caption is load-bearing — which is this
// variant's particular exposure.
//
// ── The map is the page's one full-bleed picture ──────────────────────────
// It runs the whole width of the viewport, on the same terrain the hero opens
// with, and it is the block that has to be legible from across the room. See
// `PlacesField` for why it is on the shader and why the lattice is denser here.
//
// The band's calibration is `GROUND_MAP`: more contour lines than the hero, less
// tilt. The hero needs plateaus to set type on; this one needs to look surveyed.
//
// ── The strip is fed by the calendar, and the note says so ────────────────
// `CITIES.note` is what keeps five cities from reading as a claim about the
// whole community: the drawing shows the calendar for the next few weeks, it
// cannot name a city the page does not list, and it grows on its own the day the
// Luma feed lands.
export default function RallyPlaces({ cities }: RallyPlacesProps) {
  const { placed, unplaced } = placeCities(cities);

  return (
    <section className="bg-cream pb-[6svh] pt-[14svh]">
      <Container>
        <Eyebrow className="text-gray-intermediate">{CITIES.eyebrow}</Eyebrow>

        <div className="mt-12 grid-ds gap-y-12">
          {STATS.map((s) => (
            <div key={s.id} className="col-span-6 border-t border-rule pt-6 lg:col-span-3">
              <p className="text-h1-serif italic text-ink">{s.value}</p>
              <p className="mt-4 text-caption-mono uppercase text-gray-intermediate">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid-ds gap-y-6">
          <p className="col-span-12 max-w-[52ch] text-caption text-gray-intermediate text-pretty lg:col-span-5">
            {STATS_NOTE}
          </p>
          <p className="col-span-12 max-w-[38ch] text-caption text-ink-soft text-pretty lg:col-span-4 lg:col-start-9">
            {CITIES.note}
          </p>
        </div>
      </Container>

      {/* ── Why this is a hand-built `<figure>` and not the `Figure` primitive
          The primitive comes in two tones, light and dark, and both are
          calibrated for a flat ground: a `--rule` hairline and a
          `gray-intermediate` caption for cream, `white/15` and `white/50` for
          ink. This drawing sits on neither. Rendered inside the band, the rule
          lands across the terrain as a stray contour and the caption drops to
          about 3:1 against the plateau.

          So the plate goes full bleed and its rule and caption stay up on the
          cream, where they are the values they were tuned for. The semantics are
          the primitive's — one `<figure>`, one `<figcaption>`, the caption not
          optional — and the day `Figure` grows a tone that can sit on a shader,
          this collapses back into it.

          The caption is the drawing's whole licence, which is why it cannot be
          dropped: a field of dots behind a handful of cities looks like a map,
          and a map implies land, borders and coverage this page is not
          claiming. */}
      <figure className="mt-16">
        <Surface
          palette={GROUND}
          bands={GROUND_MAP.bands}
          scale={GROUND_MAP.scale}
          tilt={GROUND_MAP.tilt}
          className="py-[9svh]"
        >
          {/* The inset is the minimum the labels of the outermost cities need to
              stay on screen. */}
          <div className="px-6 lg:px-16">
            <PlacesField placed={placed} />
          </div>
        </Surface>

        <Container>
          <figcaption className="mt-8 max-w-[80ch] text-caption-mono text-gray-intermediate text-pretty">
            {CITY_FIELD.caption}
          </figcaption>
          {/* A city the coordinate table cannot place is printed, never dropped:
              "Online" is in the sample feed and is not a place, and the day the
              real calendar arrives with somewhere the table has never heard of,
              the page says so instead of quietly showing one dot fewer. */}
          {unplaced.length > 0 && (
            <p className="mt-4 text-caption-mono uppercase text-gray-intermediate">
              {CITY_FIELD.unplaced}: {unplaced.join(" · ")}
            </p>
          )}
        </Container>
      </figure>
    </section>
  );
}
