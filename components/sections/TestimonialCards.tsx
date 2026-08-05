"use client";

import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

const QUOTES = [
  {
    quote:
      "An underrated launch. Everyone loves NEAR AI for the privacy story, but the real story is confidential inference at scale — actually, verifiably fast.",
    name: "Matt Murray",
    role: "CTO, Venice",
    variant: "dark",
  },
  {
    quote:
      "NEAR AI feels like the underlying computer we've needed for AI usage as staking. It's the missing piece for agents that hold real value.",
    name: "—",
    role: "CEO, abound",
    variant: "light",
  },
] as const;

export default function TestimonialCards() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-background text-foreground">
      <Container className="pb-20">
        <div ref={rootRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {QUOTES.map((q) => (
            <blockquote
              key={q.name}
              data-reveal
              className={`flex flex-col justify-between gap-8 rounded-xl p-8 ${
                q.variant === "dark"
                  ? "bg-secondary text-secondary-foreground"
                  : "border border-border bg-card text-card-foreground"
              }`}
            >
              <p className="text-body-lg text-pretty">“{q.quote}”</p>
              <footer className="flex flex-col gap-0.5">
                <span className="text-body-sm font-medium">{q.name}</span>
                <span
                  className={`text-caption ${
                    q.variant === "dark"
                      ? "text-secondary-foreground/60"
                      : "text-muted-foreground"
                  }`}
                >
                  {q.role}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
