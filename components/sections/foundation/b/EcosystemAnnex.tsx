import Link from "next/link";
import Clause from "@/components/sections/foundation/b/Clause";
import EcosystemMark from "@/components/sections/foundation/EcosystemMark";
import {
  ECOSYSTEM,
  ECOSYSTEM_MARKS,
} from "@/components/sections/foundation/foundationContent";

// §7 — the ecosystem, as the document's annex.
//
// Variant A runs the same twelve marks as a marquee, because there the point is
// that the ecosystem is a population with no beginning and no end. In a
// document the same twelve are a schedule: enumerated, ruled, countable. Same
// marks, opposite claim about what a list of them IS.
//
// The annex used to be twelve names set in mono, because a logo grid would have
// been five real marks beside seven blanks. It is a grid now for the reason
// given on `ECOSYSTEM_MARKS`: a reserved cell states what belongs in it, so
// half-served is a legible state and not an unfinished one. In this variant
// that lands better than in the other two — a schedule with entries still to be
// filed is what a schedule normally looks like.
//
// The number stays OUTSIDE the cell and the name stays inside it. The number
// belongs to the document (it is the annex's count, and it is what the register
// numbers everywhere else on the page); the name belongs to the asset, and once
// the asset lands its own wordmark carries it. Setting both outside would print
// every name twice for as long as the cells are reserved.
//
// The entries are not revealed. A reserved cell that fades in is a hole for as
// long as the stagger has not reached it, which is the one thing a declared gap
// must not be — the long version is on `EcosystemMark`.
//
// This is one of the two blocks whose rail carries only its label. It is not an
// oversight: the register material of an annex IS the annex, and it is already
// set as one. Repeating a count or a heading in the margin would be filling the
// rail for the sake of filling it, which is the other way to lose the variant.
const ENTRIES = ECOSYSTEM_MARKS.map((mark, i) => ({
  mark,
  index: String(i + 1).padStart(2, "0"),
}));

export default function EcosystemAnnex() {
  return (
    <section className="bg-cream">
      <Clause label={ECOSYSTEM.eyebrow}>
        <h2 data-reveal className="max-w-[16ch] text-h2 text-balance">
          {ECOSYSTEM.headline}
        </h2>

        <p data-reveal className="mt-8 max-w-[62ch] text-body text-ink-soft text-pretty">
          {ECOSYSTEM.body}
        </p>

        <p data-reveal className="mt-6">
          <Link
            href={ECOSYSTEM.href}
            className="text-label-lg text-green-ink underline-offset-4 hover:underline focus-visible:underline"
          >
            {ECOSYSTEM.linkLabel}
          </Link>
        </p>

        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRIES.map((entry) => (
            <li key={entry.mark.id} className="border-t border-rule pt-4">
              <p className="text-micro-mono text-gray-intermediate">{entry.index}</p>
              <div className="mt-4">
                <EcosystemMark mark={entry.mark} />
              </div>
            </li>
          ))}
        </ul>
      </Clause>
    </section>
  );
}
