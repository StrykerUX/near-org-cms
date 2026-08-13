"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// Section 3. Three properties, stated once. Same shape as LiveToday on the
// quantum page — deliberately, so the two pages share a rhythm — but the rule
// above each point is the shard divider rather than a plain hairline.

const POINTS = [
  {
    title: "Scalable sharding",
    body: "More shards, more throughput, no change for the developer.",
  },
  {
    title: "Confidential execution",
    body: "A private shard runs confidential transactions at the protocol layer.",
  },
  {
    title: "Quantum-safe accounts",
    body: "Post-quantum signing, live on mainnet, rotated in a single transaction.",
  },
] as const;

export default function AiScale() {
  const gridRef = useScrollReveal<HTMLDivElement>({
    build: ({ tl, q }) => {
      q("[data-reveal]").forEach((card, i) => {
        const at = 0.3 + i * 0.4;
        const rule = card.querySelector("[data-rule]");
        if (rule) tl.from(rule, { scaleX: 0, duration: 0.5, ease: "power2.out" }, at);
        tl.from(
          card.querySelectorAll("[data-copy]"),
          { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.07 },
          at + 0.1
        );
      });
    },
  });

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-[72px] py-36">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
          <h2 className="text-h2 text-pretty">
            Built for AI scale
            <br />
            <Accent>from day one</Accent>
          </h2>
          <p className="max-w-[34rem] text-body-lg text-ink-soft text-pretty lg:pt-3">
            A machine-speed economy needs three properties at once. NEAR ships all three
            today.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-6 md:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} data-reveal className="relative flex flex-col gap-3 pt-6">
              <span
                data-rule
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left bg-foreground"
              />
              <h3 data-copy className="text-h4">
                {p.title}
              </h3>
              <p data-copy className="text-body text-ink-soft text-pretty">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
