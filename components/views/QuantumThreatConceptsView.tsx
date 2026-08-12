import type { ReactNode } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Accent from "@/components/primitives/Accent";
import ThreatDuel from "@/components/sections/quantum/ThreatDuel";
import ThreatSequence from "@/components/sections/quantum/ThreatSequence";
import ThreatLede from "@/components/sections/quantum/ThreatLede";
import RotationStatement from "@/components/sections/quantum/RotationStatement";
import ConceptWeld from "@/components/sections/quantum/concepts/ConceptWeld";
import ConceptBill from "@/components/sections/quantum/concepts/ConceptBill";

// Comparison sandbox for §3 + §4 of the copy deck (docs/quantum-security-brief.md).
//
// The chosen direction leads, so the page opens on the thing being decided
// rather than on three alternatives to scroll past. The rejected treatments stay
// below for reference until the decision is final.
//
// It lives at a noindex prototype route for the same reason /prototype/flow-compare
// does: it is a decision aid, not a page, and it deliberately loads four variants
// of one section, which no real page should ever do.
//
// When this is settled the winner moves up to components/sections/quantum/ and
// this whole folder — concepts/ and this view — gets deleted.

function Slate({
  tag,
  title,
  thesis,
  notes,
  tone = "quiet",
}: {
  tag: string;
  title: string;
  thesis: ReactNode;
  notes: { label: string; body: string }[];
  tone?: "lead" | "quiet";
}) {
  const lead = tone === "lead";
  return (
    <div
      className={`border-t bg-background text-foreground ${
        lead ? "border-green-ink" : "border-foreground"
      }`}
    >
      <Container className="grid gap-8 py-16 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
        <div className="flex flex-col gap-3">
          <Eyebrow className={lead ? "text-green-ink" : "text-gray-blue"}>{tag}</Eyebrow>
          <h2 className="text-h3 text-pretty">{title}</h2>
        </div>
        <div className="flex flex-col gap-5">
          <p className="max-w-[62ch] text-body-lg text-ink-soft text-pretty">{thesis}</p>
          <dl className="grid gap-x-10 gap-y-2 sm:grid-cols-[auto_1fr]">
            {notes.map((n) => (
              <div key={n.label} className="contents">
                <dt className="text-eyebrow uppercase text-gray-blue">{n.label}</dt>
                <dd className="max-w-[62ch] text-body text-ink-soft text-pretty">{n.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </div>
  );
}

export default function QuantumThreatConceptsView() {
  return (
    <main className="flex flex-col bg-background">
      <Container className="flex flex-col gap-6 py-28">
        <Eyebrow className="text-gray-blue">Concept review</Eyebrow>
        <h1 className="max-w-[20ch] text-h1 text-pretty">
          The threat, and why NEAR
          <br />
          <Accent>moves first</Accent>
        </h1>
        <p className="max-w-[70ch] text-body-lg text-ink-soft text-pretty">
          §3 and §4 of the copy deck. The chosen direction is first; the treatments it
          beat are kept below until it is signed off. Scroll each in full — they are
          scroll-driven and do not read from a screenshot.
        </p>
      </Container>

      <Slate
        tone="lead"
        tag="Live on the page"
        title="One pinned composition, three beats"
        thesis="§3 and §4 held in a single locked viewport. The frame — label, rule, beat index, links, ring field — never moves; only the core changes, through the mechanism, the attack, and the answer."
        notes={[
          {
            label: "Why",
            body: "It restores the deck's own structure — two sections, both headlines intact — and makes the argument structurally rather than by assertion: the premise physically stays put while the consequence is rewritten under it.",
          },
          {
            label: "Motion",
            body: "Nothing translates vertically. Every transition is a fade or a colour change in place, so the eye never leaves the pivot word. The lede fades without rising; the swap runs through the page's own lime → teal → green ramp.",
          },
          {
            label: "Degradation",
            body: "With reduced motion or on mobile the swap disarms and the two endings stack — struck through, then the replacement. The argument survives with no scroll at all.",
          },
          {
            label: "Open",
            body: "The $470B figure is promoted out of §3's paragraph into a standalone stat. Same words, different typographic weight — but worth confirming that reads as intended, and that the Bloomberg attribution is the one to keep (the deck credits Galaxy Digital for the same figure in the FAQ).",
          },
        ]}
      />
      <ThreatSequence />

      <div className="border-t border-foreground bg-card-tint">
        <Container className="flex flex-col gap-3 py-12">
          <Eyebrow className="text-gray-blue">Superseded</Eyebrow>
          <p className="max-w-[62ch] text-body text-ink-soft text-pretty">
            Kept so the current version can be compared against what it replaced. All of
            this gets deleted along with this route once the composition above is signed
            off.
          </p>
        </Container>
      </div>

      <Slate
        tag="Previous iteration"
        title="Threat lede + statement, unpinned"
        thesis="The same two deck sections as two stacked blocks: a quiet lede, then the rewriting statement in its own sticky."
        notes={[
          {
            label: "Why it changed",
            body: "It took two screens to say what now fits in one, and the lede scrolled away before the statement resolved — so the threat and the answer were never in frame together.",
          },
        ]}
      />
      <ThreatLede />
      <RotationStatement />

      <Slate
        tag="Shipped today"
        title="Paired rows"
        thesis="Three left/right card pairs held in a scrubbed sticky scene, most chains against NEAR."
        notes={[
          {
            label: "Strength",
            body: "The left/right axis is instantly legible, and the green hinge between each pair implies the transformation without labelling it.",
          },
          {
            label: "Cost",
            body: "Both of the deck's headlines are lost to a merged one. The third pair breaks the metaphor — $470B at stake does not correspond to Live today. Six near-identical cards give the eye nowhere to land, and 180svh of scroll delivers about 120 words.",
          },
        ]}
      />
      <ThreatDuel />

      <Slate
        tag="Concept A"
        title="Welded / attached"
        thesis="Two specimens in the page's isometric language: one indivisible solid, and a plinth with a key that lifts out and is replaced."
        notes={[
          {
            label: "Strength",
            body: "Explains the mechanism rather than asserting it — you can see that one object cannot be taken apart and the other can.",
          },
          {
            label: "Cost",
            body: "Most expensive to build and maintain; the geometry is hand-placed. It also asks the reader to decode a metaphor before getting the point.",
          },
        ]}
      />
      <ConceptWeld />

      <Slate
        tag="Concept B"
        title="The bill"
        thesis="An itemised ledger of everything a migration touches, running without visible end, against a single line of shell."
        notes={[
          {
            label: "Strength",
            body: "The argument is carried by relative size, so it lands from across a room and before any reading happens. The empty space on the right is doing the work.",
          },
          {
            label: "Cost",
            body: "The ledger is invented content — plausible line items, not real data — which would need to be honest at production. It is also the loudest option and could overshadow the closing CTA.",
          },
        ]}
      />
      <ConceptBill />

      <div className="border-t border-foreground">
        <Container className="flex flex-col gap-4 py-20">
          <Eyebrow className="text-gray-blue">Next</Eyebrow>
          <p className="max-w-[62ch] text-body-lg text-ink-soft text-pretty">
            On sign-off,{" "}
            <span className="font-mono text-body">ThreatLede</span> and{" "}
            <span className="font-mono text-body">RotationStatement</span> move up into{" "}
            <span className="font-mono text-body">components/sections/quantum/</span>,
            replacing <span className="font-mono text-body">ThreatDuel</span> in{" "}
            <span className="font-mono text-body">QuantumSecurityView</span>. This route and
            the <span className="font-mono text-body">concepts/</span> folder get deleted
            with it.
          </p>
        </Container>
      </div>
    </main>
  );
}
