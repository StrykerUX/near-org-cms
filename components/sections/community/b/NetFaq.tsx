import Panel from "@/components/sections/shells/instrument/Panel";
import InstrumentSection from "@/components/sections/shells/instrument/Section";
import { FAQ, INSTRUMENT } from "@/components/sections/community/communityContent";

// §7 of the instrument — seven questions as a register that opens.
//
// ── Native `<details>` and not the shared `Accordion` ─────────────────────
// The primitive draws its rules in `gray-800`, which is tuned for the light
// pages that use it and sits between this panel's ground and its `white/12`
// hairlines — close enough to look like a mistake, far enough to be visible.
// Reskinning a shared primitive from one caller is not on the table, and forking
// a private copy to change one border colour is exactly how a repo ends up with
// four divergent accordions (the sections README documents that failure).
//
// `<details>` costs nothing to style, needs no state, and — the part that
// matters here — keeps this section a SERVER component. It also degrades to
// seven open questions with no JavaScript at all, where a state-driven
// accordion degrades to seven rows that do not respond, and the browser's own
// keyboard and screen-reader behaviour comes for free.
//
// The one thing to know: the disclosure triangle has to be removed twice —
// `marker:content-none` for the standards path and the WebKit pseudo-element for
// Safari, which still ships its own.
//
// No graphic here, on purpose. A list of answers is the one block on this page
// where a drawing would be filler, and the objective was never one figure per
// section.
export default function NetFaq() {
  return (
    <InstrumentSection eyebrow={FAQ.eyebrow} title={FAQ.headline}>
      <Panel label={INSTRUMENT.faq.label} meta={INSTRUMENT.faq.meta} tone="slate">
        <div className="px-5 pb-10 pt-16 lg:px-9 lg:pb-14 lg:pt-20">
          {FAQ.items.map((item) => (
            <details key={item.id} className="group border-t border-white/12">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-near-green-accent [&::-webkit-details-marker]:hidden">
                <span className="max-w-[46ch] text-h4 text-pretty">{item.title}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-label text-white/40 group-open:text-near-green-accent"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="max-w-[62ch] pb-7 text-body text-white/65 text-pretty">
                {item.body}
              </p>
            </details>
          ))}
        </div>
      </Panel>
    </InstrumentSection>
  );
}
