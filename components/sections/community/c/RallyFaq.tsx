"use client";

import Accordion from "@/components/primitives/Accordion";
import StageSection from "@/components/sections/shells/stage/Section";
import { FAQ } from "@/components/sections/community/communityContent";

// §7 of the stage — the FAQ, on the page's one white ground.
//
// ── The white is spent here, and it is spent on nothing ───────────────────
// The armature's `white` tone is the page's breath and a page should spend it
// once. It is tempting to give it to a block with cards or a picture in it; that
// is exactly backwards. Cards disappear on pure white (see the note on `--cream`
// in globals.css) and a photograph on white is a photograph on any other ground.
// What white does is give the eye somewhere to rest, so it goes to the block
// with the least in it — seven lines of type near the foot of a page that has
// been loud since the first screen.
//
// ── The shared `Accordion`, unchanged ─────────────────────────────────────
// Vertical and not the horizontal orientation the primitive also offers: seven
// items in horizontal columns gives each question a ~4ch sliver with its title
// on its side, which is a display device for three or four and illegible for
// seven.
//
// Its rules are `gray-800` rather than the page's `bg-rule` hairline. Darker
// than the rest of this layout and left alone on purpose: reskinning a shared
// primitive from one caller is not on the table, and forking a private copy to
// change one border colour is how a repo ends up with four divergent accordions.
// On white it reads as a heavier ledger rule at the foot of the page, which is
// defensible; if it ever stops being, the fix is a `tone` prop on the primitive.
//
// `items` is a mutable array and `FAQ.items` is a readonly tuple (`as const` in
// the content module), so it has to be spread. That is the content module's
// contract working, not a workaround.
//
// No graphic here. A list of answers is where a drawing would be filler, and the
// objective was never one figure per section.
export default function RallyFaq() {
  return (
    <StageSection tone="white" eyebrow={FAQ.eyebrow} title={FAQ.headline}>
      <div className="grid-ds">
        {/* The answers sit in the right two thirds so the column of questions
            stays at a reading measure instead of running the full 1780px. */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <Accordion items={[...FAQ.items]} />
        </div>
      </div>
    </StageSection>
  );
}
