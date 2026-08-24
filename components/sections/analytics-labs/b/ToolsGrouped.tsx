import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { TOOLS, TOOLS_HEADER } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal B · §5 ────────────────────────────────────────────────────────
// The same eight platforms, grouped by JOB instead of listed flat. It is B's
// central bet and it deserves the full argument.
//
// **The question the reader brings here is not "what platforms exist?" but
// "which one do I go to?".** A flat grid of eight answers the first and leaves
// the second entirely to the reader: to choose, they have to read all eight
// blurbs and build the taxonomy themselves, in their head, every time. And
// eight one-line blurbs written by eight different companies cannot be compared
// against each other — "Blockchain data" and "Blockchain data for finance" are
// literally two of them.
//
// Three task-labelled groups do that work once, on the page's side. The reader
// reads three labels, discards two, and looks at two or four cards. The taxonomy
// is an editorial decision — of this composition, not of the content — which is
// why it lives here and not in `analyticsContent.ts`: the other two proposals
// mount the same list ungrouped.
//
// **The cost, stated plainly:** some of these platforms do more than one thing
// (Token Terminal has market metrics, Artemis has onchain data), so every
// assignment is a simplification. It is accepted because the group says what a
// platform is FOR, not what it contains; and because a reader who picks the
// wrong group loses one click, while a reader facing eight flat cards loses half
// a minute every time.
//
// **No logos, for the same reason as in A**: the repo holds none of these brands
// as an asset, and eight placeholder squares shout "something is missing" in
// precisely the section that has to read straight through. The domain does the
// work of identifying the destination.

const GROUPS = [
  {
    id: "activity",
    label: "Onchain activity",
    // The label names the domain; this line names the QUESTION. It is what turns
    // the group into a decision shortcut rather than a drawer.
    forWhat: "What is actually happening on the network — transactions, flows, TVL, contracts.",
    ids: ["dune", "defillama", "pikespeak", "token-terminal"],
  },
  {
    id: "research",
    label: "Institutional research",
    forWhat: "Coverage written for desks and allocators, with methodology attached.",
    ids: ["the-tie", "blockworks"],
  },
  {
    id: "markets",
    label: "Markets & price",
    forWhat: "The traded asset — quotes, market structure, investment metrics.",
    ids: ["artemis", "yahoo-finance"],
  },
] as const;

const byId = new Map(TOOLS.map((t) => [t.id, t]));

export default function ToolsGrouped() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid-ds gap-y-6">
          <h2 className="col-span-12 text-h2 lg:col-span-4">{TOOLS_HEADER.title}</h2>
          <p className="col-span-12 max-w-[46ch] text-pretty text-body-lg text-ink-soft lg:col-span-6 lg:col-start-6">
            {TOOLS_HEADER.lead}
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-14">
          {GROUPS.map((g) => (
            <div key={g.id} className="grid-ds gap-y-6">
              {/* The group label sits to the left and NOT above the cards: that
                  way all three card columns start on the same vertical and the
                  groups compare in one sweep. A label on top of each block
                  pushes them to different heights. */}
              <div className="col-span-12 flex flex-col gap-3 lg:col-span-3">
                <h3 className="uppercase text-eyebrow-mono text-ink">{g.label}</h3>
                <p className="max-w-[32ch] text-pretty text-body-sm text-gray-intermediate">
                  {g.forWhat}
                </p>
              </div>

              <ul className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 lg:col-start-5">
                {g.ids.map((id) => {
                  const t = byId.get(id);
                  if (!t) return null;
                  return (
                    <li key={t.id}>
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-q-arrow-host
                        className="flex h-full flex-col gap-3 rounded-2xl border border-rule bg-white p-6 transition-colors hover:border-green-ink"
                      >
                        <span className="flex items-start justify-between gap-4">
                          <span className="text-h4">{t.name}</span>
                          <ArrowCircle />
                        </span>
                        <span className="text-body-sm text-ink-soft">{t.blurb}</span>
                        <span className="mt-auto pt-2 text-caption-mono text-gray-intermediate">
                          {t.domain}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
