import Clause from "@/components/sections/foundation/b/Clause";
import { OPERATIONS } from "@/components/sections/foundation/foundationContent";

// §6 — the mandate, and the second place this variant numbers something.
//
// The numbers restart at 01 here rather than continuing from the pillars, and
// that is deliberate: this section has a head of its own (the rail label plus
// the h2), so the three below it read as its sub-clauses, the way 2.1/2.2/2.3
// do. Continuing the count from the pillars would imply the six items belong to
// one list, and they do not — three are standings, three are duties.
//
// This is also the only numbering on the page that is a genuine mandate: the
// content module says the pillars' order is an argument, but these three are
// what the treasury is actually spent on.
export default function OperationsClauses() {
  return (
    <section className="bg-cream">
      <Clause label={OPERATIONS.eyebrow}>
        <h2 data-reveal className="max-w-[18ch] text-h2 text-balance">
          {OPERATIONS.headline}
        </h2>
        <p data-reveal className="mt-8 max-w-[62ch] text-body text-ink-soft text-pretty">
          {OPERATIONS.intro}
        </p>
      </Clause>

      {OPERATIONS.activities.map((activity) => (
        <Clause key={activity.id} clause={activity.index}>
          <div data-reveal className="grid-ds gap-y-4">
            <h3 className="col-span-12 max-w-[16ch] text-h3 lg:col-span-4 text-pretty">
              {activity.title}
            </h3>
            <p className="col-span-12 max-w-[58ch] text-body text-ink-soft lg:col-span-7 lg:col-start-6 text-pretty">
              {activity.body}
            </p>
          </div>
        </Clause>
      ))}
    </section>
  );
}
