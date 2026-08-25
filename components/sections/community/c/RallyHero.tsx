import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Surface from "@/components/sections/shells/stage/Surface";
import CtaPill from "@/components/primitives/CtaPill";
import { GROUND, GROUND_HERO } from "@/components/sections/community/c/ground";
import { HERO } from "@/components/sections/community/communityContent";

// §1 of the stage — the opening, on warm ground.
//
// ── The headline sits on a plateau, not across the crests ─────────────────
// That is the whole reason this armature uses a contour shader: between two
// levels there is a flat field of one colour where a display headline can land
// without a line running through it. The content is pinned to the BOTTOM of the
// surface (`items-end`) rather than centred, because the shader's tilt lifts the
// terrain toward the top of the frame — the quiet part of the picture is the
// near ground, and that is where the type goes.
//
// The calibration itself is in `./ground.ts`, shared with the map band so the
// two surfaces read as one place.
//
// ── This page routes; it does not argue ───────────────────────────────────
// Every other page in the set spends its first screen making a case. This one
// spends it pointing: the headline says who is here and the two CTAs are the two
// doors most people arrive wanting. So there is no scene and nothing to wait
// for. The surface drifts on its own and never has to finish.
//
// A server component. `Surface` owns the client boundary and the canvas is its
// sibling, never its parent — a `<canvas>` with children hides them from the
// accessibility tree, and the text in here is the page's `<h1>`.
export default function RallyHero() {
  return (
    <Surface
      palette={GROUND}
      bands={GROUND_HERO.bands}
      scale={GROUND_HERO.scale}
      tilt={GROUND_HERO.tilt}
      className="flex min-h-svh items-end pb-[12svh] pt-[calc(var(--site-header-block)+8svh)]"
    >
      <Container>
        <div className="grid-ds items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow className="text-ink-soft">{HERO.eyebrow}</Eyebrow>
            {/* The accent lands on "open web" and not on "people": the serif is
                this site's emphasis mark, and what is being built is the object
                of the sentence — the people are the subject doing it. */}
            <h1 className="mt-6 max-w-[15ch] text-display text-ink text-balance">
              The people building the <Accent display>open web</Accent>
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="max-w-[42ch] text-body-lg text-ink-soft text-pretty">{HERO.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaPill href={HERO.primary.href} tone="filled">
                {HERO.primary.label}
              </CtaPill>
              <CtaPill href={HERO.secondary.href} tone="quiet">
                {HERO.secondary.label}
              </CtaPill>
            </div>
          </div>
        </div>
      </Container>
    </Surface>
  );
}
