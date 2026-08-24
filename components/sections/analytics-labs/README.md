# `analytics-labs` — three proposals for `/analytics`

**A laboratory.** It feeds four comparison routes (`/prototype/analytics` plus
`/a`, `/b`, `/c`) and **no real page imports it**. If a proposal wins, it gets
COPIED to `components/sections/analytics/` and this folder is deleted — the rule
from the [parent README](../README.md), which exists because two files claiming
to be the same component drift apart without anyone noticing.

The general contract in the parent README applies in full. This documents only
what is specific here.

> **Language note.** Everything in this folder is in **English**, the same as
> [`../quantum`](../quantum/README.md) and [`../chain`](../chain/README.md).
> Parts of the repo are still in Spanish; converting them is a separate,
> reviewable change.

---

## The brief, and what was honoured

The copy comes from the deck *"NEAR Analytics — Page Layout & Copy"* and lives
**complete and unedited** in [`analyticsContent.ts`](./analyticsContent.ts). One
file for all three proposals, and none of them modifies it: the only thing being
compared is the composition.

The order the deck fixes is honoured — hero → figures → revenue + status →
tools → products — along with the fifteen exits, Allium excluded as the deck
asks. The numbers are placeholders and each is marked `placeholder: true`.

**The three departures from the deck, and why:**

| Deck | What the proposals do |
|---|---|
| "Keep top 3 stats, if it feels crowded" | A mounts all five; B and C promote three and drop price and shards to a footer. The reason is NOT crowding — it is that they are not the same kind of number (see below). |
| Tools as a grid of cards | None of the three does that. A makes them a table, B groups them by task, C makes them a directory. |
| Disclaimer "under the sub" | All three place it before the product list. "This is not advice" has to be read before choosing, not after. |

---

## The axis that separates the three

**How much space the page spends per datum.** Everything else follows from
that; these are not three independent decisions per proposal.

| | **A · Ledger** | **B · Signal** | **C · Editorial** |
|---|---|---|---|
| Register | Printed document | Monitored instrument | A page that gets read |
| Density | High | Medium | Low |
| §1 and §2 | Two bands | **A single screen** | Two bands |
| Figures | All 5, in a table | 3 + ambient strip | 3 full-width + footer |
| Container | 1px frame, square corner | Card with radius, light/dark | **None** — rules and air |
| §5 tools | Index table | Three groups by task | Directory at `h2` |
| Audience seam | The one dark panel | **Full-bleed band** | Change of scale (the SVRN sentence) |
| Motion | None | The status dot only | Reveals across three sections |
| Own JS | **Zero** | Zero | Two ScrollTrigger scenes |

### The three problems all of them had to solve

**1. The page is a router, not a destination.** Its declared job is to make
people leave: fifteen outbound links (8 tools + 5 products + 2 dashboards).
Fifteen cards is a link farm. A answers with two identical tables — the reader
learns the pattern once. B answers with three task-labelled groups — it answers
"which one do I go to?" rather than "what is out there?". C answers with a
directory in large type, which argues coverage before a single blurb is read.

**2. Two audiences on one page.** Whoever came for the ETPs did not come for
Dune. The deck places them back to back with no separator. A changes the ground
once (the SVRN panel is the only dark thing). B breaks out of the Container (the
page's only full-bleed band). C changes scale (the SVRN sentence at
`text-statement`).

**3. Liveness has to be honest.** The repo already has the rule written down in
[`chain/ProofBand`](../chain/ProofBand.tsx): nothing is animated to imply
telemetry that does not exist. It is worse here, because this data WILL be live
one day and at that point nobody could tell real motion from decorative motion.
None of the three mounts a count-up. All three print the cut-off time. B allows
itself a pulse on the status dot, and the distinction is argued in
[`b/LiveDot.tsx`](./b/LiveDot.tsx): a counter animates the **datum**, the dot
animates the **state**.

### Why price and shards get demoted in B and C

Not because they crowd. Because they are not the same class of number:

- **Fees, confidential TVL and intents volume are cumulative** — they measure
  what the network did, and they only go down if something breaks. A large
  number there is a claim.
- **Price and shards are ambient** — price is the most-watched number and the
  one that says least about the network (it moves for reasons that are not
  NEAR), and "6 / 6 shards" is a boolean dressed as a figure: the only
  interesting thing about it is the day it stops saying 6/6.

