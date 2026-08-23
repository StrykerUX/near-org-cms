import Link from "next/link";
import Clause from "@/components/sections/foundation/b/Clause";
import {
  ECOSYSTEM,
  ECOSYSTEM_NAMES,
} from "@/components/sections/foundation/foundationContent";

// §7 — the ecosystem, as the document's annex.
//
// Names in type and not a grid of logos: the reason is on `ECOSYSTEM_NAMES` in
// foundationContent.ts, and it holds twice over here — a wall of foreign marks
// at a dozen optical weights is the one thing that could not sit inside a filed
// document without looking pasted in.
//
// Variant A runs the same names as a marquee, because there the point is that
// the ecosystem is a population with no beginning and no end. In a document the
// same list is a schedule: enumerated, ruled, countable. Same names, same
// refusal of the logo grid, opposite claim about what a list of names IS.
//
// This is one of the two blocks whose rail carries only its label. It is not an
// oversight: the register material of an annex IS the annex, and the twelve
// numbered entries are already set as one. Repeating a count or a heading in
// the margin would be filling the rail for the sake of filling it, which is the
// other way to lose the variant.
const ENTRIES = ECOSYSTEM_NAMES.map((name, i) => ({
  name,
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

        <ul className="mt-14 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRIES.map((entry) => (
            <li
              key={entry.name}
              data-reveal
              className="flex items-baseline gap-4 border-t border-rule py-3"
            >
              <span className="text-micro-mono text-gray-intermediate">{entry.index}</span>
              <span className="text-body-sm-mono text-ink">{entry.name}</span>
            </li>
          ))}
        </ul>
      </Clause>
    </section>
  );
}
