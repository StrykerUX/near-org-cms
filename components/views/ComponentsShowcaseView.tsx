import Link from "next/link";
import { Play } from "lucide-react";
import Accent from "@/components/primitives/Accent";
import Button from "@/components/primitives/Button";
import Eyebrow from "@/components/primitives/Eyebrow";
import Container from "@/components/primitives/Container";
import Meta from "@/components/primitives/Meta";
import CtaPill from "@/components/primitives/CtaPill";
import ArrowCircle from "@/components/primitives/ArrowCircle";

const REFERENCE = [
  { name: "Accent", file: "components/primitives/Accent.tsx", props: "display?, children" },
  { name: "Button", file: "components/primitives/Button.tsx", props: "href?, variant?, icon?, className?" },
  { name: "Eyebrow", file: "components/primitives/Eyebrow.tsx", props: "mono?, className?, children" },
  { name: "Container", file: "components/primitives/Container.tsx", props: "as?, width?, className?, children" },
  { name: "CtaPill", file: "components/primitives/CtaPill.tsx", props: "href, tone?, size?, external?, icon?, className?" },
  { name: "ArrowCircle", file: "components/primitives/ArrowCircle.tsx", props: "tone?, className?" },
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
          Six primitives, each pulled out because it repeated across the site
          — not because atomic design says so. Extract on repetition, not in
          anticipation.
        </p>
      </section>

      {/* Accent */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">Accent</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The Montreal + Kepler mix, as its own component instead of a
          hand-copied <code className="text-body-sm-mono">{"<span>"}</code>{" "}
          every time. <code className="text-body-sm-mono">display</code>{" "}
          switches between the{" "}
          <code className="text-body-sm-mono">font-serif</code> (H2–H4)
          and <code className="text-body-sm-mono">font-display</code>{" "}
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
          <code className="text-body-sm-mono">variant=&quot;light&quot;</code>{" "}
          for use on a dark section,{" "}
          <code className="text-body-sm-mono">variant=&quot;dark&quot;</code>{" "}
          for use on a light one — renders an{" "}
          <code className="text-body-sm-mono">{"<a>"}</code> when{" "}
          <code className="text-body-sm-mono">href</code> is given, a{" "}
          <code className="text-body-sm-mono">{"<button>"}</code>{" "}
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
          <code className="text-body-sm-mono">text-eyebrow uppercase</code>
          ) and lets the color come from context — it&rsquo;s the same
          component on a dark panel or a light one.
        </p>
        <div className="flex flex-col gap-4 rounded-xl bg-secondary p-8">
          <Eyebrow className="text-secondary-foreground/50">On a dark panel</Eyebrow>
        </div>
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-8">
          <Eyebrow>On a light panel (default)</Eyebrow>
        </div>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          <code className="text-body-sm-mono">mono</code> switches the family
          without changing the role. It is not a second component: the same
          label reads as an instrument in mono and as a document in sans, and
          which voice a page uses is art direction, not structure. It was
          written by hand — <code className="text-body-sm-mono">text-eyebrow-mono
          uppercase</code> plus a colour — in about thirty places.
        </p>
        <div className="flex flex-col gap-3">
          <Eyebrow mono>Built to last</Eyebrow>
          <Eyebrow>Built to last</Eyebrow>
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="font-mono">{`<Eyebrow>With NEAR you get</Eyebrow>
<Eyebrow mono className="text-gray-intermediate">NEAR Protocol</Eyebrow>
<Eyebrow className="text-secondary-foreground/50">Vision</Eyebrow>`}</code>
        </pre>
        <Meta>Eyebrow · components/primitives/Eyebrow.tsx · mono?, className? (default: text-muted-foreground)</Meta>
      </section>

      {/* Container */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">Container</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The page gutter:{" "}
          <code className="text-body-sm-mono">max-w-[1780px]</code> +{" "}
          <code className="text-body-sm-mono">px-[60px]</code> +{" "}
          <code className="text-body-sm-mono">mx-auto</code>, on every
          section in the prototype.{" "}
          <code className="text-body-sm-mono">as</code> picks the
          rendered tag (<code className="text-body-sm-mono">div</code>{" "}
          by default,{" "}
          <code className="text-body-sm-mono">nav</code>/
          <code className="text-body-sm-mono">section</code> when the
          landmark matters) so the gutter never costs you semantics.{" "}
          <code className="text-body-sm-mono">width</code> switches the
          scale: <code className="text-body-sm-mono">&quot;site&quot;</code>{" "}
          (default, this page) or{" "}
          <code className="text-body-sm-mono">&quot;wide&quot;</code> (the
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

      {/* CtaPill */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">CtaPill</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The site&rsquo;s call to action. Lived in{" "}
          <code className="text-body-sm-mono">sections/quantum/</code> while
          eleven files across seven folders imported it — five of the six
          sections on <code className="text-body-sm-mono">/protocol</code>{" "}
          among them. A component that gets imports from outside its own page
          is a primitive in the wrong folder.
        </p>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          Five tones and two sizes. <code className="text-body-sm-mono">filled</code>{" "}
          is the default for cream and white grounds — an outlined pill there
          reads as an empty shape rather than a button.{" "}
          <code className="text-body-sm-mono">solid</code> and{" "}
          <code className="text-body-sm-mono">dark</code> are its two answers on
          ink, and <code className="text-body-sm-mono">quiet</code> is for the
          second CTA of a pair, where two full-weight outlines compete.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <CtaPill href="#" tone="filled">Start building</CtaPill>
          <CtaPill href="#" tone="light">See the roadmap</CtaPill>
          <CtaPill href="#" tone="quiet" size="sm">Read the paper</CtaPill>
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-ink p-6">
          <CtaPill href="#" tone="solid">Start building</CtaPill>
          <CtaPill href="#" tone="dark">See the roadmap</CtaPill>
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="font-mono">{`<CtaPill href="/protocol" tone="filled">Start building</CtaPill>
<CtaPill href="https://docs.near.org" tone="dark" external>Docs</CtaPill>
<CtaPill href="#roadmap" tone="quiet" size="sm">Read the paper</CtaPill>`}</code>
        </pre>
        <Meta>CtaPill · components/primitives/CtaPill.tsx · href, tone?: light|dark|quiet|filled|solid, size?: lg|sm, external?, icon?</Meta>
      </section>

      {/* ArrowCircle */}
      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium text-pretty">ArrowCircle</h2>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          The disc whose arrow hands off: one leaves to the right while a second
          enters from the left. Both are the same glyph — the effect is
          continuity, not an icon swap. Hover the ancestor marked{" "}
          <code className="text-body-sm-mono">data-q-arrow-host</code>, not the
          disc: the gesture belongs to the whole row.
        </p>
        <p className="text-body text-foreground max-w-2xl text-pretty">
          <code className="text-body-sm-mono">tone</code> exists because the
          cream variant used to be a COPIED FILE that differed in one line.
          Passing <code className="text-body-sm-mono">bg-cream</code> through{" "}
          <code className="text-body-sm-mono">className</code> does not work —
          both classes declare the same property, and which one wins is decided
          by Tailwind&rsquo;s emission order, not by the attribute.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <ArrowCircle />
          <span className="flex items-center gap-4 rounded-full bg-ink px-5 py-3">
            <ArrowCircle tone="cream" />
          </span>
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-body-sm">
          <code className="font-mono">{`<ArrowCircle />                // green — the default
<ArrowCircle tone="cream" />   // on ink grounds`}</code>
        </pre>
        <Meta>ArrowCircle · components/primitives/ArrowCircle.tsx · tone?: &quot;green&quot;|&quot;cream&quot;, className?</Meta>
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
