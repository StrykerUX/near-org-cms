"use client";

import Accent from "@/components/primitives/Accent";
import Button from "@/components/primitives/Button";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

export default function ClosingCta() {
  const rootRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="bg-stone text-foreground">
      <Container className="py-24 text-center">
        <div ref={rootRef} className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h2 data-reveal className="text-h1 font-medium text-pretty">
            NEAR
            <br />
            <Accent display>belongs to you.</Accent>
          </h2>
          <p data-reveal className="text-body-lg text-muted-foreground text-pretty">
            Get the latest product launches, ecosystem milestones, and updates
            straight to your inbox.
          </p>
          <div data-reveal className="flex flex-wrap items-center justify-center gap-3">
            <Button href="#" variant="dark">
              Read the docs
            </Button>
            <Button href="#" variant="brand">
              Get started
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
