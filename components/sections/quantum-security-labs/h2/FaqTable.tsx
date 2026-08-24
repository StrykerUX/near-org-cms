"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { FAQS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H2 · §FAQ ──────────────────────────────────────────────────────────────
// Five questions and five answers, all visible, in the same ruled table this
// proposal uses for the proof row and the comparison. Nothing to click.
//
// **The accordion is the default and it is not free here.** It costs the reader
// three things. They have to guess which of five panels holds their answer from
// a question alone. Opening one reflows everything below it, so the page moves
// under them at the exact moment they commit to reading. And a closed panel is
// invisible to Cmd-F, which is how a lot of people actually use an FAQ.
//
// It buys one thing: a shorter section. That trade is usually right — twenty
// entries have to collapse. These are five, running 30 to 60 words. Open, the
// section is about a screen and a half, which is not much more than the
// accordion's own heading plus five closed rows plus one open panel. There is
// little to buy back.
//
// **The two-column measure is what makes five open answers readable.** Question
// left, answer right at a ~62ch measure, so the eye has one fixed left edge for
// questions and another for answers. Stacked full-width they would be a wall.
//
// H3 keeps them collapsible, so the pair covers both bets.
export default function FaqTable() {
  const ref = useScrollReveal<HTMLDListElement>({ start: "top 88%", stagger: 0.07, y: 18 });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        {/* No eyebrow, for the reason the current build states: the reference
            has one reading "FAQ" directly above a heading that ends in "FAQ". */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-pretty text-h2">
            Quantum security <Accent>FAQ</Accent>
          </h2>
          <p className="uppercase text-caption-mono text-gray-intermediate">
            {FAQS.length} questions · all answers shown
          </p>
        </div>

        <dl ref={ref} className="flex flex-col divide-y divide-rule border-y border-rule">
          {FAQS.map((item) => (
            <div key={item.q} data-reveal className="grid-ds gap-y-3 py-8">
              <dt className="col-span-12 max-w-[26ch] text-pretty text-h3 lg:col-span-4">
                {item.q}
              </dt>
              <dd className="col-span-12 max-w-[62ch] text-pretty text-body text-foreground/75 lg:col-span-7 lg:col-start-6">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
