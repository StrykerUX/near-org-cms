"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/primitives/ArrowCircle";

// Doc sections 11, 12 and 13 — the AI layer, NEAR One, and the two ways to
// participate. Three short blocks that each said one thing; run consecutively
// at full width they would have been three near-identical slabs, so they are
// one stretch with an internal hierarchy instead.
//
// This is the design-led reordering the brief allows for: the content is
// unchanged, the running order is unchanged, only the grouping differs.

const WAYS = [
  { title: "Validators", body: "Run a node or chunk validator and help safeguard the protocol." },
  {
    title: "NEAR Enhancement Proposals",
    body: "Weigh in on the protocol's specifications and standards.",
  },
] as const;

export default function EcosystemStretch() {
  const ref = useScrollReveal<HTMLDivElement>({ y: 24, stagger: 0.1 });

  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-24 py-36">
        <div ref={ref} className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <div data-reveal className="flex flex-col gap-5">
            <h2 className="text-h2 text-pretty">
              A new operating
              <br />
              <Accent>layer for AI</Accent>
            </h2>
            <p className="max-w-[42ch] text-body-lg text-ink-soft text-pretty">
              Confidential compute in Trusted Execution Environments, low-latency finality,
              and resharding that scales with agent demand.
            </p>
            <a
              href="https://www.near.ai/"
              target="_blank"
              rel="noopener noreferrer"
              data-q-arrow-host
              className="mt-2 flex w-fit items-center gap-3 text-label"
            >
              <ArrowCircle />
              Explore NEAR AI
            </a>
          </div>

          <div data-reveal className="flex flex-col gap-5 lg:pt-4">
            <h2 className="text-h3 text-pretty">NEAR One</h2>
            <p className="max-w-[42ch] text-body text-ink-soft text-pretty">
              The engineering team building NEAR Protocol. NEAR One develops the core
              technology, drives research on architecture and scaling, and delivers the
              sharding roadmap that takes NEAR to billions of users.
            </p>
            <a
              href="https://nearone.org"
              target="_blank"
              rel="noopener noreferrer"
              data-q-arrow-host
              className="mt-2 flex w-fit items-center gap-3 text-label"
            >
              <ArrowCircle />
              Learn more
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="text-h2 text-pretty">
            Secure NEAR. <Accent>Evolve NEAR.</Accent>
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {WAYS.map((w) => (
              <div key={w.title} className="flex flex-col gap-2.5 border-t border-rule pt-6">
                <h3 className="text-h4">{w.title}</h3>
                <p className="text-body text-ink-soft text-pretty">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
