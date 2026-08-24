import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Accent from "@/components/primitives/Accent";
import Surface from "@/components/sections/shells/stage/Surface";
import { HERO, GROUND } from "@/components/sections/ecosystem/ecosystemContent";

// The opening, on the shared contour ground.
//
// The headline sits low, on the shallow end of the ramp: the terrain lifts
// toward the top of the screen (`tilt`), so the foot of the frame is where the
// plateaus are widest and there is no value edge for the type to fall off.
export default function EcosystemHero() {
  return (
    <Surface
      palette={GROUND.palette}
      bands={GROUND.bands}
      scale={GROUND.scale}
      tilt={GROUND.tilt}
      className="flex min-h-svh items-end pb-[12svh] pt-[calc(var(--site-header-block)+8svh)]"
    >
      <Container>
        <Eyebrow className="text-ink-soft">{HERO.eyebrow}</Eyebrow>
        <div className="mt-8 grid-ds items-end gap-y-10">
          <h1 className="col-span-12 max-w-[13ch] text-display text-ink text-balance lg:col-span-7">
            Built by an <Accent display>ecosystem</Accent>, not a company
          </h1>
          <p className="col-span-12 max-w-[42ch] text-body-lg text-ink-soft text-pretty lg:col-span-4 lg:col-start-9">
            {HERO.body}
          </p>
        </div>
      </Container>
    </Surface>
  );
}
