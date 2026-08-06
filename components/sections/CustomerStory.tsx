import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";

const LOGOS = [
  { name: "Venice", src: "/logos/venice.png", width: 89, height: 40 },
  { name: "Abound", src: "/logos/abound.png", width: 111, height: 24 },
  { name: "Brave", src: "/logos/brave.png", width: 86, height: 24 },
  { name: "ZODL", src: "/logos/zodl.png", width: 133, height: 27 },
  { name: "Ledger", src: "/logos/ledger.png", width: 117, height: 39 },
];

export default function CustomerStory() {
  return (
    <section className="bg-cream text-foreground">
      <Container className="flex flex-col gap-14 py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow>Customer stories</Eyebrow>
            <h2 className="text-h2 text-pretty">
              NEAR AI makes
              <br />
              <Accent>Venice private.</Accent>
            </h2>
            <p className="text-body-sm text-muted-foreground line-clamp-4 max-w-md text-pretty">
              Verifiable privacy is a prerequisite for user-owned AI. Most
              prompts today run through third-party inference providers that
              can access your inputs at runtime: your financial data, medical
              questions, product ideas, business strategy, internal
              conversations. NEAR AI runs the same models inside a
              confidential shard, so the provider verifies the computation
              without ever reading it.
            </p>
            <a href="#" className="flex items-center gap-3 text-label">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                <ArrowRight className="size-4" />
              </span>
              Read the full story
            </a>
          </div>

          <div className="aspect-[8/5] w-full rounded-md border border-border bg-muted" />
        </div>

        <div className="flex flex-wrap items-center gap-x-14 gap-y-6">
          {LOGOS.map((logo) => (
            <Image
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className="h-6 w-auto grayscale opacity-40 transition-opacity hover:opacity-70"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
