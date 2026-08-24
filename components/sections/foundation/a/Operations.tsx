"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { OPERATIONS } from "@/components/sections/foundation/foundationContent";

// §6 — the three activities.
//
// A register of rows and not a second set of columns: `Pillars` already used
// the three-column figure, and repeating it here would make the two sections
// rhyme without their content rhyming — the pillars are three standings, these
// are three things the Foundation actually spends its week on. Rows read as a
// list of duties, which is what they are.
//
// Each row hangs off the same hairline as everything else on this page. Nothing
// here is boxed.
export default function Operations() {
  const rootRef = useScrollReveal<HTMLElement>({ start: "top 78%" });

  return (
    <section ref={rootRef} className="bg-cream pb-[14svh] pt-[6svh]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div data-reveal className="col-span-12">
            <Eyebrow className="text-gray-intermediate">{OPERATIONS.eyebrow}</Eyebrow>
          </div>

          <h2 data-reveal className="col-span-12 max-w-[16ch] text-h2 lg:col-span-5 text-balance">
            {OPERATIONS.headline}
          </h2>

          <p
            data-reveal
            className="col-span-12 max-w-[56ch] text-body text-ink-soft lg:col-span-6 lg:col-start-7 lg:self-end text-pretty"
          >
            {OPERATIONS.intro}
          </p>
        </div>

        <div className="mt-[10svh]">
          {OPERATIONS.activities.map((activity) => (
            <div
              key={activity.id}
              data-reveal
              className="grid-ds gap-y-4 border-t border-rule py-9"
            >
              <p className="col-span-2 text-caption-mono text-gray-intermediate lg:col-span-1">
                {activity.index}
              </p>
              <h3 className="col-span-10 max-w-[20ch] text-h3 lg:col-span-4 text-pretty">
                {activity.title}
              </h3>
              <p className="col-span-12 max-w-[52ch] text-body text-ink-soft lg:col-span-6 lg:col-start-7 text-pretty">
                {activity.body}
              </p>
            </div>
          ))}
          <div className="h-px w-full bg-rule" aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
