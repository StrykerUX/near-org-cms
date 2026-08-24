"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { BEYOND_STAGES } from "@/components/sections/quantum-security-labs/labContent";
import { BEYOND_ACCOUNTS_CARDS as CARDS } from "@/components/sections/quantum-security-copy/quantumContent";

// ── H2 · §Beyond accounts ──────────────────────────────────────────────────
// The same three surfaces, moved off the white card grid and onto the house
// staircase: hairline over each column, columns stepped down, image and copy in
// the open.
//
// **Why the cards go.** A white rounded card on cream says "three items of the
// same kind, pick one" — the shape of a product listing. These three are not
// pickable and they are not the same kind: a partnership with wallet vendors, a
// team shipping cross-chain signatures, and unshipped research. Their bodies run
// 20, 40 and 30 words, so two of the three cards carry visible dead space and
// the grid quietly asserts a parity the copy contradicts.
//
// The staircase says the opposite and says it with the same device the rest of
// the site already uses (`WhyItMatters` on both chain proposals): three related
// things, read left to right, not level with each other.
//
// **The maturity label is what fixes the parity properly.** The three really
// are at different stages, the page says so in its own roadmap a few sections
// later, and a reader meeting them as three equal cards has no way to tell that
// research is not shipping. The labels are read off `ROADMAP_STAGES` — this is
// the page agreeing with itself, not a new claim. See `labContent.ts`.
//
// The image keeps the `--ink` plate behind it: that is the token the artwork was
// rendered against, so the PNG's own background and the plate are exactly the
// same value and the seam disappears. Two separate literals would show an edge.
const STEP = ["lg:mt-0", "lg:mt-14", "lg:mt-28"] as const;

export default function BeyondSteps() {
  const ref = useScrollReveal<HTMLDivElement>({ start: "top 88%" });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container className="flex flex-col gap-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-ink-soft">Beyond accounts</Eyebrow>
            <h2 className="text-pretty text-h2">
              Wallets, cross-chain,
              <br />
              <Accent>and research</Accent>
            </h2>
          </div>
          <p className="max-w-[52ch] text-pretty text-body-lg text-ink-soft lg:pt-2">
            Account-level protection is the first step. NEAR is also extending quantum safety
            across the surfaces that hold and move assets.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {CARDS.map((card, i) => (
            <article key={card.title} data-reveal className={`flex flex-col gap-5 ${STEP[i]}`}>
              <div className="h-px w-full bg-rule" aria-hidden="true" />
              <span className="uppercase text-caption-mono text-green-ink">
                {BEYOND_STAGES[i]}
              </span>
              <div className="overflow-hidden rounded-2xl bg-ink">
                <Image
                  src={card.src}
                  alt=""
                  width={1200}
                  height={750}
                  // `sizes` matters: these are 4000px-wide source renders, and
                  // without it Next serves the full-width candidate for a slot
                  // never wider than a third of the container.
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="aspect-[8/5] w-full object-cover"
                />
              </div>
              <h3 className="text-pretty text-h3">{card.title}</h3>
              <p className="text-pretty text-body text-foreground/75">{card.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
