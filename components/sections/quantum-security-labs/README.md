# `quantum-security-labs` — two body proposals for `/quantum-security`

**A laboratory.** It feeds `/prototype/quantum-security-h2` and `-h3`, and **no
real page imports it**. If a version wins, its sections get COPIED into the page
that receives them and this folder goes — the rule from the
[parent README](../README.md), which exists because two files claiming to be the
same component drift apart without anyone noticing.

The general contract in the parent README applies in full.

---

## Where the design comes from

**Nowhere new.** Both proposals are assembled out of devices that already exist
on this site, and the axis between them is which of the two live chain
proposals' temperament they take.

| Device | Where it already lives |
|---|---|
| Compact ruled block (`divide-y divide-rule border-y border-rule`) | `chain-ab-propuesta-a/Proof` |
| Editorial list, no rules, `value — gloss` on one baseline | `chain-ab-propuesta-b/Proof` |
| Three-column staircase (`lg:mt-0 / lg:mt-14 / lg:mt-28`) with a hairline over each | `WhyItMatters`, both chain proposals |
| Sticky accumulating scene (`enableScene` + `trackTimeline`, never `pin: true`) | `chain-ab-propuesta-{a,b}/StickyScrollCapabilities` |
| Uneven two-column split `minmax(0,0.9fr) minmax(0,1.1fr)` | `chain-ab-propuesta-b/Proof` |
| `--ink` statement card at `--text-manifesto` | `homepage-update/AgentEconomy` |
| `Eyebrow` → `text-h2` with an `<Accent>` second line | every section on all three pages |
| Mono small caps in `--gray-intermediate` for labels | all of the above |
| `py-20 lg:py-28` section rhythm | both chain proposals |

The previous attempt at this lab invented its own vocabulary — bordered spec
panels, tab pills, a terminal window — and was rejected on exactly that ground.
None of it survives.

## What is being compared, and what is not

**Not compared — settled, untouched:**

| | |
|---|---|
| The hero | `quantum-security-heroes/HeroH2` and `HeroH3` |
| `Roadmap` | still `quantum-security-copy/Roadmap` on both pages |
| `InTheNews` | still `quantum-security-copy/InTheNews` on both pages |
| **The copy** | `quantum-security-copy/quantumContent.ts`, one file, unedited |

The two settled sections are also the design brief for the rest: `Roadmap` is a
rail with dots and big status labels that light as they pass the viewport
centre, `InTheNews` is three tone cards with a quote mark and an arrow-circle
link. Both proposals are built to arrive at those two without a change of
register.

## The axis

| | **H2 · Ruled** (`propuesta-a` temperament) | **H3 · Editorial** (`propuesta-b` temperament) |
|---|---|---|
| Separation | Hairlines. Everything is a ruled block | `gap`. Almost nothing is ruled |
| Grid | Even columns, ratios used rhetorically | Uneven splits, copy vs. figure |
| The argument | Laid out; revealed once | Pinned; scrubbed |
| Dark ground | One full-bleed band (`One rotation ahead`) | Two statement cards (thesis, close) |
| Beyond accounts | The `WhyItMatters` staircase | The horizontal accordion |
| FAQ | All five open, ruled two-column | Collapsible, full width, `h3` questions |

### Section by section

| Deck section | H2 | H3 |
|---|---|---|
| Proof strip | `ProofRow` — six facts in the ruled block | `ProofList` — six `fact — gloss` lines, no rules |
| Problem + Solution | `ThreatAnswer` — one section split by a vertical rule, one figure crossing it | `ThreatScene` — pinned, two beats, the figure accumulates |
| Content block | `OnlyNearLine` — `text-statement` between two rules | `OnlyNearCard` — `--text-manifesto` on an ink card |
| What's live today | `LiveToday` — staircase of three + scheme rules | `LiveToday` — uneven split, editorial list + scheme rules |
| One rotation ahead | `RotationAhead` — ink band, a key crossing a rail on scrub | `RotationAhead` — cream, a lattice lighting across on scrub |
| Beyond accounts | `BeyondSteps` — staircase with images | **`BeyondAccountsAccordion`**, imported as-is |
| Competitive contrast | `ComparisonTable` — ruled, 4 cols vs 7 | `ComparisonPairs` — stacked pairs, no rules |
| FAQ | `FaqTable` — all open | `FaqAccordion` — collapsible |
| Closing CTA | `ClosingBand` — ruled, left-aligned, finished arc | `ClosingCard` — ink card, finished arc |

### The five problems both had to solve

