"use client";

import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import { BEYOND_ACCOUNTS_CARDS as CARDS } from "@/components/sections/quantum-security-copy/quantumContent";

// "Wallets, cross-chain, and research" — the three surfaces beyond the account
// itself, as image cards.

export default function BeyondAccounts() {
  // The ref goes on the grid, not the section: useScrollReveal uses its own
  // scope as the trigger, and the section starts a full py-40 higher.
  const gridRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-[72px] py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <Eyebrow className="text-ink-soft">Beyond accounts</Eyebrow>
            <h2 className="text-h2 text-pretty">
              Wallets, cross-chain,
              <br />
              <Accent>and research</Accent>
            </h2>
          </div>
          <p className="text-body-lg text-ink-soft text-pretty lg:pt-10">
            Account-level protection is the first step. NEAR is also extending quantum
            safety across the surfaces that hold and move assets.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              data-reveal
              className="flex flex-col rounded-3xl bg-white p-2.5"
            >
              {/* The plate behind the art is --ink, the same token the artwork
                  itself was rendered against, so the PNG's background and the
                  card's inner panel are exactly the same value and the seam
                  disappears. Two separate literals would show an edge. */}
              <div className="overflow-hidden rounded-[1.15rem] bg-ink">
                <Image
                  src={card.src}
                  alt=""
                  width={1200}
                  height={750}
                  // sizes matters here: these are 4000px-wide source renders,
                  // and without it Next serves the full-width candidate for a
                  // slot that is never wider than a third of the container.
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="aspect-[8/5] w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-3 px-4.5 py-7">
                <h3 className="text-h4">{card.title}</h3>
                <p className="text-body text-foreground/75 text-pretty">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
