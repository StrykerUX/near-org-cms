"use client";

import Accordion from "@/components/primitives/Accordion";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { FAQ } from "@/components/sections/community/communityContent";

// §7 of the Hub — the FAQ, on the shared `Accordion` primitive.
//
// Vertical and not the horizontal orientation the primitive also offers: seven
// items in horizontal columns gives each question a ~4ch sliver with its title
// set on its side, which is a display device for three or four items and
// illegible for seven.
//
// Two things about the primitive that are worth knowing before editing this:
//
//  - Its rules are `gray-800`, not the page's `bg-rule` hairline. Darker than
//    the rest of this layout, and left alone on purpose: the primitive is shared
//    with other pages and reskinning it from here is not on the table, while
//    forking a private copy to change one border colour is how a repo ends up
//    with four divergent accordions. Read as a heavier ledger rule at the foot
//    of the page, it is defensible; if it ever stops being, the fix is a `tone`
//    prop on the primitive, not a copy in this folder.
//  - `items` is a mutable array and `FAQ.items` is a readonly tuple (`as const`
//    in the content module), so it has to be spread. That is the content
//    module's contract working as intended, not a workaround.
//
// The section is a client component because the accordion it hosts owns state.
export default function HubFaq() {
  return (
    <section className="bg-cream pb-[14svh] pt-[14svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <Eyebrow className="text-gray-intermediate">{FAQ.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-[12ch] text-h1 text-pretty">{FAQ.headline}</h2>
          </div>

          {/* The answers sit in the right two thirds so the column of questions
              stays at a reading measure instead of running the full 1780px. */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Accordion items={[...FAQ.items]} />
          </div>
        </div>
      </Container>
    </section>
  );
}
