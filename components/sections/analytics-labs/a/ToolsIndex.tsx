import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";
import { AxisRule } from "@/components/sections/analytics-labs/a/Hero";
import { TOOLS, TOOLS_HEADER } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal A · §5 ────────────────────────────────────────────────────────
// Eight third-party platforms. An index TABLE, not a grid of cards, and this is
// the most consequential decision in the whole proposal.
//
// **This page's real problem is that it has fifteen outbound links** — eight
// here, five products, two internal dashboards. Fifteen cards is a link farm:
// each card demands its own act of reading (look at the logo, read the name,
// read the blurb, find the link) and eight acts of reading cost about thirty
// seconds. Eight ROWS with the same four columns are scanned in eight seconds,
// because the eye already knows where each field lands after the first row. A
// grid optimises for seeing one card; a table, for choosing among eight — which
// is what the reader is doing here.
//
// **The domain is a column, not an ornament.** The reader is about to LEAVE the
// site, and knowing where to before clicking is information, not decoration. It
// is also the only thing that separates "Blockworks" from "Token Terminal" for
// somebody who knows neither.
//
// **Logos are deliberately left out.** The repo holds none of these brands as an
// asset, so the honest alternative was eight placeholder squares — eight holes
// shouting "something is missing" in the one section whose job is to be read
// straight through. `chain/ProofBand` already made this same call for the same
// reason and wrote it down: names in the house typeface beat foreign logos at
// eight different optical weights. If the real ones ever arrive they come in as
// a column to the left of the name, without touching anything else.
//
// The green disc reacts to the hover of the WHOLE row (`data-q-arrow-host`), not
// its own: the click target is the row, and the arrow has to confirm that from
// the first pixel.

export default function ToolsIndex() {
  return (
    <section className="bg-cream py-24">
      <Container>
        <div className="grid-ds gap-y-6">
          <h2 className="col-span-12 text-h2 lg:col-span-5">{TOOLS_HEADER.title}</h2>
          <p className="col-span-12 max-w-[42ch] text-pretty text-body-lg text-ink-soft lg:col-span-6 lg:col-start-7">
            {TOOLS_HEADER.lead}
          </p>
        </div>

        <AxisRule className="mt-12" />

        {/* Column header — desktop only. On mobile the rows stack onto two lines
            and a header with no columns under it is a lie. */}
        <div className="hidden grid-ds py-3 lg:grid">
          <span className="col-span-4 uppercase text-micro-mono text-gray-intermediate">
            Platform
          </span>
          <span className="col-span-5 uppercase text-micro-mono text-gray-intermediate">
            What you&apos;ll find
          </span>
          <span className="col-span-2 uppercase text-micro-mono text-gray-intermediate">
            Destination
          </span>
        </div>

        <ul className="border-t border-rule">
          {TOOLS.map((t) => (
            <li key={t.id}>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                data-q-arrow-host
                className="grid-ds items-center gap-y-2 border-b border-rule py-5 transition-colors hover:bg-card-tint/60"
              >
                <span className="col-span-10 text-h4 lg:col-span-4">{t.name}</span>
                <span className="col-span-12 text-body-sm text-ink-soft lg:col-span-5">
                  {t.blurb}
                </span>
                <span className="col-span-10 text-caption-mono text-gray-intermediate lg:col-span-2">
                  {t.domain}
                </span>
                <span className="col-span-2 flex justify-end lg:col-span-1">
                  <ArrowCircle />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