**1. The marquee.** A moving band of facts signals decoration, so a reader who
has just met the hero waits for it to finish and it never does. Both stop it;
they disagree about whether the six facts get rules or space.

**2. The deck's framing paragraph is missing from the build.**
`[Problem + Solution Overall]` says the threat and the answer are one thought,
and the current page has no line saying so. Both proposals carry it — H2 as the
section's lede, H3 as the one constant element inside the pinned frame. It lives
in [`labContent.ts`](./labContent.ts), verbatim, marked as restored deck copy.
`quantumContent.ts` is not edited by either.

**3. The comparison table's pairing.** Four rows of 15–20 words in two columns
that never align, with nothing carrying the eye across, so the reader loses
which claim pairs with which answer. H2 makes the columns visibly uneven (4 vs
7) so the eye stops treating them as a matched grid; H3 stacks each pair so the
pairing is the reading order. The uneven split is also the honest one — the
deck's framing is that the alternatives are *narrower*, and an even table argues
against its own copy.

**4. Three surfaces presented as equals.** `[Beyond accounts]` gives wallets,
cross-chain and research as three cards of the same weight, while the roadmap
two sections later places them at three different stages. Both proposals label
the maturity, read off `ROADMAP_STAGES` — the page agreeing with itself, not a
new claim.

**5. The video break carries no argument.** ~2MB of scrubbed mp4 showing a
growing quantum field, on a page whose claim is that the structure already
shipped. Both keep the gesture (the reader's scroll drives it) and replace the
subject: H2 draws the crossing, H3 draws the ground that is already there.

## The figures

[`quantumArt.ts`](./quantumArt.ts) holds **geometry only** — no JSX, no GSAP.
Each proposal draws its own SVG from it, so the two cannot end up drawing
different rotations while claiming to draw the same one.

- **Everything rounds to 4 decimals** (`round4`). Same reason as
  [`chain/chainDiagram.ts`](../chain/chainDiagram.ts): the spec does not require
  `Math.sin`/`Math.cos` to be correctly rounded, Node and the browser disagree
  in the last ulp, and React throws away the whole client tree over a `d=` that
  does not match.
- **Nothing is random.** `keyField` runs an LCG off a seed — `Math.random()`
  during render breaks hydration, and a field that changes on every refresh
  reads as noise rather than as a diagram.
- **`KEY_SLOTS` is shared, the radius is not.** The three angles of the rotation
  are one definition; how large each version draws the ring is composition.

**What the figures are allowed to claim.** The exposure field is captioned
"Illustrative" and carries no percentage: nothing in the deck states a share, and
a lit fraction that looked measured would be reporting a statistic no source
here supports. Only the EXPOSED dots converge on the account — drawing all of
them would say the whole population migrates at once. The lattice is the right
family of shape for a lattice-based scheme and is not a diagram of the
algorithm. The scheme bars are captioned as order of adoption, not duration.

## What is unmounted, and what is deleted

**Nothing is deleted.** `ProofMarquee`, `ThreatSequence`, `MathStatement`,
`LiveToday`, `FieldBreak`, `BeyondAccounts`, `Comparison`, `QuantumFaq` and
`ClosingRing` all stay in `quantum-security-copy/`, and
`/prototype/quantum-security-copy` still mounts them — along with
`wordField.ts`, `videoScrub.ts` and the mp4 these two pages no longer use.

Two are worth a note before anyone assumes they lost a fight:

- **`wordField.ts`** rasterises the NEAR mark and lights the letters landing on
  its silhouette. Good machinery; it goes for the same reason in both versions —
  a weave of sixty crypto terms under a sentence pulls the eye into reading the
  weave, and that section has exactly one thing to say.
- **`ClosingRing`** is the most finished section on the page. It goes because it
  is the only centred block on a page that hangs off one left gutter for nine
  sections, and because a perpetual unresolved rotation under a call to action
  competes with the two things left to press. Both proposals keep the rotation —
  finished, with the mark parked at the arc's end.

## Reused, not copied

`CtaPill` and `ArrowCircle` come from [`../quantum`](../quantum/README.md), as
`chain` and `protocol` already do. `NearMark` is imported from
`quantum-security-copy` as a raw path (`NEAR_MARK_PATH`) wherever it goes inside
another `<svg>`: the component renders its own `<svg>`, and a nested one without
explicit dimensions resolves to 100% of the parent viewport instead of honouring
the transform it was given.

**No file in this folder touches `app/globals.css`.** This repo is worked across
several worktrees over one `.git`, and that is the most expensive file to merge.
The sticky scene declares its travel through a local `--travel` custom property
and a `data-seq` attribute, the same way the chain proposals do.
