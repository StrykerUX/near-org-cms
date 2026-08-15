import Link from "next/link";
import { Play } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Button from "@/components/primitives/Button";
import Eyebrow from "@/components/primitives/Eyebrow";
import Container from "@/components/primitives/Container";
import Meta from "@/components/primitives/Meta";

const REFERENCE = [
  { name: "Accent", file: "components/primitives/Accent.tsx", props: "display?, children" },
  { name: "Button", file: "components/primitives/Button.tsx", props: "href?, variant?, icon?, className?" },
  { name: "Eyebrow", file: "components/primitives/Eyebrow.tsx", props: "className?, children" },
  { name: "Container", file: "components/primitives/Container.tsx", props: "as?, width?, className?, children" },
];

export default function ComponentsShowcaseView() {
  return (
    <main className="mx-auto flex w-full max-w-[1780px] flex-col gap-24 px-[60px] pt-[calc(var(--site-header-block)+4rem)] pb-16">
      <Link
        href="/prototype"
        className="text-body-sm text-muted-foreground hover:text-foreground transition-colors text-pretty"
      >
        ← Prototype
      </Link>

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <Eyebrow>Design system · Components</Eyebrow>
        <h1 className="text-display font-medium text-foreground text-pretty">
          Building <Accent display>blocks</Accent>
        </h1>
        <p className="text-body-lg text-foreground max-w-2xl text-pretty">
          Four primitives, each pulled out because it repeated 3+ times
          verbatim across the prototype — not because atomic design says so.
          Extract on repetition, not in anticipation.
        </p>
      </section>

      {/* Accent */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">Accent</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The Montreal + Kepler mix, as its own component instead of a
          hand-copied <code className="font-mono text-body-sm">{"<span>"}</code>{" "}
          every time. <code className="font-mono text-body-sm">display</code>{" "}
          switches between the{" "}
          <code className="font-mono text-body-sm">font-serif</code> (H2–H4)
          and <code className="font-mono text-body-sm">font-display</code>{" "}
          (Display/H1) optical size.
        </p>
        <div className="flex flex-col gap-4">
          <p className="text-h2 font-medium">
            A new chapter for <Accent>the open web</Accent>
          </p>
          <p className="text-display font-medium">
            Own your <Accent display>world</Accent>
          </p>
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="font-mono">{`<Accent display>world</Accent>   // font-display, Display/H1
<Accent>the open web</Accent>    // font-serif, H2–H4`}</code>
        </pre>
        <Meta>Accent · components/primitives/Accent.tsx · display?: boolean</Meta>
      </section>

      {/* Button */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">Button</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          A rounded pill, always.{" "}
          <code className="font-mono text-body-sm">variant=&quot;light&quot;</code>{" "}
          for use on a dark section,{" "}
          <code className="font-mono text-body-sm">variant=&quot;dark&quot;</code>{" "}
          for use on a light one — renders an{" "}
          <code className="font-mono text-body-sm">{"<a>"}</code> when{" "}
          <code className="font-mono text-body-sm">href</code> is given, a{" "}
          <code className="font-mono text-body-sm">{"<button>"}</code>{" "}
          otherwise.
        </p>
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-secondary p-8">
          <Button href="#" variant="light">Get started</Button>
          <Button href="#" variant="light" icon={<Play className="size-3.5" fill="currentColor" />}>
            Watch
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-8">
          <Button href="#" variant="dark">Get started</Button>
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="font-mono">{`<Button href="#" variant="light">Get started</Button>
<Button href="#" variant="dark">Get started</Button>
<Button href="#" icon={<Play />}>Watch</Button>`}</code>
        </pre>
        <Meta>Button · components/primitives/Button.tsx · href?, variant?: "light"|"dark", icon?</Meta>
      </section>

      {/* Eyebrow */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">Eyebrow</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The uppercase kicker label. Enforces the type contract (
          <code className="font-mono text-body-sm">text-eyebrow uppercase</code>
          ) and lets the color come from context — it&rsquo;s the same
          component on a dark panel or a light one.
        </p>
        <div className="flex flex-col gap-4 rounded-xl bg-secondary p-8">
          <Eyebrow className="text-secondary-foreground/50">On a dark panel</Eyebrow>
        </div>
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-8">
          <Eyebrow>On a light panel (default)</Eyebrow>
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="font-mono">{`<Eyebrow>With NEAR you get</Eyebrow>
<Eyebrow className="text-secondary-foreground/50">Vision</Eyebrow>`}</code>
        </pre>
        <Meta>Eyebrow · components/primitives/Eyebrow.tsx · className? (default: text-muted-foreground)</Meta>
      </section>

      {/* Container */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">Container</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The page gutter:{" "}
          <code className="font-mono text-body-sm">max-w-[1780px]</code> +{" "}
          <code className="font-mono text-body-sm">px-[60px]</code> +{" "}
          <code className="font-mono text-body-sm">mx-auto</code>, on every
          section in the prototype.{" "}
          <code className="font-mono text-body-sm">as</code> picks the
          rendered tag (<code className="font-mono text-body-sm">div</code>{" "}
          by default,{" "}
          <code className="font-mono text-body-sm">nav</code>/
          <code className="font-mono text-body-sm">section</code> when the
          landmark matters) so the gutter never costs you semantics.{" "}
          <code className="font-mono text-body-sm">width</code> switches the
          scale: <code className="font-mono text-body-sm">&quot;site&quot;</code>{" "}
          (default, this page) or{" "}
          <code className="font-mono text-body-sm">&quot;wide&quot;</code> (the
          blog listing pages).
        </p>
        <div className="rounded-xl border border-dashed border-border bg-muted py-6">
          <Container className="rounded-md border border-dashed border-foreground/30 bg-background py-4 text-center">
            <p className="text-body-sm text-muted-foreground">
              max-w-[1780px] · px-[60px] · mx-auto
            </p>
          </Container>
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="font-mono">{`<Container className="grid grid-cols-[45fr_55fr] gap-36">...</Container>
<Container as="nav" className="flex items-center justify-between">...</Container>
<Container width="wide">...</Container>`}</code>
        </pre>
        <Meta>Container · components/primitives/Container.tsx · as?, width?: "site"|"wide" (default: "site"), className?</Meta>
      </section>

      {/* Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 font-medium">Component</th>
                <th scope="col" className="py-2 pr-4 font-medium">File</th>
                <th scope="col" className="py-2 pr-4 font-medium">Key props</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE.map((row) => (
                <tr key={row.name} className="border-b border-border">
                  <td className="py-2 pr-4">{row.name}</td>
                  <td className="py-2 pr-4 font-mono">{row.file}</td>
                  <td className="py-2 pr-4 font-mono">{row.props}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
