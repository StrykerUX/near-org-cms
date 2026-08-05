"use client";

import Eyebrow from "@/components/primitives/Eyebrow";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// Evolución en cards de los 3 FEATURES que hoy viven como filas en
// components/views/PrototypeLandingView.tsx:11-27 — mismo copy, presentación
// nueva (cards en vez de filas con borde punteado).
const FEATURES = [
  {
    title: "Assets",
    tag: null,
    description:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
  },
  {
    title: "Intelligence",
    tag: "Updated",
    description:
      "Private inference and a secure agent harness for enterprises and power users who want real sovereignty over their AI.",
  },
  {
    title: "Alpha",
    tag: null,
    description:
      "In the agent economy, the traces you leave are the real asset. On NEAR, the value you create returns to you.",
  },
];

export default function FeatureCards() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-10 py-20">
        <h2 className="text-h2 font-medium text-pretty">
          Next gen
          <br />
          <Accent>self custody</Accent>
        </h2>

        <div ref={rootRef} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              data-reveal
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <Eyebrow className="text-muted-foreground">Own your</Eyebrow>
                {feature.tag && (
                  <span className="rounded-full bg-near-green px-2.5 py-0.5 text-caption font-medium text-black">
                    {feature.tag}
                  </span>
                )}
              </div>
              <div className="aspect-square w-full rounded-lg bg-muted" />
              <h3 className="text-h4 font-medium text-pretty">{feature.title}</h3>
              <p className="text-body-sm text-muted-foreground text-pretty">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
