import { Play } from "lucide-react";
import CompanyGrid from "./CompanyGrid";
import ProductStage from "./ProductStage";
import CustomerStory from "./CustomerStory";
import Accent from "./primitives/Accent";
import Button from "./primitives/Button";
import Eyebrow from "./primitives/Eyebrow";
import Container from "./primitives/Container";

function StatCallout({ value, label }: { value: string; label: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-display italic text-display leading-none">{value}</span>
      <span className="font-sans text-h3 font-medium">{label}</span>
    </p>
  );
}

const FEATURES = [
  {
    title: "Own your Assets",
    description:
      "Move cross-chain, trade perps, hold RWAs, stay confidential, and access all of DeFi from your own wallet.",
  },
  {
    title: "Own your Intelligence",
    description:
      "Private inference and a secure agent harness for enterprises and power users who want real sovereignty over their AI.",
  },
  {
    title: "Own your Alpha",
    description:
      "In the agent economy, the traces you leave are the real asset. On NEAR, the value you create returns to you.",
  },
];

export default function PrototypePage() {
  return (
    <main className="flex flex-col">
      {/* 1. Nav + Hero */}
      <section className="relative flex min-h-[90vh] flex-col bg-muted pt-6 pb-16">
        <Container as="nav" className="flex items-center justify-between rounded-full bg-secondary px-2 py-2 pl-6 text-secondary-foreground">
          <span className="font-sans text-h4 font-medium lowercase">near</span>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-eyebrow uppercase text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              Founders
            </a>
            <a href="#" className="text-eyebrow uppercase text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              Developers
            </a>
            <a href="#" className="text-eyebrow uppercase text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              Tech stack
            </a>
          </div>
          <Button href="#">Get started</Button>
        </Container>

        <Container className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-display font-medium text-foreground text-pretty">
            Own your
            <br />
            <Accent display>world</Accent>
          </h1>
        </Container>
      </section>

      {/* 2. Stats + companies grid */}
      <section className="flex h-[820px] flex-col overflow-hidden bg-secondary text-secondary-foreground">
        <Container className="grid flex-1 min-h-0 grid-cols-1 grid-rows-[1fr] gap-36 lg:grid-cols-[45fr_55fr]">
          <div className="flex flex-col justify-center gap-6 py-20">
            <StatCallout value="100%" label="uptime" />
            <div className="flex flex-col gap-3">
              <Eyebrow className="text-secondary-foreground/50">
                5+ years on mainnet
              </Eyebrow>
              <p className="text-body-lg text-secondary-foreground/90 text-pretty">
                While other chains fork, fail, or fall behind, NEAR runs
                quietly at enterprise scale. Zero downtime. Sub-second
                finality. This is performance you can build on.
              </p>
            </div>
            <p className="text-caption text-secondary-foreground/50">
              Companies growing on NEAR
            </p>
          </div>

          <CompanyGrid />
        </Container>
      </section>

      {/* 3. Vision / video split */}
      <section className="bg-muted py-20">
        <Container className="grid grid-cols-1 lg:grid-cols-[60fr_40fr]">
          <div className="aspect-video border border-border bg-background lg:aspect-auto lg:min-h-[420px]" />
          <div className="flex flex-col justify-between gap-10 bg-secondary px-6 py-10 text-secondary-foreground sm:px-10 sm:py-14">
            <div className="flex flex-col gap-4">
              <Eyebrow className="text-secondary-foreground/50">Vision</Eyebrow>
              <h2 className="text-h2 font-medium text-pretty">
                A look inside the
                <br />
                <Accent>Ecosystem</Accent>
              </h2>
              <p className="text-body-sm text-secondary-foreground/70 max-w-sm text-pretty">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <Button href="#" icon={<Play className="size-3.5" fill="currentColor" />}>
              Watch
            </Button>
          </div>
        </Container>
      </section>

      {/* 4. Sovereignty feature list */}
      <section>
        <Container className="grid grid-cols-1 items-start gap-10 py-20 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-3">
            <Eyebrow>With NEAR you get</Eyebrow>
            <h2 className="text-h2 font-medium text-foreground text-pretty">
              Sovereignty,
              <br />
              <Accent>end to end.</Accent>
            </h2>
          </div>

          <div className="flex flex-col pt-28">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="grid grid-cols-[15rem_1fr_auto] items-center gap-6 border-t-2 border-dotted border-border py-8 last:border-b-2"
              >
                <h3 className="text-h4 font-medium text-foreground text-pretty">
                  {feature.title}
                </h3>
                <p className="text-body-sm text-muted-foreground text-pretty">
                  {feature.description}
                </p>
                <div className="size-10 shrink-0 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Product stage: center fixed, sides transition on scroll */}
      <ProductStage />

      {/* 6. Customer story + logo strip */}
      <CustomerStory />
    </main>
  );
}
