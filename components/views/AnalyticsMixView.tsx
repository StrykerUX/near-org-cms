// Proposal MIX — /prototype/analytics/mix
//
// The assembly page: one composition built out of sections taken from A, B and
// C. This file is the ONLY place the mix is decided, and it is meant to be
// edited one line at a time — every slot below lists its alternatives, so
// swapping a section is a matter of changing which import is rendered.
//
// Nothing here is a new section. If the mix needs a section that does not exist
// in any of the three, it gets built in `analytics-labs/mix/` — not by editing
// A, B or C, which have to stay comparable to each other.
//
// ── What is currently mounted ─────────────────────────────────────────────
//
//   §1 hero        B · Signal      ← decided
//   §2 figures     — empty, and it has to be: B's hero contains them
//   §3+§4 cards    C · Editorial   ← decided
//   §5 tools       A · Ledger      ← decided
//   §6 products    C · Editorial, with A's ring aperture and A's ETP table
//                  ← decided
//
// **An undecided slot stays empty.** The page grows one section at a time, as
// each slot is chosen. Filling a slot with a plausible default hides the fact
// that nobody picked it, and a placeholder that looks finished is a placeholder
// nobody revisits.
//
// **§2 is empty for a different reason: because §1 is B**, not because it is
// undecided. B's hero mounts the three promoted figures and the ambient strip on
// the same screen. Adding any §2 under it prints the same numbers twice. If §1
// is ever swapped for A or C, a §2 has to come back or the page states no
// figures at all.
//
// ── Things to know before swapping ────────────────────────────────────────
//
// **B's hero already contains the figures.** `b/Hero` mounts §1 and §2 on one
// screen — three promoted figures plus the ambient strip with price and shards.
// If it is selected, the §2 slot has to stay EMPTY or the page shows the same
// numbers twice. It is the only hero of the three with that property.
//
// **Not every §2 covers all five figures.** `a/CoreStats` shows the five;
// `c/CoreStats` promotes three and drops price and shards into a footnote. Pick
// a hero that is not B together with a §2 that is not A and the page never
// states two of the brief's five figures — that may be the right call, but it
// should be a decision and not a side effect.
//
// **Grounds do not match automatically.** A runs on cream, B opens on white and
// closes on cream, C alternates cream/white/ink. Two adjacent sections on the
// same ground read as one long section, and the seam between different grounds
// is a section break. Whatever the mix ends up being, `main`'s background below
// and the seams may need one pass — that is composition work, not a bug in the
// sections.
//
// **`id="network-health"` lives inside every §3+§4.** The hero's status link
// points at it. Exactly one card pair is mounted, so the anchor resolves; if a
// slot ever mounts two, the second id has to go.
//
// **C's sections are client components and animate.** `c/Hero`, `c/CoreStats`
// and `c/ToolsMural` need `PrototypeMotionProvider`, which the route's layout
// (`app/prototype/analytics/layout.tsx`) already mounts for every page in this
// lab. A's and B's are server components.

// ── §1 · Hero ───────────────────────────────────────────────────────────────
// A · Ledger — headline + AS OF masthead + tick axis. No figures.
// import HeroA from "@/components/sections/analytics-labs/a/Hero";
// B · Signal — headline + 3 figures + ambient strip. CONTAINS §2.
import HeroB from "@/components/sections/analytics-labs/b/Hero";
// C · Editorial — full-screen, display type, revenue series as background.
// import HeroC from "@/components/sections/analytics-labs/c/Hero";

// ── §2 · Core figures ───────────────────────────────────────────────────────
// EMPTY while §1 is B — see the note at the top of the file.
// A · Ledger — all five, one table row, labels above the figures.
// import CoreStatsA from "@/components/sections/analytics-labs/a/CoreStats";
// C · Editorial — three full-width rows numbered 01–03 + ambient footnote.
// import CoreStatsC from "@/components/sections/analytics-labs/c/CoreStats";
// (B has no §2 component — its figures live inside `b/Hero`.)

// ── §3 + §4 · Revenue + network status ──────────────────────────────────────
// A · Ledger — two framed panels, square corners, small sparkline.
// import DualCardsA from "@/components/sections/analytics-labs/a/DualCards";
// B · Signal — two cards of opposite tonal value, large area chart.
// import DualCardsB from "@/components/sections/analytics-labs/b/DualCards";
// C · Editorial — no boxes, two columns split by a rule, figure at display size.
import DualCardsC from "@/components/sections/analytics-labs/c/DualCards";

// ── §5 · Third-party tools ──────────────────────────────────────────────────
// A · Ledger — eight rows, four columns, index table.
// It pulls `AxisRule` from `a/Hero`, which is a plain named export with no side
// effects — mounting the table without A's hero is fine.
import ToolsA from "@/components/sections/analytics-labs/a/ToolsIndex";
// B · Signal — three groups by task, small cards.
// import ToolsB from "@/components/sections/analytics-labs/b/ToolsGrouped";
// C · Editorial — directory, one name per line at `h2`.
// import ToolsC from "@/components/sections/analytics-labs/c/ToolsMural";

// ── §6 · Public products ────────────────────────────────────────────────────
// A · Ledger — dark SVRN panel with the ring aperture + ETP table.
// import ProductsA from "@/components/sections/analytics-labs/a/Products";
// B · Signal — full-bleed SVRN band with tick field + five ETP cards.
// import ProductsB from "@/components/sections/analytics-labs/b/Products";
// C · Editorial — the SVRN sentence at `text-statement` + five narrow columns.
import ProductsC from "@/components/sections/analytics-labs/c/Products";
// A's ring aperture, mounted into C's `figure` slot. It is imported from `a/`
// and not copied: one figure, one file. See `a/Aperture`.
import Aperture from "@/components/sections/analytics-labs/a/Aperture";
// A's ETP rows, mounted into C's `productList` slot. Named export from
// `a/Products`; the section around them — heading, lead, disclaimer, legal —
// still comes from C.
import { EtpRows } from "@/components/sections/analytics-labs/a/Products";

export default function AnalyticsMixView() {
  return (
    // The ground belongs to the mix, not to any one proposal: it is whatever the
    // first section opens on, so the area above the fold matches. White because
    // §1 is B, whose hero opens on white. Update it when the §1 slot changes.
    <main className="flex flex-col bg-white text-foreground">
      {/* §1 — carries §2 inside it */}
      <HeroB />

      {/* §2 — intentionally empty: B's hero already states the figures */}

      {/* §3 + §4 — C's pair carries `id="network-health"`, which is what the
          hero's status link points at. Exactly one pair is mounted, so the
          anchor resolves. */}
      <DualCardsC />

      {/* §5 — OPEN SEAM: C's pair and A's table are both `bg-cream`, so the two
          sections abut with nothing between them and read as one long block.
          A's own page does not have this problem — there the table follows a
          section that ends differently. Fixing it is composition work on this
          page (a ground change, a rule, or spacing), not a change to either
          section. */}
      <ToolsA />

      {/* §6 — C's section, filled from A in two places. Both are SLOTS on
          `c/Products`, so C's own page passes neither and is unchanged.

          The figure is `text-white/35` because the ground here is `--ink`: the
          same value A uses on `--ink-slate`, so both readings of it match.

          The ETP table lands on the same cream as §5's tools table, and that is
          now a rhyme rather than a collision: the reader meets the same four
          columns twice — name, descriptor, destination, arrow — which is exactly
          the economy A's own page is built on. */}
      <ProductsC
        figure={<Aperture className="text-white/35" />}
        productList={<EtpRows />}
      />
    </main>
  );
}
