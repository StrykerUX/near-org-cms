import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { HERO, STATUS } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal A · §1 ────────────────────────────────────────────────────────
// A's register is the DOCUMENT: a printed statement of account. Everything that
// follows comes out of that decision and not out of a visual preference.
//
// **Why a document.** The brief asks for "precise, understated" and names
// allocators and press inside the audience. That reader consumes figures in
// tabular form every day, and what earns their trust is not a handsome chart
// but typographic restraint: label, rule, figure, source. A dashboard tells
// them "I am selling you something"; a table tells them "here it is".
//
// **The AS OF block beside the headline** exists because this page has a
// concrete credibility problem: it claims to be "a live view" and its numbers
// come from an API. A document without a cut-off date is not a document.
// Putting it at the top — rather than in a footer — is what turns the rest of
// the screen into a dated reading instead of a vague promise of liveness.
//
// **The tick strip at the foot** is the vector motif of the whole proposal: an
// axis with marks, drawn once here and repeated as the divider between
// sections. It makes "by the numbers" literal without illustrating anything,
// and it is the only ornament A allows itself.
//
// Server component throughout. A animates NOTHING, and that is also the thesis:
// a document does not present itself, it is simply there. See the folder README.

// 48 marks, every twelfth one longer. Deterministic and trivial — it does not
// go through `analyticsArt`, which exists for geometry that can actually be got
// wrong.
const TICKS = Array.from({ length: 49 }, (_, i) => i);

export function AxisRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative w-full ${className}`}>
      <div className="h-px w-full bg-rule" />
      <div className="flex w-full justify-between">
        {TICKS.map((i) => (
          <span
            key={i}
            className={`w-px bg-rule ${i % 12 === 0 ? "h-2.5" : "h-1"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="bg-cream pt-[calc(var(--site-header-block)+5rem)]">
      <Container>
        <div className="grid-ds gap-y-10">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
            <p className="uppercase text-eyebrow-mono text-gray-intermediate">
              Analytics
            </p>
            <h1 className="text-balance text-h1">
              NEAR by the <Accent display>numbers</Accent>
            </h1>
            <p className="max-w-[54ch] text-pretty text-body-lg text-ink-soft">
              {HERO.lead}
            </p>

            {/* The status link belongs here and not in a footer: it is the one
                claim in the hero the reader may want to VERIFY before reading
                on, and it goes down to the health card, not out to a third
                party. */}
            <a
              href={HERO.statusHref}
              className="group flex w-fit items-center gap-2.5 border border-rule px-4 py-2 text-label"
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-green-ink"
              />
              {HERO.statusLabel}
              <span aria-hidden="true" className="text-gray-intermediate">
                ↓
              </span>
            </a>
          </div>

          {/* ── The document's masthead ──────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <div className="border border-rule">
              <p className="border-b border-rule px-5 py-3 uppercase text-eyebrow-mono text-gray-intermediate">
                As of
              </p>
              <dl className="flex flex-col">
                <Row term="Snapshot" value={STATUS.updatedLabel.replace("Last updated ", "")} />
                <Row term="Network" value="mainnet" />
                <Row term="Sources" value="9 external" />
                {/* Declared on the face of the document rather than in a code
                    comment: this page will be reviewed on screen, and whoever
                    looks at it has to know the figures are not data yet. */}
                <Row term="Figures" value="placeholder" muted />
              </dl>
            </div>
          </div>
        </div>

        <AxisRule className="mt-16" />
      </Container>
    </section>
  );
}

function Row({
  term,
  value,
  muted = false,
}: {
  term: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule px-5 py-3 last:border-b-0">
      <dt className="text-caption-mono text-gray-intermediate">{term}</dt>
      <dd
        className={`text-caption-mono ${muted ? "text-gray-intermediate" : "text-ink"}`}
      >
        {value}
      </dd>
    </div>
  );
}
