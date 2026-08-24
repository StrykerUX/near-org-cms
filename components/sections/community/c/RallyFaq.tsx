"use client";

import Accordion from "@/components/primitives/Accordion";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { FAQ } from "@/components/sections/community/communityContent";

// §7 of the Rally — the FAQ, kept quiet.
//
// This variant put its weight at the top: the Legion is the second thing on the
// page and the opening runs for a screen and a half. The bottom of the page has
// to stay out of the way of that, so the FAQ gets a single narrow column and no
// display type — a reader who has a question finds it, and a reader who does not
// scrolls past it in one gesture.
//
// Narrower than `a/`'s and centred, which is the only reason it looks different:
// the mechanism is the same shared `Accordion`, vertical orientation. Its rules
// are `gray-800` rather than the page's `bg-rule`; that is noted in `a/HubFaq`
// along with why reskinning the primitive from a page folder is not the move.
//
// `items` is a mutable array and `FAQ.items` is a readonly tuple, hence the
// spread. Client component because the accordion owns state.
export default function RallyFaq() {
  return (
    <section className="bg-cream pb-[12svh] pt-[12svh]">
      <Container>
        <div className="mx-auto max-w-[52rem]">
          <Eyebrow className="text-gray-intermediate">{FAQ.eyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-[14ch] text-h2 text-pretty">{FAQ.headline}</h2>
          <div className="mt-12">
            <Accordion items={[...FAQ.items]} />
          </div>
        </div>
      </Container>
    </section>
  );
}
