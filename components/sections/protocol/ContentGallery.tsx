"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";

// Section 14. Five links, so a three-up grid leaves a ragged last row. A
// two-column list reads better at this count and gives each title room to sit
// on one line, which the card shape did not.

const ITEMS = [
  {
    title: "Introducing Dynamic Resharding",
    note: "How the network adds shards automatically.",
    href: "https://near.org/blog/introducing-dynamic-resharding",
  },
  {
    title: "Preparing NEAR for the Quantum Computing Era",
    note: "The post-quantum roadmap.",
    href: "https://near.org/blog/making-near-protocol-post-quantum-safe",
  },
  {
    title: "Confidential Intents: Now Open to All",
    note: "Confidential execution, generally available.",
    href: "https://near.org/blog/announcing-general-availability-confidential-intents",
  },
  {
    title: "The Agent Economy: Who Owns the Rails AI Runs On",
    note: "The thesis behind the stack.",
    href: "https://www.near.org/blog/agent-economy",
  },
  {
    title: "NEAR Foundation Joins the x402 Foundation",
    note: "Advancing open infrastructure for the agent economy.",
    href: "https://www.near.org/blog/near-foundation-joins-x402-foundation",
  },
] as const;

export default function ContentGallery() {
  const listRef = useScrollReveal<HTMLDivElement>({ y: 18, stagger: 0.07 });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-14 py-36">
        <div className="flex flex-col gap-4">
          <h2 className="text-h2 text-pretty">
            Go deeper <Accent>on NEAR</Accent>
          </h2>
          <p className="text-body-lg text-ink-soft">
            Protocol deep dives, coverage, and more
          </p>
        </div>

        <div ref={listRef} className="grid gap-x-10 md:grid-cols-2">
          {ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              data-q-arrow-host
              className="group/row flex items-start gap-5 border-b border-rule py-7 transition-colors hover:border-foreground"
            >
              <ArrowCircle />
              <span className="flex flex-col gap-1.5">
                <span className="text-h4 text-pretty">{item.title}</span>
                <span className="text-body-sm text-gray-intermediate">{item.note}</span>
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
