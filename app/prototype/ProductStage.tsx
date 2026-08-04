import Image from "next/image";
import Accent from "./primitives/Accent";
import Container from "./primitives/Container";

export default function ProductStage() {
  return (
    <section className="bg-background text-foreground">
      <Container className="flex flex-col gap-16 py-20">
        <h2 className="text-h2 font-medium text-center text-pretty">
          The NEAR
          <br />
          <Accent>Stack</Accent>
        </h2>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
          <p className="flex items-start gap-2">
            <span className="text-caption text-muted-foreground">01.</span>
            <span className="text-body-lg font-medium text-pretty">near.com</span>
          </p>

          <div className="relative mx-auto aspect-[563/463] w-72 sm:w-96">
            <Image src="/near-stack.svg" alt="" fill className="object-contain" />
          </div>

          <p className="text-body-sm text-muted-foreground max-w-xs text-pretty">
            Trade across 35+ chains and 150+ assets from one account. Toggle on
            Confidential Mode to execute inside a private shard. No manual gas
            juggling or bridging required. Powered by NEAR Intents.
          </p>
        </div>
      </Container>
    </section>
  );
}
