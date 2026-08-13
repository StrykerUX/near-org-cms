"use client";

import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";
import CtaPill from "@/components/sections/quantum/CtaPill";

// Section 10. Three points plus a code sample.
//
// The sample is styled by hand rather than run through a highlighter. Lawrence
// asked for real syntax highlighting, and that is the right long-term call —
// but it means a build-time dependency (Shiki), and adding one for a single
// twelve-line block belongs in its own change rather than buried here. The
// markup below is already token-per-span, so swapping in a highlighter later
// is a replacement, not a rewrite.

const POINTS = [
  { title: "Rust or JS", body: "A WebAssembly runtime for smart contracts." },
  { title: "Gasless UX", body: "Meta-transactions cover gas on behalf of your users." },
  { title: "Earn as they run", body: "30% of burned gas returns to the contract's developer." },
] as const;

// ds-exempt: source code is not prose — the DS scale does not govern it
const CODE: Array<Array<[string, string]>> = [
  [["import", "kw"], [" { NearBindgen, view } ", "t"], ["from", "kw"], [" 'near-sdk-js'", "s"], [";", "t"]],
  [],
  [["@NearBindgen", "at"], ["({})", "t"]],
  [["class", "kw"], [" SmartContract", "ty"], [" {", "t"]],
  [["  greeting", "p"], [": ", "t"], ["String", "ty"], [" = ", "t"], ['"Hello NEAR"', "s"], [";", "t"]],
  [],
  [["  @view", "at"], ["({})", "t"]],
  [["  get_greeting", "fn"], ["(): ", "t"], ["String", "ty"], [" {", "t"]],
  [["    return", "kw"], [" this", "p"], [".greeting;", "t"]],
  [["  }", "t"]],
  [["}", "t"]],
];

const TOKEN: Record<string, string> = {
  kw: "text-[color:var(--cta-mint)]",
  s: "text-[color:var(--cta-lime)]",
  ty: "text-cream",
  at: "text-[color:var(--near-green-accent)]",
  fn: "text-cream",
  p: "text-cream/80",
  t: "text-cream/55",
};

export default function DeveloperBlock() {
  const gridRef = useScrollReveal<HTMLDivElement>({ y: 22, stagger: 0.1 });

  return (
    <section className="bg-background text-foreground">
      <Container className="grid items-center gap-16 py-36 lg:grid-cols-2 lg:gap-24">
        <div ref={gridRef} className="flex flex-col gap-8">
          <h2 data-reveal className="text-h2 text-pretty">
            A blockchain
            <br />
            <Accent>for developers</Accent>
          </h2>
          <div className="flex flex-col gap-6">
            {POINTS.map((p) => (
              <div key={p.title} data-reveal className="flex flex-col gap-1.5">
                <h3 className="text-h4">{p.title}</h3>
                <p className="max-w-[38ch] text-body text-ink-soft text-pretty">{p.body}</p>
              </div>
            ))}
          </div>
          <div data-reveal>
            <CtaPill href="https://docs.near.org" tone="filled" external>
              Start building
            </CtaPill>
          </div>
        </div>

        {/* The editor. Dark against the white section so it reads as a
            different surface — a thing you look INTO rather than another
            block of page. */}
        <div className="overflow-hidden rounded-3xl bg-ink-slate p-7 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.45)]">
          <div className="mb-5 flex gap-2" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-cream/20" />
            <span className="size-2.5 rounded-full bg-cream/20" />
            <span className="size-2.5 rounded-full bg-[color:var(--near-green-accent)]/70" />
          </div>
          {/* ds-exempt: code, sized in its own monospace rhythm */}
          <pre className="overflow-x-auto font-mono text-caption leading-[1.85]">
            <code>
              {CODE.map((line, i) => (
                <span key={i} className="block">
                  {line.length === 0 ? " " : line.map(([text, kind], j) => (
                    <span key={j} className={TOKEN[kind]}>
                      {text}
                    </span>
                  ))}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </Container>
    </section>
  );
}