Setting all five at the same size asserts they weigh the same. A accepts that
cost because its register is the table, where every row counts equally by
definition; B and C do not.

---

## The assembly page

[`/prototype/analytics/mix`](../../../app/prototype/analytics/mix) mounts ONE
composition built out of sections taken from A, B and C. It is not a fourth
position on the density axis; it is where the decision gets made section by
section once the three have been looked at.

The whole mix lives in `components/views/AnalyticsMixView.tsx`, which lists
every slot with its alternatives as commented imports — swapping a section is a
one-line change. Four things it documents, repeated here because they are easy
to trip over:

- **`b/Hero` already contains §2.** Selecting it means the §2 slot stays empty,
  or the same figures appear twice.
- **Not every §2 covers all five figures.** `a/CoreStats` does; `c/CoreStats`
  promotes three and footnotes price and shards.
- **Grounds do not match automatically.** A is cream, B opens white, C
  alternates cream/white/ink. Seams are composition work after each swap.
- **No new sections go in the mix view.** If the mix needs something none of the
  three has, it gets built in `analytics-labs/mix/` — never by editing A, B or
  C, which have to stay comparable.

---

## The charts

[`analyticsArt.ts`](./analyticsArt.ts) holds the **geometry** and nothing else —
no JSX, no GSAP. Each proposal draws its own SVG. Sharing the computation and
not the component is deliberate: a common `<Sparkline />` would make all three
look alike and the comparison would stop measuring design.

Three things in that file are load-bearing:

- **Everything rounds to 4 decimals** (`round4`). Same reason as
  [`chain/chainDiagram.ts`](../chain/chainDiagram.ts): the spec does not require
  `Math.sin`/`Math.cos` to be correctly rounded, Node and the browser disagree
  in the last ulp, and React throws away the whole client tree over a `d=` that
  does not match.
- **The uptime strip is deterministic and clustered.** `Math.random()` during
  render breaks hydration; and the deficit is concentrated in one or two days
  rather than spread as an invisible 0.02 per bar, because real outages cluster
  and a visually perfect strip is a useless strip.
- **The sparkline scales against the series' extremes, not against zero.** That
  exaggerates the variation, and it is only acceptable because the number is
  written out next to it: the chart says "it has been going up", never the
  magnitude.

C's hero background is **the same series as the revenue card**, resampled. It is
not a texture: it is the only possible ornament that is also true. Edit
`REVENUE_SERIES` and both change.

---

## Reused, not copied

`CtaPill` and `ArrowCircle` come from [`../quantum`](../quantum/README.md), as
`chain` and `protocol` already do. Both hover mechanisms live in
`app/globals.css` (`[data-q-cta]`, `[data-q-arrow]`), so a copy here would be a
second thing to keep in step with that rule.

**No file in this lab touches `app/globals.css`.** That is exactly why
`LiveDot`'s pulse uses Tailwind's `animate-ping`: this repo is worked across
several worktrees over one `.git`, and `globals.css` is the most expensive file
to merge.

## Logos

**There are none, and the initial squares are declared placeholders.** The repo
holds none of these thirteen brands as an asset (`public/logos` has exactly one
from this family). The precedent is already set in
[`chain/ProofBand`](../chain/ProofBand.tsx): names in the house typeface beat
foreign logos at thirteen different optical weights.

Where the square does appear — A and B, on the ETPs — there is a concrete
reason: an ETP is chosen by its **issuer**, so there the logo is the row's
primary information and its absence shows. Across the eight tools the primary
information is what you will find, and eight placeholder holes would shout
"something is missing" in the one section that has to read straight through. If
real ones arrive, they enter as a column to the left of the name without
touching anything else.

## What is missing before one of these can be the real page

1. **Wire the data.** Every value is marked `placeholder: true`; the compiler
   points at exactly what to replace. The real route's `page.tsx` does the fetch
   (`lib/queries/*`) and passes flat props to the view — no section and no view
   asks for data, per the parent README's contract.
2. **Pick the status panel's dynamic headline.** The deck gives two (`titleOk` /
   `titleIssue`); both are in the content and no composition decides between
   them.
3. **The real 60 days of uptime**, which `uptimeBars` currently synthesises from
   the percentage.
4. **Logos**, if they can be licensed.
